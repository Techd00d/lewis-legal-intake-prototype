# Lewis Legal intake modernization prototype

Interactive, schema-driven mockup built from the eight legacy Lewis Legal PDF forms reviewed in July 2026.

This is a planning artifact, not a production intake service. It has no database, authentication, email, AI service, MyCase connection, analytics, or file-upload backend. Use synthetic information only. Form answers live only in React memory and disappear when the page is refreshed.

## Public preview

Open the client-safe demonstration at:

**https://techd00d.github.io/lewis-legal-intake-prototype/**

This public build is intentionally marked `noindex` and must only be used with synthetic information.

Portal-planning views:

- `?view=staff` — MyCase-backed client/matter picker and form-assignment mock
- `?view=client` — verification and assigned-form dashboard mock
- `?view=security` — trust boundaries, roles, threat controls, and API reality
- `?view=forms` — complete working form library

## Run locally

From this directory:

```powershell
npm install
npm run dev
```

Then open `http://localhost:3000`.

Useful direct prototype links:

- `http://localhost:3000/?form=conflict-prescreen`
- `http://localhost:3000/?form=general-intake`
- `http://localhost:3000/?form=custody-support`
- `http://localhost:3000/?form=dissolution`
- `http://localhost:3000/?form=spousal-support-modification`
- `http://localhost:3000/?form=privacy-communications`
- `http://localhost:3000/?form=document-collection`
- `http://localhost:3000/?form=internal-opening`

Replace `http://localhost:3000/` with the public preview URL above to share a specific form with Heather.

## Verify and export

```powershell
npm run check
```

The build produces a fully static export in `out/`. Any normal static web server can host that folder for a demonstration. Do not publish it as a real client intake until the production security, privacy, accessibility, retention, authentication, and integration controls described in the project review are implemented.

## Structure

- `src/data/forms.ts` — canonical form definitions, conditions, sensitivity flags, and proposed MyCase mappings
- `src/data/portalDemo.ts` — synthetic clients, matters, assignments, portal states, and workshop questions
- `src/components/IntakePortal.tsx` — form library, wizard, review boundary, and sample JSON export
- `src/components/PortalExperience.tsx` — staff workspace, client verification/dashboard, and security architecture views
- `src/types/intake.ts` — form-schema contracts
- `src/app/globals.css` — responsive visual system and accessible interaction states
- `docs/CLIENT_PORTAL_ARCHITECTURE.md` — product, identity, autosave, MyCase, privacy, and security baseline
- `docs/MILITARY_INTAKE_BASIS.md` — primary-source rationale and attorney-review boundary for military-family questions

## Deliberate safety choices

- A minimal conflict pre-screen precedes detailed intake.
- Social Security and driver's-license numbers are represented as deferred protected fields, not active public inputs.
- Safety questions route to staff and explicitly do not contact a court or emergency service.
- The privacy module uses granular, revocable channel preferences instead of blanket voicemail authorization.
- The support-modification module gathers the existing order and asserted changed circumstances without deciding legal sufficiency.
- MyCase mappings are proposals; the prototype makes no API calls.
- AI is limited to future staff-assistance roles and never communicates autonomously with a client.
- A reusable portal URL is modeled only as an entry point; it is never treated as an authentication credential.
- Autosave, identity verification, notification delivery, staff SSO, and MyCase synchronization are visibly marked as simulations.
- The proposed production model stores drafts on an encrypted server with revision control; it does not rely on browser `localStorage`.
