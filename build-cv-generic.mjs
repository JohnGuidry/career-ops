import fs from 'fs';

const template = fs.readFileSync('templates/cv-template.html', 'utf-8');

const data = {
  LANG: 'en',
  PAGE_WIDTH: '8.5in',
  NAME: 'John Guidry',
  PHONE: '540-267-4470',
  EMAIL: 'john.guidry92@gmail.com',
  LINKEDIN_URL: 'https://www.linkedin.com/in/jrguidry/',
  LINKEDIN_DISPLAY: 'linkedin.com/in/jrguidry',
  PORTFOLIO_URL: 'https://john-guidry.com',
  PORTFOLIO_DISPLAY: 'john-guidry.com',
  LOCATION: 'Port Townsend, Washington',
  SECTION_SUMMARY: 'Professional Summary',
  SUMMARY_TEXT: 'Senior Software Engineer and Database Specialist with 9+ years of experience in mission-critical enterprise environments (Finance, Government). Currently leveraging a deep foundation in SQL Server, C#, and .NET to build production-grade AI agentic systems and automation workflows. Expert at bridging the gap between legacy data reliability and modern intelligent automation.',
  SECTION_COMPETENCIES: 'Core Competencies',
  COMPETENCIES: [
    'AI Agentic Workflows',
    'LLM Integration',
    'Python Automation',
    'SQL Server AlwaysOn',
    'Performance Tuning',
    'C# / .NET Core',
    'ETL / SSIS',
    'AWS RDS & Beanstalk'
  ].map(c => `<span class="competency-tag">${c}</span>`).join('\n      '),
  SECTION_EXPERIENCE: 'Work Experience',
  EXPERIENCE: `
    <div class="job">
      <div class="job-header">
        <span class="job-company">KinderSystems</span>
        <span class="job-period">Oct 2024 – Present</span>
      </div>
      <div class="job-role">Database Developer II</div>
      <div class="job-location">Remote, Washington</div>
      <ul>
        <li><strong>ETL Ownership:</strong> Maintains and enhances complex ETL pipelines, SSIS packages, and SQL Agent Jobs for a multi-tenant SaaS platform serving government agencies.</li>
        <li><strong>Reliability:</strong> Coordinates and validates Disaster Recovery (DR) failover sequences, ensuring data continuity across environment switches.</li>
        <li><strong>Performance:</strong> Diagnoses and resolves complex data and query performance issues in production environments.</li>
        <li><strong>Stakeholder Communication:</strong> Bridges technical implementation and business value for state agency clients.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-header">
        <span class="job-company">State Employees Credit Union</span>
        <span class="job-period">Aug 2019 – Nov 2023</span>
      </div>
      <div class="job-role">Software Engineer II</div>
      <div class="job-location">Raleigh, NC</div>
      <ul>
        <li><strong>High Availability:</strong> Managed SQL Server Always On Availability Groups supporting a top-10 US credit union's core financial operations.</li>
        <li><strong>Lifecycle Management:</strong> Led the transition from Bugzilla to Jira and architected a comprehensive SDLC for facility projects.</li>
        <li><strong>Automation:</strong> Developed SQL Agent Jobs and PowerShell automation for mission-critical financial workflows and API integrations.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-header">
        <span class="job-company">Public Consulting Group</span>
        <span class="job-period">Jun 2015 – Aug 2019</span>
      </div>
      <div class="job-role">Software Engineer II</div>
      <div class="job-location">Blacksburg, VA</div>
      <ul>
        <li><strong>Enterprise Delivery:</strong> Led full software lifecycle from requirements analysis to enterprise-wide deployment for high-scale public sector clients.</li>
        <li><strong>Optimization:</strong> Developed complex SQL maintenance scripts and optimized stored procedures, improving retrieval efficiency.</li>
      </ul>
    </div>
  `,
  SECTION_PROJECTS: 'Technical Projects',
  PROJECTS: `
    <div class="project">
      <span class="project-title">Prosite | Modern TypeScript Architecture</span>
      <span class="project-badge">TypeScript / AI</span>
      <div class="project-desc">Modernized professional presence using AI-augmented workflows and TypeScript architecture. Focused on high-signal technical narratives and career mapping.</div>
      <div class="project-tech">TypeScript, Next.js, AI Workflows</div>
    </div>
    <div class="project">
      <span class="project-title">WoW Addon Manager (WAM)</span>
      <span class="project-badge">Python / CLI</span>
      <div class="project-desc">Open-source Python CLI tool for managing addons on Linux. Integrates CurseForge and GitHub APIs with a dual-layered management system.</div>
      <div class="project-tech">Python, API Integration, Linux</div>
    </div>
    <div class="project">
      <span class="project-title">Cloud-Deployed ASP.NET Site</span>
      <span class="project-badge">Full Stack / AWS</span>
      <div class="project-desc">Full-stack personal site built in ASP.NET Core with a two-stage database lifecycle: local SQL Server dev to AWS RDS production migration.</div>
      <div class="project-tech">C#, ASP.NET Core, AWS RDS, Elastic Beanstalk</div>
    </div>
  `,
  SECTION_EDUCATION: 'Education',
  EDUCATION: `
    <div class="edu-item">
      <div class="edu-header">
        <span class="edu-title">Bachelor of Science in Computer Science</span>
        <span class="edu-year">Salem, VA</span>
      </div>
      <div class="edu-org">Roanoke College</div>
    </div>
  `,
  SECTION_CERTIFICATIONS: 'Personal & Environment',
  CERTIFICATIONS: `
    <div class="cert-item">
      <span class="cert-title">Linux Daily Driver</span>
      <span class="cert-org">Fedora/Bazzite</span>
    </div>
    <div class="cert-item">
      <span class="cert-title">Self-Built Systems</span>
      <span class="cert-org">Hardware & Low-level config</span>
    </div>
  `,
  SECTION_SKILLS: 'Technical Skills',
  SKILLS: `
    <div class="skills-grid">
      <div class="skill-item"><span class="skill-category">AI/Automation:</span> Agentic Workflows, LLM Integration, Python, PowerShell</div>
      <div class="skill-item"><span class="skill-category">Software:</span> C#, .NET Core, TypeScript, API Integration, Git, SDLC</div>
      <div class="skill-item"><span class="skill-category">Database:</span> SQL Server (AlwaysOn), T-SQL, Performance Tuning, SSIS, ETL, AWS RDS</div>
    </div>
  `
};

let output = template;
for (const [key, value] of Object.entries(data)) {
  output = output.replace(new RegExp(`{{${key}}}`, 'g'), value);
}

fs.writeFileSync('cv-john-guidry-generic.html', output);
