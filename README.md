# Pacific Plains Electric

A server-rendered Next.js website for Pacific Plains Electric, with secure website intake, protected content publishing, and owner/admin access management. Uses a **separate** Supabase project: `xcknbrmmypjnkbuyxutm` in the Pacific Plains Electric organization.

## Run

```sh
npm ci
cp .env.example .env.local
# Fill the Supabase URL and publishable key for the separate project.
npm run dev
```

```sh
npm run test
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

## Operational status

- Public pages, themes, service intake, database permissions, CMS publishing, and RBAC are implemented.
- Online scheduling is **OFF**. The database prevents accidental enablement.
- There is no website chat assistant. The main phone line is answered by an automated assistant; live website AI is not connected.
- Website requests are saved in a protected intake outbox, not delivered to Volteira. No email/SMS delivery or appointment confirmation is claimed.
- Payments, uploads, live appointment management, and operational dashboards require further integration.
- The custom domain requires registration and DNS configuration. See the handoff.

Read [the handoff](docs/HANDOFF.md), [integration contracts](docs/VOLTEIRA.md), and [verification notes](docs/VERIFICATION.md).
