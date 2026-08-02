"use client";

import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Clock3,
  Database,
  Download,
  FileScan,
  FileText,
  Info,
  ListChecks,
  LockKeyhole,
  Plus,
  Scale,
  ShieldCheck,
  Upload,
  UserCheck,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  intakeForms,
  legacySourceMap,
} from "@/data/forms";
import {
  ClientPortalDemo,
  PortalOverview,
  SecurityArchitecture,
  StaffWorkspace,
  type PortalView,
} from "@/components/PortalExperience";
import type {
  FieldValue,
  IntakeField,
  IntakeFormDefinition,
  IntakeValues,
} from "@/types/intake";

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

const getFieldHelp = (field: IntakeField) => {
  if (field.help) return field.help;

  const plainLabel = field.label.replace(/[?.:]$/, "");
  const normalizedId = field.id.toLowerCase();
  const normalizedLabel = plainLabel.toLowerCase();
  let guidance: string;

  if (normalizedId.endsWith("legal_name")) {
    guidance = "Enter the full legal name as it appears on current identity or court records, including the middle name if known.";
  } else if (normalizedId.includes("case_number") && field.type === "text") {
    guidance = "Copy the case number from a court notice, filed paper, or online docket if available. Keep all letters, spaces, and dashes.";
  } else if (["text", "textarea"].includes(field.type) && (normalizedLabel.includes("court") || normalizedLabel.includes("county") || normalizedLabel.includes("department"))) {
    guidance = "Copy the court, county, branch, department, or hearing information from the most recent court paper if available. Staff will verify it before use.";
  } else if (["text", "textarea"].includes(field.type) && normalizedLabel.includes("address")) {
    guidance = "Enter the complete address you currently know, including city, state, and ZIP code. Do not investigate another person's address or guess.";
  } else if (["text", "textarea"].includes(field.type) && (normalizedLabel.includes("attorney") || normalizedLabel.includes("law firm"))) {
    guidance = "Enter the attorney's or law firm's name exactly as shown on a letter, email, or filed paper, if known.";
  } else {
    switch (field.type) {
      case "date":
        guidance = `Enter the exact date for “${plainLabel}” if known. If it is only approximate, leave the date blank and explain the estimate in a related notes field.`;
        break;
      case "currency":
        guidance = `Enter the best current dollar amount for “${plainLabel}.” Use a monthly amount unless the field or column says otherwise; an estimate is acceptable at intake.`;
        break;
      case "number":
        guidance = `Enter the best current number for “${plainLabel}.” Use an estimate only when an exact figure is not reasonably available.`;
        break;
      case "email":
        guidance = normalizedLabel.includes("safe") || normalizedLabel.includes("primary")
          ? "Enter an email address that staff may safely use. Communication restrictions can be added or changed in the privacy-preferences form."
          : `Enter the email address for “${plainLabel}” only if you already know it; do not investigate or guess.`;
        break;
      case "tel":
        guidance = normalizedLabel.includes("safe") || normalizedLabel.includes("primary")
          ? "Enter a phone number that staff may safely use, including the area code. Communication restrictions can be added or changed later."
          : `Enter the phone number for “${plainLabel}” only if you already know it; do not investigate or guess.`;
        break;
      case "select":
        guidance = `Choose the option that most closely matches “${plainLabel}.” Use “Unsure” or “Other” when offered instead of guessing.`;
        break;
      case "yesno":
        guidance = `Choose Yes or No for “${plainLabel}” based on what you currently know. Staff can clarify the answer later.`;
        break;
      case "checkboxes":
        guidance = `Select every option that currently applies to “${plainLabel}.” Leave an option unselected rather than guessing.`;
        break;
      case "textarea":
        guidance = `Give a short, factual answer for “${plainLabel}.” Include names and approximate dates when helpful, but do not guess or offer legal conclusions.`;
        break;
      case "table":
        guidance = `Add one row for each applicable item under “${plainLabel}.” Follow the column headings, use estimates when necessary, and leave unknown cells blank.`;
        break;
      case "matrix":
        guidance = `Use the rows and columns to organize the best current information available for “${plainLabel}.” Estimates are acceptable and staff will verify important figures.`;
        break;
      case "upload":
        guidance = `Choose only records relevant to “${plainLabel}.” In this prototype, filenames remain in browser memory and file contents are not uploaded or transmitted.`;
        break;
      case "acknowledgment":
        guidance = "Read the full statement and check the box only if it accurately reflects your understanding or instruction.";
        break;
      case "notice":
        guidance = "Read this information before continuing to the remaining fields in this section.";
        break;
      default:
        guidance = `Enter the information requested for “${plainLabel}” using the best facts you currently know.`;
    }
  }

  const qualifiers: string[] = [];
  if (field.required) qualifiers.push("This item is required to continue.");
  if (field.sensitive) qualifiers.push("Treat this as sensitive information and use synthetic data in this public prototype.");
  if (field.deferred) qualifiers.push("Collection is intentionally deferred until staff provides an authenticated, protected method.");

  return [guidance, ...qualifiers].join(" ");
};

function LogoMark() {
  return (
    <div className="brand source-brand" aria-label="Lewis Legal Group APC">
      <span className="source-brand-logo" aria-hidden="true" />
    </div>
  );
}

function PrototypeBanner() {
  return (
    <div className="prototype-banner" role="status">
      <div className="shell prototype-inner">
        <span className="prototype-pill">Interactive prototype</span>
        <span>Use synthetic information only. Verification, autosave, notifications, and MyCase access are simulated.</span>
      </div>
    </div>
  );
}

function HomeHeader({ view, setView }: { view: PortalView; setView: (view: PortalView) => void }) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <button className="header-brand-button" onClick={() => setView("overview")} aria-label="Open portal plan overview">
          <LogoMark />
        </button>
        <nav className="header-nav" aria-label="Prototype sections">
          <button className={view === "overview" ? "nav-active" : ""} onClick={() => setView("overview")}>
            Plan
          </button>
          <button className={view === "staff" ? "nav-active" : ""} onClick={() => setView("staff")}>
            Staff
          </button>
          <button className={view === "client" ? "nav-active" : ""} onClick={() => setView("client")}>
            Client
          </button>
          <button className={view === "security" ? "nav-active" : ""} onClick={() => setView("security")}>
            Security
          </button>
          <button className={view === "forms" || view === "sources" ? "nav-active" : ""} onClick={() => setView("forms")}>
            Forms
          </button>
        </nav>
        <button className="header-cta" onClick={() => setView("client")}>
          Portal demo <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </header>
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

function FormLibraryPage({ openForm, setView }: { openForm: (formId: string) => void; setView: (view: PortalView) => void }) {
  return (
    <main className="shell form-library-page">
      <div className="portal-page-intro library-page-intro">
        <div className="section-kicker"><Braces size={17} /> Existing form engine</div>
        <h1>The form library remains reusable inside the secure portal</h1>
        <p>These working mockups are the content layer. Assignment, identity, autosave, review status, and the MyCase handoff sit around them as separate services.</p>
        <button className="button-secondary" onClick={() => setView("sources")}>
          Review the legacy PDF source audit <ChevronRight size={16} />
        </button>
      </div>
      <FormLibrary openForm={openForm} />
    </main>
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

function FieldHelp({ field, helpId }: { field: IntakeField; helpId: string }) {
  const helpText = getFieldHelp(field);

  return (
    <>
      <span className="sr-only" id={helpId}>{helpText}</span>
      <details
        className="field-help-disclosure"
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary")?.focus();
        }}
      >
        <summary
          aria-label={`Helpful information for ${field.label}`}
          aria-describedby={helpId}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            const disclosure = event.currentTarget.parentElement as HTMLDetailsElement;
            disclosure.open = !disclosure.open;
          }}
        >
          <CircleHelp size={17} aria-hidden="true" />
        </summary>
        <span className="field-help-popover" aria-hidden="true">{helpText}</span>
      </details>
    </>
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
  const describedBy = `${id}-help`;

  if (field.type === "notice") {
    return (
      <div className="field-full notice-card">
        <Info size={20} aria-hidden="true" />
        <div><strong>{field.label}</strong><p>{getFieldHelp(field)}</p></div>
      </div>
    );
  }

  const wrapperClass = `form-field ${field.fullWidth || ["table", "matrix", "upload", "checkboxes", "textarea", "acknowledgment"].includes(field.type) ? "field-full" : ""} ${invalid ? "field-invalid" : ""} ${field.deferred ? "field-deferred" : ""}`;
  const usesGroupLabel = ["yesno", "table", "matrix"].includes(field.type);

  const label = (
    <div className="field-label-row">
      {usesGroupLabel ? <span className="field-legend">{field.label}</span> : <label htmlFor={id}>{field.label}</label>}
      <div className="field-meta-actions">
        <FieldBadges field={field} />
        <FieldHelp field={field} helpId={describedBy} />
      </div>
    </div>
  );

  const mapping = mappingMode && field.mycaseTarget && (
    <div className="mapping-inline"><Database size={13} /> {field.mycaseTarget}</div>
  );

  if (field.type === "yesno") {
    return (
      <div className={wrapperClass}>
        {label}
        <div className="segmented-control" id={id} role="group" aria-label={field.label} aria-describedby={describedBy}>
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
      <fieldset className={wrapperClass} aria-describedby={describedBy}>
        <legend className="sr-only">{field.label}</legend>
        <div className="field-label-row">
          <span className="field-legend">{field.label}</span>
          <div className="field-meta-actions"><FieldBadges field={field} /><FieldHelp field={field} helpId={describedBy} /></div>
        </div>
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
        <div className="acknowledgment-layout">
          <label className={`acknowledgment-card ${checked ? "acknowledged" : ""}`} htmlFor={id}>
            <input id={id} type="checkbox" checked={checked} onChange={(event) => setValue(field.id, event.target.checked)} aria-describedby={describedBy} />
            <span className="checkbox-visual">{checked && <Check size={14} />}</span>
            <span>{field.label}<FieldBadges field={field} /></span>
          </label>
          <FieldHelp field={field} helpId={describedBy} />
        </div>
        {mapping}
      </div>
    );
  }

  if (field.type === "table") {
    const rowCount = tableRows[field.id] ?? field.initialRows ?? 2;
    return (
      <div className={wrapperClass}>
        {label}
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
                          aria-describedby={describedBy}
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
        {label}
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
                        <input id={inputId(cellId)} value={(values[cellId] as string) ?? ""} onChange={(event) => setValue(cellId, event.target.value)} aria-describedby={describedBy} />
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
        {label}
        <label className="upload-zone" htmlFor={id}>
          <input
            id={id}
            type="file"
            multiple
            onChange={(event) => setValue(field.id, Array.from(event.target.files ?? []).map((file) => file.name))}
            aria-describedby={describedBy}
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
        {label}
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
        {label}
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
      {label}
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
      schemaVersion: "lewis-legal-intake-prototype-v0.2",
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
              <div className="field-help-guide" role="note">
                <CircleHelp size={19} aria-hidden="true" />
                <div>
                  <strong>Short explanations are available without crowding the form.</strong>
                  <p>
                    <span className="help-guide-desktop">Hover over or keyboard-focus the question-mark button beside any field.</span>
                    <span className="help-guide-touch">Tap the question-mark button beside any field.</span>
                    {" "}It explains what normally belongs there and when an estimate or “Unsure” is appropriate.
                  </p>
                </div>
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
  const [homeView, setHomeView] = useState<PortalView>("overview");
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const activeForm = intakeForms.find((form) => form.id === activeFormId);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedForm = params.get("form");
    const requestedView = params.get("view");
    const validViews: PortalView[] = ["overview", "staff", "client", "security", "forms", "sources"];
    const timer = window.setTimeout(() => {
      if (requestedForm && intakeForms.some((form) => form.id === requestedForm)) {
        setActiveFormId(requestedForm);
      } else if (requestedView && validViews.includes(requestedView as PortalView)) {
        setHomeView(requestedView as PortalView);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const changeView = (view: PortalView) => {
    setHomeView(view);
    const nextUrl = view === "overview" ? window.location.pathname : `${window.location.pathname}?view=${encodeURIComponent(view)}`;
    window.history.replaceState(null, "", nextUrl);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const openForm = (formId: string) => {
    setActiveFormId(formId);
    window.history.replaceState(null, "", `${window.location.pathname}?form=${encodeURIComponent(formId)}`);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const closeForm = () => {
    setActiveFormId(null);
    const nextUrl = homeView === "overview" ? window.location.pathname : `${window.location.pathname}?view=${encodeURIComponent(homeView)}`;
    window.history.replaceState(null, "", nextUrl);
  };

  if (activeForm) return <><PrototypeBanner /><FormWizard form={activeForm} closeForm={closeForm} /></>;

  return (
    <div className="site-app">
      <PrototypeBanner />
      <HomeHeader view={homeView} setView={changeView} />
      {homeView === "overview" && <PortalOverview setView={changeView} />}
      {homeView === "staff" && <StaffWorkspace />}
      {homeView === "client" && <ClientPortalDemo openForm={openForm} />}
      {homeView === "security" && <SecurityArchitecture />}
      {homeView === "forms" && <FormLibraryPage openForm={openForm} setView={changeView} />}
      {homeView === "sources" && <SourceAudit />}
      <footer className="site-footer">
        <div className="shell footer-inner">
          <LogoMark />
          <p>Planning prototype for Lewis Legal Group · No client data · No legal advice · No live integrations</p>
          <span>Updated August 2026</span>
        </div>
      </footer>
    </div>
  );
}
