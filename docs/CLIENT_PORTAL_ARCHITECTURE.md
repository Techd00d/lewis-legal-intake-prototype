# Lewis Legal Client Forms Portal — Product and Security Architecture

Reviewed: August 2, 2026  
Status: planning baseline for Heather and the implementation team  
Scope: custom assigned-form portal that integrates with MyCase without attempting to replace MyCase case management

This document is a design and attorney-review aid. It is not a legal opinion, a security certification, or a representation that the public prototype is suitable for client information. The public prototype has no production authentication, database, autosave, notification provider, MyCase connection, or protected file store.

## Executive recommendation

Build a narrow **Lewis Legal Forms Center** with three controlled contexts:

1. A staff workspace protected by Lewis Legal Microsoft Entra sign-in, MFA, Conditional Access, named accounts, and role-based permissions.
2. A prospective-client intake lane that collects only the minimum information approved for conflict screening, exposes no matter data, and does not imply that the firm has accepted an engagement.
3. A represented-client workspace that exposes only forms assigned to a verified person for a specifically authorized MyCase matter.

MyCase remains the authoritative source for client and case identity. The custom portal owns form templates and versions, assignments, identity bindings, verification challenges, server-side drafts, submitted snapshots, review status, and an independent audit trail.

The website may use one visible `Client Portal` entry point, but the firm should preserve a clear product boundary:

- **Custom Forms Center:** requested forms, conditional questions, autosave, completion status, corrections, and staff review.
- **Native MyCase portal:** secure messages, shared case documents, events, billing, and payments after engagement.

This avoids rebuilding functions that MyCase already provides while solving the API gap around externally controlled forms and assignments.

## Non-negotiable product rules

- A portal URL or invitation link is a locator, never a reusable credential.
- No client name, matter name, form title, or sensitive fact appears before successful authentication and authorization.
- Identity is bound to a person; access is granted to a person–matter relationship. Access is never inferred merely because a person is a contact on a case.
- Each adult, joint client, guardian, interpreter, or authorized representative receives a separate identity and explicit access grant. Credentials are not shared within a household.
- A prospective inquiry and a represented-client portal account are different states. Only authorized staff may promote or associate an inquiry after the firm's conflict and engagement procedures; automation or AI may never make that decision.
- Authentication, authorization, notifications, and MyCase writes are deterministic services. An AI model cannot grant access, choose recipients, send notifications, or select a matter.
- Autosave preserves a draft. It does not constitute final submission, a signature, a legal instruction, or acceptance by the firm.
- Submission creates an immutable, timestamped snapshot. A reopened form becomes a new revision.
- Staff review is required before supported data or documents move to MyCase.
- The initial release should not accept production document uploads. Continue using the native MyCase portal for sensitive file exchange until the custom upload threat model, scanning, storage, retention, and evidentiary handling are approved.

## What the MyCase API can support

The current public reference was checked on August 2, 2026.

### Client lookup

`GET /v1/clients` returns firm clients visible to the authorized MyCase user and documents exact filters for:

- First name
- Last name
- Email
- Cell, home, and work phone
- Updated-after timestamp
- Page size

The response includes client identifiers, contact fields, archived status, associated case identifiers, custom-field values, and created/updated timestamps.

Reference: [MyCase — Get Clients (People)](https://mycaseapi.stoplight.io/docs/mycase-api-documentation/c19659e69949e-get-clients-people)

### Matter lookup

`GET /v1/clients/{id}/cases` returns the cases associated with a client. Case data includes:

- MyCase case ID
- Case name and number
- Opened and closed dates
- Practice area and case stage
- Open/closed status
- Associated clients and staff
- Created and updated timestamps

Reference: [MyCase — Get All Cases for a Client](https://mycaseapi.stoplight.io/docs/mycase-api-documentation/999662f9e0762-get-all-cases-for-a-client)

`GET /v1/cases` documents filters for open/closed status and updated-after timestamp. It does not document a universal name query or a sort parameter.

Reference: [MyCase — Get Cases](https://mycaseapi.stoplight.io/docs/mycase-api-documentation/2c2d46374701c-get-cases)

### Search design consequence

The requested typeahead search and recent-first ordering should not issue a complete MyCase scan for every keystroke. Use a minimal, encrypted portal directory cache:

1. Perform an initial paginated synchronization of permitted client and case directory fields.
2. Subscribe to documented client and case webhooks.
3. Verify each webhook signature and process it idempotently.
4. Run a scheduled `updated_after` reconciliation so a missed, delayed, duplicated, or out-of-order webhook cannot make the cache authoritative by accident.
5. Provide fuzzy search and local sorting inside the portal service.
6. Sort matters by MyCase `updated_at` by default; display both last activity and opened date. Allow staff to switch to client-name order or filter open/closed matters.

The cache should contain only fields needed for lookup and authorization. Full form answers do not belong in the directory index.

### External portal ownership

The published API does not document control of MyCase intake-form definitions, conditional form logic, native workflow rules, client-portal invitations, or portal settings. The external system must own its form assignments and access lifecycle.

The API does document operational records such as clients, cases, custom-field values, notes, tasks, documents, and selected event/billing resources. Every production write must go through a separate allowlisted integration broker and an explicit staff review state.

The MyCase OAuth access and refresh tokens must never be exposed to the client browser or language model.

## Staff experience

### Prospective-client boundary

The detailed assignment workflow below is for a person and matter that staff has intentionally approved for that stage. A brand-new inquiry follows a separate, minimal lane:

1. Collect only the contact, adverse-party, related-person, and matter-category information Heather approves as reasonably necessary for the conflict pre-screen.
2. Label every screen and receipt so it does not promise representation or legal advice.
3. Route the information to staff for the firm's documented conflict procedure. The software may find possible matches, but staff or Heather decides the result.
4. Do not expose MyCase matter data, detailed forms, shared documents, messages, or billing.
5. After the firm decides to proceed, authorized staff explicitly creates or associates the proper MyCase client and matter, records the person's role, and assigns the represented-client forms.
6. Preserve the prospective-client record according to the attorney-approved confidentiality, retention, and deletion policy even if no engagement follows.

California Rule of Professional Conduct 1.18 protects qualifying information learned from a prospective client even when no lawyer-client relationship follows. The purpose of this separation is data minimization and correct workflow state, not a determination that any particular inquiry does or does not create a prospective-client relationship.

### Default workflow

1. Staff signs in with an individual Microsoft 365 account.
2. The system enforces the staff role and retrieves only permitted directory records.
3. Staff searches by client name, verified contact value, MyCase client ID, matter name, or matter number.
4. Results default to recent activity and show open matters first. Closed and archived records require an explicit filter.
5. Staff selects the intended person.
6. Staff selects the intended matter and confirms the person’s role in that matter.
7. Staff selects one or more approved form-template versions, due dates, ordering/dependencies, and reminder policy.
8. Staff selects a safe, pre-bound notification channel and reviews any communication restriction.
9. A confirmation screen shows the person, matter, role, channel, forms, and expiration.
10. Staff creates an access invitation. Notification delivery is a separate, auditable action.
11. Staff can see delivery, verification, draft, submission, correction, acceptance, expiration, and revocation states.

### Proposed staff roles

| Role | Proposed permissions |
|---|---|
| Front office | Search permitted records; select client/matter; assign approved bundles; create, resend, or revoke invitations; view status metadata but not substantive answers unless needed for assigned duties |
| Legal assistant | Front-office permissions plus review submissions, request corrections, reopen drafts, prepare approved MyCase handoff, and resolve operational exceptions |
| Heather / portal administrator | Approve templates, publication, permissions, retention, identity exceptions, access recovery, legal content, and all legal or conflict-related decisions |

No shared `staff` portal identity should exist. Shared Microsoft mailboxes may receive operational notices, but actions must remain attributable to an individual user.

## Client experience

### Entry and verification

The permanent website destination is a generic address such as `portal.lewislegal.law`. It contains no client or matter identifier.

An invitation notification may contain a high-entropy, opaque, short-lived reference. That reference:

- Contains no client or matter name
- Expires after a defined period or first use
- Can be revoked and reissued
- Starts the verification process
- Does not itself establish an authenticated session

After successful initial enrollment, the client may return through the generic portal address. The portal identifies the account only after a neutral login flow and successful verification.

### Identity binding versus authentication

Possession of an email inbox or mobile number proves control of that channel; it does not, by itself, prove the person’s legal identity. Lewis Legal must approve an initial binding procedure based on the relationship already established with the client.

Examples for attorney review include:

- In-person enrollment by staff
- Enrollment during a verified consultation or existing MyCase portal session
- Staff comparison against already-established contact data and a separate known fact that is appropriate to use
- A stronger commercial identity-proofing service if the risk assessment justifies it

The portal then authenticates control of the bound authenticator on later visits.

### Recommended authentication pattern

1. Use the known channel for an initial, short-lived enrollment challenge.
2. Offer passkey enrollment for low-friction, phishing-resistant repeat access.
3. Retain a verified mobile code as a controlled alternative where appropriate.
4. Treat email-only repeat access as a documented risk decision, not an assumption that email is high assurance.
5. Use staff-assisted recovery for lost authenticators or contact changes.
6. Never permit a user to replace the only recovery channel merely by proving control of that same channel.

Initial proposed settings for testing, subject to risk review:

- At least six random decimal digits for a manual code
- Ten-minute maximum validity
- One successful use only
- Server-side hashed challenge storage
- Account, channel, IP, and device-aware throttling
- New challenge does not reset accumulated failure limits
- Generic responses that do not disclose whether an account exists
- Thirty-minute idle session timeout and twelve-hour absolute limit
- Session ID rotation after verification and privilege changes
- Secure, HttpOnly, appropriately scoped SameSite cookies
- Step-up verification for contact changes, sensitive exports, or an aged session’s final submission
- Immediate server-side session and invitation revocation

NIST SP 800-63B is used as a benchmark, not as a claim that federal assurance levels bind this private system. Its current guidance does not permit email as an out-of-band authenticator and treats PSTN delivery such as SMS and voice as restricted. The firm should approve a risk-based policy with counsel and its security provider.

Reference: [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html)

### Dashboard

After authorization, the client sees:

- Only matters for which that identity has an active membership
- Only forms assigned to that identity for the selected matter
- Form status, due date, progress, last successful save, and next action
- Clear `Not started`, `In progress`, `Submitted`, `Needs correction`, `Accepted`, `Expired`, and `Withdrawn` states
- A visible server-save indicator
- A warning when the browser is offline or the latest change has not reached the server
- A separate, deliberate Submit action
- A receipt containing submission time and revision identifier
- Office support information and a notice that the portal is not monitored for emergencies

The application should meet WCAG 2.2 AA, use at least 16px form controls on small screens, preserve 44px touch targets, support keyboard operation, and allow reasonable accommodation and language workflows approved by the firm.

## Autosave and cross-device resume

### Save behavior

- Save changed fields after a short debounce, again on field blur, and at section navigation.
- Send only the changed field set to the server.
- Use a draft revision or ETag and conditional update so stale devices cannot silently overwrite newer data.
- Return the committed revision and server timestamp.
- Show `Saving`, `Saved`, `Offline`, and `Could not save` states truthfully.
- Retry idempotently after a transient failure.
- Do not log answer values in application, observability, or audit logs.
- Do not store access tokens or production draft answers in `localStorage`.
- Do not claim offline support unless an approved encrypted-device-storage design exists. The safer initial behavior is to retain unsent edits only in page memory, warn the client, and synchronize when connectivity returns.

### Submission behavior

- Autosave never marks a form submitted.
- Submission validates the complete assigned template version.
- The server creates an immutable answer snapshot, form-template version, submitter identity, timestamp, matter membership, and integrity hash.
- Staff may accept, request correction, or reopen.
- Reopening creates a new draft revision linked to the prior submitted snapshot; it does not edit history.
- A later template publication does not change already-assigned or submitted versions.

### Conflict handling

When two devices edit the same draft:

1. The server rejects the stale conditional update.
2. The UI identifies the affected section without exposing data from another matter or person.
3. The client chooses the current server value or their newer local value field by field where safe.
4. The resolution becomes a new audited draft revision.

## Core data model

| Record | Purpose |
|---|---|
| `portal_person` | Portal identity linked to a MyCase client ID; no access is implied by the link |
| `authenticator_binding` | Approved email, mobile, passkey, or recovery binding with verification and revocation timestamps |
| `matter_membership` | Explicit person, MyCase matter ID, role, permission set, effective dates, and approver |
| `form_template_version` | Immutable published schema, disclosures, help text, validation, and MyCase mapping proposal |
| `form_assignment` | Recipient, matter membership, template version, due date, status, ordering, reminder policy, and staff owner |
| `draft_revision` | Encrypted server draft, revision number, last-save metadata, and integrity information |
| `submission` | Immutable submitted snapshot, receipt, review state, and later correction chain |
| `verification_challenge` | Hashed short-lived challenge, attempts, channel, expiration, one-use status, and risk metadata |
| `session` | Revocable server session with idle/absolute expiration and assurance context |
| `audit_event` | Append-oriented security and workflow event without secrets or answer values |
| `integration_outbox` | Idempotent, approval-gated MyCase write prepared after staff review |

Every database query for client-facing content must bind the authenticated person, active matter membership, assignment, and firm tenant on the server. A client-supplied matter or assignment ID is never sufficient authorization.

## Security threat/control matrix

| Threat | Required control |
|---|---|
| Forwarded invitation | Opaque, short-lived, single-use, revocable invite that starts verification but grants no session |
| Account enumeration | Generic responses and equivalent timing/status behavior; rate limits and bot defense |
| Shared household or adverse party | Separate identities and explicit person–matter roles; no shared credentials; safe-notification rules |
| Stolen phone or inbox | Passkey option, new-session checks, device/session revocation, step-up actions, staff-assisted recovery |
| Incorrect MyCase selection | Stable IDs, recent/open filters, role display, staff confirmation screen, and complete audit event |
| Privileged integration token | Dedicated broker, secret vault, allowlisted routes, input policy, approval gates, independent audit, and kill switch |
| Cross-matter access | Server-side row/resource authorization on every request and automated negative tests |
| Concurrent edits | Revision/ETag conditional updates and explicit conflict resolution |
| Sensitive logs | Redaction by design, structured event metadata only, restricted access, and retention limits |
| Malicious uploads | Defer initially; later add type/size allowlists, quarantine, malware scanning, private objects, short-lived access, hashes, and preservation rules |
| Notification leakage | No matter/form names or facts in email/SMS; fixed human-approved templates; safe-channel preference check |
| AI overreach | No AI in authentication, authorization, notification delivery, conflict clearance, legal advice, or autonomous MyCase writes |

## Audit events

At minimum, record:

- Staff sign-in, denied access, role changes, and session revocation
- MyCase directory synchronization and reconciliation results
- Client/matter selection and assignment creation
- Invite creation, delivery provider result, expiration, resend, and revocation
- Verification success/failure category without recording the code
- Session creation, step-up, expiration, and logout
- Draft revision committed, rejected as stale, or failed without recording answers
- Submission, reopen, correction request, acceptance, withdrawal, and expiration
- MyCase handoff approval, idempotency key, operation type, result, and reconciliation
- Administrative template publication and retention action

Audit access must itself be logged and restricted. Audit retention should be approved separately from form-answer retention.

## Privacy, ethics, and legal review

Before processing real information, Heather and counsel should approve:

- The minimum necessary fields at each intake stage
- Prospective-client, current-client, former-client, and minor-data boundaries
- Authentication and recovery policy
- Retention and deletion schedule for abandoned drafts, submitted forms, exports, backups, and audit events
- Client notice and consent language for providers and any AI-assisted internal review
- Vendor contracts, confidentiality, data-location, subprocessors, incident notice, deletion, and model-training restrictions
- Breach response and California notification analysis
- Accessibility and language-accommodation workflow
- Whether any form requires an electronic signature rather than an acknowledgment
- Evidence preservation and metadata policy for future uploads

California Rules of Professional Conduct 1.6 and 1.18 require careful protection of confidential client and prospective-client information. The State Bar's updated 2026 practical AI guidance says greater agent autonomy requires greater supervision and verification; it also warns against unrestricted agent access to firm systems and autonomous external transmission of client information without safeguards and human review.

References:

- [California Rule of Professional Conduct 1.6](https://www.calbar.ca.gov/index.php/legal-professionals/rules/rules-professional-conduct/current-rules-professional-conduct/chapter-1-lawyer-client-relationship)
- [California Rule of Professional Conduct 1.18](https://www.calbar.ca.gov/index.php/legal-professionals/rules/rules-professional-conduct/current-rules-professional-conduct/chapter-1-lawyer-client-relationship)
- [State Bar of California — 2026 Generative AI Practical Guidance](https://www.calbar.ca.gov/Portals/0/documents/ethics/Generative-AI-Practical-Guidance.pdf)
- [California Civil Code § 1798.82 — security breach notification](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.82)

## AI boundary

AI is optional and downstream of secure collection. An approved internal assistant may:

- Flag missing or internally inconsistent answers
- Suggest a document category
- Draft a staff-only intake summary with links to the source fields
- Prepare a proposed mapping or MyCase write for human review

AI may not:

- Authenticate or identify a client
- Decide who may access a matter
- Choose or change a safe communication channel
- Send a client notification or message
- Clear a conflict or make an engagement decision
- Provide legal advice to a client
- Create an unsupervised legal deadline
- Submit a form, sign for a client, or autonomously write to MyCase

All AI processing of confidential content requires an approved environment, matter isolation, contractual protections, retention controls, and attorney supervision.

## Proposed rollout

### Phase 0 — policy workshop

- Map the actual staff assignment and conflict procedures.
- Approve roles, identity binding, recovery, safe communications, retention, and portal/MyCase division.
- Identify required MyCase custom fields and data-quality cleanup.

### Phase 1 — synthetic integration proof

- Obtain or validate MyCase API credentials in a test context.
- Synchronize synthetic clients and matters.
- Prove search, recent-first sorting, multiple matters, webhook validation, and reconciliation.
- Prove staff Microsoft sign-in and role denial tests.
- Do not send messages or accept files.

### Phase 2 — forms pilot

- Publish one attorney-approved form bundle.
- Implement identity binding, verification, secure server sessions, autosave, revision conflicts, submit/reopen, audit, and retention.
- Pilot with staff and synthetic personas across phone, tablet, and desktop.
- Complete accessibility, security, privacy, recovery, backup, and incident-response testing.

### Phase 3 — limited production

- Invite a small, consented client cohort.
- Keep MyCase handoff review-only.
- Monitor save failures, support calls, delivery issues, completion rates, incorrect assignments, denied access, and recovery events.
- Conduct a post-pilot review with Heather before expanding.

### Later phases

- Approved reminder automation
- Passkey expansion
- Staff-reviewed structured MyCase writes
- Document upload only after a separate threat model and operational decision
- Internal AI assistance only after vendor/data approval and matter-isolation testing

## Questions for Heather

1. Which MyCase records should appear in the staff picker: active clients only, former clients, leads, or all three?
2. Which role may assign, revoke, reopen, request correction, or accept each form?
3. Which contact fields are considered verified and safe, and how are restrictions recorded today?
4. What initial identity-binding procedure is appropriate for existing and new clients?
5. Will the firm offer passkeys, or accept email/SMS for repeat access after a documented risk review?
6. Which functions remain in the native MyCase portal?
7. How long should incomplete drafts, submissions, receipts, audit events, and expired invitations remain?
8. How should guardians, authorized representatives, interpreters, and multiple-client matters be handled?
9. Which forms or actions require an electronic signature rather than a checkbox acknowledgment?
10. What is the approved reminder cadence and escalation path after delivery failure or inactivity?

## Additional security references

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Microsoft Entra Conditional Access overview](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview)
- [Twilio Verify best practices](https://www.twilio.com/docs/verify/developer-best-practices)
- [MyCase Client Portal overview](https://supportcenter.mycase.com/en/articles/9369919-mycase-client-portal-overview)
