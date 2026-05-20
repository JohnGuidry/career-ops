---
name: career-ops-pdf
description: Generación de PDF ATS-Optimizado
user-invocable: true
license: MIT
---

# career-ops-pdf

# System Context -- career-ops

<!-- ============================================================
     THIS FILE IS AUTO-UPDATABLE. Don't put personal data here.
     
     Your customizations go in modes/_profile.md (never auto-updated).
     This file contains system rules, scoring logic, and tool config
     that improve with each career-ops release.
     ============================================================ -->

## Sources of Truth

| File | Path | When |
|------|------|------|
| cv.md | `cv.md` (project root) | ALWAYS |
| article-digest.md | `article-digest.md` (if exists) | ALWAYS (detailed proof points) |
| profile.yml | `config/profile.yml` | ALWAYS (candidate identity and targets) |
| _profile.md | `modes/_profile.md` | ALWAYS (user archetypes, narrative, negotiation) |
| writing-samples/ | `writing-samples/` | When generating candidate-facing text — check `_profile.md` for cached `## Writing Style` first; only scan files if absent |

**RULE: NEVER hardcode metrics from proof points.** Read them from cv.md + article-digest.md at evaluation time.
**RULE: For article/project metrics, article-digest.md takes precedence over cv.md.**
**RULE: Read _profile.md AFTER this file. User customizations in _profile.md override defaults here.**

---

## Scoring System

The evaluation uses 6 blocks (A-F) with a global score of 1-5:

| Dimension | What it measures |
|-----------|-----------------|
| Match con CV | Skills, experience, proof points alignment |
| North Star alignment | How well the role fits the user's target archetypes (from _profile.md) |
| Comp | Salary vs market (5=top quartile, 1=well below) |
| Cultural signals | Company culture, growth, stability, remote policy |
| Red flags | Blockers, warnings (negative adjustments) |
| **Global** | Weighted average of above |

**Score interpretation:**
- 4.5+ → Strong match, recommend applying immediately
- 4.0-4.4 → Good match, worth applying
- 3.5-3.9 → Decent but not ideal, apply only if specific reason
- Below 3.5 → Recommend against applying (see Ethical Use in AGENTS.md)

## Posting Legitimacy (Block G)

Block G assesses whether a posting is likely a real, active opening. It does NOT affect the 1-5 global score -- it is a separate qualitative assessment.

**Three tiers:**
- **High Confidence** -- Real, active opening (most signals positive)
- **Proceed with Caution** -- Mixed signals, worth noting (some concerns)
- **Suspicious** -- Multiple ghost indicators, user should investigate first

**Key signals (weighted by reliability):**

| Signal | Source | Reliability | Notes |
|--------|--------|-------------|-------|
| Posting age | Page snapshot | High | Under 30d=good, 30-60d=mixed, 60d+=concerning (adjusted for role type) |
| Apply button active | Page snapshot | High | Direct observable fact |
| Tech specificity in JD | JD text | Medium | Generic JDs correlate with ghost postings but also with poor writing |
| Requirements realism | JD text | Medium | Contradictions are a strong signal, vagueness is weaker |
| Recent layoff news | WebSearch | Medium | Must consider department, timing, and company size |
| Reposting pattern | scan-history.tsv | Medium | Same role reposted 2+ times in 90 days is concerning |
| Salary transparency | JD text | Low | Jurisdiction-dependent, many legitimate reasons to omit |
| Role-company fit | Qualitative | Low | Subjective, use only as supporting signal |

**Ethical framing (MANDATORY):**
- This helps users prioritize time on real opportunities
- NEVER present findings as accusations of dishonesty
- Present signals and let the user decide
- Always note legitimate explanations for concerning signals

## Archetype Detection

Classify every offer into one of these types (or hybrid of 2):

| Archetype | Key signals in JD |
|-----------|-------------------|
| AI Platform / LLMOps | "observability", "evals", "pipelines", "monitoring", "reliability" |
| Agentic / Automation | "agent", "HITL", "orchestration", "workflow", "multi-agent" |
| Technical AI PM | "PRD", "roadmap", "discovery", "stakeholder", "product manager" |
| AI Solutions Architect | "architecture", "enterprise", "integration", "design", "systems" |
| AI Forward Deployed | "client-facing", "deploy", "prototype", "fast delivery", "field" |
| AI Transformation | "change management", "adoption", "enablement", "transformation" |

After detecting archetype, read `modes/_profile.md` for the user's specific framing and proof points for that archetype.

## Global Rules

### NEVER

1. Invent experience or metrics
2. Modify cv.md or portfolio files
3. Submit applications on behalf of the candidate
4. Share phone number in generated messages
5. Recommend comp below market rate
6. Generate a PDF without reading the JD first
7. Use corporate-speak
8. Ignore the tracker (every evaluated offer gets registered)

### ALWAYS

0. **Cover letter:** If the form allows it, ALWAYS include one. Same visual design as CV. JD quotes mapped to proof points. 1 page max.
1. Read cv.md, _profile.md, and article-digest.md (if exists) before evaluating
1b. **First evaluation of each session:** Run `node cv-sync-check.mjs`. If warnings, notify user.
2. Detect the role archetype and adapt framing per _profile.md
3. Cite exact lines from CV when matching
4. Use WebSearch for comp and company data
5. Register in tracker after evaluating
6. Generate content in the language of the JD (EN default)
7. Be direct and actionable -- no fluff
8. Native tech English for generated text. Short sentences, action verbs, no passive voice.
8b. Case study URLs in PDF Professional Summary (recruiter may only read this).
9. **Tracker additions as TSV** -- NEVER edit applications.md directly. Write TSV in `batch/tracker-additions/`.
10. **Include `**URL:**` in every report header.**

### Tools

| Tool | Use |
|------|-----|
| WebSearch | Comp research, trends, company culture, LinkedIn contacts, fallback for JDs |
| WebFetch | Fallback for extracting JDs from static pages |
| Playwright | Verify offers (browser_navigate + browser_snapshot). **NEVER 2+ agents with Playwright in parallel.** |
| Read | cv.md, _profile.md, article-digest.md, cv-template.html |
| Write | Temporary HTML for PDF, applications.md, reports .md |
| Edit | Update tracker |
| Canva MCP | Optional visual CV generation. Duplicate base design, edit text, export PDF. Requires `cv.canva_resume_design_id` in profile.yml. |
| Bash | `node generate-pdf.mjs` |

### Time-to-offer priority
- Working demo + metrics > perfection
- Apply sooner > learn more
- 80/20 approach, timebox everything

---

## Writing Style Calibration

**Check `_profile.md` first.** If a `## Writing Style` section exists there, use it directly — do not re-scan the writing-samples files. Re-scanning is only needed when new samples are added or the user explicitly asks to recalibrate.

**When to apply:** Before generating any text the user will send or publish — cover letters, LinkedIn outreach, application form answers, follow-up emails, executive summaries, profile blurbs. Does NOT apply to internal evaluation reports (A–F blocks, scores, analysis).

**If no cached style in `_profile.md`:** Read all files in `writing-samples/`, **skipping any file named `README.md`**. If no user-provided samples are found, skip style calibration and gently note — once, without pressure — that adding a writing sample (e.g. a past cover letter, a LinkedIn About section, any professional writing) would help tailor outputs to their voice. If samples exist, extract the markers below and write the result to `_profile.md` under `## Writing Style` so future sessions skip this step.

### What to extract

**Tone & register**
- Formal vs. conversational
- Confident vs. hedging (watch for qualifiers like "I think", "perhaps", "somewhat")
- Warm vs. transactional
- Degree of self-promotion — does the user undersell, match, or lead with achievements?

**Sentence structure**
- Average sentence length — short and punchy or long and layered?
- Use of fragments for emphasis
- Clause nesting and complexity
- How sentences open — subject-first, action-first, context-first?

**Punctuation habits**
- Em dashes, en dashes, or parentheses for asides?
- Oxford comma or not?
- Ellipses — used or avoided?
- Exclamation marks — never, sparingly, or freely?
- Semicolons vs. full stops to join related ideas

**Vocabulary**
- Technical density — how much jargon per paragraph?
- Preferred synonyms (e.g. "built" vs. "developed" vs. "engineered")
- Words or phrases the user reaches for repeatedly — keep them
- Words that never appear — don't introduce them

**Paragraph and structure patterns**
- Paragraph length — one-liners or developed blocks?
- Bullet-heavy or prose-heavy?
- How ideas are sequenced — problem → solution, result-first, chronological?
- Use of headers within longer pieces

**Voice signatures**
- First-person patterns — "I led", "we built", "our team"?
- Active vs. passive ratio
- Habitual openers and closers
- Rhetorical moves — does the user ask questions, use contrast, tell micro-stories?

### Rules

- **Only extract what is demonstrably present.** Do not infer style from a single data point.
- **Idiosyncratic choices are intentional.** Unconventional punctuation or phrasing is the user's voice — preserve it, do not correct it.
- **If samples conflict**, weight the most recent or most similar-context file.
- **If samples are sparse**, apply what can be reliably extracted and fall back to defaults for the rest.
- **Style calibration applies to tone and structure only.** Do not import content, claims, or metrics from samples into CVs, reports, or evaluations.
- **No verbatim copying or personal identifiers.** Store only abstract style descriptors (tone, structure, vocabulary preferences). Do not quote user sentences verbatim and do not retain personal identifiers (names, emails, phone numbers) from writing samples. "Preserve idiosyncratic choices" applies to stylistic traits only.

### Persisting the extracted style

After scanning (excluding any `README.md` files), write to `modes/_profile.md` only if at least one user-provided sample was found: find the existing `## Writing Style` section and replace the entire block up to the next `##` heading (or EOF) with the new content. If no `## Writing Style` section exists, append it. This ensures there is always exactly one canonical section. If no samples were found after filtering, do not write or modify the section.

```markdown
## Writing Style

_Extracted from writing-samples/ on {date}. Re-run if new samples are added._

**Tone:** {e.g. conversational, confident, no hedging qualifiers}
**Sentence length:** {e.g. short and punchy, avg 12 words}
**Openings:** {e.g. action-first, subject-first}
**Punctuation:** {e.g. em dashes for asides, Oxford comma, no ellipses}
**Vocabulary:** {e.g. prefers "built"/"ran"/"cut" over "developed"/"led"/"reduced"}
**Structure:** {e.g. prose-heavy, result-first sequencing}
**Voice:** {e.g. "I led", active voice dominant, no rhetorical questions}
**Avoid:** {words or patterns absent from samples}
```

---

## Professional Writing & ATS Compatibility

These rules apply to ALL generated text that ends up in candidate-facing documents: PDF summaries, bullets, cover letters, form answers, LinkedIn messages. They do NOT apply to internal evaluation reports.

### Avoid cliché phrases
- "passionate about" / "results-oriented" / "proven track record"
- "leveraged" (use "used" or name the tool)
- "spearheaded" (use "led" or "ran")
- "facilitated" (use "ran" or "set up")
- "synergies" / "robust" / "seamless" / "cutting-edge" / "innovative"
- "in today's fast-paced world"
- "demonstrated ability to" / "best practices" (name the practice)

### Unicode normalization for ATS
`generate-pdf.mjs` automatically normalizes em-dashes, smart quotes, and zero-width characters to ASCII equivalents for maximum ATS compatibility. But avoid generating them in the first place.

### Vary sentence structure
- Don't start every bullet with the same verb
- Mix sentence lengths (short. Then longer with context. Short again.)
- Don't always use "X, Y, and Z" — sometimes two items, sometimes four

### Prefer specifics over abstractions
- "Cut p95 latency from 2.1s to 380ms" beats "improved performance"
- "Postgres + pgvector for retrieval over 12k docs" beats "designed scalable RAG architecture"
- Name tools, projects, and customers when allowed


---

# Modo: pdf — Generación de PDF ATS-Optimizado

## Pipeline completo

1. Lee `cv.md` como fuentes de verdad
2. Pide al usuario el JD si no está en contexto (texto o URL)
3. Extrae 15-20 keywords del JD
4. Detecta idioma del JD → idioma del CV (EN default)
5. Detecta ubicación empresa → formato papel:
   - US/Canada → `letter`
   - Resto del mundo → `a4`
6. Detecta arquetipo del rol → adapta framing
7. Reescribe Professional Summary inyectando keywords del JD + exit narrative bridge ("Built and sold a business. Now applying systems thinking to [domain del JD].")
8. Selecciona top 3-4 proyectos más relevantes para la oferta
9. Reordena bullets de experiencia por relevancia al JD
10. Construye competency grid desde requisitos del JD (6-8 keyword phrases)
11. Inyecta keywords naturalmente en logros existentes (NUNCA inventa)
12. Genera HTML completo desde template + contenido personalizado
13. Lee `name` de `config/profile.yml` → normaliza a kebab-case lowercase (e.g. "John Doe" → "john-doe") → `{candidate}`
14. Escribe HTML a `/tmp/cv-{candidate}-{company}.html`
15. Ejecuta: `node generate-pdf.mjs /tmp/cv-{candidate}-{company}.html output/cv-{candidate}-{company}-{YYYY-MM-DD}.pdf --format={letter|a4}`
16. Reporta: ruta del PDF, nº páginas, % cobertura de keywords

## Reglas ATS (parseo limpio)

- Layout single-column (sin sidebars, sin columnas paralelas)
- Headers estándar: "Professional Summary", "Work Experience", "Education", "Skills", "Certifications", "Projects"
- Sin texto en imágenes/SVGs
- Sin info crítica en headers/footers del PDF (ATS los ignora)
- UTF-8, texto seleccionable (no rasterizado)
- Sin tablas anidadas
- Keywords del JD distribuidas: Summary (top 5), primer bullet de cada rol, Skills section

## Diseño del PDF

- **Fonts**: Space Grotesk (headings, 600-700) + DM Sans (body, 400-500)
- **Fonts self-hosted**: `fonts/`
- **Header**: nombre en Space Grotesk 24px bold + línea gradiente `linear-gradient(to right, hsl(187,74%,32%), hsl(270,70%,45%))` 2px + fila de contacto
- **Section headers**: Space Grotesk 13px, uppercase, letter-spacing 0.05em, color cyan primary
- **Body**: DM Sans 11px, line-height 1.5
- **Company names**: color accent purple `hsl(270,70%,45%)`
- **Márgenes**: 0.6in
- **Background**: blanco puro

## Orden de secciones (optimizado "6-second recruiter scan")

1. Header (nombre grande, gradiente, contacto, link portfolio)
2. Professional Summary (3-4 líneas, keyword-dense)
3. Core Competencies (6-8 keyword phrases en flex-grid)
4. Work Experience (cronológico inverso)
5. Projects (top 3-4 más relevantes)
6. Education & Certifications
7. Skills (idiomas + técnicos)

## Estrategia de keyword injection (ético, basado en verdad)

Ejemplos de reformulación legítima:
- JD dice "RAG pipelines" y CV dice "LLM workflows with retrieval" → cambiar a "RAG pipeline design and LLM orchestration workflows"
- JD dice "MLOps" y CV dice "observability, evals, error handling" → cambiar a "MLOps and observability: evals, error handling, cost monitoring"
- JD dice "stakeholder management" y CV dice "collaborated with team" → cambiar a "stakeholder management across engineering, operations, and business"

**NUNCA añadir skills que el candidato no tiene. Solo reformular experiencia real con el vocabulario exacto del JD.**

## Template HTML

Usar el template en `cv-template.html`. Reemplazar los placeholders `{{...}}` con contenido personalizado:

| Placeholder | Contenido |
|-------------|-----------|
| `{{LANG}}` | `en` o `es` |
| `{{PAGE_WIDTH}}` | `8.5in` (letter) o `210mm` (A4) |
| `{{NAME}}` | (from profile.yml) |
| `{{PHONE}}` | (from profile.yml — include with its separator only when `profile.yml` has a non-empty `phone` value; omit both `<span>` and `<span class="separator">` otherwise) |
| `{{EMAIL}}` | (from profile.yml) |
| `{{LINKEDIN_URL}}` | [from profile.yml] |
| `{{LINKEDIN_DISPLAY}}` | [from profile.yml] |
| `{{PORTFOLIO_URL}}` | [from profile.yml] (o /es según idioma) |
| `{{PORTFOLIO_DISPLAY}}` | [from profile.yml] (o /es según idioma) |
| `{{LOCATION}}` | [from profile.yml] |
| `{{SECTION_SUMMARY}}` | Professional Summary / Resumen Profesional |
| `{{SUMMARY_TEXT}}` | Summary personalizado con keywords |
| `{{SECTION_COMPETENCIES}}` | Core Competencies / Competencias Core |
| `{{COMPETENCIES}}` | `<span class="competency-tag">keyword</span>` × 6-8 |
| `{{SECTION_EXPERIENCE}}` | Work Experience / Experiencia Laboral |
| `{{EXPERIENCE}}` | HTML de cada trabajo con bullets reordenados |
| `{{SECTION_PROJECTS}}` | Projects / Proyectos |
| `{{PROJECTS}}` | HTML de top 3-4 proyectos |
| `{{SECTION_EDUCATION}}` | Education / Formación |
| `{{EDUCATION}}` | HTML de educación |
| `{{SECTION_CERTIFICATIONS}}` | Certifications / Certificaciones |
| `{{CERTIFICATIONS}}` | HTML de certificaciones |
| `{{SECTION_SKILLS}}` | Skills / Competencias |
| `{{SKILLS}}` | HTML de skills |

## Canva CV Generation (optional)

If `config/profile.yml` has `cv.canva_resume_design_id` set, offer the user a choice before generating:
- **"HTML/PDF (fast, ATS-optimized)"** — existing flow above
- **"Canva CV (visual, design-preserving)"** — new flow below

If the user has no `cv.canva_resume_design_id`, skip this prompt and use the HTML/PDF flow.

### Canva workflow

#### Step 1 — Duplicate the base design

a. `export-design` the base design (using `cv.canva_resume_design_id`) as PDF → get download URL
b. `import-design-from-url` using that download URL → creates a new editable design (the duplicate)
c. Note the new `design_id` for the duplicate

#### Step 2 — Read the design structure

a. `get-design-content` on the new design → returns all text elements (richtexts) with their content
b. Map text elements to CV sections by content matching:
   - Look for the candidate's name → header section
   - Look for "Summary" or "Professional Summary" → summary section
   - Look for company names from cv.md → experience sections
   - Look for degree/school names → education section
   - Look for skill keywords → skills section
c. If mapping fails, show the user what was found and ask for guidance

#### Step 3 — Generate tailored content

Same content generation as the HTML flow (Steps 1-11 above):
- Rewrite Professional Summary with JD keywords + exit narrative
- Reorder experience bullets by JD relevance
- Select top competencies from JD requirements
- Inject keywords naturally (NEVER invent)

**IMPORTANT — Character budget rule:** Each replacement text MUST be approximately the same length as the original text it replaces (within ±15% character count). If tailored content is longer, condense it. The Canva design has fixed-size text boxes — longer text causes overlapping with adjacent elements. Count the characters in each original element from Step 2 and enforce this budget when generating replacements.

#### Step 4 — Apply edits

a. `start-editing-transaction` on the duplicate design
b. `perform-editing-operations` with `find_and_replace_text` for each section:
   - Replace summary text with tailored summary
   - Replace each experience bullet with reordered/rewritten bullets
   - Replace competency/skills text with JD-matched terms
   - Replace project descriptions with top relevant projects
c. **Reflow layout after text replacement:**
   After applying all text replacements, the text boxes auto-resize but neighboring elements stay in place. This causes uneven spacing between work experience sections. Fix this:
   1. Read the updated element positions and dimensions from the `perform-editing-operations` response
   2. For each work experience section (top to bottom), calculate where the bullets text box ends: `end_y = top + height`
   3. The next section's header should start at `end_y + consistent_gap` (use the original gap from the template, typically ~30px)
   4. Use `position_element` to move the next section's date, company name, role title, and bullets elements to maintain even spacing
   5. Repeat for all work experience sections
d. **Verify layout before commit:**
   - `get-design-thumbnail` with the transaction_id and page_index=1
   - Visually inspect the thumbnail for: text overlapping, uneven spacing, text cut off, text too small
   - If issues remain, adjust with `position_element`, `resize_element`, or `format_text`
   - Repeat until layout is clean
d. Show the user the final preview and ask for approval
e. `commit-editing-transaction` to save (ONLY after user approval)

#### Step 5 — Export and download PDF

a. `export-design` the duplicate as PDF (format: a4 or letter based on JD location)
b. **IMMEDIATELY** download the PDF using Bash:
   ```bash
   curl -sL -o "output/cv-{candidate}-{company}-canva-{YYYY-MM-DD}.pdf" "{download_url}"
   ```
   The export URL is a pre-signed S3 link that expires in ~2 hours. Download it right away.
c. Verify the download:
   ```bash
   file output/cv-{candidate}-{company}-canva-{YYYY-MM-DD}.pdf
   ```
   Must show "PDF document". If it shows XML or HTML, the URL expired — re-export and retry.
d. Report: PDF path, file size, Canva design URL (for manual tweaking)

#### Error handling

- If `import-design-from-url` fails → fall back to HTML/PDF pipeline with message
- If text elements can't be mapped → warn user, show what was found, ask for manual mapping
- If `find_and_replace_text` finds no matches → try broader substring matching
- Always provide the Canva design URL so the user can edit manually if auto-edit fails

## Post-generación

Actualizar tracker si la oferta ya está registrada: cambiar PDF de ❌ a ✅.
