# Balanced Generic Resume (LaTeX) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a balanced generic resume in LaTeX format that highlights both deep enterprise engineering and modern AI/Automation pivot.

**Architecture:** Transform structured data from `cv.md` and `config/profile.yml` into a LaTeX document based on `templates/cv-template.tex`.

**Tech Stack:** LaTeX, Node.js (`generate-latex.mjs`).

---

### Task 1: Initialize LaTeX Content and Header

**Files:**
- Create: `cv-john-guidry-generic.tex`

- [ ] **Step 1: Create the base LaTeX file with header and summary**

```latex
%-------------------------
% Career-Ops LaTeX CV - John Guidry (Generic Balanced)
%------------------------

\documentclass[letterpaper,11pt]{article}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage{fontawesome}
\usepackage{multicol}
\setlength{\multicolsep}{-3.0pt}
\setlength{\columnsep}{-1pt}
\input{glyphtounicode}
\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\addtolength{\oddsidemargin}{-0.6in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1.19in}
\addtolength{\topmargin}{-.7in}
\addtolength{\textheight}{1.4in}
\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}
\titleformat{\section}{
  \vspace{-7pt}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{0pt}]
\pdfgentounicode=1

\newcommand{\resumeItem}[1]{\item\small{{#1 \vspace{-3pt}}}}
\newcommand{\resumeSubheading}[4]{
  \vspace{-3pt}\item
    \begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & \textbf{\small #2} \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}
\newcommand{\resumeProjectHeading}[2]{
  \vspace{-3pt}\item
    \begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & \textbf{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.0in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{0pt}}

\begin{center}
    {\Huge\scshape John Guidry} \\
    \small Port Townsend, Washington $|$ 540-267-4470 $|$ \href{mailto:john.guidry92@gmail.com}{\underline{john.guidry92@gmail.com}} \\
    \href{https://www.linkedin.com/in/jrguidry/}{\faLinkedin\ \underline{linkedin.com/in/jrguidry}} $|$ 
    \href{https://github.com/JohnGuidry}{\faGithub\ \underline{github.com/JohnGuidry}} $|$
    \href{https://john-guidry.com}{\faGlobe\ \underline{john-guidry.com}}
\end{center}

\section{Summary}
Senior Software Engineer and Database Specialist with 9+ years of experience in mission-critical enterprise environments. Currently leveraging a deep foundation in SQL Server, C\#, and .NET to build production-grade AI agentic systems and automation workflows. Expert at bridging the gap between legacy data reliability and modern intelligent automation.

\end{document}
```

- [ ] **Step 2: Commit initial file**
```bash
git add cv-john-guidry-generic.tex
git commit -m "feat: init generic resume with header and summary"
```

### Task 2: Add Education and Skills

**Files:**
- Modify: `cv-john-guidry-generic.tex`

- [ ] **Step 1: Add Education and Skills sections before \end{document}**

```latex
\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Roanoke College}{Salem, VA}
      {Bachelor of Science in Computer Science}{2011 -- 2015}
  \resumeSubHeadingListEnd

\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{AI \& Automation}{: Agentic Workflows, LLM Integration, AI-Augmented Development, Python Automation} \\
     \textbf{Software Engineering}{: C\#, .NET Core, .NET Framework, TypeScript, API Integration, SDLC Management, Git} \\
     \textbf{Database Architecture}{: SQL Server (AlwaysOn), Performance Tuning, Stored Procedures, SSIS, ETL, RDS} \\
     \textbf{Tools \& Infra}{: AWS (Elastic Beanstalk, RDS), Jira, GitHub, Linux (Daily Driver), PowerShell, Batch}
    }}
 \end{itemize}
```

- [ ] **Step 2: Commit**
```bash
git add cv-john-guidry-generic.tex
git commit -m "feat: add education and skills to generic resume"
```

### Task 3: Add Work Experience

**Files:**
- Modify: `cv-john-guidry-generic.tex`

- [ ] **Step 1: Add Experience section after Summary**

```latex
\section{Experience}
  \resumeSubHeadingListStart

    \resumeSubheading
      {KinderSystems}{Oct 2024 -- Present}
      {Database Developer II}{Remote, WA}
      \resumeItemListStart
        \resumeItem{Maintains and enhances customer relationships by delivering high-impact ETL and backend solutions for a multi-tenant SaaS platform serving government-regulated state agencies.}
        \resumeItem{Engineers and maintains complex ETL pipelines, SSIS packages, SQL Agent Jobs, and PowerShell/Batch scripts for mission-critical data workflows.}
        \resumeItem{Diagnoses and resolves complex performance issues and data anomalies, ensuring 100\% data integrity in production environments.}
        \resumeItem{Coordinates and validates Disaster Recovery (DR) failover sequences, bridging the gap between IT infrastructure and data pipeline continuity.}
      \resumeItemListEnd

    \resumeSubheading
      {State Employees Credit Union}{Aug 2019 -- Nov 2023}
      {Software Engineer II}{Raleigh, NC}
      \resumeItemListStart
        \resumeItem{Architected a comprehensive SDLC for facility projects at a top-10 US credit union, improving delivery efficiency and auditability.}
        \resumeItem{Managed SQL Server Always On Availability Groups on load and read servers, supporting high-availability database operations in a production financial environment.}
        \resumeItem{Modernized incident tracking by leading the transition from Bugzilla to Jira, significantly reducing MTTR and improving team collaboration.}
        \resumeItem{Developed SQL Agent Jobs and PowerShell automation to streamline mission-critical financial workflows and site edits via API integrations.}
      \resumeItemListEnd

    \resumeSubheading
      {Public Consulting Group}{Jun 2015 -- Aug 2019}
      {Software Engineer II}{Blacksburg, VA}
      \resumeItemListStart
        \resumeItem{Led the end-to-end software lifecycle from requirements analysis to enterprise-wide deployment for high-scale public sector clients.}
        \resumeItem{Developed complex SQL maintenance scripts and optimized stored procedures, enhancing data analysis speed and retrieval efficiency.}
        \resumeItem{Orchestrated multi-environment releases, including feature testing and coding corrections, ensuring zero-downtime product launches.}
      \resumeItemListEnd

  \resumeSubHeadingListEnd
```

- [ ] **Step 2: Commit**
```bash
git add cv-john-guidry-generic.tex
git commit -m "feat: add work experience to generic resume"
```

### Task 4: Add Technical Projects

**Files:**
- Modify: `cv-john-guidry-generic.tex`

- [ ] **Step 1: Add Projects section after Experience**

```latex
\section{Technical Projects}
    \resumeSubHeadingListStart
      \resumeProjectHeading
          {\textbf{Prosite} $|$ \emph{TypeScript, Next.js, AI Workflows}}{john-guidry.com}
          \resumeItemListStart
            \resumeItem{Built a modern professional platform using AI-augmented workflows and Modern TypeScript Architecture to showcase technical pivots.}
            \resumeItem{Designed interactive career mapping and high-signal technical narratives to bridge legacy experience with modern AI capabilities.}
          \resumeItemListEnd
      \resumeProjectHeading
          {\textbf{WoW Addon Manager (WAM)} $|$ \emph{Python, APIs, Linux}}{github.com/JohnGuidry/wow-addon-manager}
          \resumeItemListStart
            \resumeItem{Developed an open-source Python CLI tool for managing game addons on Linux, integrating CurseForge and GitHub APIs.}
            \resumeItem{Implemented a dual-layered management system combining local .toc file analysis with a JSON registry for complex file structures.}
          \resumeItemListEnd
      \resumeProjectHeading
          {\textbf{Cloud-Deployed ASP.NET Site} $|$ \emph{C\#, AWS, SQL Server}}{github.com/JohnGuidry/JohnGuidrySite}
          \resumeItemListStart
            \resumeItem{Engineered a full-stack personal site in ASP.NET Core with a two-stage database lifecycle: local development to AWS RDS production migration.}
            \resumeItem{Deployed and managed environment configurations via AWS Elastic Beanstalk and .ebextensions for automated cloud infrastructure.}
          \resumeItemListEnd
    \resumeSubHeadingListEnd
```

- [ ] **Step 2: Commit**
```bash
git add cv-john-guidry-generic.tex
git commit -m "feat: add technical projects to generic resume"
```

### Task 5: Final Assembly and Validation

**Files:**
- Modify: `cv-john-guidry-generic.tex`

- [ ] **Step 1: Ensure all sections are properly ordered and formatted**
The final order should be:
1. Header
2. Summary
3. Experience
4. Technical Projects
5. Education
6. Technical Skills

- [ ] **Step 2: Run validation script**
Run: `node generate-latex.mjs cv-john-guidry-generic.tex`
Expected: "Validation successful" (or similar success message).

- [ ] **Step 3: Generate PDF**
Run: `node generate-pdf.mjs cv-john-guidry-generic.html` (Note: `generate-latex.mjs` might already produce a PDF if `pdflatex` is available, but the system prefers HTML-to-PDF via Playwright if possible. Check `generate-pdf.mjs` logic.)

Actually, since this is a LaTeX plan, we should try to compile it:
Run: `pdflatex cv-john-guidry-generic.tex` (if available)

- [ ] **Step 4: Final Commit**
```bash
git add cv-john-guidry-generic.tex
git commit -m "feat: finalize generic resume and validate"
```
