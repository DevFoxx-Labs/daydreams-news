# Owner TODO — ख़बर सेतु

Tasks only the owner can do (legal facts, accounts, consoles, keys).
Nothing here is ticked off without the owner's confirmation.

---

## 2026-11-20 — after the reader-site build (M0–M6)

### Legal & compliance (blocks launch)

- [ ] Decide the final brand name and domain (PRD §15.1). Everything reads from
      `lib/site.ts`, so it is a one-file change.
- [ ] Fill the real legal facts as environment variables — until then the site shows
      `[भरना बाकी]` placeholders:
      - `NEXT_PUBLIC_LEGAL_ENTITY`, `NEXT_PUBLIC_LEGAL_ADDRESS`, `NEXT_PUBLIC_LEGAL_CIN`
      - `NEXT_PUBLIC_PRIVACY_EMAIL`, `NEXT_PUBLIC_EDITOR_EMAIL`, `NEXT_PUBLIC_ADS_EMAIL`
      - `NEXT_PUBLIC_GRIEVANCE_NAME`, `NEXT_PUBLIC_GRIEVANCE_EMAIL`, `NEXT_PUBLIC_GRIEVANCE_PHONE`
- [ ] Appoint the Grievance Officer formally and agree the response times published on
      `/grievance` (48 h acknowledgement, 30 days resolution).
- [ ] **Have a lawyer review** `/privacy`, `/terms`, `/cookies`, `/ethics` and `/grievance`
      against the DPDP Act 2023, the DPDP Rules 2025 and the IT Rules 2021. The texts are
      drafts and say so on the page.
- [ ] Provide the final list of processors (hosting, CDN, email, analytics, ads, weather /
      AQI / market / cricket providers) with their countries, so §3 and §4 of the Privacy
      Notice and the cookie table can be completed.
- [ ] Confirm the retention periods in the Privacy Notice (server logs 180 days,
      newsletter until unsubscribe + 30 days, consent records kept for proof).
- [ ] Write the breach runbook contacts (who notifies the Data Protection Board within
      72 hours, and from which mailbox).

### Editorial & brand

- [ ] Supply the editorial team details and ownership for `/about` (E-E-A-T + IT Rules).
- [ ] Decide the Google News and WhatsApp channel URLs
      (`NEXT_PUBLIC_SOCIAL_GOOGLE_NEWS`, `NEXT_PUBLIC_SOCIAL_WHATSAPP`) — the article
      follow box stays hidden until they exist (gap G15).
- [ ] Social profile URLs (`NEXT_PUBLIC_SOCIAL_FACEBOOK` / `_X` / `_LINKEDIN` /
      `_YOUTUBE` / `_INSTAGRAM`); the footer icons appear only for configured ones.
- [ ] Commission the real logo and favicon from the chosen mark (GRAPHICS_PROMPTS §11),
      and add `public/fonts/Mukta-ExtraBold.ttf` so per-story OG cards can render Hindi
      (gap G8).

### Accounts & keys (never commit these)

- [ ] Hosting project in a Mumbai region (`NEXT_PUBLIC_SITE_URL`), with MFA on the account.
- [ ] Postgres (Neon/Supabase/RDS) with daily backups + point-in-time recovery.
- [ ] Email provider for the newsletter double opt-in.
- [ ] Google Ad Manager / AdSense account; ad unit ids per placement and `ads.txt`
      content. Ads only load after consent, and `NEXT_PUBLIC_FLAG_AD_NETWORK` must be
      set to `true` to enable them at all.
- [ ] Analytics property (`NEXT_PUBLIC_ANALYTICS_ID` + `NEXT_PUBLIC_FLAG_ANALYTICS=true`).
- [ ] Weather, AQI, market and cricket API keys (server-side only).
- [ ] Redis/Upstash for cross-instance rate limiting (gap G5).
- [ ] CDN/WAF in front of the origin, with the origin hidden.

### Decisions needed

- [ ] Which states and cities get dedicated desks at launch (PRD §15.2).
- [ ] Photo sourcing: own photographers, agency subscription, or both (PRD §15.3).
- [ ] Confirm Payload as the CMS (PRD §15.4).
- [ ] Is an English edition planned within 12 months? It decides whether URLs stay at
      `/` or move to `/hi/` (PRD §15.7) — cheap now, expensive later.
- [ ] Newsletter and push providers + budget (PRD §15.8).
