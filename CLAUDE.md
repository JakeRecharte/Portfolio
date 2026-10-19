@AGENTS.md

# Design

Before writing or changing any JSX, CSS, or Tailwind class, read
[DESIGN.md](./docs/DESIGN.md). It is the style sheet in prose: the color tokens and
the opacity ladder, the surface/border/radius values, the type scale, the
spacing rhythm, the motion settings, and the patterns a section, row, and link
are built from. Never invent a design value. Reuse one from DESIGN.md §2 or
add the new one to that doc in the same commit.

# Content

Before editing anything in `src/content/`, writing user-facing copy, or adding
a section, read [CONTENT.md](./docs/CONTENT.md). It is the fact sheet: what is
verified about Jake, what is still placeholder, the length limits the layout
holds at, and the voice rules. Never invent a fact about Jake. If one is
missing, add the question to CONTENT.md §7 and leave an obvious placeholder.

# Demos

Before adding or changing anything under `src/components/demos/`,
`public/demos/` or the build scripts behind them, read
[DEMO.md](./docs/DEMO.md). It covers what a demo is allowed to run (the project's
real artifact, never a reimplementation or a recording), where its bytes are
allowed to come from, the rule that one command in `scripts/` rebuilds every
committed byte, and how a demo proves it isn't lying. DESIGN.md §3 still owns
what it looks like.

[TODO.md](./docs/TODO.md) is the build plan and phase checklist.

# Dev server

`npm run dev` has hot reload, so almost no change requires stopping it. Edit
the files and let it refresh. If you do stop or kill the localhost server for
any reason (a config change, a port conflict, a clean rebuild), **start it
again once your changes are in** and confirm it came up before you report
back. Never end a turn having left Jake without a running preview, and say in
your reply if the URL or port changed.
