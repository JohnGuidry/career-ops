/**
 * Robert Half CDP scanner — connects to existing Chromium session via remote debugging.
 * Intercepts the Robert Half API response (prod.api.roberthalf.com) to get structured
 * job data, then filters and deduplicates against scan history.
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCAN_HISTORY = path.join(__dirname, 'data/scan-history.tsv');
const PIPELINE = path.join(__dirname, 'data/pipeline.md');
const TODAY = new Date().toISOString().slice(0, 10);

const POSITIVE = /dba|database|sql server|sql developer|data engineer|etl|database developer|database reliability|database platform|t-sql|ssis|software engineer|software developer|.net|c#/i;
const NEGATIVE = /junior|intern|oracle dba|php|ruby|ios|salesforce admin|cobol|machine learning|data scientist/i;

const SEARCH_QUERIES = [
  { q: 'SQL Server Database Administrator', label: 'SQL Server DBA' },
  { q: 'Database Reliability Engineer', label: 'DBRE' },
  { q: 'SQL Server Database Engineer', label: 'SQL Server Database Engineer' },
  { q: 'SSIS ETL Developer', label: 'SSIS ETL' },
  { q: 'Database Developer SQL', label: 'Database Developer' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function formatSalary(job) {
  if (!job.minPayRate && !job.maxPayRate) return '';
  const min = job.minPayRate ? `$${Number(job.minPayRate).toLocaleString()}` : '';
  const max = job.maxPayRate ? `$${Number(job.maxPayRate).toLocaleString()}` : '';
  const rate = job.payRateType || '';
  const label = rate === 'hr' ? '/hr' : rate === 'yr' ? '/yr' : rate ? `/${rate}` : '';
  if (min && max && min !== max) return `${min}–${max}${label}`;
  return `${min || max}${label}`;
}

function formatLocation(job) {
  const parts = [];
  if (job.city) parts.push(job.city);
  if (job.state) parts.push(job.state);
  const loc = parts.join(', ');
  if (job.isRemote) return loc ? `${loc} (Remote)` : 'Remote';
  return loc;
}

function buildJobUrl(job) {
  const id = job.jobOrderId || '';
  const title = (job.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const lob = (job.lineOfBusiness || 'technology').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `https://www.roberthalf.com/us/en/job/${lob}/${title}/${id}`;
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
    `${e.url}\t${TODAY}\tRobertHalf-CDP\t${e.title}\t${e.company}\t${e.status}`
  ).join('\n') + '\n';
  fs.appendFileSync(SCAN_HISTORY, lines);
}

function appendPipeline(entries) {
  if (entries.length === 0) return;
  let text = fs.readFileSync(PIPELINE, 'utf8');
  const marker = '## Pendientes';
  const idx = text.indexOf(marker);
  const blockLines = entries.map(e => {
    const salary = e.salary ? ` | ${e.salary}` : '';
    const loc = e.location ? ` | ${e.location}` : '';
    return `- [ ] ${e.url} | Robert Half | ${e.title}${loc}${salary}`;
  }).join('\n');

  if (idx === -1) {
    const procIdx = text.indexOf('## Procesadas');
    const insertAt = procIdx === -1 ? text.length : procIdx;
    const block = `\n${marker}\n` + blockLines + '\n\n';
    text = text.slice(0, insertAt) + block + text.slice(insertAt);
  } else {
    const afterMarker = idx + marker.length;
    const nextSection = text.indexOf('\n## ', afterMarker);
    const insertAt = nextSection === -1 ? text.length : nextSection;
    const block = '\n' + blockLines + '\n';
    text = text.slice(0, insertAt) + block + text.slice(insertAt);
  }
  fs.writeFileSync(PIPELINE, text);
}

async function captureJobsForQuery(page, query, label) {
  const searchUrl = `https://www.roberthalf.com/us/en/jobs?q=${encodeURIComponent(query)}&location=&remote=true`;
  let apiJobs = [];
  let apiCount = 0;

  const responsePromise = page.waitForResponse(
    r => r.url().includes('prod.api.roberthalf.com') &&
         r.url().includes('/jobs/v1/jobs') &&
         r.status() === 200,
    { timeout: 25000 }
  ).then(async r => {
    const body = await r.json().catch(() => ({}));
    apiJobs = body.jobs || [];
    apiCount = body.count || 0;
  }).catch(() => {});

  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {});
  await responsePromise;
  await sleep(2000);

  // Paginate up to 100 results per query
  if (apiCount > 25 && apiJobs.length < Math.min(apiCount, 100)) {
    let offset = 25;
    while (apiJobs.length < Math.min(apiCount, 100) && offset < 200) {
      const pageResponsePromise = page.waitForResponse(
        r => r.url().includes('prod.api.roberthalf.com') && r.status() === 200,
        { timeout: 15000 }
      ).then(async r => {
        const body = await r.json().catch(() => ({}));
        if (body.jobs) apiJobs.push(...body.jobs);
      }).catch(() => {});

      await page.goto(`${searchUrl}&offset=${offset}`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
      await pageResponsePromise;
      await sleep(1000);
      offset += 25;
    }
  }

  console.log(`  ${label}: ${apiJobs.length} jobs (${apiCount} total available)`);
  return apiJobs;
}

async function main() {
  console.log(`\nRobert Half CDP Scan — ${TODAY}`);
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

  // Warm up session on base page
  await page.goto('https://www.roberthalf.com/us/en/jobs', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
  await sleep(2000);

  const allJobs = [];
  const seenIds = new Set();

  for (const { q, label } of SEARCH_QUERIES) {
    try {
      const jobs = await captureJobsForQuery(page, q, label);
      for (const job of jobs) {
        const id = job.jobOrderId || `${job.title}||${job.city}||${job.state}`;
        if (seenIds.has(id)) continue;
        seenIds.add(id);
        job._source = label;
        allJobs.push(job);
      }
    } catch (e) {
      console.log(`  Error on "${label}": ${e.message}`);
    }
  }

  await page.close();
  await browser.close();

  console.log(`\nTotal unique jobs found: ${allJobs.length}`);

  const toAdd = [];
  const historyEntries = [];
  let skippedTitle = 0, skippedDup = 0;

  for (const job of allJobs) {
    const url = buildJobUrl(job);
    const title = job.title || '';
    const salary = formatSalary(job);
    const location = formatLocation(job);

    if (seenUrls.has(url)) {
      skippedDup++;
      historyEntries.push({ url, title, company: 'Robert Half', status: 'skipped_dup' });
      continue;
    }
    if (!POSITIVE.test(title) || NEGATIVE.test(title)) {
      skippedTitle++;
      historyEntries.push({ url, title, company: 'Robert Half', status: 'skipped_title' });
      continue;
    }

    toAdd.push({ url, title, company: 'Robert Half', salary, location, source: job._source });
    historyEntries.push({ url, title, company: 'Robert Half', status: 'added' });
  }

  if (historyEntries.length > 0) appendHistory(historyEntries);
  if (toAdd.length > 0) appendPipeline(toAdd);

  console.log('\nRobert Half CDP Scan Complete');
  console.log('━'.repeat(44));
  console.log(`Queries run:            ${SEARCH_QUERIES.length}`);
  console.log(`Unique jobs found:      ${allJobs.length}`);
  console.log(`Filtered by title:      ${skippedTitle} skipped`);
  console.log(`Duplicates skipped:     ${skippedDup}`);
  console.log(`New added to pipeline:  ${toAdd.length}`);

  if (toAdd.length > 0) {
    console.log('\nNew postings:');
    toAdd.forEach(j => console.log(`  + ${j.title} | ${j.location} | ${j.salary} | ${j.source}`));
  } else {
    console.log('\nNo new postings found.');
  }

  console.log('\n→ Run /career-ops pipeline to evaluate new offers.');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
