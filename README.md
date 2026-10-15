# Portfolio

Personal portfolio site: projects, experience, and contact info.

**Jake Recharte** · Computer Science, San Diego State University

See [TODO.md](./TODO.md) for the project plan, goals, and phase checklist, and
[CONTENT.md](./CONTENT.md) for the content fact sheet. Read it before editing
anything in `src/content/` or writing copy.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Motion](https://motion.dev) (`motion/react`) for animation
- Deployed on [Vercel](https://vercel.com)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with autofix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (no writes) |
| `npm run typecheck` | `tsc --noEmit` |

## Notes

- Next 16 defaults to Turbopack, and `params` / `searchParams` are async
  (Promises), which matters when project deep-linking lands in Phase 4.
- `next lint` was removed in Next 16; ESLint runs directly via flat config in
  `eslint.config.mjs`.
- `AGENTS.md` is generated and re-added by `next dev`. Leave it committed.
