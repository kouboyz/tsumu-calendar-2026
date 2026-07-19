# Copilot instructions

## Tooling and commands

- Use Node.js 24+ and npm. Install the lockfile exactly with `npm ci`.
- Start Vite with `npm run dev`; preview the production build with `npm run preview`.
- `npm run build` runs the TypeScript project build (`tsc -b`) before `vite build`.
- `npm run lint` runs Oxlint with the React, TypeScript, and Oxc plugins.
- `npm test` runs the complete Vitest suite once; `npm run test:watch` starts watch mode.
- Run one test file with `npm test -- src/domain/calendar.test.ts`.
- Run one named test with `npm test -- src/domain/calendar.test.ts -t 'builds a Sunday-to-Saturday week'`.

Tests are colocated with source as `*.test.ts` or `*.test.tsx`. They use Vitest, Testing Library, and the `jsdom` environment configured in `vitest.config.ts`; shared browser shims, including native `<dialog>` methods, belong in `src/test/setup.ts`.

## Architecture

This is a browser-only, single-page React planner deployed as a static GitHub Pages site. There is no router, server, or remote data layer.

- `src/App.tsx` is the interaction coordinator. It owns transient UI state, the top-level dnd-kit `DndContext`, drag routing, and the sequence between homework, date, and outcome dialogs.
- `src/hooks/usePlanner.ts` owns all persistent planner mutations. It loads and saves the card array through `localStorage`, exposes storage failures to the UI, and resolves template/homework IDs into card titles.
- `src/domain/` contains pure calendar, progress, template, type, and persistence logic. Keep calculations and serialization here rather than embedding them in components.
- `src/data/homework.ts` is the canonical homework master and summer-rules dataset. Homework templates in `src/domain/templates.ts` represent subjects; scheduled `PlannedCard` records optionally point to a concrete master item with `homeworkItemId`.
- `src/components/` renders the card pool, Sunday-to-Saturday calendar, planned cards, and native `<dialog>` flows. `WeekCalendar` and `PlannerCard` provide dnd-kit drop targets; `App` interprets their typed `data` payloads and performs mutations through `usePlanner`.

The two scheduling paths intentionally differ: events can be added directly to a date, while homework must select a concrete master item. Tapping a homework template selects the item before the date; dropping it on a date captures the target date before opening the homework picker.

## Repository-specific conventions

- The app is fixed to the vacation interval July 18-August 26, 2026. Centralize date boundaries and `yyyy-MM-dd` date-key conversion in `src/domain/calendar.ts`; weeks start on Sunday and navigation must remain clamped to the vacation.
- Homework progress is based on unique completed `homeworkItemId` values, not scheduled-card count. The overall denominator is the full 172-item master, and duplicate cards for the same item must not increase completion.
- Persisted data uses `STORAGE_KEY = 'tsumu-calendar:v2'` and the version-2 `PlannerState` schema. Any shape change must update the TypeScript types, runtime validation/serialization, storage tests, and versioning or migration strategy together. Invalid stored data is surfaced to the reset UI rather than silently overwritten.
- Keep dnd-kit payload contracts aligned across producers and `App`: pool cards use `{ type: 'template', templateId }`, planned cards use `{ type: 'card', cardId, date }`, day targets use `{ type: 'day', date }`, and ordering targets use `{ type: 'card-target', cardId, date }`.
- Styling uses Tailwind CSS v4 utilities alongside semantic component classes in `src/index.css`. Template-specific colors flow through `--card-bg` and `--card-accent`; reuse that mechanism for pool and planned-card variants. The layout is mobile-first, Japanese-language, and horizontally scrolls the seven-day grid on narrow screens.
- TypeScript uses `verbatimModuleSyntax`, `erasableSyntaxOnly`, and no-unused checks. Use `import type` for type-only imports and avoid TypeScript constructs that emit runtime syntax.
- Tests involving the current week/countdown should set an explicit local `Date` with Vitest fake timers. UI tests should query the existing Japanese accessible names and roles rather than implementation classes.
- The GitHub Pages path is `/tsumu-calendar-2026/` in `vite.config.ts`; update it if the repository name changes. Deployment on pushes to `main` runs `npm ci`, tests, and the production build before publishing `dist`.
- Runtime artwork is imported from `src/assets/girls2/logo.webp` and `hero.webp`. Preserve those filenames when replacing approved assets unless imports are updated too.
