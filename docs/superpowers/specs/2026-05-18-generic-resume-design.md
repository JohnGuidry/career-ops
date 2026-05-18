# Design Spec: Balanced Generic Resume (LaTeX)

**Status:** Approved
**Date:** 2026-05-18
**Candidate:** John Guidry
**Format:** Classic LaTeX (`cv-template.tex`)
**Emphasis:** Balanced (Full Profile: AI Agent/Automation + Database Specialist + Senior Software Engineer)

## 1. Narrative Strategy: The "Reliable Evolver"
The core narrative is that John provides **production-grade reliability** for the next generation of AI systems. His 9+ years of experience in highly regulated financial and government environments is the "bedrock" upon which he builds modern agentic workflows.

- **Bridge:** From managing mission-critical data to building agents that act on it.
- **Tone:** Professional, senior, technical, and forward-looking.

## 2. Content Mapping

### A. Header & Summary
- **Contact:** Include Phone, Email, LinkedIn, GitHub, Website (john-guidry.com), and Location (Port Townsend, WA).
- **Summary:** "Senior Software Engineer and Database Specialist with 9+ years of experience in mission-critical enterprise environments. Currently leveraging a deep foundation in SQL Server, C#, and .NET to build production-grade AI agentic systems and automation workflows. Expert at bridging the gap between legacy data reliability and modern intelligent automation."

### B. Experience Highlights
- **KinderSystems (2024-Present):** Focus on ETL ownership, PowerShell/Batch automation, and stakeholder translation of complex data processes.
- **SECU (2019-2023):** Emphasize AlwaysOn AG (High Availability), API integrations, and leading the SDLC/Jira transition.
- **PCG (2015-2019):** Highlight full software lifecycle ownership and enterprise-wide deployments.

### C. Projects (Technical Proof)
- **Prosite:** Focus on TypeScript, AI-augmented development, and "Evolver" narrative.
- **WoW Addon Manager:** Focus on Python CLI, API integrations (CurseForge/GitHub), and Linux administration.
- **ASP.NET Site:** Focus on AWS Elastic Beanstalk, RDS migration, and C#/.NET stack.

### D. Skills Grid (Categorized)
- **AI & Automation:** Agentic Workflows, LLM Integration, Python Automation.
- **Software Engineering:** C#, .NET/Framework, TypeScript, API Integration, SDLC.
- **Database Architecture:** SQL Server (AlwaysOn), Performance Tuning, SSIS/ETL, Stored Procedures.
- **Tools & Infra:** AWS (RDS/Beanstalk), Git, Jira, Linux (Daily Driver).

## 3. Implementation Details
- **Template:** `templates/cv-template.tex`.
- **Validation:** Use `generate-latex.mjs` to ensure the LaTeX is valid before finalizing.
- **Final Output:** `cv-john-guidry-generic.tex` (and generated PDF).

## 4. Self-Review
- **Placeholder scan:** No TBDs. All contact info and project links are available in `cv.md` and `profile.yml`.
- **Consistency:** The "Balanced" approach is maintained by ensuring each of the three archetypes has a dedicated category in the Skills section and at least one representative project.
- **Ambiguity:** Explicitly choosing to include the "Evolver" narrative in the summary to clarify the pivot.
