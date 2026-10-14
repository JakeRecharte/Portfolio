# DESIGN.md — the source of truth for anything the site looks like

Read this before writing or changing any JSX, CSS, or Tailwind class. It is to
styling what `CONTENT.md` is to copy: the rules the design actually holds at,
written down so two sessions building two different sections end up with the
same site.

**Hard rule: do not invent a design value.** Every color, size, radius, and
duration below already exists in the code. If you need one that isn't here,
either reuse the nearest listed value or add it to this doc in the same commit
that introduces it. A one-off `bg-white/[0.06]` next to the eight places that
use `/[0.03]` is how a design system dies.

**Division of labor**

| Doc | Owns |
| --- | --- |
| `DESIGN.md` (this) | how it looks and moves |
| [CONTENT.md](./CONTENT.md) | what it says, and length limits per field |
| [TODO.md](./TODO.md) | what gets built next |

Length limits live in `CONTENT.md` §5 because they are content rules, but they
exist *because* of the type scale in §2 here. Changing a heading size means
re-checking §5.

---

## 1. The one-sentence version

A near-black page with a drifting blue fog GIF behind it; content sits in
translucent glass panels and hairline-divided rows; headings are enormous,
uppercase, and two-tone; one amber accent carries every affordance; everything
fades up once as it enters the viewport.

---

## 2. Tokens

### 2.1 Color

Three CSS custom properties in [globals.css](./src/app/globals.css), exposed to
Tailwind through `@theme inline`:

| Token | Value | Tailwind class | Use |
| --- | --- | --- | --- |
| `--background` | `#000` | `bg-background` | the page canvas, and the fog's backstop |
| `--foreground` | `#ededed` | `text-foreground` | `body` default only |
| `--accent` | `#ffa94d` (amber) | `text-accent`, `border-accent/40`, `bg-accent/10` | **every** affordance |

Everything else is `white` at an alpha. That is deliberate — the fog is the
color in this design, so the UI stays neutral over it.

**Accent discipline.** Amber means "this does something." It is currently used
in exactly six places: the focus ring, `ArrowLink` on every linking row, the
role line under a job row in `Work Experience`, the filled levels of the contribution
graph, the channel icons in `Icon` (contact rows and header pills), and the
outline of a **kind** chip (`border-accent/40` — `CLUB`, `INTERNSHIP`,
`PROJECT`, in both `Work Experience` and the header's "Now" rail). Do not spend it beyond
that list. It no longer marks "happening now" — the header's
badges became kind chips (`CLUB`, `INTERNSHIP`) and are neutral, with
ongoing-ness carried by the period text instead.

The icons are the one entry that is closer to decoration than affordance, and
they are on this list by explicit request. They earn it two ways: every row
that carries one *is* a link, and amber on the left mirrors the amber
`ArrowLink` on the right, so a contact row reads as one amber-bracketed
affordance rather than two unrelated marks.
Never use amber as a background for text — `#ffa94d` on black is a 10:1
foreground, but black-on-amber at small sizes is not the look.

**Never write a raw hex or a named Tailwind palette color** (`amber-400`,
`neutral-800`) in a component. Use `accent` or `white/NN`. Two existing
exceptions are called out in §8.

### 2.2 The opacity ladder

This is the real type hierarchy; weight and size do less work than alpha does.

| Alpha | Role |
| --- | --- |
| `text-white` | headings, row titles, stat values, hover state of a muted link |
| `text-white/80` | emphasized secondary (degree line) |
| `text-white/75` | label on a bordered pill |
| `text-white/65` | lead paragraphs, nav links |
| `text-white/55` | **body copy floor** — bullets, blurbs, tech chips |
| `text-white/45` | stat labels, metadata values, tool category |
| `text-white/40` | mono eyebrow |
| `text-white/35` | dates, captions, graph axis labels |
| `text-white/30` | footer, bullet dots |
| `text-white/20` | the dropped second line of a display heading |

**`/55` is the floor for anything a person reads as a sentence** — `TODO.md` §1
commits to 4.5:1 and `/55` on black is where that lands. `/45` and below are for
labels and numbers only, never prose.

### 2.3 Surfaces and borders

| Element | Classes |
| --- | --- |
| Glass panel (header) | `rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl` |
| Sticky nav bar | `border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl`, `h-16` |
| Nav action pill | `rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm` |
| Modal (`<dialog>`) | `rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl`, backdrop `backdrop:bg-black/70` |
| Tile / small card | `rounded-2xl border border-white/10 bg-white/[0.03]` |
| Pill button | `rounded-lg border border-white/10 bg-white/[0.03]` |
| Chip, content (tech) | `rounded-full border border-white/10 px-2.5 py-0.5` |
| Chip, kind (`CLUB`, `PROJECT`) | `rounded-full border border-accent/40 px-2.5 py-0.5` |
| Hairline rule | `border-white/10`, `divide-white/10` |
| Row hover | `hover:bg-white/[0.03]` |
| Tile/button hover | `hover:border-white/25 hover:bg-white/[0.07]` |

Borders are `white/10` at rest and `white/25` on hover, with one exception: a
kind chip outlines in `border-accent/40` and does not change on hover (it isn't
interactive). Surface fills are
`white/[0.03]` or `white/[0.04]` at rest and `white/[0.07]` on hover. There are
no other values; don't add a sixth.

**Rows beat boxes.** A list of comparable things (work rows, the modals'
channel rows) is a `divide-y divide-white/10` list with a top or `y` border —
not a stack of cards.

**Cards are the exception, and there are exactly two.** The header panel
(`rounded-3xl`), and the **three featured projects** — a `lg:grid-cols-3` grid
of `rounded-2xl` tiles with `gap-4`, each `flex h-full flex-col` so the tech
chips bottom-align on `mt-auto` regardless of blurb length. Below `lg:` they
stack, because three blurbs do not fit across a tablet. That grid is the whole
reason the featured set reads as featured rather than as the top of a list, so
a second *card* grid anywhere else would spend it.

**The checkerboard is a third shape, and it is not a card grid.** The
additional projects
([ProjectBoard](./src/components/ProjectBoard.tsx)) are square tiles three
across, and the distinction that keeps them from competing with the featured
cards is that they have no gap, no radius of their own and no fill of their
own: they are cells of one board, not objects on the page. The recipe:

| Part | Classes |
| --- | --- |
| Board | `grid grid-cols-3 overflow-hidden rounded-2xl border-t border-l border-white/10` |
| Cell | `aspect-square border-r border-b border-white/10` |
| Filled cell | adds `bg-white/[0.04]` when `i % 2 === 0` |
| Open cell | no fill — the fog shows through |
| Cell hover | `hover:bg-white/[0.07]`, border unchanged |

Borders collapse rather than gap: the board draws its own top and left edge and
each cell draws its right and bottom, so every rule is 1px and the open cells
stay genuinely transparent. A `gap` plus per-cell borders would double every
interior rule to 2px and a gap colored by the container would tint the open
cells.

**Three columns is load-bearing.** With an odd column count, `i % 2` alternates
both across a row and between rows, so the checker needs no row arithmetic. An
even column count turns the same code into vertical stripes. The board also
stays three across at every breakpoint — that is the pattern, not a layout
convenience — which is why a tile's `kind` chip is `hidden … lg:inline-block`
and its title steps `text-sm sm:text-base lg:text-lg`: a third of a phone
screen is about 100px and the chip does not fit in it. The dialog carries the
chip at every size instead.

**A board is padded to full.** A half-empty last row reads as a broken grid
rather than a pattern, so `ProjectBoard` appends inert `aria-hidden` cells to
complete it, continuing the checker and carrying nothing else.

**A modal is the nav pill's surface, one step more opaque.** `neutral-950/80`
rather than `/60` because a modal sits over arbitrary content and has to win;
it is the only use of that value. Size is `h-[90dvh] w-[92vw] max-w-6xl` — the
same `max-w-6xl` outer bound as the page shell (§2.6), so a modal never reads
wider than the site. The resume viewer
([ResumeDialog](./src/components/ResumeDialog.tsx)) uses that full size; a modal
that only holds a few rows
([ContactDialog](./src/components/ContactDialog.tsx)) is
`w-[min(92vw,26rem)]` with `p-6 sm:p-8` and sizes to its content instead; the
project detail ([ProjectBoard](./src/components/ProjectBoard.tsx)) is the same
recipe one step wider at `w-[min(92vw,32rem)]`, because it holds a blurb and a
chip row rather than two link rows.

**Chips come in two sizes and two colors of one recipe.** Size: content chips
(tech, and the `kind` label in `Work Experience`) are `px-2.5 py-0.5`; the denser badge in
the header's "Now" rail is `px-2 py-0.5`. Color is what the chip *is*: a **kind
label** (`CLUB`, `INTERNSHIP`, `PROJECT`) outlines `border-accent/40` and adds
`font-mono text-[10px] tracking-wider`; a **content chip** (a tech name) stays
`border-white/10`. All are `rounded-full border` with `text-white/55` — amber
never fills one, only outlines it.

### 2.4 Radius

`rounded-3xl` panel · `rounded-2xl` tile · `rounded-lg` small button ·
`rounded-full` pill and chip · `rounded-[2px]` contribution cell.

### 2.5 Type

Two fonts, both `next/font/google`, wired in [layout.tsx](./src/app/layout.tsx):
**Inter Tight** (`font-sans`, default) and **JetBrains Mono** (`font-mono`).

Mono is not for code. It marks machine-ish facts: dates, periods, badges, and
the eyebrow label. If it's a date or a status, it's mono; otherwise it isn't.

| Role | Classes |
| --- | --- |
| Hero display | `text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.85]` |
| Section display | `text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.85]` |
| Name (`h1`) | `text-3xl font-bold tracking-tight` |
| Stat value | `text-5xl sm:text-6xl font-black tracking-tighter tabular-nums` |
| Row title (`h3`) | `text-xl sm:text-2xl font-bold` |
| Contact row label | `text-lg sm:text-xl font-semibold` |
| Lead paragraph | `text-base sm:text-lg leading-relaxed max-w-xl` |
| Body / bullet | `text-sm leading-relaxed max-w-lg` |
| Metadata | `font-mono text-xs` |
| Eyebrow | `font-mono text-xs tracking-[0.2em] uppercase` |
| Stat label | `text-xs tracking-widest uppercase` |
| Caption / micro | `text-[11px]`, `text-[10px]`, `text-[9px]` |

**Display headings are always two lines**, first `text-white`, second
`text-white/20`, and the pair must read as one phrase
(`FEATURED`/`PROJECTS`).
Use [SectionHeading](./src/components/SectionHeading.tsx) for every section; the
hero is the only hand-rolled one, because it sits one step larger.

Measure is capped deliberately: `max-w-xl` for a lead, `max-w-lg` for body. Full
-width prose across `max-w-6xl` is never correct here.

### 2.6 Spacing rhythm

Page shell, from [page.tsx](./src/app/page.tsx):
`mx-auto w-full max-w-6xl px-5 lg:px-8 pt-12 lg:pt-16 pb-28`.
The nav is `sticky`, not `fixed`, so it occupies its own 64px and the shell's
top padding is the gap *below* it, not clearance for it — it was `pt-24
lg:pt-28` while the nav floated. `max-w-6xl` is the hard outer bound, and the
bar's inner row repeats it so wordmark and content share one left edge.
`scroll-mt-24` on each section still clears the 64px bar on an anchor jump.

| Gap | Value |
| --- | --- |
| Between sections | `space-y-28 lg:space-y-36` |
| Header → first section | `mt-20 lg:mt-28` |
| Section → subsection | `mt-16 lg:mt-20` |
| Display heading → list | `mt-12` |
| Eyebrow → list | `mt-8` |
| Display heading → paragraph | `mt-8` |
| Paragraph → list | `mt-10` |
| Panel padding | `p-6 sm:p-8` |
| List row, major (project, role) | `py-7` |
| Featured card padding | `p-6`, grid `gap-4` |
| List row, link (contact) | `py-5` |
| List row, dense (now) | `py-3.5` |

Breakpoints used: `sm:` (640) and `lg:` (1024), plus `md:` for the header's
two-column split only. Don't reach for `xl:` or `2xl:` — the shell caps before
they matter.

### 2.7 Motion

All scroll animation goes through [Reveal](./src/components/Reveal.tsx). Do not
hand-write a `motion.div` in a section.

- Enter: `opacity 0 → 1`, `y: 24 → 0`, `duration: 0.6`,
  `ease: [0.22, 1, 0.36, 1]`, `viewport: { once: true, margin: "-80px" }`.
- Stagger: `delay={i * 0.06}` for list rows, `i * 0.04` for grid tiles,
  `0.1` / `0.2` for sequential blocks inside one section.
- Hover: `transition` or `transition-colors` (Tailwind default 150ms) for
  color and background; `duration-300` for the arrow's transform.
- `once: true` is not optional. Re-firing reveals on scroll-up reads as noise.

Reduced motion is handled globally in `globals.css` and must not be re-handled
per component. Nothing may be *only* legible mid-animation.

---

## 3. Patterns

**A channel gets its mark.** GitHub, LinkedIn, Email and Resume carry an
[Icon](./src/components/Icon.tsx) in `text-accent`, `size-5` on a contact row
and `size-4` in a header pill, with `gap-3` and `gap-2` respectively. **The
label sets the icon size, not the other way round:** an icon runs one step
above its text (`size-4` beside `text-sm`, `size-5` beside `text-lg`), which is
why the header pill is `text-sm` and not the `text-xs` it started as — at
`text-xs` the mark out-sized the word beside it. All four
are stroke outlines on the `ArrowLink` recipe (`viewBox="0 0 24 24"`,
`strokeWidth="2"`, round caps, `fill="none"`) — never a filled brand mark, and
never amber as a fill. Adding a fifth channel means adding it to `IconName`,
not writing an inline `<svg>` in a section.

**A row that leads somewhere** gets `group`, `transition-colors
hover:bg-white/[0.03]`, and an [ArrowLink](./src/components/ArrowLink.tsx) at
the far right in `text-accent`. The arrow's `group-hover` nudge is the hover
affordance — don't also underline or scale. A row or card with no destination
gets no arrow, which is how a project with no public repo reads as one.

**A checkerboard tile is the exception: every tile carries the arrow**, because
every tile leads somewhere — to its own detail dialog if not to a repo. The
board only reads as uniform if the mark is uniform, and a tile with a blank
corner would look broken rather than linkless. It steps down to `size-4` below
`sm:` so it doesn't out-weigh the title beside it (§3, "the label sets the icon
size").

**The contribution graph is one link, not a row.** The whole figure
([ContributionGraph](./src/components/ContributionGraph.tsx)) is an anchor to
`site.links.github`, so the obvious click target behaves. It carries the
`ArrowLink` beside its caption rather than at a far-right edge, at `size-3.5`
— the third step of "the label sets the icon size", the one that belongs to
`text-[11px]` caption text — and its hover affordance is the caption lifting
`text-white/35 → text-white` (§2.2's muted-link hover), **not** the row
recipe's `hover:bg-white/[0.03]`: a background tint behind a 17px cell grid
would read as a change in the data. The anchor owns the accessible name
(`"<caption>. View the profile on GitHub."`) and everything inside it is
`aria-hidden`, so the caption isn't announced twice.

**The nav bar** is `sticky top-0 z-50`, 64px tall, with three groups on one
`max-w-6xl` row: the wordmark (`#top`), the section anchors (`gap-7`, hidden
under `sm:` where the pills matter more), and the actions. Actions are the
Contact and Resume pills — the two things a visitor is actually looking for,
and since the Contact section came off the page on 2026-10-13 the Contact pill
is the only route to an address at all, so it is load-bearing, not a shortcut —
both on the same pill recipe; the reference site fills one of them, which this
design can't do, because §2.1 forbids text on an amber field and there is no
other fill.

**A section** is `<section id="…" className="scroll-mt-24">`, opens with a
`<Reveal><SectionHeading /></Reveal>`, then `mt-12` and its list. The `id` must
match an entry in [Nav](./src/components/Nav.tsx), and `scroll-mt-24` must stay
or the fixed nav covers the heading on anchor jump.

**A subsection** is the one exception to that: a second list belonging to the
section above it takes the §2.5 eyebrow as its `<h2>` instead of a display
heading, then `mt-8` and its list, and carries no `id` and no `scroll-mt-24`
because the nav points at the parent. `Additional projects` is the only one —
the featured cards own the `PROJECTS` title, and a second display heading would
split one list into two sections in the reader's head. It sits `mt-16 lg:mt-20`
under its parent, which means the pair has to be wrapped in a plain `div` in
[page.tsx](./src/app/page.tsx): `main`'s `space-y` out-specifies a child's
`mt-*` and would otherwise force the full between-sections gap.

**A list of things** is `<ul>`/`<ol>` with `divide-y divide-white/10` and
`border-t border-white/10` (`border-y` if nothing follows). Each `<li>` is
wrapped in its own `<Reveal delay={i * 0.06}>`.

**Semantics are part of the design.** One `<h1>` (the name, in `Header`);
every section heading is an `<h2>`; row titles are `<h3>`. Stats are a `<dl>`
with an `sr-only` `<dt>`. Decorative SVG gets `aria-hidden="true"`. External
links get `target="_blank" rel="noreferrer"`; internal paths must not.

---

## 4. Non-negotiables

1. **Dark only.** There is no light mode and no `prefers-color-scheme` branch.
   The fog GIF is a dark asset; a light variant would be a different site.
2. **The focus ring stays.** `2px solid var(--accent)`, `outline-offset: 3px`,
   global in `globals.css`. Never `outline-none` without an equivalent
   replacement — fixing the reference site's missing focus states is an
   explicit goal in `TODO.md` §2.
3. **Real anchors and buttons.** No `<li onClick>`. Everything interactive is
   keyboard reachable without JS. A row that opens a modal is still an anchor
   to the thing it shows, with the handler intercepting only a plain left
   click — the Resume trigger degrades to a link straight to `/resume.pdf`,
   the Contact trigger to `mailto:` the address (it pointed at `#contact`
   until that section came off the page). A modal trigger is an anchor to the
   thing it shows, never a bare `<button>`.
4. **Server components by default.** `Reveal`, `ResumeDialog`,
   `ContactDialog` and `ProjectBoard` are the only `"use client"` files. A dialog takes its
   trigger as `children` plus a class, so the markup around it can stay on the
   server and one dialog can serve two call sites. If a new
   component needs the directive, say why in a comment.
5. **No new dependency** for something Tailwind plus `motion` already does.

---

## 5. Changing the design

Pick a token, not a pixel. In order of preference:

1. Change the value of `--accent` / `--background` / `--foreground` in
   `globals.css` — it propagates everywhere.
2. Reuse a value already in §2.
3. Add a new token to `:root` **and** `@theme inline`, and document it here.
4. Only then write a literal, and only with a comment saying why.

`npm run format` runs `prettier-plugin-tailwindcss`, which sorts class lists —
let it, don't hand-order. Run `npm run lint && npm run typecheck` before
calling a styling change done.

---

## 6. Known drift — fix on sight

Found while writing this doc. None are urgent; all are real.

- **The monogram uses raw palette colors.** `Header.tsx` has
  `bg-gradient-to-br from-amber-400/90 to-orange-600/90`, bypassing `--accent`.
  It should be derived from the token, or the token should grow a second stop.
  (It's a placeholder until there's a real photo — `CONTENT.md` §8.)
- **`--foreground` is nearly dead.** It styles `body` and nothing else; every
  piece of light text is `text-white/NN` instead. Either the ladder in §2.2
  should be built on `--foreground`, or the token should be dropped. Pick one.
- **The hero heading duplicates `SectionHeading`.** `Sections.tsx` hand-rolls
  the same two-tone markup one size up. A `size` prop on `SectionHeading`
  would make the pair impossible to drift.
- **Two hover recipes for the same thing.** Header social pills end at
  `hover:bg-white/10`, against the `/[0.07]` rule in §2.3. (The tool tiles that
  were the other half of this note are gone with the Tools section.)
- **`CONTENT.md` §7 says all images go through `next/image`.** The fog GIF
  deliberately doesn't — the optimizer doesn't animate GIFs. The rule needs
  the exception written into it.

Also stale and worth a cleanup pass: `CONTENT.md` §5 still describes
`site.bio` as living "in the sticky card," which `Header` replaced, and
`TODO.md` §3 still lists font and accent choice as open when both have shipped
(Inter Tight / JetBrains Mono, `#ffa94d`).
