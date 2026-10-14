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

**Accent discipline.** Amber means "this does something or is happening now."
It is currently used in exactly five places: the focus ring, `ArrowLink` on
every linking row, the job title under each experience role, the `NOW` badge,
and the filled levels of the contribution graph. Do not spend it on decoration.
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
| Floating nav pill | `rounded-full border border-white/10 bg-neutral-950/60 backdrop-blur-xl` |
| Tile / small card | `rounded-2xl border border-white/10 bg-white/[0.03]` |
| Pill button | `rounded-lg border border-white/10 bg-white/[0.03]` |
| Chip (tech, badge) | `rounded-full border border-white/10 px-2.5 py-0.5` |
| Hairline rule | `border-white/10`, `divide-white/10` |
| Row hover | `hover:bg-white/[0.03]` |
| Tile/button hover | `hover:border-white/25 hover:bg-white/[0.07]` |

Borders are always `white/10` at rest and `white/25` on hover. Surface fills are
`white/[0.03]` or `white/[0.04]` at rest and `white/[0.07]` on hover. There are
no other values; don't add a sixth.

**Rows beat boxes.** A list of comparable things (projects, roles, contact
links) is a `divide-y divide-white/10` list with a top or `y` border — not a
stack of cards. Cards are reserved for the header panel and the tools grid.

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
`text-white/20`, and the pair must read as one phrase (`RECENT`/`PROJECTS`).
Use [SectionHeading](./src/components/SectionHeading.tsx) for every section; the
hero is the only hand-rolled one, because it sits one step larger.

Measure is capped deliberately: `max-w-xl` for a lead, `max-w-lg` for body. Full
-width prose across `max-w-6xl` is never correct here.

### 2.6 Spacing rhythm

Page shell, from [page.tsx](./src/app/page.tsx):
`mx-auto w-full max-w-6xl px-5 lg:px-8 pt-24 lg:pt-28 pb-28`.
Top padding clears the fixed nav; `max-w-6xl` is the hard outer bound.

| Gap | Value |
| --- | --- |
| Between sections | `space-y-28 lg:space-y-36` |
| Header → first section | `mt-20 lg:mt-28` |
| Display heading → list | `mt-12` |
| Display heading → paragraph | `mt-8` |
| Paragraph → list | `mt-10` |
| Panel padding | `p-6 sm:p-8` |
| List row, major (project, role) | `py-7` |
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

**A row that leads somewhere** gets `group`, `transition-colors
hover:bg-white/[0.03]`, and an [ArrowLink](./src/components/ArrowLink.tsx) at
the far right in `text-accent`. The arrow's `group-hover` nudge is the hover
affordance — don't also underline or scale.

**A section** is `<section id="…" className="scroll-mt-24">`, opens with a
`<Reveal><SectionHeading /></Reveal>`, then `mt-12` and its list. The `id` must
match an entry in [Nav](./src/components/Nav.tsx), and `scroll-mt-24` must stay
or the fixed nav covers the heading on anchor jump.

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
   keyboard reachable without JS.
4. **Server components by default.** Only `Reveal` is `"use client"`. If a new
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
  `hover:bg-white/10`; tool tiles at `hover:bg-white/[0.07]`. §2.3 declares
  `/[0.07]` the rule; the pill is the outlier.
- **`CONTENT.md` §7 says all images go through `next/image`.** The fog GIF
  deliberately doesn't — the optimizer doesn't animate GIFs. The rule needs
  the exception written into it.

Also stale and worth a cleanup pass: `CONTENT.md` §5 still describes
`site.bio` as living "in the sticky card," which `Header` replaced, and
`TODO.md` §3 still lists font and accent choice as open when both have shipped
(Inter Tight / JetBrains Mono, `#ffa94d`).
