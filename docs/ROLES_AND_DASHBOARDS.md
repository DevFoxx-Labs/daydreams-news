# Roles, Users & Dashboards — ख़बर सेतु

| | |
|---|---|
| **Document** | Operational analysis for the newsroom & business panels, v1.0 |
| **Date** | 21 Nov 2026 |
| **Written from** | The owner's seat: how a Hindi news portal is actually run day to day |
| **Companion docs** | `PRD.md` (§7 defines 4 CMS roles — this document extends that to the full operation), `DESIGN.md`, `project-rules.md` |
| **Status** | For decision. §12 lists what only the owner can decide. |

> Prose is English (repo convention); every label in quotes is the Hindi string the
> panel would actually show, because the people using these screens work in Hindi.

---

## 1. The owner's view in one page

A Hindi news portal is not one product. It is **four businesses sharing a database**:

1. **A newsroom** that has to publish a verified story in under three minutes at 6 a.m.
   and again at 11 p.m., seven days a week.
2. **A district stringer network** — 80% of the state and city news that makes a Hindi
   portal local comes from part-time correspondents paid per story. If their filing and
   payment are tracked in WhatsApp and a notebook, the network quietly dies in four months.
   **This is the module most portals get wrong, and it belongs in v1, not phase 3.**
3. **An ad business** whose people must never be able to touch a story.
4. **A regulated publisher** that owes a named Grievance Officer, a 48-hour
   acknowledgement, a consent ledger and a corrections log — by law, not by choice.

So the question "how many roles?" has two answers:

- **Permission-wise:** 17 internal roles + 6 external user types (§3, §4).
- **Panel-wise:** do **not** build 17 dashboards. Build **7 dashboards** in v1 (§7), and
  give the remaining roles a scoped version of an existing one. A dashboard nobody opens
  is worse than no dashboard: it rots, and then nobody trusts any of them.

**The one rule I'd hold every panel to:** a person opening their dashboard must know
*what to do next* within three seconds. One work queue, at most five metric tiles, one
primary button. Everything else goes behind a tab.

### Illustrative launch staffing (3 states: UP, Bihar, Delhi)

Numbers are a planning shape to confirm, not a budget.

| Function | Heads | Notes |
|---|---|---|
| Editor-in-Chief | 1 | Named on the masthead; legally accountable (IT Rules 2021) |
| Output / Desk editors | 4 | 24×7 needs 3 shifts + 1 relief. Shift handover is a system feature, §8.6 |
| Senior sub-editors | 3 | Copy, headlines, SEO titles |
| Staff reporters | 6–8 | National desk + 3 state capitals |
| **Stringers / district correspondents** | **30–60** | Per-story payment. The system's real load |
| Bureau chiefs | 3 | One per state; they own coverage and the stringer budget |
| Photo/video desk | 2–3 | Media QC, credits, licences |
| Social media | 2 | Includes push + WhatsApp channel |
| SEO / traffic analyst | 1 | Highest ROI single hire for a portal |
| Ad sales / ad ops | 3 | 2 sales + 1 ops |
| Finance | 1 | Shared; mostly stringer payouts + invoices |
| Admin / tech | 1 | Also handles integrations and backups |
| Grievance Officer | 1 | May be held by the Editor or by legal, but must be a **named** person |

~25 staff + the stringer network. Everything in §7 is sized for that.

---

## 2. The complete user universe

### 2.1 External (they never see an admin panel, except the last three)

| # | User type | What they are | Account needed? |
|---|---|---|---|
| E1 | **Anonymous reader** | 95%+ of traffic; arrives from Google Discover/News or WhatsApp | No |
| E2 | **Registered reader** (P2) | Bookmarks, followed topics, notification preferences | Phone OTP / Google |
| E3 | **Newsletter subscriber** | Email + double opt-in; consent row in the ledger | No account needed |
| E4 | **Push subscriber** | Browser/app token + topic choice | No |
| E5 | **Paid subscriber** (P3) | Ad-free / e-paper | Yes |
| E6 | **Reader who files a complaint** | Grievance or DPDP rights request — may be anonymous | No (identity verified by the officer) |
| E7 | **Advertiser / agency** | Needs to see their own campaign numbers and invoices | Yes → small portal, §7.15 |
| E8 | **Guest author / columnist** | Op-eds, expert columns; not staff | Yes → restricted portal, §7.16 |
| E9 | **Citizen contributor** ("आपकी ख़बर") | Reader-submitted photo/tip. **High abuse risk** — treat every submission as untrusted, moderated, never auto-published | Optional |
| E10 | **Syndication partner** | Consumes our feed/API under contract | API key, not a login |

### 2.2 Internal

Grouped by the panel they'd live in, which is how I'd build them.

**Editorial (`/desk`)** — Editor-in-Chief · Output/Desk editor · Senior sub-editor ·
Staff reporter · Stringer · Bureau chief · Photo-video editor · Fact-checker ·
Translator · Social media manager · SEO analyst · Live-blog operator

**Business (`/business`)** — Ad sales manager · Ad ops · Finance · Marketing/growth ·
Syndication manager

**Governance (`/admin`)** — System admin · Grievance Officer / DPO · Auditor (read-only,
for legal or an external reviewer)

---

## 3. Role model — permissions, not job titles

Job titles change; permissions shouldn't. Model it as **role = a bundle of permissions +
a scope**, and let a person hold more than one role (a bureau chief is also a reporter).

### 3.1 Scopes

This is the part generic CMS roles get wrong, and the part a state-and-district portal
lives or dies on.

| Scope | Meaning | Example |
|---|---|---|
| `global` | Everything | Editor-in-Chief |
| `desk:<category>` | One section | खेल desk editor can't publish in देश |
| `state:<slug>` | One state | Bihar bureau chief |
| `district:<slug>` | One district | A Gaya stringer files only Gaya |
| `own` | Only their own records | Reporter's drafts, own analytics |

A permission check is always **permission + scope + ownership**, evaluated on the
server for every request (global security rule: never trust the client for `user_id`,
`status`, `state` or `category`).

### 3.2 Permission matrix (abridged — the full list belongs in the CMS migration)

✓ = allowed · ◐ = allowed within scope · ✗ = denied · ⚠ = allowed but audited and alerted

| Permission | Reporter | Stringer | Sub-editor | Desk editor | Bureau chief | Editor-in-Chief | Social | SEO | Ad sales | Ad ops | Finance | Admin | Grievance |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| story.create | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| story.edit.own | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| story.edit.any | ✗ | ✗ | ◐ desk | ✓ | ◐ state | ✓ | ✗ | ◐ meta only | ✗ | ✗ | ✗ | ✗ | ✗ |
| story.publish | ✗ | ✗ | ◐ desk | ✓ | ◐ state | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| story.breaking | ✗ | ✗ | ✗ | ⚠ ✓ | ⚠ ◐ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| story.unpublish / spike | ✗ | ✗ | ✗ | ◐ desk | ◐ state | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ⚠ ✓ legal hold |
| story.delete | ✗ | ✗ | ✗ | ✗ | ✗ | ⚠ ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| correction.add | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| home.curate | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| ticker.manage | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| live.manage | ✗ | ✗ | ◐ | ✓ | ◐ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| media.upload | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| media.delete | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ⚠ ✓ | ✗ |
| seo.meta.edit | ◐ own | ✗ | ✓ | ✓ | ◐ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| redirect.manage | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ |
| push.send | ✗ | ✗ | ✗ | ⚠ ✓ | ✗ | ✓ | ⚠ ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| newsletter.send | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| social.post | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| analytics.view.own | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| analytics.view.all | ✗ | ✗ | ✗ | ✓ | ◐ state | ✓ | ✓ | ✓ | ◐ own camps | ✓ | ✗ | ✓ | ✗ |
| ads.campaign.manage | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| ads.creative.approve | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| finance.view | ✗ | ✗ | ✗ | ✗ | ◐ budget | ✓ | ✗ | ✗ | ◐ own | ✗ | ✓ | ✗ | ✗ |
| payout.approve | ✗ | ✗ | ✗ | ✗ | ◐ recommend | ⚠ ✓ | ✗ | ✗ | ✗ | ✗ | ⚠ ✓ | ✗ | ✗ |
| user.manage / role.manage | ✗ | ✗ | ✗ | ✗ | ◐ stringers | ⚠ ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ⚠ ✓ | ✗ |
| settings.manage | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ⚠ ✓ | ✗ |
| grievance.handle | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| consent.ledger.view | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| reader.pii.view | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ⚠ ✓ break-glass | ✓ |
| audit.view | ✗ | ✗ | ✗ | ◐ own desk | ◐ state | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |

**Three lines I would not cross, whatever anyone asks:**

1. **Ad sales can never touch a story.** Sponsored content enters through the desk with a
   forced "प्रायोजित" label that the editor cannot remove. Enforced server-side.
2. **Nobody edits the consent ledger or the audit log.** Append-only, including for the
   Admin (global database rule).
3. **No shared logins.** The Editor's name is on the masthead under the IT Rules; "who
   published this" has to be one human. MFA mandatory for every role above reporter.

### 3.3 Personal-data access (DPDP least privilege)

Who may see reader personal data at all — this is separate from content permissions and
is asked about in every audit.

| Data | Who can see it | Who can export it |
|---|---|---|
| Newsletter emails | Grievance Officer, Marketing (counts only) | Grievance Officer, with a logged reason |
| Push tokens | Nobody in the UI (counts only) | Nobody |
| Consent ledger rows | Grievance Officer / DPO | Grievance Officer |
| Grievance & rights requests | Grievance Officer (+ Editor for content complaints) | Grievance Officer |
| Reader account details (P2) | Grievance Officer; Admin only via break-glass, alerted | Grievance Officer |
| Stringer bank/PAN details | Finance only | Finance |
| Staff HR data | **Not in this system** — §10 |

---

## 4. Workflow — the states a story actually moves through

PRD §7.2 lists Draft → In review → Published → Updated + Unpublished/Scheduled. Running a
real desk needs five more:

```
Idea/Assigned ──> Draft ──> Filed (stringer) ──> In review ──┬──> Scheduled ──> Published ──> Updated
                    ^                                        │
                    └──────── Needs rewrite ◄────────────────┤
                                                             ├──> Spiked (killed, kept for audit)
                                                             └──> Legal hold (only Grievance/Editor releases)
                                                                        Published ──> Unpublished ──> Archived
```

| State | Who moves it in | Why it exists |
|---|---|---|
| **Assigned** | Desk, Bureau chief | So a reporter's dashboard has a queue at 9 a.m. instead of a blank page |
| **Filed** | Stringer | Distinct from Draft: a filing starts a payment claim and an SLA clock |
| **Needs rewrite** | Sub-editor, Desk | Returned **with a note** — the note is mandatory; "returned silently" is why stringers stop filing |
| **Spiked** | Desk, Editor | Newsroom reality: stories get killed. Never deleted — kept for the audit trail and the payment decision |
| **Legal hold** | Grievance Officer, Editor | A takedown notice or a defamation claim freezes edits and unpublishes within one click |

### 4.1 The speed/accuracy trade-off, made explicit

Breaking news must publish in under 60 seconds (PRD FR-G2) *and* be accountable:

- Desk editor publishes breaking with headline + one paragraph + category.
- The story is flagged `post_review_pending` and the clock starts.
- **Unreviewed after 15 minutes** → appears on the Editor-in-Chief's "needs my decision"
  queue. **After 30 minutes** → push alert to the Editor.
- Two desk editors cannot publish breaking on the same slug within 2 minutes (duplicate
  guard; three stringers filing the same accident is routine).

### 4.2 Four automations worth more than any dashboard chart

| Automation | Who it saves | Why it matters |
|---|---|---|
| **Coverage-gap alert** — "आज इन ज़िलों से कोई ख़बर नहीं आई" by 11 a.m. | Bureau chief | The single most useful screen in a district operation |
| **Similar-story warning** at filing time (title + body similarity within 24h, same district) | Desk | Stops the same accident being published three times |
| **Refresh queue** — published stories whose Search impressions fell >40% in 14 days | SEO, Desk | In Hindi search, evergreen pages (नौकरी, रिज़ल्ट, राशिफल) earn more than new ones |
| **Publish-check gate** — missing alt text, missing image credit, duplicate headline, body < 80 words | Everyone | Compliance and quality, enforced once instead of argued daily |

---

## 5. Build architecture — how many panels, really

**Recommendation: one admin app, three spaces, role-gated.**

```
/desk       editorial    — the newsroom lives here all day
/business   ads, finance, syndication
/admin      users, settings, integrations, compliance, audit
```

Payload (PRD §7) stays as the **content model + API + media library** under
`/admin/cms`. But the editorial dashboards are **custom Next.js routes** reading the same
database through the same `lib/cms` interface the reader site uses.

Why not use Payload's generic admin for everything:

- A generic list/edit UI cannot do "breaking in 60 seconds", the home curation board, or a
  coverage-gap map. Those are the screens that decide whether the newsroom adopts the tool.
- Business and compliance dashboards aggregate across ads, payouts and consent — they are
  not CRUD on a collection.

Keep Payload for what it is good at (schema, access control, revisions, media), and own
the six screens people use hourly.

**Mobile:** `/desk` must be fully usable on a ₹10k Android phone on 4G. Stringers file
from the field; reporters approve from a bike. Responsive web (PWA) first; a Flutter app
only once filing volume justifies it.

---

## 6. What every panel gets, regardless of role

| Feature | Why |
|---|---|
| Hindi UI, Latin numerals | Same rule as the reader site (PRD §10.5) |
| **One work queue + ≤5 tiles + one primary button** | The anti-bloat rule |
| Global search (⌘K): story, person, tag, district | Desk editors live in it |
| Notification bell + optional push, per role (§9) | Breaking, approvals, grievances, failures |
| "My shift" header: who else is on duty now, handover note | 24×7 desk reality |
| Audit footprint on every object: who, what, when, before/after | PRD §7.1; legal defence |
| MFA, 12-hour session, no shared logins, device list | Global security rule |
| Offline-tolerant composer (autosave every 10s, local draft) | Patchy 4G in districts |
| "Report a problem" that files a ticket with the current screen state | Adoption |

---

## 7. Dashboard specifications

Each spec: **who**, **the one question it answers**, the **primary action**, the **work
queue**, the **tiles**, and the **alerts**.

### 7.1 Owner / Publisher — "क्या कारोबार ठीक चल रहा है?"

Read-mostly, phone-first, 60 seconds a day.

- **Tiles:** today's readers vs same day last week · ad revenue MTD vs target · fill rate
  & RPM · cash position: receivables ageing + payouts due · audience growth (push +
  newsletter subs, 7-day returning %)
- **Panels:** top 10 stories by **revenue**, not views (a 2-lakh-view story on a 300×250
  can earn less than a 20k-view business story) · traffic by source (Discover / Search /
  WhatsApp / Direct) with the Discover dependency called out · cost per published story
  by desk · state-wise reader split against where the stringer budget goes
- **Alerts:** traffic down >30% day-on-day · Google News/Discover drop · revenue pacing
  below plan · any legal notice or takedown received · a 🔴 compliance item open >7 days
- **Deliberately absent:** editing tools. An owner who edits copy at 11 p.m. is a
  governance risk and an audit problem.

### 7.2 Editor-in-Chief — "अभी क्या हो रहा है और मुझे क्या तय करना है?"

- **Primary action:** "ब्रेकिंग चलाएं"
- **Queue: "मेरे फ़ैसले का इंतज़ार"** — unreviewed breaking >15 min · stories escalated by
  the desk · legal holds · corrections awaiting approval · sponsored content awaiting
  editorial sign-off
- **Panels:** live newsroom board (writing / in review / scheduled next 2h / live blogs
  running) · today's diary (assignments by desk and state) · duty roster + handover notes ·
  top 10 live right now with real-time readers · corrections log this week · complaint
  summary from the Grievance Officer
- **Tiles:** published today vs plan · average file→publish time · breaking count & median
  publish time · stories spiked · corrections issued (a rising number is the quality signal)
- **Alerts:** anything with a legal flag · a story live >30 min without review · a desk
  with zero output in 3 hours

### 7.3 Output / Desk editor — the busiest screen in the company

- **Primary action:** "ब्रेकिंग" (one-minute composer: headline, one paragraph, category,
  optional image → publish + ticker)
- **Queue: "समीक्षा के लिए"** — submitted stories, oldest first, with an SLA timer, the
  filer's name, the district, and a similarity warning badge
- **Panels:** **home curation board** (drag into hero / 2 secondary / top-news 1–5 / each
  category lead, with pin-expiry timers — mirrors DESIGN §5) · ticker manager · trending
  tags · live blog console · scheduled queue for the next 6 hours · "अभी क्या पढ़ा जा रहा
  है" real-time top 20 with 5-minute trend arrows
- **Tiles:** pending review count · oldest item's age · published this shift · ticker items
  live · homepage slots expiring in 30 min
- **Alerts:** story waiting >20 min · duplicate detected · publish-check failure · live
  blog with no update for 20 minutes
- **Shift handover:** ending a shift forces a short note — running stories, what to watch,
  embargoes — shown at the top of the next shift's dashboard.

### 7.4 Senior sub-editor

A narrowed desk dashboard: copy queue for their desk, headline/SEO-title helper with
character counters, image-and-credit check, no home curation, no ticker.

### 7.5 Staff reporter — "मुझे आज क्या करना है और मेरी ख़बर कैसी चली?"

- **Primary action:** "नई ख़बर लिखें"
- **Queue: "मेरे असाइनमेंट"** — with deadline and the assigning editor
- **Panels:** my drafts · returned with notes (**the note is always visible, never a bare
  rejection**) · my published stories with views, average read time, shares, and
  Search/Discover share · my beat's alerts (tags I follow, district filings) · monthly
  scorecard: stories, views, corrections against my byline
- **Tiles:** assignments due today · drafts · returned · published this month · my best
  story this week
- Reporters see **their own** numbers; comparative leaderboards across reporters are a
  morale trap, so they are visible to editors only.

### 7.6 Stringer / district correspondent — the module that keeps the network alive

Everything here is phone-first and tolerant of a dropped connection.

- **Primary action:** "ख़बर भेजें" (headline + 150 words + photo from camera + district,
  autosaves locally, uploads when signal returns)
- **Queue: "मेरी भेजी ख़बरें"** with an unambiguous status: भेजी गई → स्वीकृत → प्रकाशित,
  or लौटाई गई (with the reason) / रद्द
- **Panels:** **"इस महीने की कमाई"** — accepted stories × rate, payment status
  (अनुमोदित / भुगतान हुआ / लंबित), last payment date and UTR · payment history with
  downloadable monthly statement · my district's published stories · documents (contract,
  PAN, bank, ID) with expiry reminders
- **Tiles:** filed this month · accepted · acceptance rate · earnings this month · last payment
- **Alerts:** story returned · payment released · assignment for my district
- **Owner's note:** acceptance rate and payment date are the two numbers that determine
  whether a stringer files for you or for the competition next month. They must be on the
  first screen, not three clicks deep.

### 7.7 Bureau chief — "मेरे राज्य में कहाँ से ख़बर नहीं आ रही?"

- **Primary action:** "असाइनमेंट दें"
- **Queue:** approvals for their state (stringer filings), scoped — cannot touch another state
- **Panels:** **coverage map/list by district**: filed today / filed this week / silent —
  silent districts at the top · stringer roster with activity and acceptance rate ·
  state traffic and top stories · **budget**: month's stringer spend vs allocation,
  payouts recommended · local competitor watch (manual link board is enough in v1)
- **Tiles:** districts silent today · filings pending review · published from my state ·
  budget used % · stringers inactive 14+ days
- **Alerts:** a district silent for 48 hours · a stringer's acceptance rate below 40%
  (they need coaching or removal) · budget at 80%

### 7.8 Photo / video desk

- **Queue:** incoming media awaiting QC
- **Panels:** missing alt text (Hindi) / missing credit / missing licence · AI-illustration
  flags needing the forced caption (GRAPHICS_PROMPTS §0) · video publish pipeline with
  YouTube status, thumbnail and duration · licence expiry calendar for agency images
- **Tiles:** media pending QC · items missing alt text · videos in pipeline · licences
  expiring in 30 days

### 7.9 Social media manager

- **Primary action:** "पोस्ट शेड्यूल करें"
- **Panels:** scheduled posts calendar per platform · suggested stories to push (rising
  but under-shared) · auto-generated share cards from the story's OG template · **push
  composer** with the rate cap visible (max 1 per 30 min, editor override for breaking)
  and audience selector (all / state / topic) · WhatsApp channel queue · UTM builder
- **Tiles:** posts today · push sent / delivered / CTR · top shared story · push opt-in
  growth · unsubscribe spike warning
- **Guardrail:** push and newsletter sends are **always** logged to the audit trail with
  the sender's name. A mis-sent push to 2 lakh devices is a reputational event.

### 7.10 SEO / traffic analyst

- **Panels:** Search Console: impressions, clicks, position by section and by story ·
  **Discover** performance separately (it behaves nothing like Search) · the **refresh
  queue** (§4.2) · keyword gaps vs competitors · Core Web Vitals per template with the
  worst offenders · 404s and redirect manager · schema/rich-result errors · news sitemap
  and indexation status · cannibalisation pairs (two of our stories competing)
- **Tiles:** clicks 7d vs previous · Discover share · indexed vs submitted · CWV pass rate
  · stories needing a refresh
- **Permissions:** can edit SEO meta and redirects; **cannot** edit the body or publish.

### 7.11 Live blog operator

A focused console, not a dashboard: post an update (time auto, title, body, media), pin,
edit, delete, set live/ended, key-events editor, and a reader-count ticker so they know
whether the event is still worth staffing.

### 7.12 Ad sales manager

- **Primary action:** "नया प्रस्ताव बनाएं"
- **Queue:** proposals awaiting client response, with follow-up dates
- **Panels:** pipeline by stage with value · **inventory availability calendar** (which
  slots are sold for which dates — the question sales asks ten times a day) · live campaigns
  with delivery vs booked · invoices raised / paid / overdue · my commission
- **Tiles:** booked MTD vs target · pipeline value · overdue receivables · campaigns ending
  this week · fill rate on my slots
- **Hard boundary:** no access to story editing, ever (§3.2).

### 7.13 Ad ops

- **Queue:** creatives awaiting QC (size, weight, no auto-play audio, no malware redirect,
  **no fake "breaking news" creatives** — a real revenue-vs-trust decision)
- **Panels:** slot inventory map matching the reader site's placements · campaign scheduler
  · delivery pacing (under/over) · house-ad fallback coverage · **performance impact**:
  CLS and LCP per slot, so an ad that breaks Core Web Vitals is caught by us and not by
  Google · consent-gated serving split (personalised vs non-personalised)
- **Tiles:** creatives pending · campaigns under-pacing · fill rate · CLS attributable to ads
  · blocked creatives this week

### 7.14 Finance

- **Primary action:** "भुगतान रन शुरू करें" (monthly stringer payout)
- **Queue:** payouts awaiting approval, grouped by state with the bureau chief's recommendation
- **Panels:** revenue by source (direct, programmatic, sponsored) · receivables ageing
  30/60/90 · stringer payout run with per-person statements, TDS and bank details ·
  expense claims · GST/TDS summary export for the accountant
- **Tiles:** collected MTD · outstanding >60 days · payouts due this week · average cost
  per published story
- **Controls:** payouts need two approvals above a threshold; bank-detail changes trigger a
  24–72 hour hold and a notification (global security rule on payout fraud).

### 7.15 Advertiser portal (external, small)

Their campaigns only: live delivery (impressions, clicks, CTR), creative upload for QC,
invoices and receipts, and a support contact. Strictly scoped to their own account — the
classic IDOR target, so every object check is ownership-checked server-side.

### 7.16 Guest author / contributor portal (external, small)

Submit an article, see its status, see published pieces and their numbers, maintain bio and
photo for the author page. No access to anyone else's content, no media library browsing.

### 7.17 Admin / Tech

- **Panels:** users, roles and scopes (with MFA status per user — chase the blanks) ·
  failed logins and suspicious IPs · API keys and syndication partners · **feature flags**
  (fail-closed, with a kill switch per integration) · integration health: weather, AQI,
  market, cricket, search, push, email, with last-success times · cache/revalidation status
  · error rate and deploy history · **backup verified-restore date** (not "backup ran" —
  "restore tested") · retention/deletion job status · audit log search
- **Tiles:** users without MFA · failed logins 24h · integrations down · error rate ·
  days since the last tested restore
- **Break-glass:** viewing reader personal data requires a stated reason, is time-boxed,
  and alerts the Grievance Officer.

### 7.18 Grievance Officer / DPO — legally the most important panel

- **Queue:** open grievances and DPDP rights requests with **SLA timers** (48-hour
  acknowledgement, 30-day resolution) going amber then red
- **Panels:** requests by type (access / correction / erasure / nomination / withdrawal /
  content complaint) · consent ledger statistics and lookup by visitor or account ·
  corrections log and the public corrections page · takedown and legal notices with the
  legal-hold switch · notice version history (which text was live on which date — this is
  what proves what a reader agreed to) · processor register · breach runbook with the
  72-hour clock · retention job evidence
- **Tiles:** open requests · breaching SLA today · average resolution time · consents
  withdrawn this month · corrections published
- This panel exists in v1. Not having it is not a gap, it is non-compliance.

---

## 8. Cross-cutting requirements the dashboards imply

### 8.1 Data model additions beyond PRD §11

`Assignment` · `StringerProfile` (district, rate card, documents, bank — encrypted) ·
`Filing` (links story → stringer → payment claim) · `PayoutRun`, `PayoutLine` ·
`Advertiser`, `Campaign`, `Creative`, `Invoice` · `Shift`, `HandoverNote` ·
`EditorialNote` (the returned-with-reason note) · `LegalHold` · `StoryMetricDaily`
(views, read time, source — so dashboards don't hammer the analytics API) ·
`SearchMetricDaily` · `Notification`, `NotificationPreference` · `AuditLog` (exists in
PRD, now used by every panel) · `Role`, `Permission`, `RoleScope`.

### 8.2 Analytics ingestion

Dashboards read from **our own aggregated tables**, refreshed every 5–15 minutes from GA4
/ the server-side counter, never live from a third-party API per page load. Otherwise the
dashboard is slow, rate-limited and down whenever the vendor is.

### 8.3 Security posture for the panels (global rule)

Every admin route authenticated and role-checked server-side · MFA mandatory above reporter
· every client-sent ID checked for ownership **and** for belonging to the other IDs in the
request · admin panels `noindex` and behind rate limits · no admin route map in page props
· destructive actions (delete, payout, role change, push send) need confirmation + audit +
alert · session 12h, device list, revoke-all on role change.

### 8.4 Compliance hooks (global DPDP rule)

Staff and stringers are **data principals too**: their notice, consent and rights apply to
their own records. Any new field that collects personal data (a stringer's Aadhaar, a
reader's address) updates the Privacy Notice, the purposes and the ledger **in the same
change** — that rule applies to the admin side exactly as it does to the reader site.

### 8.5 Notifications by role

| Event | Goes to |
|---|---|
| Breaking published | Editor, Desk, Social |
| Story waiting >20 min | Desk on duty |
| Breaking unreviewed >30 min | Editor-in-Chief |
| District silent 48h | Bureau chief |
| Grievance received | Grievance Officer (+ Editor if content) |
| Rights request SLA at 50% | Grievance Officer |
| Payment released | The stringer |
| Creative rejected | Ad ops, Ad sales |
| Integration down / error spike | Admin |
| Traffic −30% or Discover drop | Owner, SEO |

### 8.6 Shift model

Desk roles have shifts (morning 6–2, afternoon 2–10, night 10–6). The system needs a duty
roster, a "who is on now" header, and a forced handover note. Without it, 11 p.m. breaking
news has no owner.

---

## 9. Phasing — what I'd actually build, in order

| Phase | Panels | Why this order |
|---|---|---|
| **P1 — launch (M7)** | Desk editor · Reporter · **Stringer** · Bureau chief · Admin · **Grievance/DPO** · Editor-in-Chief (light) | Nothing publishes without the first four; the last two are legal; the Editor's full cockpit can wait a month |
| **P2 — month 2–4** | Social · SEO · Photo/video · Live blog console · Editor-in-Chief (full) · Finance (payout run) | These make the operation efficient rather than possible |
| **P3 — month 4–8** | Ad sales · Ad ops · Owner cockpit · Advertiser portal · Guest author portal | Monetisation matures after traffic; the owner cockpit needs 3 months of data to be meaningful |
| **P4 — later** | Syndication · Citizen contributions · Subscriptions · Comments moderation | Each adds an abuse surface; none is needed to prove the business |

**Rough build sizing** (team of two, for planning only): P1 ≈ 6–8 weeks on top of the CMS
collections; P2 ≈ 4–5 weeks; P3 ≈ 5–6 weeks.

---

## 10. What I would deliberately **not** build

| Not building | Use instead | Why |
|---|---|---|
| HR, payroll, attendance, leave | Zoho People / Keka | Not a differentiator; carries employee personal data we'd then have to protect |
| A full CRM for ad sales | Zoho/HubSpot free tier, synced | A news CMS that also tries to be a CRM does both badly |
| Our own analytics engine | GA4/Plausible + our aggregation tables | Months of work to be worse |
| Comment moderation (v1) | Not having comments | PRD already excludes it; it is a 24×7 moderation job and a legal surface |
| A separate mobile app for stringers (v1) | Responsive PWA | Ship filing in 2 weeks, not 2 months; build the app once volume proves it |
| Per-reporter public leaderboards | Private scorecards | Rewards volume over accuracy — the opposite of what a news brand needs |
| 17 dashboards | 7 (§9) | Unused dashboards rot and then nobody trusts the numbers |

---

## 11. Risks worth naming now

| Risk | Mitigation |
|---|---|
| Newsroom rejects the tool and goes back to WhatsApp | Build the desk and stringer screens *with* two real desk editors in the room; measure file→publish time weekly |
| Stringer payments slip → network collapses | Payment run is a P1 feature with a fixed monthly date and a visible status on the stringer's phone |
| Ad sales pressure to edit or re-label stories | Permission boundary in code, not in policy; label removal is impossible, not discouraged |
| A single Editor account shared by the desk | MFA + device list + per-user audit; publishing with a shared account is a disciplinary matter, and the system makes it visible |
| Dashboard numbers disagree with GA4 | One aggregation pipeline, one definition of "view", documented; every tile links to its source |
| Panel becomes an attack surface (it holds money + personal data) | Admin routes noindexed, MFA, break-glass PII access, full audit, pentest of payout and role-change flows before launch |

---

## 12. Decisions only the owner can make

1. **Launch states and districts** — this sets the stringer count, the bureau structure and
   the coverage-gap thresholds.
2. **Stringer commercial model** — per story, per accepted story, or monthly retainer +
   incentive? The payout module is built differently for each.
3. **Who is the named Grievance Officer**, and does the Editor-in-Chief hold it or legal?
4. **24×7 or 6 a.m.–midnight** at launch — decides the shift model and the desk headcount.
5. **Is sponsored content sold in v1?** If yes, the labelled workflow and the ad-ops QC
   move from P3 to P1.
6. **Payout approval threshold** and who the second approver is.
7. **Buy or build for CRM/HR** (§10) — confirm the "buy" recommendation.
8. **Citizen contributions ("आपकी ख़बर")** — yes/no. It is a large moderation and legal
   commitment, and I would say no for the first year.
