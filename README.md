# ख़बर सेतु (Khabar Setu)

A fast, mobile-first Hindi news portal — Next.js 16 (App Router, Cache Components),
TypeScript and Tailwind CSS v4.

Reader site is built against mock data behind a swappable data-access layer; the
newsroom CMS plugs into the same interface later.

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm check          # typecheck + lint + tests
pnpm build && pnpm start
```

Useful routes while developing:

| Route | What |
|---|---|
| `/` | Homepage (DESIGN §5) |
| `/desh/uttar-bharat-kohra-thand-double-attack-1001` | Article template |
| `/dev/components` | Design-system preview (development only) |
| `/admin` | Newsroom panel (needs `ADMIN_SESSION_SECRET` + `ADMIN_DEV_PASSWORD`) |
| `/consent` · `/grievance` | Consent dashboard and rights requests |
| `/api/legal` | Versioned legal notices for the apps |

Responsive check (the dev or production server must be running):

```bash
BASE_URL=http://localhost:3000 ROUTE=/ node scripts/screenshot.mjs home 360,390,768,1024,1280,1440,1920
ROUTE=/ node scripts/overflow.mjs 360     # which element causes horizontal scroll

# hydration / console-error check (fresh profile, so the cookie banner is shown)
ROUTES=/,/search node scripts/hydration-check.mjs
AS_USER=u-desk ROUTES=/admin,/admin/stories node scripts/hydration-check.mjs
```

## Documentation

| File | What |
|---|---|
| `docs/PRD.md` | What to build, phases, acceptance criteria |
| `docs/DESIGN.md` | How it looks — tokens, components, every screen |
| `docs/GRAPHICS_PROMPTS.md` | Image generation prompts and the news-ethics rules |
| `docs/project-rules.md` | The standards this repo is built to — read first |
| `docs/ROLES_AND_DASHBOARDS.md` | Who uses the portal, their permissions and what each dashboard shows |
| `docs/known-gaps.md` | What is not done yet, with severity |
| `docs/owner-todo.md` | Tasks only the owner can do (legal facts, accounts, keys) |
| `changes/CHANGELOG.md` | One entry per task |
| `docs/reference/` | Reference screens and the static prototypes |

## Structure

```
app/            routes (reader site + /api)
components/
  layout/       shell: utility bar, masthead, nav, mobile header, footer, tab bar
  news/         primitives: StoryCard variants, AdSlot, Ticker, SectionHeader…
  home/ article/ live/ stories/ consent/ legal/   per-template pieces
  ui/           shadcn-style primitives restyled to the tokens
  admin/        newsroom panel: shell, nav, dashboards, admin UI kit
lib/
  admin/        roles, scopes, session, newsroom workload
  cms/          the only way pages read content (swap this for the CMS)
  data/         typed mock content
  services/     weather / AQI / market / cricket adapters
  consent/ legal/ seo/ search/ format/            supporting domains
messages/hi.json   every UI string
tests/             Vitest unit tests
```

## Configuration

Everything environment-specific lives in `lib/site.ts` and is read from env vars.
Unset legal values render a visible `[भरना बाकी]` placeholder rather than an invented
fact — see `docs/owner-todo.md` for the full list.

Feature flags fail closed (`NEXT_PUBLIC_FLAG_*` must be exactly `true` to enable a
feature): ad network, analytics, web push, next-story infinite scroll.

> All content currently on the site is demo content. Headlines, names and figures are
> invented and bear no relation to real people or events.
