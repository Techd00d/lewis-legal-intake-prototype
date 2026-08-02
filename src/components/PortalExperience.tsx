"use client";

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BellRing,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Cloud,
  Database,
  FileCheck2,
  FileText,
  Filter,
  FolderLock,
  KeyRound,
  Link2,
  ListChecks,
  LockKeyhole,
  Mail,
  MessageSquareText,
  MonitorSmartphone,
  Phone,
  RefreshCw,
  Search,
  Send,
  Server,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Users,
  WifiOff,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  clientPortalMatters,
  designQuestions,
  portalDemoClients,
  portalJourney,
  type DemoAssignmentStatus,
  type DemoMatter,
} from "@/data/portalDemo";
import { intakeForms } from "@/data/forms";

export type PortalView =
  | "overview"
  | "staff"
  | "client"
  | "security"
  | "forms"
  | "sources";

interface ViewNavigationProps {
  setView: (view: PortalView) => void;
}

interface ClientPortalProps {
  openForm: (formId: string) => void;
}

const assignableFormIds = [
  "general-intake",
  "custody-support",
  "dissolution",
  "spousal-support-modification",
  "privacy-communications",
  "document-collection",
];

const assignableForms = assignableFormIds
  .map((id) => intakeForms.find((form) => form.id === id))
  .filter((form): form is NonNullable<typeof form> => Boolean(form));

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(/^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? `${isoDate}T12:00:00` : isoDate));

const statusCopy: Record<
  DemoAssignmentStatus,
  { label: string; action: string }
> = {
  "not-started": { label: "Not started", action: "Start form" },
  "in-progress": { label: "In progress", action: "Resume form" },
  submitted: { label: "Submitted", action: "View form" },
  "needs-attention": { label: "Needs attention", action: "Review request" },
};

function PortalDashboardPreview() {
  return (
    <div className="portal-preview" aria-label="Illustration of the proposed client forms dashboard">
      <div className="portal-preview-bar">
        <span className="portal-preview-brand">Lewis Legal forms</span>
        <span className="portal-preview-secure"><LockKeyhole size={13} /> Verified session</span>
      </div>
      <div className="portal-preview-body">
        <div className="portal-preview-heading">
          <div>
            <span className="overline">Matter 24-1042</span>
            <strong>Your requested forms</strong>
          </div>
          <span className="portal-preview-count">3 of 4 active</span>
        </div>
        <div className="portal-preview-item">
          <span className="preview-status preview-progress"><RefreshCw size={15} /></span>
          <div><strong>General intake</strong><small>64% complete · saved 2 min ago</small></div>
          <span>Resume</span>
        </div>
        <div className="portal-preview-item">
          <span className="preview-status preview-progress"><RefreshCw size={15} /></span>
          <div><strong>Dissolution details</strong><small>28% complete · due Aug 12</small></div>
          <span>Resume</span>
        </div>
        <div className="portal-preview-item">
          <span className="preview-status preview-complete"><Check size={15} /></span>
          <div><strong>Communication preferences</strong><small>Submitted Aug 1</small></div>
          <span>View</span>
        </div>
        <div className="portal-preview-save">
          <Cloud size={15} /> Encrypted server draft · ready on another device
        </div>
      </div>
    </div>
  );
}

export function PortalOverview({ setView }: ViewNavigationProps) {
  return (
    <main>
      <section className="portal-hero">
        <div className="shell portal-hero-grid">
          <div className="portal-hero-copy">
            <div className="eyebrow"><ShieldCheck size={17} /> Client forms portal concept · v0.3</div>
            <h1>A secure front door for every requested form.</h1>
            <p className="portal-hero-lede">
              Staff selects the correct MyCase client and matter, assigns the right forms, and sends a protected access notice. Clients verify a new session, save continuously, and return from any device.
            </p>
            <div className="hero-actions">
              <button className="button-primary" onClick={() => setView("staff")}>
                Walk through the staff side <ArrowRight size={18} />
              </button>
              <button className="button-secondary" onClick={() => setView("client")}>
                Preview the client portal
              </button>
            </div>
            <div className="trust-row portal-trust-row">
              <span><KeyRound size={16} /> Link is not a credential</span>
              <span><Cloud size={16} /> Server-side autosave</span>
              <span><UserCheck size={16} /> Human-reviewed MyCase handoff</span>
            </div>
          </div>
          <PortalDashboardPreview />
        </div>
      </section>

      <div className="shell portal-plan-shell">
        <section className="portal-workflow-section" aria-labelledby="portal-workflow-title">
          <div className="section-kicker"><Workflow size={17} /> Start-to-finish experience</div>
          <div className="section-heading-row">
            <div>
              <h2 id="portal-workflow-title">One controlled path, with a clear owner at every step</h2>
              <p>The custom portal owns assignments and drafts. MyCase remains the authoritative client and matter directory.</p>
            </div>
          </div>
          <ol className="portal-journey-grid">
            {portalJourney.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="perspective-section" aria-labelledby="perspective-title">
          <div className="section-kicker"><Users size={17} /> Three perspectives</div>
          <div className="section-heading-row">
            <div>
              <h2 id="perspective-title">Simple for the client, controlled for staff, defensible for the firm</h2>
            </div>
          </div>
          <div className="perspective-grid">
            <article>
              <span className="perspective-icon"><Smartphone size={22} /></span>
              <h3>Client</h3>
              <p>One familiar entry page, assigned forms only, visible progress, plain-language help, continuous save, and easy cross-device return.</p>
              <button onClick={() => setView("client")}>See the client experience <ChevronRight size={16} /></button>
            </article>
            <article>
              <span className="perspective-icon"><ListChecks size={22} /></span>
              <h3>Staff</h3>
              <p>Fast client and matter lookup, approved form bundles, safe-channel confirmation, due dates, resend/revoke controls, and a review queue.</p>
              <button onClick={() => setView("staff")}>See the staff workspace <ChevronRight size={16} /></button>
            </article>
            <article>
              <span className="perspective-icon"><ShieldCheck size={22} /></span>
              <h3>Security</h3>
              <p>Separate identities per person, matter-scoped authorization, short-lived verification, encrypted drafts, redacted logs, retention rules, and audit history.</p>
              <button onClick={() => setView("security")}>Review the safeguards <ChevronRight size={16} /></button>
            </article>
          </div>
        </section>

        <section className="portal-boundary-section" aria-labelledby="portal-boundary-title">
          <div className="portal-boundary-copy">
            <span className="section-kicker"><Link2 size={17} /> One website entry point</span>
            <h2 id="portal-boundary-title">Avoid rebuilding the parts MyCase already handles well</h2>
            <p>A Lewis Legal “Client Portal” link can present two clearly labeled destinations after the firm confirms the final operating model.</p>
          </div>
          <div className="portal-boundary-options">
            <article>
              <span className="boundary-number">01</span>
              <div>
                <h3>Requested forms</h3>
                <p>This custom forms center: assignments, autosave, conditional questions, completion status, and staff review.</p>
              </div>
            </article>
            <article>
              <span className="boundary-number">02</span>
              <div>
                <h3>Case communications</h3>
                <p>The native MyCase portal: secure messages, shared documents, events, billing, and payments after engagement.</p>
              </div>
            </article>
          </div>
          <div className="portal-boundary-note">
            <CircleAlert size={19} />
            <p><strong>Decision for Heather:</strong> clients should not discover two overlapping portals by accident. The final website language, invitation sequence, and support script must make the division obvious.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function newestMatter(matters: DemoMatter[]) {
  return [...matters].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
}

export function StaffWorkspace() {
  const [query, setQuery] = useState("");
  const [matterStatus, setMatterStatus] = useState<"open" | "closed" | "all">("open");
  const [sortOrder, setSortOrder] = useState<"recent" | "name">("recent");
  const [selectedClientId, setSelectedClientId] = useState(portalDemoClients[0].id);
  const [selectedMatterId, setSelectedMatterId] = useState(portalDemoClients[0].matters[0].id);
  const [selectedForms, setSelectedForms] = useState<string[]>([
    "general-intake",
    "dissolution",
    "privacy-communications",
  ]);
  const [dueDate, setDueDate] = useState("2026-08-12");
  const [deliveryChannel, setDeliveryChannel] = useState<"email" | "sms">("email");
  const [confirmed, setConfirmed] = useState(false);
  const [inviteCreated, setInviteCreated] = useState(false);

  const filteredClients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = portalDemoClients.filter((client) => {
      const eligibleMatters = client.matters.filter((matter) =>
        matterStatus === "all" ? true : matter.status === matterStatus,
      );
      if (eligibleMatters.length === 0) return false;
      if (!normalized) return true;
      const searchText = [
        client.name,
        client.id,
        client.maskedEmail,
        client.maskedPhone,
        ...client.matters.flatMap((matter) => [
          matter.name,
          matter.caseNumber,
          matter.practiceArea,
          matter.stage,
        ]),
      ].join(" ").toLowerCase();
      return searchText.includes(normalized);
    });

    return matches.sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [matterStatus, query, sortOrder]);

  const selectedClient = filteredClients.find((client) => client.id === selectedClientId)
    ?? filteredClients[0]
    ?? portalDemoClients.find((client) => client.id === selectedClientId)
    ?? portalDemoClients[0];
  const eligibleSelectedMatters = selectedClient.matters.filter((matter) =>
    matterStatus === "all" ? true : matter.status === matterStatus,
  );
  const selectedMatter = eligibleSelectedMatters.find((matter) => matter.id === selectedMatterId)
    ?? newestMatter(eligibleSelectedMatters.length > 0 ? eligibleSelectedMatters : selectedClient.matters);

  const chooseClient = (clientId: string) => {
    const client = portalDemoClients.find((item) => item.id === clientId);
    if (!client) return;
    const eligible = client.matters
      .filter((matter) => matterStatus === "all" || matter.status === matterStatus)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    setSelectedClientId(clientId);
    setSelectedMatterId((eligible[0] ?? newestMatter(client.matters)).id);
    setConfirmed(false);
    setInviteCreated(false);
  };

  const chooseMatter = (matterId: string) => {
    setSelectedMatterId(matterId);
    setConfirmed(false);
    setInviteCreated(false);
  };

  const toggleForm = (formId: string) => {
    setSelectedForms((current) =>
      current.includes(formId)
        ? current.filter((id) => id !== formId)
        : [...current, formId],
    );
    setConfirmed(false);
    setInviteCreated(false);
  };

  return (
    <main className="shell portal-page">
      <div className="portal-page-intro">
        <div className="section-kicker"><MonitorSmartphone size={17} /> Staff workspace · interactive mock</div>
        <h1>Assign the right forms to the right person and matter</h1>
        <p>The production workspace would require Lewis Legal Microsoft sign-in, MFA, and role-based permissions. Every record shown here is synthetic.</p>
      </div>

      <div className="workspace-status" role="status">
        <span><Database size={16} /> MyCase directory cache</span>
        <span><i /> Demo sync completed 2 minutes ago</span>
        <span><RefreshCw size={14} /> Webhooks + scheduled reconciliation</span>
      </div>

      <div className="staff-workspace-grid">
        <section className="client-picker-panel" aria-labelledby="client-picker-title">
          <div className="workspace-panel-head">
            <div>
              <span className="step-chip">Step 1</span>
              <h2 id="client-picker-title">Find a MyCase client</h2>
            </div>
            <span className="result-count">{filteredClients.length} matches</span>
          </div>

          <div className="directory-controls">
            <label className="search-control" htmlFor="client-search">
              <span>Search client or matter</span>
              <div><Search size={18} /><input id="client-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, email, phone, or matter number" /></div>
            </label>
            <div className="directory-filter-row">
              <label htmlFor="matter-status-filter">
                <Filter size={15} /> Matter status
                <select id="matter-status-filter" value={matterStatus} onChange={(event) => {
                  setMatterStatus(event.target.value as "open" | "closed" | "all");
                  setInviteCreated(false);
                }}>
                  <option value="open">Open matters</option>
                  <option value="closed">Closed matters</option>
                  <option value="all">All matters</option>
                </select>
              </label>
              <label htmlFor="client-sort">
                <Activity size={15} /> Sort
                <select id="client-sort" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as "recent" | "name")}>
                  <option value="recent">Recent activity</option>
                  <option value="name">Client name</option>
                </select>
              </label>
            </div>
          </div>

          <div className="client-result-list" aria-label="Synthetic client search results">
            {filteredClients.map((client) => {
              const recentMatter = newestMatter(client.matters);
              const isSelected = client.id === selectedClient.id;
              return (
                <button key={client.id} className={isSelected ? "client-result selected" : "client-result"} aria-pressed={isSelected} onClick={() => chooseClient(client.id)}>
                  <span className="client-avatar" aria-hidden="true">{client.name.split(" ").map((part) => part[0]).join("")}</span>
                  <span className="client-result-copy">
                    <strong>{client.name}</strong>
                    <small>{client.maskedEmail} · {client.matters.length} {client.matters.length === 1 ? "matter" : "matters"}</small>
                    <small>Last activity {formatDate(recentMatter.updatedAt)}</small>
                  </span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              );
            })}
            {filteredClients.length === 0 && (
              <div className="empty-result">
                <Search size={20} />
                <strong>No matching synthetic records</strong>
                <p>Try a client name, matter number, or a different status filter.</p>
              </div>
            )}
          </div>
          <p className="panel-footnote"><LockKeyhole size={14} /> Production results must be limited to records the signed-in staff member may access.</p>
        </section>

        <section className="assignment-panel" aria-labelledby="assignment-title">
          <div className="workspace-panel-head">
            <div>
              <span className="step-chip">Steps 2–4</span>
              <h2 id="assignment-title">Matter, forms, and delivery</h2>
            </div>
            <span className="synthetic-chip">Synthetic</span>
          </div>

          <div className="selected-client-summary">
            <span className="client-avatar large" aria-hidden="true">{selectedClient.name.split(" ").map((part) => part[0]).join("")}</span>
            <div>
              <span className="overline">Selected client</span>
              <strong>{selectedClient.name}</strong>
              <small>MyCase ID {selectedClient.id.replace("mc-client-", "")}</small>
            </div>
            <BadgeCheck size={21} aria-label="Selection confirmed" />
          </div>

          <fieldset className="matter-choice-group">
            <legend>Choose the matching matter</legend>
            <div className="matter-choice-list">
              {[...selectedClient.matters]
                .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                .map((matter) => {
                  const isSelected = matter.id === selectedMatter.id;
                  return (
                    <button type="button" key={matter.id} aria-pressed={isSelected} className={isSelected ? "matter-choice selected" : "matter-choice"} onClick={() => chooseMatter(matter.id)}>
                      <span className={`matter-status-dot ${matter.status}`} aria-hidden="true" />
                      <span>
                        <strong>{matter.name}</strong>
                        <small>{matter.caseNumber} · {matter.practiceArea} · {matter.stage}</small>
                        <small>Opened {formatDate(matter.openedDate)} · active {formatDate(matter.updatedAt)}</small>
                      </span>
                      <span className={`status-pill ${matter.status}`}>{matter.status}</span>
                    </button>
                  );
                })}
            </div>
          </fieldset>

          <fieldset className="form-assignment-group">
            <legend>Assign client-facing forms</legend>
            <p>Each assignment pins the approved template version so later edits cannot silently alter an active draft.</p>
            <div className="assignment-checklist">
              {assignableForms.map((form) => (
                <label key={form.id} className={selectedForms.includes(form.id) ? "assignment-check selected" : "assignment-check"}>
                  <input type="checkbox" checked={selectedForms.includes(form.id)} onChange={() => toggleForm(form.id)} />
                  <span className="assignment-check-icon"><FileText size={17} /></span>
                  <span>
                    <strong>{form.shortTitle}</strong>
                    <small>{form.estimatedMinutes} · {form.sections.length} sections</small>
                  </span>
                  <span className="template-version">v1.0</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="delivery-group">
            <legend>Choose a verified, safe delivery channel</legend>
            <div className="delivery-options">
              <label className={deliveryChannel === "email" ? "delivery-option selected" : "delivery-option"}>
                <input type="radio" name="delivery" value="email" checked={deliveryChannel === "email"} onChange={() => {
                  setDeliveryChannel("email");
                  setConfirmed(false);
                  setInviteCreated(false);
                }} />
                <Mail size={19} />
                <span><strong>Email</strong><small>{selectedClient.maskedEmail}</small></span>
              </label>
              <label className={deliveryChannel === "sms" ? "delivery-option selected" : "delivery-option"}>
                <input type="radio" name="delivery" value="sms" checked={deliveryChannel === "sms"} onChange={() => {
                  setDeliveryChannel("sms");
                  setConfirmed(false);
                  setInviteCreated(false);
                }} />
                <Phone size={19} />
                <span><strong>Text message</strong><small>{selectedClient.maskedPhone}</small></span>
              </label>
            </div>
            <div className="safe-channel-note"><BellRing size={16} /><span><strong>MyCase note:</strong> {selectedClient.safeChannelNote}</span></div>
            <label className="due-date-control" htmlFor="assignment-due-date">
              <span><CalendarDays size={16} /> Requested completion date</span>
              <input id="assignment-due-date" type="date" value={dueDate} onChange={(event) => {
                setDueDate(event.target.value);
                setConfirmed(false);
                setInviteCreated(false);
              }} />
            </label>
          </fieldset>

          <div className="invite-review-card">
            <div className="invite-review-heading">
              <span className="step-chip">Final check</span>
              <strong>Review before creating access</strong>
            </div>
            <dl>
              <div><dt>Recipient</dt><dd>{selectedClient.name}</dd></div>
              <div><dt>Matter</dt><dd>{selectedMatter.name} · {selectedMatter.caseNumber}</dd></div>
              <div><dt>Forms</dt><dd>{selectedForms.length} selected</dd></div>
              <div><dt>Requested by</dt><dd>{formatDate(dueDate)}</dd></div>
              <div><dt>Delivery</dt><dd>{deliveryChannel === "email" ? selectedClient.maskedEmail : selectedClient.maskedPhone}</dd></div>
              <div><dt>Access</dt><dd>Verify each new session</dd></div>
            </dl>
            <label className="confirmation-check">
              <input type="checkbox" checked={confirmed} onChange={(event) => {
                setConfirmed(event.target.checked);
                setInviteCreated(false);
              }} />
              <span>I confirmed the client, matter, recipient role, and safe contact channel.</span>
            </label>
            <button className="button-primary generate-button" disabled={!confirmed || selectedForms.length === 0} onClick={() => setInviteCreated(true)}>
              <Send size={17} /> Generate access preview
            </button>
          </div>

          {inviteCreated && (
            <div className="invite-result" role="status">
              <span className="invite-result-icon"><CheckCircle2 size={22} /></span>
              <div>
                <span className="overline">Preview created · nothing sent</span>
                <h3>Portal access is ready for staff delivery</h3>
                <p><strong>Entry page:</strong> portal.lewislegal.law</p>
                <p><strong>Invite reference:</strong> DEMO-74C2 · expires after first use or 24 hours</p>
                <small>The notification link is opaque, short-lived, revocable, and contains no client or matter name. It starts verification; it does not grant portal access by itself.</small>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export function ClientPortalDemo({ openForm }: ClientPortalProps) {
  const [stage, setStage] = useState<"login" | "verify" | "dashboard">("login");
  const [method, setMethod] = useState<"email" | "sms">("sms");
  const [code, setCode] = useState("");
  const [activeMatterId, setActiveMatterId] = useState(clientPortalMatters[0].id);
  const activeMatter = clientPortalMatters.find((matter) => matter.id === activeMatterId)
    ?? clientPortalMatters[0];

  const resetDemo = () => {
    setStage("login");
    setCode("");
  };

  if (stage !== "dashboard") {
    return (
      <main className="client-access-page">
        <div className="client-access-shell">
          <div className="client-access-context">
            <span className="section-kicker"><LockKeyhole size={17} /> Proposed secure access</span>
            <h1>Continue to your Lewis Legal forms</h1>
            <p>Use the same portal address whenever you need to return. Your identity is checked before any client name, matter, or form status appears.</p>
            <ul>
              <li><Check size={16} /> Works on a phone, tablet, or computer</li>
              <li><Check size={16} /> Saves each completed field to an encrypted server draft</li>
              <li><Check size={16} /> Shows only forms assigned to your verified identity and matter</li>
            </ul>
            <div className="client-access-warning">
              <CircleAlert size={18} />
              <p>This portal is not monitored for emergencies and does not provide legal advice. Contact the office for help with access.</p>
            </div>
          </div>

          <section className="verification-card" aria-labelledby="verification-title">
            <div className="verification-card-head">
              <span className="verification-lock"><ShieldCheck size={22} /></span>
              <div>
                <span className="overline">Interactive prototype</span>
                <h2 id="verification-title">{stage === "login" ? "Verify a new session" : "Enter the one-time code"}</h2>
              </div>
            </div>

            {stage === "login" ? (
              <>
                <p>Choose a contact method already verified with Lewis Legal. The production page would return the same neutral message whether or not an account exists.</p>
                <fieldset className="verification-methods">
                  <legend>Where should the one-time code be sent?</legend>
                  <label className={method === "sms" ? "verification-method selected" : "verification-method"}>
                    <input type="radio" name="verification-method" checked={method === "sms"} onChange={() => setMethod("sms")} />
                    <Phone size={20} />
                    <span><strong>Text message</strong><small>Mobile ending in 0148</small></span>
                  </label>
                  <label className={method === "email" ? "verification-method selected" : "verification-method"}>
                    <input type="radio" name="verification-method" checked={method === "email"} onChange={() => setMethod("email")} />
                    <Mail size={20} />
                    <span><strong>Email</strong><small>j•••••@example.com</small></span>
                  </label>
                </fieldset>
                <button className="button-primary verification-action" onClick={() => setStage("verify")}>
                  Send a demo code <ArrowRight size={17} />
                </button>
                <small className="neutral-response">No message is sent in this prototype. Production wording will not reveal whether an account exists.</small>
              </>
            ) : (
              <>
                <p>A six-digit code would be sent to the {method === "sms" ? "mobile number ending in 0148" : "verified email address"}. It expires quickly and works once.</p>
                <label className="otp-control" htmlFor="demo-code">
                  <span>One-time code</span>
                  <input id="demo-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" />
                </label>
                <div className="demo-code-hint">
                  <span>Prototype code: <strong>482731</strong></span>
                  <button onClick={() => setCode("482731")}>Fill demo code</button>
                </div>
                <button className="button-primary verification-action" disabled={code.length !== 6} onClick={() => setStage("dashboard")}>
                  Verify and continue <ArrowRight size={17} />
                </button>
                <button className="text-button" onClick={() => {
                  setCode("");
                  setStage("login");
                }}>Choose another method</button>
              </>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="shell portal-page client-dashboard-page">
      <div className="client-session-bar">
        <span><ShieldCheck size={16} /> Verified demo session</span>
        <span>Session locks after inactivity</span>
        <button onClick={resetDemo}>Sign out</button>
      </div>

      <div className="client-dashboard-heading">
        <div>
          <span className="section-kicker"><FileCheck2 size={17} /> Assigned forms</span>
          <h1>Welcome back, Jordan</h1>
          <p>Your answers save as you go. You can close the page and continue later from another device.</p>
        </div>
        <div className="saved-state-card" role="status">
          <CheckCircle2 size={21} />
          <div><strong>All recent changes saved</strong><small>Encrypted server draft · 2 minutes ago</small></div>
        </div>
      </div>

      <section className="matter-switcher" aria-labelledby="matter-switcher-title">
        <div>
          <span className="overline">Your matters</span>
          <h2 id="matter-switcher-title">Choose a matter</h2>
        </div>
        <div className="matter-switcher-list">
          {clientPortalMatters.map((matter) => (
            <button key={matter.id} className={matter.id === activeMatter.id ? "selected" : ""} aria-pressed={matter.id === activeMatter.id} onClick={() => setActiveMatterId(matter.id)}>
              <span><strong>{matter.label}</strong><small>Matter {matter.caseNumber}</small></span>
              <span className={`status-pill ${matter.status}`}>{matter.status}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="assigned-forms-section" aria-labelledby="assigned-forms-title">
        <div className="assigned-section-head">
          <div>
            <span className="overline">Matter {activeMatter.caseNumber}</span>
            <h2 id="assigned-forms-title">Requested forms</h2>
          </div>
          <span>{activeMatter.assignments.length} assigned</span>
        </div>
        <div className="assigned-form-list">
          {activeMatter.assignments.map((assignment) => {
            const form = intakeForms.find((item) => item.id === assignment.formId);
            if (!form) return null;
            const copy = statusCopy[assignment.status];
            return (
              <article key={assignment.formId} className="assigned-form-card">
                <span className={`assigned-status-icon status-${assignment.status}`}>
                  {assignment.status === "submitted" ? <Check size={19} /> : assignment.status === "not-started" ? <FileText size={19} /> : <RefreshCw size={19} />}
                </span>
                <div className="assigned-form-main">
                  <div className="assigned-form-title-row">
                    <div>
                      <span className={`assignment-status-label status-${assignment.status}`}>{copy.label}</span>
                      <h3>{form.shortTitle}</h3>
                    </div>
                    <span className="assignment-due"><CalendarDays size={14} /> {assignment.due}</span>
                  </div>
                  <p>{form.description}</p>
                  <div className="assignment-progress-row">
                    <div className="assignment-progress" role="progressbar" aria-label={`${form.shortTitle} completion`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={assignment.progress}>
                      <span style={{ width: `${assignment.progress}%` }} />
                    </div>
                    <strong>{assignment.progress}%</strong>
                  </div>
                  <div className="assignment-meta-row">
                    <span><Cloud size={14} /> {assignment.lastSaved}</span>
                    {assignment.revision && <span>Draft revision {assignment.revision}</span>}
                  </div>
                </div>
                <button className="button-secondary assigned-form-action" onClick={() => openForm(form.id)}>{copy.action} <ChevronRight size={16} /></button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="autosave-explainer" aria-labelledby="autosave-title">
        <div className="autosave-heading">
          <span className="autosave-icon"><Cloud size={24} /></span>
          <div><span className="overline">Designed for interruption</span><h2 id="autosave-title">What “saved” will mean in production</h2></div>
        </div>
        <div className="autosave-grid">
          <div><Clock3 size={18} /><strong>Frequent server saves</strong><p>Changed fields save after a short pause and again when the client leaves a field.</p></div>
          <div><RefreshCw size={18} /><strong>Revision-safe updates</strong><p>A version number prevents one device from silently overwriting newer work from another.</p></div>
          <div><WifiOff size={18} /><strong>Honest offline state</strong><p>The portal shows when the connection is lost and never claims unsent changes are saved.</p></div>
          <div><CheckCircle2 size={18} /><strong>Submission is separate</strong><p>Autosave preserves a draft; Submit creates a dated, immutable snapshot for staff review.</p></div>
        </div>
      </section>
    </main>
  );
}

const roleRows = [
  ["Front office", "Search permitted records; select client/matter; assign approved bundles; create, resend, or revoke access."],
  ["Legal assistant", "All front-office actions plus review submissions, request corrections, reopen drafts, and prepare MyCase handoff."],
  ["Heather / administrator", "Approve templates, permissions, retention, exceptions, and any legal or conflict-related decision."],
  ["Client / authorized person", "Access only specifically assigned forms for specifically authorized matters; never share an account."],
];

const threatRows = [
  ["Forwarded or old invite", "Invite is short-lived, one-use, revocable, and starts verification; it is never a bearer login."],
  ["Wrong household member", "Separate identity and matter membership per person; no shared family credentials or inferred access."],
  ["Stolen email or phone", "New-session verification, passkey enrollment option, device/session revocation, step-up for sensitive actions."],
  ["Account discovery", "Neutral sign-in responses, masked channels only after a safe step, throttling, bot controls, and alerting."],
  ["Wrong MyCase matter", "Staff confirmation screen, stable MyCase IDs, role validation, and an auditable human review before assignment."],
  ["Concurrent device edits", "Server revisions, conditional updates, conflict prompts, and an immutable submitted snapshot."],
  ["Sensitive data in logs", "Field-value redaction, secrets excluded by design, restricted audit access, and tested retention."],
  ["Unsafe automation", "Authentication, authorization, notifications, and writes are deterministic services; AI cannot grant access or send."],
];

export function SecurityArchitecture() {
  return (
    <main className="shell portal-page security-page">
      <div className="portal-page-intro">
        <div className="section-kicker"><ShieldCheck size={17} /> Security and privacy blueprint</div>
        <h1>The portal link opens the door; it never unlocks it</h1>
        <p>Security is built around a verified person, an authorized matter relationship, and a short-lived server session—not possession of an email link.</p>
      </div>

      <div className="security-recommendation">
        <KeyRound size={25} />
        <div>
          <span className="overline">Recommended identity pattern</span>
          <h2>Bootstrap with a known channel, then offer a passkey for repeat access</h2>
          <p>Email can notify a client and validate control of an address, but it is a weaker sole authenticator. For sensitive repeat access, use a passkey when practical, with a verified mobile code and staff-assisted recovery as controlled alternatives.</p>
        </div>
      </div>

      <section className="architecture-section" aria-labelledby="architecture-title">
        <div className="section-heading-row">
          <div><span className="section-kicker"><Server size={17} /> Proposed trust boundaries</span><h2 id="architecture-title">Every layer has one job</h2></div>
        </div>
        <div className="architecture-flow" aria-label="Proposed portal trust flow">
          <div><span><Link2 size={20} /></span><strong>LewisLegal.law</strong><small>Public entry page · no case data</small></div>
          <i><ArrowRight size={17} /></i>
          <div><span><KeyRound size={20} /></span><strong>Identity service</strong><small>Verification, recovery, session issuance</small></div>
          <i><ArrowRight size={17} /></i>
          <div><span><ShieldCheck size={20} /></span><strong>Policy gateway</strong><small>Person + matter + assignment checks</small></div>
          <i><ArrowRight size={17} /></i>
          <div><span><Cloud size={20} /></span><strong>Forms service</strong><small>Versioned forms, encrypted drafts, audit</small></div>
          <i><ArrowRight size={17} /></i>
          <div><span><Database size={20} /></span><strong>MyCase broker</strong><small>Allowlisted reads and reviewed writes</small></div>
        </div>
        <div className="architecture-note"><LockKeyhole size={17} /><span>MyCase credentials, verification-provider secrets, and encryption keys stay in dedicated server services. They are never exposed to the browser or language model.</span></div>
      </section>

      <section className="security-controls-section" aria-labelledby="controls-title">
        <div className="section-heading-row">
          <div><span className="section-kicker"><FolderLock size={17} /> Defense in depth</span><h2 id="controls-title">Controls mapped to realistic failure modes</h2></div>
        </div>
        <div className="threat-control-grid">
          {threatRows.map(([threat, control]) => (
            <article key={threat}>
              <span>Risk</span>
              <h3>{threat}</h3>
              <p>{control}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="role-section" aria-labelledby="role-title">
        <div className="section-heading-row">
          <div><span className="section-kicker"><UserCheck size={17} /> Least privilege</span><h2 id="role-title">Proposed role boundaries</h2></div>
        </div>
        <div className="role-table-wrap">
          <table className="role-table">
            <thead><tr><th>Identity</th><th>Allowed portal actions</th></tr></thead>
            <tbody>{roleRows.map(([role, actions]) => <tr key={role}><th>{role}</th><td>{actions}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="staff-auth-note">
          <BadgeCheck size={20} />
          <p><strong>Staff authentication:</strong> use Lewis Legal Microsoft Entra accounts, MFA, Conditional Access, and separate named users. Do not create a shared “staff” portal login.</p>
        </div>
      </section>

      <section className="api-reality-section" aria-labelledby="api-reality-title">
        <div className="api-reality-head">
          <Database size={24} />
          <div><span className="overline">Verified against the current public reference</span><h2 id="api-reality-title">What the MyCase API contributes</h2></div>
        </div>
        <div className="api-reality-grid">
          <article>
            <span className="api-label api-yes">Documented</span>
            <h3>Client and matter directory</h3>
            <p>List clients, filter exact contact fields, retrieve a client&apos;s cases, read case status and dates, and receive client/case webhooks.</p>
          </article>
          <article>
            <span className="api-label api-partial">Portal-owned</span>
            <h3>Fast fuzzy search and recent-first sort</h3>
            <p>The documented endpoints do not expose a universal fuzzy query or sort parameter. A minimal encrypted cache provides responsive search and local sorting by MyCase timestamps.</p>
          </article>
          <article>
            <span className="api-label api-no">Not documented</span>
            <h3>Native form and portal administration</h3>
            <p>The public API does not document control of MyCase intake-form definitions, workflow rules, or client-portal invitations. The custom portal must own those records.</p>
          </article>
        </div>
        <div className="source-links">
          <a href="https://mycaseapi.stoplight.io/docs/mycase-api-documentation/c19659e69949e-get-clients-people" target="_blank" rel="noreferrer">MyCase: Get Clients <ChevronRight size={15} /></a>
          <a href="https://mycaseapi.stoplight.io/docs/mycase-api-documentation/999662f9e0762-get-all-cases-for-a-client" target="_blank" rel="noreferrer">MyCase: client cases <ChevronRight size={15} /></a>
          <a href="https://supportcenter.mycase.com/en/articles/9369919-mycase-client-portal-overview" target="_blank" rel="noreferrer">MyCase portal scope <ChevronRight size={15} /></a>
        </div>
      </section>

      <section className="security-baseline-section" aria-labelledby="baseline-title">
        <div className="section-heading-row">
          <div><span className="section-kicker"><FileCheck2 size={17} /> Review baseline</span><h2 id="baseline-title">Controls required before real client data</h2></div>
        </div>
        <div className="baseline-grid">
          <div><strong>Identity and recovery</strong><p>Single-use codes, rate limits, replay prevention, session revocation, safe contact changes, staff-assisted recovery, and optional passkeys.</p></div>
          <div><strong>Application security</strong><p>TLS, secure HttpOnly cookies, CSRF defense, CSP, server-side authorization, dependency scanning, penetration testing, and incident response.</p></div>
          <div><strong>Data protection</strong><p>Encryption at rest, managed keys, field minimization, redacted logs, backups, restore tests, retention schedules, and defensible deletion.</p></div>
          <div><strong>Operational control</strong><p>Named staff accounts, access reviews, form version approval, resend/revoke history, delivery failures, review queues, and exception reports.</p></div>
          <div><strong>File handling</strong><p>Later phase only: allowlisted types, size limits, quarantine and malware scanning, short-lived object access, hashes, and original-file preservation.</p></div>
          <div><strong>AI boundary</strong><p>AI may flag missing answers or draft an internal summary after approval. It cannot authenticate, authorize, send, clear conflicts, advise, or decide a MyCase write.</p></div>
        </div>
        <div className="benchmark-note">
          <CircleAlert size={18} />
          <p>NIST SP 800-63B is used here as a security benchmark, not as a claim that federal assurance levels legally bind this private portal. Its current guidance does not treat email as an out-of-band authenticator and treats SMS/voice as restricted, so Heather should approve a documented, risk-based client authentication policy.</p>
          <a href="https://pages.nist.gov/800-63-4/sp800-63b.html" target="_blank" rel="noreferrer">Read NIST guidance <ChevronRight size={15} /></a>
        </div>
      </section>

      <section className="decision-section" aria-labelledby="decision-title">
        <div className="section-heading-row">
          <div><span className="section-kicker"><MessageSquareText size={17} /> Heather workshop</span><h2 id="decision-title">Decisions still needed before production design</h2><p>These are policy decisions, not coding details. The mock can move forward while they are being answered.</p></div>
        </div>
        <ol className="decision-list">
          {designQuestions.map((question, index) => <li key={question}><span>{String(index + 1).padStart(2, "0")}</span><p>{question}</p></li>)}
        </ol>
      </section>
    </main>
  );
}
