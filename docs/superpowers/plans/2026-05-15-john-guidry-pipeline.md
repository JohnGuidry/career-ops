# John Guidry Pipeline & CV Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete PDF generation for recent reports and process all 53 pending URLs in the pipeline.

**Architecture:** 
1.  **CV Generation:** Create a specialized batch script to generate tailored HTML CVs and PDFs for roles 255, 256, 257, and 259.
2.  **Pipeline Processing:** Iterate through `data/pipeline.md`, scraping, evaluating, and tracking each role.
3.  **Automation:** Use existing scripts (`scrape-single-job.mjs`, `generate-pdf.mjs`, `merge-tracker.mjs`) to automate the workflow.

**Tech Stack:** Node.js, Playwright, Markdown, HTML/CSS.

---

### Task 1: Generate Tailored CVs for Roles 255, 256, 257, 259

**Files:**
- Create: `build-cv-john-guidry-batch-2026-05-15.mjs`
- Modify: `data/applications.md` (Update PDF status)

- [ ] **Step 1: Create the batch CV generation script**
Create a script that uses `templates/cv-template.html` and the data from reports 255, 256, 257, 259.

- [ ] **Step 2: Run the script to generate HTML and PDF**
Run: `node build-cv-john-guidry-batch-2026-05-15.mjs`
Expected: 4 HTML files in root and 4 PDF files in `output/`.

- [ ] **Step 3: Verify PDFs**
Check that `output/cv-john-guidry-{company}-{id}-2026-05-15.pdf` files exist.

- [ ] **Step 4: Update tracker**
Update `data/applications.md` to change `❌` to `✅` for entries 255, 256, 257, 259.

### Task 2: Process Pipeline URLs (Batch 1: #260-#264)

**Files:**
- Modify: `data/pipeline.md`
- Create: `reports/260-*.md` to `reports/264-*.md`
- Create: `batch/tracker-additions/260.tsv` to `264.tsv`

- [ ] **Step 1: Scrape and Evaluate URLs**
For each URL in `data/pipeline.md` (starting at #260), run evaluation logic.
Use `scrape-single-job.mjs` and follow the `auto-pipeline` workflow.

- [ ] **Step 2: Generate Reports and Tracking TSVs**
Create report and TSV for each.

- [ ] **Step 3: Generate tailored CV/PDF if Score >= 3.8**

- [ ] **Step 4: Sync Tracker**
Run: `node merge-tracker.mjs`

- [ ] **Step 5: Update Pipeline**
Mark processed URLs with `[x]` in `data/pipeline.md`.

### Task 3: Repeat Pipeline Processing for remaining URLs (Blocks of 5)

- [ ] **Step 1: Process #265-#269**
- [ ] **Step 2: Process #270-#274**
- [ ] **Step 3: Process #275-#279**
- [ ] **Step 4: Process #280-#284**
- [ ] **Step 5: Process #285-#289**
- [ ] **Step 6: Process #290-#294**
- [ ] **Step 7: Process #295-#299**
- [ ] **Step 8: Process #300-#304**
- [ ] **Step 9: Process #305-#309**
- [ ] **Step 10: Process #310-#312 (Final)**

---
