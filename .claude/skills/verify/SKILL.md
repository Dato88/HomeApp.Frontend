---
name: verify
description: End-to-end browser verification recipe for HomeApp.Frontend against the real backend
---

# HomeApp.Frontend — verify recipe

## Setup

- System Node (v20.x) is too old for the Angular CLI. Before any `ng`/`npm` command:
  `export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"`
- `npm run test` uses **Vitest** (`@angular/build:unit-test`, `runner: vitest`), not Karma. Just
  run `npm run test` plain — flags like `--browsers=ChromeHeadless` are for the old Karma runner
  and will fail with "requires @vitest/browser-* to be installed".
- `npm run build` / `npm start` work with the Node v24 PATH override above.

## Backend

Lives in the sibling repo `~/GitHub Source/HomeApp.Backend` (.NET Aspire AppHost). Start it with:

```bash
cd "~/GitHub Source/HomeApp.Backend/HomeApp.Backend/HomeApp.Backend.AppHost"
dotnet run > /path/to/apphost.log 2>&1 &
disown
```

Takes ~15-30s to bring up Postgres/Keycloak/Web API/Bff as AppHost sub-resources. Poll
`curl -s -o /dev/null -w "%{http_code}" http://localhost:5555/` — a `404` (not connection-refused)
means the API is up (there's no route at `/`, that's expected). The frontend's `proxy.conf.json`
routes both `/api` and `/auth` to `http://localhost:5555`.

## Frontend dev server

```bash
export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"
npm start   # -> http://localhost:4200
```

## Login

Dev login: `devuser` / `devpassword`. Navigating to `localhost:4200` unauthenticated redirects to
Keycloak at `http://localhost:8080/realms/homeapp/protocol/openid-connect/auth?...`. Fill
`#username`, `#password`, click `#kc-login` — redirects back to `localhost:4200/dashboard`.

## Driving the app (Playwright)

The repo has `@playwright/test` installed but no standalone browser-driving script — write one
ad hoc into the scratchpad. Since it lives outside `src/`, resolve the package via:

```js
import { createRequire } from 'module';
const require = createRequire('/Users/andrej_mac/GitHub Source/HomeApp.Frontend/package.json');
const { chromium } = require('@playwright/test');
```

Run with the Node v24 PATH override: `node /path/to/script.mjs`.

### UI markup gotchas

- `lib-dropdown-list` renders as `button.dropdown-trigger[aria-label="<Label>"]` + a popover of
  `[role="option"]` entries. **Option index 0 is always a placeholder** (e.g. "Konto wählen") —
  real values start at index 1. So an N-item list shows N+1 options.
- `lib-dialog` uses a native `<dialog>` — `[closeOnOutsideClick]="false"` is mandatory on any
  dialog containing a dropdown, otherwise the coordinate-based outside-click check closes it on
  option click (see homeapp-lib-dialog-dropdown-pitfall memory).
- Buttons inside a dialog can accessible-name-collide with same-labelled buttons elsewhere on the
  page (e.g. row-level "zusammenführen" icon buttons vs. the dialog's "Zusammenführen" submit
  button — `getByRole('button', {name: 'Zusammenführen'})` without scoping matches both via
  substring match). **Scope locators to the dialog's custom element tag**
  (e.g. `page.locator('home-merge-payment-partner-dialog').getByRole(...)`) rather than
  querying the whole page.

### Finance module navigation

Finance tabs are **not routes** — `/finance?tab=<id>` works as a deep link (`transactions`,
`accounts`, `categories`, `paymentPartners`, `report`), read once in `FinanceViewComponent`'s
constructor from the query param.

## What's worth driving

- Buchungen tab: select an account, check the grid renders, open the per-row "Kategorie per
  Empfänger zuweisen" dialog (`button[aria-label*="Kategorie per Empfänger zuweisen"]`).
- Zahlungspartner tab: list, rename (pencil icon, `aria-label*="umbenennen"`), merge (union icon,
  `aria-label*="zusammenführen"`, only rendered when 2+ partners exist).
- Konten tab: edit dialog, Aktiv checkbox, conditional "Deaktiviert seit" date field.

## Known caveat

Merge (`POST /PaymentPartner/merge`) is **irreversible** — no alias mechanism, the source
partner's matching key is gone for good once merged. Don't merge real/seeded data you care about
without expecting to reseed the dev DB afterward.
