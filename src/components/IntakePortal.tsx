"use client";

import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Database,
  Download,
  FileScan,
  FileText,
  FolderLock,
  Info,
  ListChecks,
  LockKeyhole,
  Plus,
  Scale,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCheck,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  governancePrinciples,
  intakeForms,
  legacySourceMap,
  processStages,
} from "@/data/forms";
import type {
  FieldValue,
  IntakeField,
  IntakeFormDefinition,
  IntakeValues,
} from "@/types/intake";

type HomeView = "blueprint" | "sources" | "governance";

const formIcons: Record<string, typeof FileText> = {
  "conflict-prescreen": ShieldCheck,
  "general-intake": FileText,
  "custody-support": Users,
  dissolution: Scale,
  "spousal-support-modification": ListChecks,
  "privacy-communications": LockKeyhole,
  "document-collection": FileScan,
  "internal-opening": UserCheck,
};

const audienceLabels = {
  prospect: "Prospect-facing",
  client: "Invited client",
  staff: "Staff only",
};

const accentClass = (accent: IntakeFormDefinition["accent"]) =>
  `accent-${accent}`;

const hasValue = (value: FieldValue | undefined) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "boolean") return value;
  return Boolean(value?.toString().trim());
};

const inputId = (fieldId: string) => fieldId.replaceAll(".", "-");

function LogoMark() {
  return (
    <div className="brand" aria-label="Lewis Legal Group">
      <div className="brand-mark" aria-hidden="true">
        <span>LL</span>
      </div>
      <div className="brand-copy">
        <span className="brand-name">Lewis Legal</span>
        <span className="brand-subtitle">Family Law · California</span>
      </div>
    </div>
  );
}

function PrototypeBanner() {
  return (
    <div className="prototype-banner" role="status">
      <div className="shell prototype-inner">
        <span className="prototype-pill">Interactive prototype</span>
        <span>Use synthetic information only. Nothing is saved, uploaded, or sent to MyCase.</span>
      </div>
    </div>
  );
}

function HomeHeader({ view, setView }: { view: HomeView; setView: (view: HomeView) => void }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <LogoMark />
        <nav className="header-nav" aria-label="Prototype sections">
          <button className={view === "blueprint" ? "nav-active" : ""} onClick={() => setView("blueprint")}>
            Blueprint
          </button>
          <button className={view === "sources" ? "nav-active" : ""} onClick={() => setView("sources")}>
            Source audit
          </button>
          <button className={view === "governance" ? "nav-active" : ""} onClick={() => setView("governance")}>
            Safeguards
          </button>
        </nav>
        <a className="header-cta" href="#form-library">
          Explore forms <ChevronRight size={16} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}

function WorkflowStrip() {
  return (
    <section className="workflow-section" aria-labelledby="workflow-title">
      <div className="section-kicker"><Workflow size={16} /> Proposed operating model</div>
      <div className="section-heading-row">
        <div>
          <h2 id="workflow-title">One safe path from inquiry to MyCase</h2>
          <p>Each gate collects only what the next person or system actually needs.</p>
        </div>
        <div className="flow-legend">
          <span><i className="legend-human" /> Human decision</span>
          <span><i className="legend-system" /> System assist</span>
        </div>
      </div>
      <div className="process-track">
        {processStages.map((stage, index) => (
          <div className={`process-step ${[1, 4].includes(index) ? "human-step" : "system-step"}`} key={stage.number}>
            <span className="process-number">{stage.number}</span>
            <h3>{stage.title}</h3>
            <p>{stage.detail}</p>
            {index < processStages.length - 1 && <ArrowRight className="process-arrow" size={17} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function FormLibrary({ openForm }: { openForm: (formId: string) => void }) {
  return (
    <section className="forms-section" id="form-library" aria-labelledby="forms-title">
      <div className="section-kicker"><Braces size={16} /> Schema-driven form library</div>
      <div className="section-heading-row">
        <div>
          <h2 id="forms-title">Eight modules, shown only when needed</h2>
          <p>The same canonical fields can power this interface, validation, audit logs, and future MyCase writes.</p>
        </div>
        <span className="library-count">{intakeForms.length} working mockups</span>
      </div>
      <div className="form-grid">
        {intakeForms.map((form) => {
          const Icon = formIcons[form.id] ?? FileText;
          return (
            <article className={`form-card ${accentClass(form.accent)}`} key={form.id}>
              <div className="form-card-top">
                <div className="form-icon"><Icon size={21} aria-hidden="true" /></div>
                <span className={`audience-badge audience-${form.audience}`}>{audienceLabels[form.audience]}</span>
              </div>
              <div>
                <span className="form-stage">{form.stage}</span>
                <h3>{form.shortTitle}</h3>
                <p>{form.description}</p>
              </div>
              <div className="form-meta">
                <span><Clock3 size={14} /> {form.estimatedMinutes}</span>
                <span><ListChecks size={14} /> {form.sections.length} sections</span>
              </div>
              <div className="safeguard-tags" aria-label="Safeguards">
                {form.safeguards.slice(0, 2).map((item) => <span key={item}>{item}</span>)}
              </div>
              <button className="card-action" onClick={() => openForm(form.id)}>
                Open prototype <ArrowRight size={16} aria-hidden="true" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SourceAudit() {
  return (
    <main className="shell content-page">
      <div className="page-intro compact-intro">
        <div className="section-kicker"><FileScan size={16} /> Eight PDFs reviewed</div>
        <h1>Legacy form reconciliation</h1>
        <p>Every source remains traceable, but duplication and unsafe collection patterns do not have to survive the migration.</p>
      </div>
      <div className="audit-table-wrap">
        <table className="audit-table">
          <thead>
            <tr><th>Legacy source</th><th>Finding</th><th>Modern destination</th></tr>
          </thead>
          <tbody>
            {legacySourceMap.map((row) => (
              <tr key={row.source}>
                <td><FileText size={16} /> <strong>{row.source}</strong></td>
                <td>{row.finding}</td>
                <td><span className="destination-chip">{row.destination}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="audit-callout">
        <CheckCircle2 size={22} />
        <div>
          <strong>Confirmed duplicate set</strong>
          <p>GENERAL INTAKE 2022 and GENERAL INTAKE 2024 have identical extracted content on both pages. GENERAL INTAKE LLG is the same first page.</p>
        </div>
      </div>
    </main>
  );
}

function GovernanceView() {
  return (
    <main className="shell content-page">
      <div className="page-intro compact-intro">
        <div className="section-kicker"><ShieldCheck size={16} /> Human-led by design</div>
        <h1>Guardrails are part of the workflow</h1>
        <p>The system can remove clerical friction while preserving Heather&apos;s professional judgment and the staff&apos;s control of client communication.</p>
      </div>
      <div className="governance-grid">
        <div className="governance-main">
          <span className="overline">Operating principles</span>
          {governancePrinciples.map((principle, index) => (
            <div className="principle-row" key={principle}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{principle}</p>
            </div>
          ))}
        </div>
        <aside className="control-stack">
          <div className="control-card">
            <FolderLock size={22} />
            <h3>Information boundaries</h3>
            <p>Conflict data, engaged-client facts, restricted safety notes, and files live in separate access zones.</p>
          </div>
          <div className="control-card">
            <UserCheck size={22} />
            <h3>Mandatory approvals</h3>
            <p>Conflict outcome, legal conclusions, engagement, deadlines, client messages, MyCase conversion, and filings require a person.</p>
          </div>
          <div className="control-card">
            <Database size={22} />
            <h3>API reality</h3>
            <p>The integration can write supported leads, contacts, and custom fields. It cannot remotely redesign MyCase native forms or workflows.</p>
          </div>
        </aside>
      </div>
      <div className="ai-boundary">
        <div className="ai-boundary-icon"><Sparkles size={24} /></div>
        <div>
          <span className="overline">Appropriate AI role</span>
          <h2>Draft, classify, compare, and flag—then stop for review.</h2>
        </div>
        <div className="boundary-list">
          <span><Check size={15} /> Find missing answers</span>
          <span><Check size={15} /> Suggest document categories</span>
          <span><Check size={15} /> Prepare staff summaries</span>
          <span className="boundary-no"><X size={15} /> No client advice</span>
          <span className="boundary-no"><X size={15} /> No autonomous sending</span>
        </div>
      </div>
    </main>
  );
}

function BlueprintHome({ openForm }: { openForm: (formId: string) => void }) {
  return (
    <main>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><ShieldCheck size={16} /> Intake modernization prototype · v0.1</div>
            <h1>Less paperwork.<br /><em>More protected time.</em></h1>
            <p className="hero-lede">A secure, staged family-law intake experience built from Lewis Legal&apos;s existing forms—and designed for a supervised future connection to MyCase.</p>
            <div className="hero-actions">
              <button className="button-primary" onClick={() => openForm("conflict-prescreen")}>
                Try the first-contact flow <ArrowRight size={17} />
              </button>
              <a className="button-secondary" href="#form-library">See all modules</a>
            </div>
            <div className="trust-row">
              <span><LockKeyhole size={15} /> Data minimization</span>
              <span><UserCheck size={15} /> Human approval</span>
              <span><Database size={15} /> MyCase-ready schema</span>
            </div>
          </div>
          <div className="hero-panel" aria-label="Intake workflow overview">
            <div className="panel-head">
              <span>Prospective client journey</span>
              <span className="status-live"><i /> Proposed</span>
            </div>
            <div className="journey-stack">
              <div className="journey-item complete">
                <span className="journey-icon"><Check size={16} /></span>
                <div><strong>Names & safe contact</strong><small>Minimum conflict-check data</small></div>
                <span className="journey-time">3 min</span>
              </div>
              <div className="journey-line" />
              <div className="journey-item human">
                <span className="journey-icon"><UserCheck size={16} /></span>
                <div><strong>Staff conflict review</strong><small>Required human gate</small></div>
                <span className="human-label">HUMAN</span>
              </div>
              <div className="journey-line" />
              <div className="journey-item">
                <span className="journey-icon"><FileText size={16} /></span>
                <div><strong>Relevant intake modules</strong><small>Conditional, no duplicate questions</small></div>
              </div>
              <div className="journey-line" />
              <div className="journey-item">
                <span className="journey-icon"><Database size={16} /></span>
                <div><strong>Reviewed MyCase write</strong><small>Supported fields only</small></div>
              </div>
            </div>
            <div className="panel-foot">
              <ShieldCheck size={17} />
              <p><strong>Safety boundary:</strong> no form creates a lawyer-client relationship, gives advice, or contacts a court.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="shell">
        <WorkflowStrip />
        <FormLibrary openForm={openForm} />
      </div>
    </main>
  );
}

function FieldBadges({ field }: { field: IntakeField }) {
  if (!field.required && !field.sensitive && !field.deferred) return null;
  return (
    <span className="field-badges">
      {field.required && <span className="required-badge">Required</span>}
      {field.sensitive && <span className="sensitive-badge"><LockKeyhole size={11} /> Sensitive</span>}
      {field.deferred && <span className="deferred-badge">Deferred</span>}
    </span>
  );
}

interface FieldRendererProps {
  field: IntakeField;
  values: IntakeValues;
  setValue: (id: string, value: FieldValue) => void;
  tableRows: Record<string, number>;
  addTableRow: (fieldId: string) => void;
  invalid: boolean;
  mappingMode: boolean;
}

function FieldRenderer({ field, values, setValue, tableRows, addTableRow, invalid, mappingMode }: FieldRendererProps) {
  const id = inputId(field.id);
  const value = values[field.id];
  const describedBy = field.help ? `${id}-help` : undefined;

  if (field.type === "notice") {
    return (
      <div className="field-full notice-card">
        <Info size={20} aria-hidden="true" />
        <div><strong>{field.label}</strong><p>{field.help}</p></div>
      </div>
    );
  }

  const wrapperClass = `form-field ${field.fullWidth || ["table", "matrix", "upload", "checkboxes", "textarea", "acknowledgment"].includes(field.type) ? "field-full" : ""} ${invalid ? "field-invalid" : ""} ${field.deferred ? "field-deferred" : ""}`;

  const label = (
    <div className="field-label-row">
      <label htmlFor={id}>{field.label}</label>
      <FieldBadges field={field} />
    </div>
  );

  const help = field.help && <p className="field-help" id={describedBy}>{field.help}</p>;
  const mapping = mappingMode && field.mycaseTarget && (
    <div className="mapping-inline"><Database size={13} /> {field.mycaseTarget}</div>
  );

  if (field.type === "yesno") {
    return (
      <div className={wrapperClass}>
        {label}{help}
        <div className="segmented-control" id={id} role="group" aria-label={field.label}>
          {["Yes", "No"].map((option) => (
            <button key={option} type="button" className={value === option ? "selected" : ""} onClick={() => setValue(field.id, option)}>
              {value === option && <Check size={14} />} {option}
            </button>
          ))}
        </div>
        {mapping}
      </div>
    );
  }

  if (field.type === "checkboxes") {
    const checked = Array.isArray(value) ? value : [];
    return (
      <fieldset className={wrapperClass}>
        <legend className="sr-only">{field.label}</legend>
        <div className="field-label-row"><span className="field-legend">{field.label}</span><FieldBadges field={field} /></div>
        {help}
        <div className="choice-grid">
          {field.options?.map((option) => {
            const isChecked = checked.includes(option);
            return (
              <label className={`choice-card ${isChecked ? "choice-selected" : ""}`} key={option}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setValue(field.id, isChecked ? checked.filter((item) => item !== option) : [...checked, option])}
                />
                <span className="checkbox-visual">{isChecked && <Check size={13} />}</span>
                <span>{option}</span>
              </label>
            );
          })}
        </div>
        {mapping}
      </fieldset>
    );
  }

  if (field.type === "acknowledgment") {
    const checked = value === true;
    return (
      <div className={wrapperClass}>
        <label className={`acknowledgment-card ${checked ? "acknowledged" : ""}`} htmlFor={id}>
          <input id={id} type="checkbox" checked={checked} onChange={(event) => setValue(field.id, event.target.checked)} />
          <span className="checkbox-visual">{checked && <Check size={14} />}</span>
          <span>{field.label}<FieldBadges field={field} /></span>
        </label>
        {help}{mapping}
      </div>
    );
  }

  if (field.type === "table") {
    const rowCount = tableRows[field.id] ?? field.initialRows ?? 2;
    return (
      <div className={wrapperClass}>
        {label}{help}
        <div className="responsive-table">
          <table className="entry-table">
            <thead><tr>{field.columns?.map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {Array.from({ length: rowCount }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  {field.columns?.map((column, columnIndex) => {
                    const cellId = `${field.id}.${rowIndex}.${columnIndex}`;
                    return (
                      <td key={column} data-label={column}>
                        <label className="sr-only" htmlFor={inputId(cellId)}>{`${field.label}, row ${rowIndex + 1}, ${column}`}</label>
                        <input
                          id={inputId(cellId)}
                          value={(values[cellId] as string) ?? ""}
                          onChange={(event) => setValue(cellId, event.target.value)}
                          placeholder={rowIndex === 0 ? column : ""}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="add-row" onClick={() => addTableRow(field.id)}><Plus size={15} /> Add another row</button>
        {mapping}
      </div>
    );
  }

  if (field.type === "matrix") {
    return (
      <div className={wrapperClass}>
        {label}{help}
        <div className="responsive-table">
          <table className="matrix-table">
            <thead><tr><th>Item</th>{field.columns?.map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {field.rows?.map((row, rowIndex) => (
                <tr key={row}>
                  <th>{row}</th>
                  {field.columns?.map((column, columnIndex) => {
                    const cellId = `${field.id}.${rowIndex}.${columnIndex}`;
                    return (
                      <td key={column} data-label={column}>
                        <label className="sr-only" htmlFor={inputId(cellId)}>{`${row}, ${column}`}</label>
                        <input id={inputId(cellId)} value={(values[cellId] as string) ?? ""} onChange={(event) => setValue(cellId, event.target.value)} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mapping}
      </div>
    );
  }

  if (field.type === "upload") {
    const filenames = Array.isArray(value) ? value : [];
    return (
      <div className={wrapperClass}>
        {label}{help}
        <label className="upload-zone" htmlFor={id}>
          <input
            id={id}
            type="file"
            multiple
            onChange={(event) => setValue(field.id, Array.from(event.target.files ?? []).map((file) => file.name))}
          />
          <span className="upload-icon"><Upload size={22} /></span>
          <span><strong>Choose files for this mock</strong><small>Filenames stay in this browser session; file contents are not read.</small></span>
        </label>
        {filenames.length > 0 && <div className="file-list">{filenames.map((name) => <span key={name}><FileText size={14} /> {name}</span>)}</div>}
        {mapping}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={wrapperClass}>
        {label}{help}
        <textarea
          id={id}
          value={(value as string) ?? ""}
          onChange={(event) => setValue(field.id, event.target.value)}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
          disabled={field.deferred}
          rows={4}
        />
        {mapping}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className={wrapperClass}>
        {label}{help}
        <select id={id} value={(value as string) ?? ""} onChange={(event) => setValue(field.id, event.target.value)} aria-describedby={describedBy} disabled={field.deferred}>
          <option value="">Select an option</option>
          {field.options?.map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
        {mapping}
      </div>
    );
  }

  const htmlType = field.type === "currency" ? "number" : field.type;
  return (
    <div className={wrapperClass}>
      {label}{help}
      <div className={field.type === "currency" ? "currency-wrap" : ""}>
        {field.type === "currency" && <span>$</span>}
        <input
          id={id}
          type={htmlType}
          value={(value as string) ?? ""}
          onChange={(event) => setValue(field.id, event.target.value)}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
          disabled={field.deferred}
          inputMode={field.type === "currency" ? "decimal" : undefined}
        />
      </div>
      {mapping}
    </div>
  );
}

interface WizardProps {
  form: IntakeFormDefinition;
  closeForm: () => void;
}

function FormWizard({ form, closeForm }: WizardProps) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [values, setValues] = useState<IntakeValues>({});
  const [tableRows, setTableRows] = useState<Record<string, number>>({});
  const [mappingMode, setMappingMode] = useState(false);
  const [validationShown, setValidationShown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const isReview = sectionIndex === form.sections.length;
  const section = isReview ? null : form.sections[sectionIndex];
  const progress = Math.round((sectionIndex / form.sections.length) * 100);

  const visibleFields = useMemo(() => {
    if (!section) return [];
    return section.fields.filter((field) => {
      if (!field.condition) return true;
      const controllingValue = values[field.condition.fieldId];
      if (field.condition.includes && Array.isArray(controllingValue)) return controllingValue.includes(field.condition.includes);
      return controllingValue === field.condition.equals;
    });
  }, [section, values]);

  const missingRequired = visibleFields.filter((field) => field.required && field.type !== "notice" && !hasValue(values[field.id]));

  const answeredCount = Object.values(values).filter(hasValue).length;

  const setValue = (id: string, value: FieldValue) => {
    setValues((current) => ({ ...current, [id]: value }));
    setValidationShown(false);
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const next = (skipValidation = false) => {
    if (!skipValidation && missingRequired.length > 0) {
      setValidationShown(true);
      return;
    }
    setValidationShown(false);
    setSectionIndex((current) => Math.min(form.sections.length, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previous = () => {
    setValidationShown(false);
    setSectionIndex((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const downloadPayload = () => {
    const payload = {
      schemaVersion: "lewis-legal-intake-prototype-v0.1",
      prototype: true,
      formId: form.id,
      formTitle: form.title,
      generatedAt: new Date().toISOString(),
      answers: values,
      reviewRequired: true,
      transmissionStatus: "not-sent",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${form.id}-sample-payload.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("Sample JSON downloaded. Nothing was transmitted.");
  };

  return (
    <div className="wizard-app">
      <header className="wizard-header">
        <div className="wizard-brand-row">
          <LogoMark />
          <div className="wizard-actions">
            <button className={`mapping-toggle ${mappingMode ? "mapping-on" : ""}`} onClick={() => setMappingMode((current) => !current)}>
              <Database size={15} /> {mappingMode ? "Hide mapping" : "Show MyCase mapping"}
            </button>
            <button className="icon-button" onClick={closeForm} aria-label="Close form prototype"><X size={20} /></button>
          </div>
        </div>
        <div className="progress-line" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      </header>

      <div className="wizard-layout">
        <aside className="wizard-sidebar">
          <button className="back-library" onClick={closeForm}><ArrowLeft size={15} /> Form library</button>
          <div className={`wizard-form-icon ${accentClass(form.accent)}`}>{(() => { const Icon = formIcons[form.id] ?? FileText; return <Icon size={22} />; })()}</div>
          <span className={`audience-badge audience-${form.audience}`}>{audienceLabels[form.audience]}</span>
          <h2>{form.shortTitle}</h2>
          <p>{form.description}</p>
          <div className="sidebar-meta"><Clock3 size={14} /> {form.estimatedMinutes}</div>
          <nav className="section-nav" aria-label="Form sections">
            {form.sections.map((item, index) => (
              <button
                key={item.id}
                className={`${sectionIndex === index ? "current" : ""} ${sectionIndex > index ? "complete" : ""}`}
                onClick={() => { setSectionIndex(index); setValidationShown(false); }}
              >
                <span>{sectionIndex > index ? <Check size={13} /> : index + 1}</span>
                <div><strong>{item.title}</strong><small>{item.eyebrow}</small></div>
              </button>
            ))}
            <button className={isReview ? "current" : ""} onClick={() => setSectionIndex(form.sections.length)}>
              <span>{form.sections.length + 1}</span><div><strong>Review</strong><small>Sample payload</small></div>
            </button>
          </nav>
          <div className="sidebar-source">
            <span>Built from</span>
            {form.sourceDocuments.map((source) => <small key={source}><FileText size={12} /> {source}</small>)}
          </div>
        </aside>

        <main className="wizard-main">
          {!isReview && section ? (
            <>
              <div className="mobile-form-label">
                <button onClick={closeForm}><ArrowLeft size={15} /> Library</button>
                <span>{form.shortTitle}</span>
              </div>
              <div className="section-intro">
                <span className="overline">{section.eyebrow}</span>
                <h1>{section.title}</h1>
                <p>{section.description}</p>
              </div>
              {mappingMode && (
                <div className="mapping-banner">
                  <Database size={18} />
                  <div><strong>Implementation view is on</strong><p>Each field shows its intended destination or approval boundary. These are proposed mappings, not live API calls.</p></div>
                </div>
              )}
              <form className="fields-grid" onSubmit={(event) => { event.preventDefault(); next(); }} noValidate>
                {visibleFields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    values={values}
                    setValue={setValue}
                    tableRows={tableRows}
                    addTableRow={(fieldId) => setTableRows((current) => ({ ...current, [fieldId]: (current[fieldId] ?? field.initialRows ?? 2) + 1 }))}
                    invalid={validationShown && field.required === true && !hasValue(values[field.id])}
                    mappingMode={mappingMode}
                  />
                ))}
                {validationShown && missingRequired.length > 0 && (
                  <div className="validation-message field-full" role="alert">
                    <CircleAlert size={18} />
                    <div><strong>Please complete {missingRequired.length} required {missingRequired.length === 1 ? "item" : "items"}.</strong><p>For a walkthrough, you can also skip this section below.</p></div>
                  </div>
                )}
                <div className="wizard-footer field-full">
                  <div>
                    {sectionIndex > 0 && <button type="button" className="button-secondary" onClick={previous}><ArrowLeft size={16} /> Back</button>}
                  </div>
                  <div className="wizard-footer-right">
                    <button type="button" className="skip-button" onClick={() => next(true)}>Skip section in prototype</button>
                    <button type="submit" className="button-primary">{sectionIndex === form.sections.length - 1 ? "Review answers" : "Save & continue"}<ArrowRight size={16} /></button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="review-page">
              <div className="section-intro">
                <span className="overline">Review · Prototype only</span>
                <h1>Ready for human review</h1>
                <p>This screen demonstrates the handoff boundary. A production submission would be validated, quarantined, and reviewed before any MyCase write.</p>
              </div>
              <div className="review-status">
                <div className="review-check"><CheckCircle2 size={28} /></div>
                <div><strong>{answeredCount} populated answer fields</strong><p>Nothing has been saved or transmitted.</p></div>
                <span>Review required</span>
              </div>
              <div className="review-sections">
                {form.sections.map((item, index) => {
                  const answerKeys = item.fields.flatMap((field) => Object.keys(values).filter((key) => key === field.id || key.startsWith(`${field.id}.`)));
                  const populated = answerKeys.filter((key) => hasValue(values[key]));
                  return (
                    <button key={item.id} onClick={() => setSectionIndex(index)}>
                      <span className="review-section-number">{String(index + 1).padStart(2, "0")}</span>
                      <div><strong>{item.title}</strong><small>{populated.length} populated fields</small></div>
                      <ChevronRight size={17} />
                    </button>
                  );
                })}
              </div>
              <div className="handoff-card">
                <div className="handoff-heading"><Workflow size={20} /><strong>Production handoff</strong></div>
                <div className="handoff-track">
                  <span className="done"><Check size={13} /> Form data</span><i />
                  <span>Validation</span><i />
                  <span>Staff review</span><i />
                  <span>Heather approval</span><i />
                  <span>MyCase</span>
                </div>
                <p>The API write is deliberately last. Native MyCase form and workflow configuration remains outside the published API and would be maintained separately.</p>
              </div>
              <div className="review-actions">
                <button className="button-secondary" onClick={previous}><ArrowLeft size={16} /> Back to form</button>
                <button className="button-primary" onClick={downloadPayload}><Download size={16} /> Download sample JSON</button>
              </div>
            </div>
          )}
        </main>
      </div>
      {toast && <div className="toast" role="status"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  );
}

export default function IntakePortal() {
  const [homeView, setHomeView] = useState<HomeView>("blueprint");
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const activeForm = intakeForms.find((form) => form.id === activeFormId);

  useEffect(() => {
    const requestedForm = new URLSearchParams(window.location.search).get("form");
    if (requestedForm && intakeForms.some((form) => form.id === requestedForm)) {
      const timer = window.setTimeout(() => setActiveFormId(requestedForm), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const openForm = (formId: string) => {
    setActiveFormId(formId);
    window.history.replaceState(null, "", `?form=${encodeURIComponent(formId)}`);
  };

  const closeForm = () => {
    setActiveFormId(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  if (activeForm) return <><PrototypeBanner /><FormWizard form={activeForm} closeForm={closeForm} /></>;

  return (
    <div className="site-app">
      <PrototypeBanner />
      <HomeHeader view={homeView} setView={setHomeView} />
      {homeView === "blueprint" && <BlueprintHome openForm={openForm} />}
      {homeView === "sources" && <SourceAudit />}
      {homeView === "governance" && <GovernanceView />}
      <footer className="site-footer">
        <div className="shell footer-inner">
          <LogoMark />
          <p>Planning prototype for Lewis Legal Group · No client data · No legal advice · No live integrations</p>
          <span>Prepared July 2026</span>
        </div>
      </footer>
    </div>
  );
}
