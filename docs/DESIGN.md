# DESIGN.md: the source of truth for anything the site looks like

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
| [DEMO.md](./DEMO.md) | what runs, where it comes from, how it's rebuilt |
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

Three CSS custom properties in [globals.css](../src/app/globals.css), exposed to
Tailwind through `@theme inline`:

| Token | Value | Tailwind class | Use |
| --- | --- | --- | --- |
| `--background` | `#000` | `bg-background` | the page canvas, and the fog's backstop |
| `--foreground` | `#ededed` | `text-foreground` | `body` default only |
| `--accent` | `#ffa94d` (amber) | `text-accent`, `border-accent/40`, `bg-accent/10` | **every** affordance |

Everything else is `white` at an alpha. That is deliberate. The fog is the
color in this design, so the UI stays neutral over it.

**Accent discipline.** Amber means "this does something." It is currently used
in exactly six places: the focus ring, `ArrowLink` on every linking row, the
role line under a job row in `Work Experience`, the filled levels of the contribution
graph, the channel icons in `Icon` (contact rows and header pills), and the
outline of a **kind** chip (`border-accent/40`, `CLUB`, `INTERNSHIP`,
`PROJECT`, in both `Work Experience` and the header's "Now" rail). Do not spend it beyond
that list. It no longer marks "happening now". The header's
badges became kind chips (`CLUB`, `INTERNSHIP`) and are neutral, with
ongoing-ness carried by the period text instead.

The icons are the one entry that is closer to decoration than affordance, and
they are on this list by explicit request. They earn it two ways: every row
that carries one *is* a link, and amber on the left mirrors the amber
`ArrowLink` on the right, so a contact row reads as one amber-bracketed
affordance rather than two unrelated marks.
Never use amber as a background for text. `#ffa94d` on black is a 10:1
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
| `text-white/55` | **body copy floor**, bullets, blurbs, tech chips |
| `text-white/45` | stat labels, metadata values, tool category |
| `text-white/40` | mono eyebrow |
| `text-white/35` | dates, captions, graph axis labels |
| `text-white/30` | footer, bullet dots |
| `text-white/20` | the dropped second line of a display heading |

**`/55` is the floor for anything a person reads as a sentence**: `TODO.md` §1
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
channel rows) is a `divide-y divide-white/10` list with a top or `y` border,
not a stack of cards.

**Cards are the exception, and there are exactly two.** The header panel
(`rounded-3xl`), and the **three featured projects**, `rounded-2xl` cards in a
`flex flex-col gap-4` stack, one per row at every breakpoint, each `p-6`. A
featured card is therefore the widest surface on the page, which is what makes
the set read as featured rather than as the top of a list; a second *card* shape
anywhere else would spend that.

Two consequences of stacking, both load-bearing:

- **A card sizes to its own content**, so there is no `h-full` and no
  `mt-auto` bottom-alignment. Those existed only to level three cards sharing
  one row. Tech chips take a plain `mt-6`.
- **The card is wider than its prose may be.** The blurb carries §2.5's
  `max-w-lg` measure itself rather than inheriting a cap from a narrow column.
  Full-bleed prose across `max-w-6xl` is the failure mode a stacked card
  invites, and the one thing to check when editing it.

**The checkerboard is a third shape, and it is not a card grid.** The
additional projects
([ProjectBoard](../src/components/ProjectBoard.tsx)) are square tiles three
across, and the distinction that keeps them from competing with the featured
cards is that they have no gap, no radius of their own and no fill of their
own: they are cells of one board, not objects on the page. The recipe:

| Part | Classes |
| --- | --- |
| Board | `grid grid-cols-3 overflow-hidden rounded-2xl border-t border-l border-white/10` |
| Cell | `aspect-square border-r border-b border-white/10` |
| Filled cell | adds `bg-white/[0.04]` when `i % 2 === 0` |
| Open cell | no fill, the fog shows through |
| Cell hover | `hover:bg-white/[0.07]`, border unchanged |

Borders collapse rather than gap: the board draws its own top and left edge and
each cell draws its right and bottom, so every rule is 1px and the open cells
stay genuinely transparent. A `gap` plus per-cell borders would double every
interior rule to 2px and a gap colored by the container would tint the open
cells.

**A tile carries its own write-up, from `sm:` up.** The square is not just a
title: it holds the period, the blurb and the tech chips, so the board can be
read without opening anything and the dialog is left to the demo and the long
form. What fits depends entirely on how wide a third of the viewport is:

| Part | Classes | From |
| --- | --- | --- |
| Period + kind | `font-mono text-[10px] sm:text-xs`, chip `hidden lg:inline-block` | always |
| Blurb wrapper | `mt-3 hidden min-h-0 flex-1 sm:block` | `sm:` |
| Blurb | `line-clamp-3 text-xs leading-relaxed text-white/55 lg:line-clamp-5 lg:text-sm` | `sm:` |
| Tech chips | `mt-3 hidden flex-wrap gap-2 lg:flex` | `lg:` |
| Title + arrow | `mt-3 flex items-end justify-between` | always |

**The wrapper hides and the paragraph clamps, never both on one element.**
`hidden` and `line-clamp-*` both set `display`, so a `hidden sm:line-clamp-3`
resolves by stylesheet order rather than by intent. The measurements behind the
breakpoints: a cell is ~110px on a phone (title only), ~200px at `sm:` (three
clamped lines, no room for chips) and ~362px at `lg:` (five lines and two rows
of chips, with headroom).

A tile with this much in it can no longer compute its own accessible name (the
anchor would announce as one 200-character link), so it takes an explicit
`aria-label` of title, period and what the click does.

**Three columns is load-bearing.** With an odd column count, `i % 2` alternates
both across a row and between rows, so the checker needs no row arithmetic. An
even column count turns the same code into vertical stripes. The board also
stays three across at every breakpoint (that is the pattern, not a layout
convenience), which is why a tile's `kind` chip is `hidden … lg:inline-block`
and its title steps `text-sm sm:text-base lg:text-lg`: a third of a phone
screen is about 100px and the chip does not fit in it. The dialog carries the
chip at every size instead.

**A tile carries one chip, and it is always `kind`.** A chip on this site
names what a thing *is* (`PROJECT`, `HACKATHON`, `CLUB`, `INTERNSHIP`), and
never where it is in its life. A project that isn't finished also has a
`status` (`UPCOMING`, `IN PROGRESS`), but the tile does not spend its one chip
slot on it: a hackathon that reads `UPCOMING` has been labelled on the wrong
axis, which is the same mistake the header's "Now" rail made before its badges
became kind chips (§2.1). Two chips would wrap on a square this size, so the
tile shows `kind` and **`period` carries the state in words**, "Upcoming",
"Sep 2026 - Now". The dialog has room and shows both, kind first. Both use the
amber kind-chip recipe from §2.3, so the amber budget is unchanged: still one
chip per tile.

Below `lg:` the chip is hidden entirely, so **the period string is what carries
the state at phone width**, which is why they read `Upcoming` and
`Sep 2026 - Now` rather than a bare date. That matches `now.ts`, where period
is the only place time is expressed.

**A board is padded to full.** A half-empty last row reads as a broken grid
rather than a pattern, so `ProjectBoard` appends inert `aria-hidden` cells to
complete it, continuing the checker and carrying nothing else.

**The art gallery is a fourth shape, and the reason is the content.** The
`/art` page ([ArtGallery](../src/components/ArtGallery.tsx)) is uncropped
masonry, CSS multi-column, two across on a phone and three from `lg:`:

| Part | Classes |
| --- | --- |
| Gallery | `mt-12 columns-2 gap-4 lg:columns-3` |
| Piece | `mb-4 break-inside-avoid` |
| Frame | `overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]` |
| Image | `block h-auto w-full`, `sizes="(min-width: 1024px) 33vw, 50vw"` |
| Empty frame | `grid place-items-center p-4` + inline `aspectRatio` |
| Empty label | `font-mono text-[10px] tracking-wider text-white/35 uppercase` |
| Caption, title | `mt-3 block text-sm font-medium text-white` |
| Caption, meta | `mt-1 block font-mono text-xs text-white/35`, omitted when empty |

`columns-*` and `break-inside-avoid` are the only values this introduced; the
frame is §2.3's tile recipe unchanged and the caption is §2.5's metadata line
under a row title one step down.

Three rules hold it:

1. **Nothing is cropped.** Every other collection on this site is square,
   because the project board holds text and a square is a shape to fill. A
   picture cropped to a square has lost the composition, so each piece keeps
   its own aspect ratio and the columns stagger around it. That is the whole
   reason this is not the checkerboard.
2. **`gap` is horizontal only.** In a multi-column box, `gap` sets the gutter
   between columns and nothing between items, so each piece carries its own
   `mb-4`, the same 4 as the gutter, so the grid reads as even.
   `break-inside-avoid` keeps a piece from being sliced across a column
   boundary, and it has to sit on the **direct child of the column box**:
   `Reveal` is therefore *inside* the `<li>` here, the one place on the site
   where it is not wrapped around it.
3. **An aspect ratio is content, not design.** A piece's `width`/`height` come
   from the file and ride in an inline `style`, on the same exemption the Apple
   Picker poster's `aspect-[8/5]` takes in §3. A piece with no file yet draws
   an empty frame at its real ratio rather than a broken image, so the layout
   while the page is placeholder is the layout it will ship with.

**A caption says only what is known.** Title, then `year · medium` on a mono
line, and that second line is **not rendered at all** when both are missing,
rather than collapsing to an empty row or a stray separator. No piece has a
year today (CONTENT.md §2.7), so most captions are one line, and the layout
has to look deliberate either way.

The frame is a hairline and nothing else on purpose: on this page the picture
is the content, so the chrome around it cannot compete. There is no hover
state and no arrow, because a piece is not a link. If pieces ever become
clickable, that is the dialog recipe below, not a new one.

**The profile picture is one of the pieces.** The header's avatar
([Header](../src/components/Header.tsx)) is *Cradled Fortress*, served from
`art.ts` rather than copied, same file, same `alt`, same dimensions as the
gallery renders. It is `aspect-square w-32 sm:w-36` on §2.3's tile frame with
the image `block h-full w-full` inside it, and the choice of piece is
load-bearing: at 2160 × 2160 the square frame crops nothing, so it does not
break rule 1 above. A tall piece here would. `sizes` is the frame's two real
widths (`144px` / `128px`), not a `vw` fraction, because this box never scales
with the viewport, and `priority` because it is above the fold on every visit.

**A modal is the nav pill's surface, one step more opaque.** `neutral-950/80`
rather than `/60` because a modal sits over arbitrary content and has to win;
it is the only use of that value. Size is `h-[90dvh] w-[92vw] max-w-6xl`, the
same `max-w-6xl` outer bound as the page shell (§2.6), so a modal never reads
wider than the site. The resume viewer
([ResumeDialog](../src/components/ResumeDialog.tsx)) uses that full size; a modal
that only holds a few rows
([ContactDialog](../src/components/ContactDialog.tsx)) is
`w-[min(92vw,26rem)]` with `p-6 sm:p-8` and sizes to its content instead. The
**About** modal ([AboutDialog](../src/components/AboutDialog.tsx)) is the third
size and introduces nothing: it borrows the project dialog's write-up-only
`max-h-[90dvh] w-[min(92vw,32rem)]`, which is about half the `max-w-6xl` shell
and a little under, wide enough for prose at §2.5's `max-w-lg` measure, narrow
enough that it still reads as a panel over the header rather than a page.

**The About modal's body is prose, so it takes the one heading the type scale
doesn't have.** Its sections (*The code*, *Outside the code*) are the §2.5
eyebrow at `text-white` rather than `text-white/40`: the pinned bar above them
is already an eyebrow at `/40`, and repeating that exactly would flatten the
dialog title and its subsections into one level. Geometry from the eyebrow,
alpha from §2.2's heading row, no new value. Sections are `space-y-8` apart,
paragraphs `space-y-3` within one, and the single link out (`/art`) is the §3
row recipe on a `rounded-2xl` tile with the arrow at `size-4`, because it is
the only thing in the dialog that leads anywhere.

**The project dialog ([ProjectDialog](../src/components/ProjectDialog.tsx))
has two sizes, and the content picks.** It takes its trigger as `children`
plus a class, the same way `ResumeDialog` and `ContactDialog` do (§4 rule 4),
which is what lets one component serve both the checkerboard tiles and the
featured cards while both of those stay server components. A featured card
now opens it too. CWG's demo had nowhere else to live, and a card that only
linked out was the one project surface with no write-up behind it. A project with a demo takes the resume
viewer's full `h-[90dvh] w-[92vw] max-w-6xl`; one with only a write-up takes
`max-h-[90dvh] w-[min(92vw,32rem)]` and sizes to itself, with `max-h-` rather
than `h-` so three paragraphs scroll instead of overflowing. Both share one
shell: `p-0 open:flex open:flex-col`, a pinned header bar
(`border-b border-white/10 px-5 py-3.5`) holding the title and the close
button, and one scrolling body at `min-h-0 flex-1 overflow-y-auto p-6 sm:p-8`.
With a demo the body becomes `lg:grid lg:grid-cols-3 lg:gap-8`. The demo takes
`lg:col-span-2` and the write-up rides in the last column, stacking under it
below `lg:`.

**Chips come in two sizes and two colors of one recipe.** Size: content chips
(tech, and the `kind` label in `Work Experience`) are `px-2.5 py-0.5`; the denser badge in
the header's "Now" rail is `px-2 py-0.5`. Color is what the chip *is*: a **kind
label** (`CLUB`, `INTERNSHIP`, `PROJECT`) outlines `border-accent/40` and adds
`font-mono text-[10px] tracking-wider`; a **content chip** (a tech name) stays
`border-white/10`. All are `rounded-full border` with `text-white/55`. Amber
never fills one, only outlines it.

### 2.4 Radius

`rounded-3xl` panel · `rounded-2xl` tile · `rounded-lg` small button ·
`rounded-full` pill and chip · `rounded-[2px]` contribution cell.

### 2.5 Type

Two fonts, both `next/font/google`, wired in [layout.tsx](../src/app/layout.tsx):
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
Use [SectionHeading](../src/components/SectionHeading.tsx) for every one of
them, including a hero: `size="hero"` is the step up in the table above and
`size="section"` (the default) is everything inside a page. Nothing hand-rolls
this markup any more. The homepage hero did until 2026-10-14, which is the
drift §6 had open.

`as="h1"` is the other prop, and it is a semantics switch rather than a style
one: a display heading is an `<h2>` because `Header` owns the page's `<h1>`,
but a page with no `Header` (`/art`) has to make its own title the `<h1>`
(§3, "Semantics are part of the design").

Measure is capped deliberately: `max-w-xl` for a lead, `max-w-lg` for body. Full
-width prose across `max-w-6xl` is never correct here.

### 2.6 Spacing rhythm

Page shell, from [page.tsx](../src/app/page.tsx):
`mx-auto w-full max-w-6xl px-5 lg:px-8 pt-12 lg:pt-16 pb-28`.
**Every route repeats it verbatim**: `/art` carries its own copy rather than
inheriting one, because a second page at a different measure would read as a
different site. The fog, the nav and the footer are not in a page at all: they
are in [layout.tsx](../src/app/layout.tsx), which wraps both routes.
The nav is `sticky`, not `fixed`, so it occupies its own 64px and the shell's
top padding is the gap *below* it, not clearance for it. It was `pt-24
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
| Featured card padding | `p-6`, stack `gap-4` |
| List row, link (contact) | `py-5` |
| List row, dense (now) | `py-3.5` |

Breakpoints used: `sm:` (640) and `lg:` (1024), plus `md:` for the header's
two-column split only. Don't reach for `xl:` or `2xl:`. The shell caps before
they matter.

### 2.7 Motion

All scroll animation goes through [Reveal](../src/components/Reveal.tsx). Do not
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
[Icon](../src/components/Icon.tsx) in `text-accent`, `size-5` on a contact row
and `size-4` in a header pill, with `gap-3` and `gap-2` respectively. **The
label sets the icon size, not the other way round:** an icon runs one step
above its text (`size-4` beside `text-sm`, `size-5` beside `text-lg`), which is
why the header pill is `text-sm` and not the `text-xs` it started as, at
`text-xs` the mark out-sized the word beside it. All four
are stroke outlines on the `ArrowLink` recipe (`viewBox="0 0 24 24"`,
`strokeWidth="2"`, round caps, `fill="none"`), never a filled brand mark, and
never amber as a fill. Adding a fifth channel means adding it to `IconName`,
not writing an inline `<svg>` in a section.

**A row that leads somewhere** gets `group`, `transition-colors
hover:bg-white/[0.03]`, and an [ArrowLink](../src/components/ArrowLink.tsx) at
the far right in `text-accent`. The arrow's `group-hover` nudge is the hover
affordance. Don't also underline or scale. A row or card with no destination
gets no arrow, which is how a project with no public repo reads as one.

**A checkerboard tile is the exception: every tile carries the arrow**, because
every tile leads somewhere, to its own detail dialog if not to a repo. The
board only reads as uniform if the mark is uniform, and a tile with a blank
corner would look broken rather than linkless. It steps down to `size-4` below
`sm:` so it doesn't out-weigh the title beside it (§3, "the label sets the icon
size").

**The contribution graph is one link, not a row.** The whole figure
([ContributionGraph](../src/components/ContributionGraph.tsx)) is an anchor to
`site.links.github`, so the obvious click target behaves. It carries the
`ArrowLink` beside its caption rather than at a far-right edge, at `size-3.5`
(the third step of "the label sets the icon size", the one that belongs to
`text-[11px]` caption text), and its hover affordance is the caption lifting
`text-white/35 → text-white` (§2.2's muted-link hover), **not** the row
recipe's `hover:bg-white/[0.03]`: a background tint behind a 17px cell grid
would read as a change in the data. The anchor owns the accessible name
(`"<caption>. View the profile on GitHub."`) and everything inside it is
`aria-hidden`, so the caption isn't announced twice.

**A demo is a figure, a control and a table, in the site's own palette.**
A live demo ([demos/](../src/components/demos/)) renders inside the project
dialog's demo column and may not reach for colors the rest of the site does not
have. The recipe, from
[TradingDemo](../src/components/demos/TradingDemo.tsx):

| Part | Classes |
| --- | --- |
| Plot | `h-40 w-full sm:h-48`, `viewBox="0 0 600 180"`, `preserveAspectRatio="none"` |
| Series line | `strokeWidth="2"` + `vectorEffect="non-scaling-stroke"` |
| Subject series | `text-accent` |
| Baseline series | `text-white/55` |
| Zero rule | `text-white/10`, 1px |
| Selected marker | `text-white/25`, 1px |
| Axis gutter | wrapper `relative pl-12`, labels `absolute … font-mono text-[9px] text-white/35` |
| Legend swatch | `h-0.5 w-3 rounded-[2px]` in the series' color, label `text-[11px] text-white/35` |
| Range input | `w-full accent-accent` and nothing else |
| Progress bar | `h-0.5 rounded-full bg-white/[0.07]`, fill `bg-accent` |

Four rules hold it to the design:

1. **Two series, not a palette.** Amber is the thing being demonstrated and
   `white/55` is whatever it is being measured against, a baseline, not a
   second category. §2.1's accent discipline means a demo never introduces a
   second hue, so a chart that genuinely needs three or more categories has to
   be rethought, not recolored.
2. **Never red and green.** Direction is carried by an explicit `+` / `−` and
   the sign of the number. This is the palette rule and the colorblind-safe
   answer at the same time.
3. **Stretch the strokes, not the glyphs.** `preserveAspectRatio="none"` is
   what lets the plot fill its column, and it would skew any `<text>` inside
   the SVG, so every label is HTML positioned around it, and the paths keep
   an even weight through `non-scaling-stroke`.
4. **The numbers are the alternative text.** The `<svg>` is `aria-hidden`; the
   `<figcaption>`, the readout table and the summary `<dl>` carry the same
   information in text, which is also what keeps a `/55` line legible for
   anyone who can't resolve it against black.

**A demo that is mostly a map or a canvas takes the whole dialog.** `wide` on
a `ProjectDemo` drops the `lg:grid lg:grid-cols-3` split, so the demo spans
the full width and the write-up sits underneath instead of beside it. Spending
a third of the dialog on prose next to a map is the wrong trade; for a stepper
or a chart, where the guide is read *while* the demo runs, the split is right.
Permit Paragons and Clearline are the `wide` demos.

**A heavy demo is a poster first, and loads only on a click.** A compiled
build (a Unity WebGL game, anything in the tens of megabytes) must not start
downloading because a dialog opened. The pane renders a poster on the tile
recipe at the build's own aspect ratio, and the `<iframe>` is mounted by the
click, never before:

| Part | Classes |
| --- | --- |
| Frame | `aspect-[8/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]` |
| Poster | `group flex h-full w-full flex-col items-center justify-center gap-3 p-6 transition-colors hover:bg-white/[0.07]` |
| Play control | the §2.3 pill button, with `<Icon name="Play" className="size-4 text-accent" />` |
| Cost line | `font-mono text-xs text-white/35` |
| Player | `<iframe className="h-full w-full border-0">` |

The aspect ratio is the build's, not a design choice. `aspect-[8/5]` is Apple
Picker's 960×600 `defaultScreenWidthWeb`. A different build gets a different
ratio, and that is the one place a demo may introduce a value without adding
it here.

Two are on record. Permit Paragons is `aspect-[4/3]`, a map that wants to be
wide. Clearline is `aspect-[3/4] sm:aspect-[4/3]`: it frames a dashboard that scrolls
rather than a fixed canvas, so below `sm:` it goes portrait. At 4:3 a phone gets
a 307×230 window onto a stacked page, and at 3:4 it gets a usable one. A demo
whose page scrolls may do the same; one with a fixed-size canvas, like the Unity
build, may not, since there the ratio is the build's.

**The cost line is not optional.** A poster states what the click will cost
and what it needs before it is clicked, the download size and, where it
matters, the input: Apple Picker is mouse-driven and has nothing to aim with
on a phone. A demo that only reveals that after thirty megabytes has lied by
omission. `Play` is the one mark in [Icon](../src/components/Icon.tsx) that
isn't a contact channel; it is on the same stroke recipe (§3) and outlined
rather than filled for the same reason the brand glyphs are.

**A demo computes in chunks, never in one blocking pass**, and says so while it
works: a mono line and the progress bar above. Chunk with `setTimeout`, not
`requestAnimationFrame`. RAF stops dead while a tab is backgrounded, which
would strand the run at whatever percent it had reached.

**A demo that steps through something gets one scrub control, and everything
else reads off it.** [CwgDemo](../src/components/demos/CwgDemo.tsx) is the
pattern: a range input is the single source of "where are we", and the code
view, the variables and the output are all derived from its value rather than
holding state of their own. Playback is a `setTimeout` chain at 700ms, and it
sets its state inside the timeout, never synchronously in the effect, which
cascades renders and ESLint rejects.

| Part | Classes |
| --- | --- |
| Program tabs | the §2.3 chip recipe, selected `border-accent/40 text-white` |
| View tabs | the §2.3 pill button, selected `border-white/25 bg-white/[0.07] text-white` |
| Code / graph frame | `overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4` |
| Executing line | `font-bold text-white` |
| Line already run | `text-white/55` |
| Line not yet run | `text-white/25` |
| Changed variable | chip with `border-accent/40 text-white` |

**Three states, one accent, and never a colour per category.** A commit graph
wants to distinguish `if/` from `while/` from `fn/`, and the palette cannot:
§2.1 allows one accent. So branch *type* is carried by the lane the commit
sits in and by its branch label, and colour is spent on the axis that
actually changes while you watch, not-yet-run, run, running now. The same
rule produced the trading demo's amber-and-grey, and it is why neither demo
needs a legend of five hues.

**The nav bar** is `sticky top-0 z-50`, 64px tall, with three groups on one
`max-w-6xl` row: the wordmark (`/`), the links (`gap-7`, hidden under `sm:`
where the pills matter more), and the actions. The links are
`/#work` and `/#projects` and that is the whole list. **`/art` is deliberately
not in the bar** (Jake, 2026-10-14). It is reached from the row at the bottom
of the About modal instead, which keeps the bar answering the one question it
exists for. A third link would have set a gallery at the same level as the
work.

**A homepage anchor is rooted (`/#work`, never `#work`**), because a bare
fragment is relative to the current page and resolved to `/art#work` from the
gallery. That still matters with Art out of the bar, because this bar also
renders *on* `/art` and is how a visitor gets back. On the homepage a same-path
fragment is still a scroll, so nothing changed there. `next/link` rather than
`<a>` is for one specific reason: a full load restarts the fog GIF from frame
one and flashes the bar out and back in. Actions are the Contact and Resume
pills, the two things a visitor is actually looking for. Since the Contact
section came off the page on 2026-10-13 the Contact pill is the only route to
an address at all, so it is load-bearing, not a shortcut. Both sit on the same
pill recipe; the reference site fills one of them, which this design can't do,
because §2.1 forbids text on an amber field and there is no other fill.

**A section** is `<section id="…" className="scroll-mt-24">`, opens with a
`<Reveal><SectionHeading /></Reveal>`, then `mt-12` and its list. The `id` must
match an entry in [Nav](../src/components/Nav.tsx), and `scroll-mt-24` must stay
or the fixed nav covers the heading on anchor jump.

**A subsection** is the one exception to that: a second list belonging to the
section above it takes the §2.5 eyebrow as its `<h2>` instead of a display
heading, then `mt-8` and its list, and carries no `id` and no `scroll-mt-24`
because the nav points at the parent. `Additional projects` is the only one:
the featured cards own the `PROJECTS` title, and a second display heading would
split one list into two sections in the reader's head. It sits `mt-16 lg:mt-20`
under its parent, which means the pair has to be wrapped in a plain `div` in
[page.tsx](../src/app/page.tsx): `main`'s `space-y` out-specifies a child's
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
   replacement. Fixing the reference site's missing focus states is an
   explicit goal in `TODO.md` §2.
3. **Real anchors and buttons.** No `<li onClick>`. Everything interactive is
   keyboard reachable without JS. A row that opens a modal is still an anchor
   to the thing it shows, with the handler intercepting only a plain left
   click. The Resume trigger degrades to a link straight to `/resume.pdf`,
   the Contact trigger to `mailto:` the address (it pointed at `#contact`
   until that section came off the page). A modal trigger is an anchor to the
   thing it shows, never a bare `<button>`, **with one exception, and the
   test is whether a destination exists at all.** The About modal
   ([AboutDialog](../src/components/AboutDialog.tsx)) holds copy that lives
   only in `site.about`: there is no file to open and no section to jump to,
   and an `href="#about"` pointing at nothing would degrade worse than a
   button does. So that trigger is a `<button type="button">` with
   `aria-haspopup="dialog"`, keyboard reachable, but genuinely inert without
   JS, which is the cost of the exception. Anything with a URL behind it still
   has to be an anchor.
4. **Server components by default.** `Reveal`, `ResumeDialog`,
   `ContactDialog`, `AboutDialog`, `ProjectDialog` and everything under
   `components/demos/`
   are the only `"use client"` files. `ProjectBoard` and `Sections` stayed on
   the server through the dialog rework by handing their markup to
   `ProjectDialog` as a trigger. A demo is mounted only while its dialog is
   open: five tiles must not each hold a running Python runtime. A demo is interactive by definition, so
   it is a client component and is reached only through the dialog, never
   imported into a server section, which would put its JavaScript on the
   homepage for every visitor. A dialog takes its
   trigger as `children` plus a class, so the markup around it can stay on the
   server and one dialog can serve two call sites. If a new
   component needs the directive, say why in a comment.
5. **No new dependency** for something Tailwind plus `motion` already does.

---

## 5. Changing the design

Pick a token, not a pixel. In order of preference:

1. Change the value of `--accent` / `--background` / `--foreground` in
   `globals.css`. It propagates everywhere.
2. Reuse a value already in §2.
3. Add a new token to `:root` **and** `@theme inline`, and document it here.
4. Only then write a literal, and only with a comment saying why.

`npm run format` runs `prettier-plugin-tailwindcss`, which sorts class lists.
Let it, don't hand-order. Run `npm run lint && npm run typecheck` before
calling a styling change done.

---

## 6. Known drift: fix on sight

Found while writing this doc. None are urgent; all are real.

- ~~**The monogram uses raw palette colors.**~~ **Gone 2026-10-14.** The
  `JR` block and its `from-amber-400/90 to-orange-600/90` gradient (the one
  place on the site that bypassed `--accent`) came off when Jake made
  *Cradled Fortress* the profile picture (§3, `CONTENT.md` §8 Q10). The token
  never needed a second stop; the placeholder that wanted one is just no
  longer there.
- **`--foreground` is nearly dead.** It styles `body` and nothing else; every
  piece of light text is `text-white/NN` instead. Either the ladder in §2.2
  should be built on `--foreground`, or the token should be dropped. Pick one.
- ~~**The hero heading duplicates `SectionHeading`.**~~ **Fixed 2026-10-14**,
  when `/art` needed the same heading a third time and copying it again was
  the point the note became real. `SectionHeading` took a `size` prop
  (`hero` | `section`) and an `as` prop (`h1` | `h2`); `Sections.tsx` renders
  `<SectionHeading lines={site.headline} size="hero" />` and the markup exists
  once (§2.5).
- **Two hover recipes for the same thing.** Header social pills end at
  `hover:bg-white/10`, against the `/[0.07]` rule in §2.3. (The tool tiles that
  were the other half of this note are gone with the Tools section.)
- **`CONTENT.md` §7 says all images go through `next/image`.** The fog GIF
  deliberately doesn't. The optimizer doesn't animate GIFs. The rule needs
  the exception written into it.

Also stale and worth a cleanup pass: `CONTENT.md` §5 still describes
`site.bio` as living "in the sticky card," which `Header` replaced, and
`TODO.md` §3 still lists font and accent choice as open when both have shipped
(Inter Tight / JetBrains Mono, `#ffa94d`).
