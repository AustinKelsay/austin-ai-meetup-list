# Austin AI Club Meetup List

This context describes the language for curating Austin AI Club meetups, topic boards, reminders, and the durable public archive.

## Language

**Austin AI Club**:
The community gathering this website archives and supports.

**Member**:
A person in or near the Austin AI Club community.

**Meetup**:
A dated Austin AI Club gathering with a topic board, optional reminder metadata, and an archive page.
_Avoid_: Session

**Meetup Slot**:
A tentative calendar placeholder for a likely Austin AI Club gathering.
_Avoid_: Meetup

**Event Metadata**:
The time, location, calendar, and reminder details for a Meetup.

**Topic Board**:
The curated set of Tracks, Topics, Community Slot, and Showcases for a Meetup.

**Track**:
A stable high-level discussion category used to group meetup topics.
_Avoid_: Section, bucket

**Topic**:
A single discussion item on a meetup board, backed by one or more Links.
_Avoid_: Story, item, link

**Discussion Fit**:
The editorial standard for whether an AI item belongs on the meetup board.
_Avoid_: Interestingness

**Major AI Story**:
An AI story with enough industry or cultural gravity that Austin AI Club would naturally discuss it.

**Open Source Lens**:
An editorial lens for favoring topics with inspectable code, open weights, reproducible artifacts, or open ecosystem impact.
_Avoid_: Track

**Privacy Lens**:
An editorial lens for favoring topics that affect user data control, local-first workflows, surveillance risk, or privacy-preserving AI systems.
_Avoid_: Track

**Security Lens**:
An editorial lens for evaluating how topics affect attack surfaces, misuse paths, defensive practice, operational risk, or trust boundaries.

**Link**:
A source URL that supports a Topic or is submitted for possible curation into a Topic.
_Avoid_: Topic

**Submission**:
An incoming Link or Showcase contribution that is immediately associated with a target Meetup.
_Avoid_: Suggestion, proposal

**Curation**:
The organizer workflow of choosing, grouping, wording, and placing material on a Meetup board.

**Markdown Archive**:
The durable source of record for authored Meetup notes.
_Avoid_: Data source

**LLM Wiki**:
The public, interlinked Markdown knowledge layer that organizes the Markdown Archive into reusable pages for Meetups, entities, concepts, comparisons, source link records, and durable queries.
_Avoid_: Frontend data source

**Wiki Explorer**:
The public website surface for browsing the LLM Wiki through metadata, excerpts, wikilinks, backlinks, tags, and graph navigation.
_Avoid_: Markdown renderer

**Meetup Data**:
The structured rendering model for a whole Meetup, curated from the Markdown Archive for the website and Presentation Mode.
_Avoid_: Archive of record

**Presentation Mode**:
A public slide-by-slide surface for presenting Meetup Data during or after a Meetup.

**Reminder**:
A subscriber email sent for an actual planned Meetup.
_Avoid_: Meetup Slot reminder

**Presenter Notes**:
Public host-facing notes that add extra context for presenting a Topic or Showcase.
_Avoid_: Private notes

**Community Slot**:
The end-of-meetup area reserved for short member-led shares.
_Avoid_: Track

**Showcase**:
A short member-led share proposed for the Community Slot.
_Avoid_: Talk, presentation

**Local Builds & Projects**:
The track for Austin/member/community-orbit projects, demos, prototypes, launches, and things people can run or inspect directly.
_Avoid_: SHIPPED

**Agent Infrastructure**:
The track for agent runtimes, protocols, interfaces, orchestration layers, tool-calling systems, and deployment plumbing.

**Models & Research**:
The track for model releases, benchmark shifts, papers, architecture updates, and capability comparisons.

**Security**:
The track for attacks, abuse patterns, red-team findings, prompt injection, defensive work, and security-relevant failures.

**Big Tech Moves**:
The track for major company moves, hardware launches, ecosystem shifts, acquisitions, platform bets, product strategy, and policy or infrastructure changes that shape AI development.

## Relationships

- A **Meetup** has one **Topic Board**.
- A **Topic Board** has zero or more **Tracks**.
- A **Topic Board** has one **Community Slot**.
- The **Community Slot** appears after all **Tracks**.
- A **Meetup** can have optional **Event Metadata**.
- **Austin AI Club** has recurring **Meetups**.
- **Austin AI Club** tries to meet biweekly.
- **Meetup Slots** follow the biweekly planning cadence by default.
- A **Meetup Slot** can have template **Event Metadata** for calendar display.
- A **Meetup Slot** does not have a **Topic Board**.
- A **Meetup Slot** can be replaced by a hand-authored **Meetup**.
- A **Meetup** is recorded in the **Markdown Archive**.
- The **LLM Wiki** organizes the **Markdown Archive** without replacing it.
- The **LLM Wiki** lives in public Markdown files and is safe to publish in GitHub.
- The **Wiki Explorer** browses the **LLM Wiki** without replacing the Markdown files.
- The **Wiki Explorer** uses a generated manifest as its frontend read model.
- The **Wiki Explorer** does not render full Markdown pages in v1.
- **Meetup Data** is curated from the **Markdown Archive**.
- **Meetup Data** is not generated from the **LLM Wiki** in v1.
- **Presentation Mode** renders **Meetup Data**.
- A **Track** has zero or more **Topics**.
- A **Topic** belongs to exactly one **Track**.
- A **Topic** has one or more **Links**.
- A **Topic** can have **Presenter Notes**.
- A **Topic** must have **Discussion Fit** for Austin AI Club.
- A **Major AI Story** has **Discussion Fit** even when its builder angle is not yet obvious.
- The **Open Source Lens** shapes **Discussion Fit** but is not a **Track**.
- The **Privacy Lens** shapes **Discussion Fit** but is not a **Track**.
- The **Security Lens** shapes **Discussion Fit** across **Tracks**.
- **Security** is both a standard **Track** and a **Security Lens**.
- A **Showcase** can have **Presenter Notes**.
- A **Submission** belongs to exactly one target **Meetup**.
- A new **Submission** always targets the next upcoming **Meetup** or **Meetup Slot**.
- A **Submission** requires a title.
- A **Submission** can become a **Topic** or **Showcase** through **Curation**.
- **Curation** can rewrite, combine, reframe, order, or move submitted material.
- **Curation** orders **Tracks** and **Topics** by intended discussion flow.
- **Curation** orders **Showcases** by organizer or in-room choice.
- **Reminders** are sent only for actual planned **Meetups**, not tentative **Meetup Slots**.
- A **Topic Board** has one **Community Slot** after its standard **Tracks**.
- A **Community Slot** has zero or more **Showcases**.
- An empty **Community Slot** appears only for the next upcoming **Meetup**.
- An empty **Community Slot** is omitted from past **Meetups**.
- A **Showcase** can have zero or more **Links**.
- **Local Builds & Projects**, **Agent Infrastructure**, **Models & Research**, **Security**, and **Big Tech Moves** are the standard recurring **Tracks**.
- Standard **Tracks** use their standard order by default: **Local Builds & Projects**, **Agent Infrastructure**, **Models & Research**, **Security**, **Big Tech Moves**.
- Empty standard **Tracks** are omitted from an authored **Meetup**.

## Example dialogue

> **Dev:** "A member launched a small Codex workflow this week. Should that go in SHIPPED?"
> **Domain expert:** "No — put it in **Local Builds & Projects** and say in the **Topic** description that it shipped."
>
> **Dev:** "A non-local open-source repo is runnable and interesting. Does it go in **Local Builds & Projects**?"
> **Domain expert:** "No — use **Local Builds & Projects** for Austin/member/community-orbit work, and place outside projects by their main discussion angle."
>
> **Dev:** "The calendar shows a generated date two weeks out. Is that already a **Meetup**?"
> **Domain expert:** "No — that is a **Meetup Slot** until we hand-author the board. We try to stay biweekly, but can override slots when the real date shifts."
>
> **Dev:** "If a generated **Meetup Slot** has time and location details, is it confirmed?"
> **Domain expert:** "No — **Meetup Slots** can use template **Event Metadata** for calendar display without becoming planned **Meetups**."
>
> **Dev:** "Can a **Meetup Slot** have a **Topic Board**?"
> **Domain expert:** "No — once there is a **Topic Board**, it is a **Meetup**, not just a **Meetup Slot**."
>
> **Dev:** "Is a board without time and location metadata still a **Meetup**?"
> **Domain expert:** "Yes — **Event Metadata** is optional. A **Meetup** can still exist as an archived topic board."
>
> **Dev:** "Is the **Meetup** the same thing as the board?"
> **Domain expert:** "No — the **Meetup** is the gathering, and the **Topic Board** is the curated artifact for that gathering."
>
> **Dev:** "The Markdown notes and structured data disagree. Which one should I trust?"
> **Domain expert:** "Trust the **Markdown Archive** as the durable record, then update the **Meetup Data** to render the intended board."
>
> **Dev:** "Now that the archive is an **LLM Wiki**, should the frontend parse those wiki pages directly?"
> **Domain expert:** "No — the **LLM Wiki** helps humans and agents preserve knowledge, but **Meetup Data** remains the explicit frontend rendering contract."
>
> **Dev:** "Are **Presenter Notes** private?"
> **Domain expert:** "No — they are public notes to self that add context for presenting a **Topic** or **Showcase**."
>
> **Dev:** "Should the member demo at the end be another **Track**?"
> **Domain expert:** "No — that belongs in the **Community Slot** as a **Showcase** after the **Tracks**."
>
> **Dev:** "Should we show an empty **Security** track when there are no security topics this week?"
> **Domain expert:** "No — omit empty standard **Tracks** from the authored **Meetup**."
>
> **Dev:** "Should a past **Meetup** show an empty **Community Slot**?"
> **Domain expert:** "No — only the next upcoming **Meetup** should show an empty **Community Slot** as an open-slot call to action."
>
> **Dev:** "Does any interesting AI news qualify as a **Topic**?"
> **Domain expert:** "No — a **Topic** should either be an unavoidable major AI story or something important to developers and builders who care about cutting-edge capability, security, privacy, and open source."
>
> **Dev:** "Does a huge AI story need an immediate builder takeaway to belong?"
> **Domain expert:** "No — a **Major AI Story** has **Discussion Fit** because the room will naturally need to talk about it."
>
> **Dev:** "Should open-source items have their own **Track**?"
> **Domain expert:** "No — use the **Open Source Lens** when deciding what belongs, then place the **Topic** in the best existing **Track**."
>
> **Dev:** "Should privacy have its own **Track**?"
> **Domain expert:** "No — use the **Privacy Lens** when deciding what belongs, then place the **Topic** by its discussion angle."
>
> **Dev:** "If a model release has security implications, does it automatically move to the **Security** track?"
> **Domain expert:** "No — **Security** is also a **Security Lens**. Put the **Topic** in **Models & Research** if that is the main discussion angle."
>
> **Dev:** "Does an energy, regulation, or export-control story belong if no major AI company shipped something?"
> **Domain expert:** "Yes — put it in **Big Tech Moves** when it changes the platform, infrastructure, or policy reality builders have to work inside."
>
> **Dev:** "A submitted URL came in through the link form. Is that already a **Topic**?"
> **Domain expert:** "No — it is a **Link** until it gets curated into a **Topic**, and one **Topic** may include many **Links**."
>
> **Dev:** "Does a submitted **Link** wait in a detached review queue?"
> **Domain expert:** "No — it is a **Submission** for the target **Meetup** immediately, then the organizer can curate it into the board."
>
> **Dev:** "Does submitted copy have to appear exactly as written?"
> **Domain expert:** "No — **Curation** can rewrite, combine, reframe, order, or move submitted material to make the board clearer."
>
> **Dev:** "Should **Topics** be sorted like a news feed?"
> **Domain expert:** "No — **Curation** orders **Tracks** and **Topics** by the intended room discussion flow."
>
> **Dev:** "Can I reorder the standard **Tracks**?"
> **Domain expert:** "Use the standard order by default, but change it when the specific **Meetup** flow calls for it."
>
> **Dev:** "Should **Showcases** appear by submission time?"
> **Domain expert:** "No — **Curation** orders **Showcases** by organizer or in-room choice."
>
> **Dev:** "Can someone submit only a URL?"
> **Domain expert:** "No — every **Submission** needs a title so the organizer can see the intended angle quickly."
>
> **Dev:** "Should the submitter pick a date?"
> **Domain expert:** "No — every new **Submission** targets the next upcoming **Meetup** or **Meetup Slot**."
>
> **Dev:** "Should reminder copy point at a generated **Meetup Slot**?"
> **Domain expert:** "No — **Reminders** should only point at an actual planned **Meetup**."
>
> **Dev:** "Can a **Showcase** include a repo, demo URL, and announcement post?"
> **Domain expert:** "Yes — a **Showcase** can have many **Links**, but it can also be ad hoc and spontaneous."

## Flagged ambiguities

- "SHIPPED" was used as a temporary track name for launched work — resolved: launched member work belongs in **Local Builds & Projects**.
- "local builds" was close to meaning any runnable project — resolved: **Local Builds & Projects** is for Austin/member/community-orbit work.
- "session" was used for dated Austin AI Club gatherings — resolved: the canonical term is **Meetup** in docs, data, and UI code.
- "future meetup" was used for generated calendar placeholders — resolved: tentative generated dates are **Meetup Slots** until manually overridden by hand-authored **Meetups**.
- "biweekly" was close to being a hard schedule guarantee — resolved: it is the default planning cadence, and authored **Meetups** can override it.
- "source of truth" was split between Markdown and structured data — resolved: the **Markdown Archive** is the durable record; **Meetup Data** is the curated rendering model.
- "LLM wiki" was close to becoming a new frontend source — resolved: the **LLM Wiki** organizes the **Markdown Archive**, while **Meetup Data** remains the rendering model.
- "notes" was close to being treated as private facilitation material — resolved: **Presenter Notes** are public notes to self.
- "showcase" was close to being treated as a **Track** — resolved: a **Showcase** belongs to the **Community Slot**, which appears after the standard **Tracks**.
- "standard track" was close to meaning every track must appear every time — resolved: empty standard **Tracks** are omitted.
- "empty community slot" was close to appearing on every **Meetup** — resolved: empty **Community Slots** appear only on the next upcoming **Meetup**.
- "interesting AI news" was close to being enough for **Discussion Fit** — resolved: a **Topic** needs either unavoidable AI relevance or builder relevance through the club's cutting-edge, security, privacy, and open-source lens.
- "adversarial" and "cutting-edge" were used descriptively, not as canonical domain terms — resolved: do not add them as separate lenses or Tracks.
- "open source" was close to becoming another **Track** — resolved: the **Open Source Lens** shapes curation across existing **Tracks**.
- "privacy" was close to becoming another **Track** — resolved: the **Privacy Lens** shapes curation across existing **Tracks**.
- "security" was close to being only a **Track** — resolved: **Security** is both a standard **Track** and a **Security Lens**.
- "big tech" was close to excluding policy and infrastructure — resolved: **Big Tech Moves** includes platform-scale policy, regulation, energy, export-control, and infrastructure changes when they shape AI development.
- "link" was close to being treated as another name for **Topic** — resolved: **Links** are source material; **Topics** are curated discussion entries.
- "topic without links" was considered — resolved: every **Topic** requires at least one **Link**.
- "showcase without links" was considered — resolved: **Showcases** do not require **Links** because they can be ad hoc and spontaneous.
- "submission" was close to being treated as pre-acceptance review state — resolved: **Submissions** are associated with their target **Meetup** immediately to keep contribution friction low.
- "target meetup" was close to being user-selectable — resolved: new **Submissions** always target the next upcoming **Meetup** or **Meetup Slot**.
- "reminder target" was close to following generated **Meetup Slots** — resolved: reminders only point at actual planned **Meetups**.
