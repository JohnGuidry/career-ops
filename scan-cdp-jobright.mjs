/**
 * JobRight CDP scanner — connects to existing Chromium session via remote debugging.
 * Uses the user's authenticated JobRight session to scrape job recommendations
 * and search results, then filters and deduplicates against scan history.
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCAN_HISTORY = path.join(__dirname, 'data/scan-history.tsv');
const PIPELINE = path.join(__dirname, 'data/pipeline.md');
const TODAY = new Date().toISOString().slice(0, 10);

const POSITIVE = ['dba', 'database', 'etl', 'database engineer', 'database developer',
  'database admin', 'database administrator', 'database reliability', 'database platform',
  'sql server', 't-sql', 'ssis', 'data engineer', 'software engineer', 'software developer', '.net', 'c#'];
const NEGATIVE = ['junior', 'intern', 'ios', 'php', 'ruby', 'salesforce admin', 'oracle ebs', 'cobol',
  'machine learning', 'data scientist', 'frontend'];

function titleMatches(title) {
  const t = title.toLowerCase();
  if (NEGATIVE.some(n => t.includes(n))) return false;
  return POSITIVE.some(p => t.includes(p));
}

function loadHistory() {
  const seen = new Set();
  if (fs.existsSync(SCAN_HISTORY)) {
    fs.readFileSync(SCAN_HISTORY, 'utf8').split('\n').forEach(line => {
      const url = line.split('\t')[0]?.trim();
      if (url && url.startsWith('http')) seen.add(url);
    });
  }
  if (fs.existsSync(PIPELINE)) {
    fs.readFileSync(PIPELINE, 'utf8').split('\n').forEach(line => {
      const m = line.match(/https?:\/\/[^\s|]+/);
      if (m) seen.add(m[0].trim());
    });
  }
  return seen;
}

function appendHistory(entries) {
  const lines = entries.map(e =>
    `${e.url}\t${TODAY}\tJobRight-CDP\t${e.title}\t${e.company}\t${e.status}`
  ).join('\n') + '\n';
  fs.appendFileSync(SCAN_HISTORY, lines);
}

function appendPipeline(entries) {
  if (entries.length === 0) return;
  let text = fs.readFileSync(PIPELINE, 'utf8');
  const marker = '## Pendientes';
  const idx = text.indexOf(marker);
  if (idx === -1) {
    const procIdx = text.indexOf('## Procesadas');
    const insertAt = procIdx === -1 ? text.length : procIdx;
    const block = `\n${marker}\n` + entries.map(e =>
      `- [ ] ${e.url} | ${e.company} | ${e.title}`
    ).join('\n') + '\n\n';
    text = text.slice(0, insertAt) + block + text.slice(insertAt);
  } else {
    const afterMarker = idx + marker.length;
    const nextSection = text.indexOf('\n## ', afterMarker);
    const insertAt = nextSection === -1 ? text.length : nextSection;
    const block = '\n' + entries.map(e =>
      `- [ ] ${e.url} | ${e.company} | ${e.title}`
    ).join('\n') + '\n';
    text = text.slice(0, insertAt) + block + text.slice(insertAt);
  }
  fs.writeFileSync(PIPELINE, text);
}

async function scrapeJobPage(page, url, source) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Scroll to trigger lazy-loaded cards
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(500);
  }

  return page.evaluate((src) => {
    const seen = new Set();
    const results = [];
    document.querySelectorAll('a[href*="/jobs/info/"]').forEach(card => {
      const href = card.href?.split('?')[0];
      if (!href || seen.has(href)) return;
      seen.add(href);

      // Walk up to find the job card container
      let el = card;
      for (let i = 0; i < 5; i++) {
        if (el.querySelectorAll('a[href*="/jobs/info/"]').length === 1) break;
        el = el.parentElement || el;
      }

      const titleEl = el.querySelector('h2, h3, [class*="job-title"]');
      // Company name is the first div inside the "third-row" container (JobRight DOM as of 2026-04)
      const companyEl = el.querySelector('[class*="third-row"] > div:first-child');
      const title = titleEl?.textContent?.trim() || card.textContent?.trim()?.split('\n')[0] || '';
      const company = companyEl?.textContent?.trim() || '';

      if (title) results.push({ title, company, url: href, source: src });
    });
    return results;
  }, source);
}

async function main() {
  console.log(`\nJobRight CDP Scan — ${TODAY}`);
  console.log('━'.repeat(44));

  const seenUrls = loadHistory();
  console.log(`Loaded ${seenUrls.size} already-seen URLs\n`);

  const res = await fetch('http://localhost:9222/json/version');
  const { webSocketDebuggerUrl } = await res.json();

  console.log('Connecting to Chromium (port 9222)...');
  const browser = await chromium.connectOverCDP(webSocketDebuggerUrl);
  const context = browser.contexts()[0];
  const page = await context.newPage();
  console.log('Opened new tab\n');

  const allFound = [];

  // 1. Recommendations page (personalized — uses your account's AI matching)
  const pages = [
    { url: 'https://jobright.ai/jobs/recommend', label: 'Recommendations' },
    { url: 'https://jobright.ai/jobs?query=SQL+Server+Database+Administrator&location=United+States&remote=true', label: 'Search: SQL Server DBA' },
    { url: 'https://jobright.ai/jobs?query=SQL+Server+Database+Engineer&location=United+States&remote=true', label: 'Search: SQL Server Database Engineer' },
    { url: 'https://jobright.ai/jobs?query=Database+Reliability+Engineer+SQL+Server&location=United+States&remote=true', label: 'Search: DBRE SQL Server' },
    { url: 'https://jobright.ai/jobs?query=SSIS+ETL+SQL+Server+remote&location=United+States&remote=true', label: 'Search: SSIS ETL' },
    { url: 'https://jobright.ai/jobs?query=SQL+DBA+remote&location=United+States&remote=true', label: 'Search: SQL DBA remote' },
  ];

  for (const { url, label } of pages) {
    console.log(`Scanning: ${label}`);
    try {
      const jobs = await scrapeJobPage(page, url, label);
      console.log(`  Found ${jobs.length} job cards`);
      allFound.push(...jobs);
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }

  await page.close();
  await browser.close(); // disconnects CDP session without closing Chromium

  // Deduplicate by URL
  const uniqueMap = new Map();
  allFound.forEach(j => { if (!uniqueMap.has(j.url)) uniqueMap.set(j.url, j); });
  const unique = Array.from(uniqueMap.values());
  console.log(`\nTotal unique jobs found: ${unique.length}`);

  const toAdd = [];
  const historyEntries = [];
  let skippedTitle = 0, skippedDup = 0;

  for (const job of unique) {
    if (seenUrls.has(job.url)) {
      skippedDup++;
      historyEntries.push({ ...job, status: 'skipped_dup' });
      continue;
    }
    if (!titleMatches(job.title)) {
      skippedTitle++;
      historyEntries.push({ ...job, status: 'skipped_title' });
      continue;
    }
    toAdd.push(job);
    historyEntries.push({ ...job, status: 'added' });
  }

  if (historyEntries.length > 0) appendHistory(historyEntries);
  if (toAdd.length > 0) appendPipeline(toAdd);

  console.log('\nJobRight CDP Scan Complete');
  console.log('━'.repeat(44));
  console.log(`Pages scanned:         ${pages.length}`);
  console.log(`Unique jobs found:      ${unique.length}`);
  console.log(`Filtered by title:      ${skippedTitle} skipped`);
  console.log(`Duplicates skipped:     ${skippedDup}`);
  console.log(`New added to pipeline:  ${toAdd.length}`);

  if (toAdd.length > 0) {
    console.log('\nNew postings:');
    toAdd.forEach(j => console.log(`  + ${j.company || '(unknown)'} | ${j.title} | ${j.source}`));
  } else {
    console.log('\nNo new postings found.');
  }

  console.log('\n→ Run /career-ops pipeline to evaluate new offers.');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
