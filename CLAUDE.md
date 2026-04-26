# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

EnPULSE Dashboard — a Next.js admin tool that configures data‑collection campaigns and visualizes sensor/survey data uploaded by the paired Android library ([EnPULSE](https://github.com/Kaist-ICLab/EnPULSE)). It talks directly to a self‑hosted Supabase using the **service role key**, so the app has full admin privileges and is intended for local / private‑network use only — never deploy it on a public server.

## Commands

- `npm run dev` — start Next dev server
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` — `next lint` (eslint‑config‑next, core‑web‑vitals + typescript)
- `npm install` — also runs `flowbite-react patch` via `postinstall`

There is no test runner configured.

## Environment

Copy `.example.env` → `.env` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` from the self‑hosted Supabase. `NEXT_PUBLIC_PENDING_IMPORTED_CONFIG_KEY` is used as a `sessionStorage` key to hand an imported campaign config from the campaigns list page into the `/create` wizard.

Path alias `@/*` → `src/*` (see `tsconfig.json`).

## High‑level architecture

### Routes (App Router)

- `/` → redirects to `/campaigns`
- `/campaigns` — campaign picker
- `/campaigns/[id]/layout.tsx` — `await getCampaignList()` server‑side, then mounts `CampaignInitProvider` which hydrates the `useCampaign` store and calls `selectCampaign(id)`. All children below assume the store is populated.
  - `dashboard` — `DailyStatTable` + `ComparisonChart`
  - `download-data` — bulk export UI
  - `settings/{general,passive-sensing,active-sensing}` — edit existing campaign (wraps children in `ConfigEditInitProvider` with `isNewCampaign={false}`)
- `/create/{general,passive-sensing,active-sensing,confirm}` — new‑campaign wizard. Layout wraps children in `ConfigEditInitProvider` with `isNewCampaign={true}`, which optionally hydrates from a pending imported config in `sessionStorage`. `CampaignCreateSidebar` controls step gating via `useValidConfigState`.

### State (Zustand)

Several small stores instead of one global one. Most are vanilla `create()`; the editable campaign store is `create + immer + zundo (temporal)` for undo/redo.

- `hooks/useCampaign.ts` — canonical fetched campaign (`campaign`, `campaignTables`, `campaignTableFields`, `campaignTableFieldMapping`, `campaignParticipants`, `campaignList`). All maps are keyed by id/uuid. `selectCampaign(id)` is short‑circuited if the id matches `selectedCampaignId` unless `force=true`.
- `hooks/useCampaignConfigEdit.ts` — the editable working copy used by both the `/create` wizard and the `/settings/*` editors. Uses Immer drafts. Survey questions are nested via triggers; mutation helpers take a `questionPath: number[]` of the form `[qIdx, triggerIdx, childQIdx, triggerIdx, …]` and resolve it through `getQuestionArrayAndIndexFromPath` / sibling helpers. New entities use sentinel `id === -1` until persisted; deletions accumulate in `removedEntries` so the next save can issue the corresponding delete calls.
- `hooks/useTemporalStore.ts` — generic helper to subscribe to a zundo `temporal` slice (used by `UndoRedoButtons` and the init providers, which call `clear()` after seeding).
- `hooks/useSectionState.ts` — dashboard view state: `date`, `timeRange`, `selectedSection` (`ComparisonType`), per‑section `comparisonParams`, plus `chartPinQuery` / `draggedTime` for inter‑chart navigation and time‑axis dragging.
- `hooks/useSectionState.ts` is initialized by `SectionStateInitProvider` (auto‑selects first participant, sets `date` based on whether the campaign is upcoming/active/finished).
- `hooks/useDownloadState.ts`, `hooks/configuration/useValidConfigState.ts`, etc.

### Provider pattern

Server components fetch data, then a client `*InitProvider` hydrates the relevant Zustand store in a `useEffect`. When adding a new top‑level page that depends on store state, follow the existing pattern (`CampaignInitProvider`, `ConfigEditInitProvider`, `SectionStateInitProvider`, `DownloadInitProvider`) instead of fetching inside the page.

### Data layer

- `lib/supabase.ts` — single typed Supabase client using `Database` from the generated `lib/schema.ts`. Schema is large (~78 KB) and machine‑generated — treat it as read‑only.
- `lib/supabaseHelper.ts` — `mapQuery` (Promise.allSettled wrapper that returns `Result<T>`), plus `groupByTimestamp` / `groupByTimestampAndBitmask` for shaping bucketed RPC output.
- `services/*.ts` — all Supabase access lives here:
  - `campaignService.ts` — fetch + cascading upserts (`upsertCampaign` → `upsertCampaignTable` → `upsertCampaignTableField` → `…_mapping`; `upsertSurvey` → `upsertSurveyQuestion` → `upsertSurveyTrigger` recursively). Each layer treats `id === -1` as “insert new”, deletes the id, upserts, then propagates returned ids into children before recursing. `restoreSurveyHierarchy` rebuilds the question tree from the flat list returned by the join query.
  - `chartService.ts` — calls Postgres RPCs `bucket_numerical_data` / `bucket_categorical_data` (chosen by `field_type`) and the `campaign_table_row_count` view. `field_type` of `bitmask` reuses the categorical RPC and is reshaped via `groupByTimestampAndBitmask` into a heatmap.
  - `messageService.ts`, `downloadService.ts`.
- `utils/type.ts` — `DeepRequired<T>`, `MakeOptional<T,K>`, and a small Rust‑style `Result`/`Ok`/`Err` used by `mapQuery`.

### Charts

`types/chart.ts` defines 4 `ChartType`s — `numerical | categorical | barcode | heatmap` — sharing a single `TimelineData` envelope. The dashboard offers three `ComparisonType`s (`Sensors`, `Days`, `Participants`) handled by sibling functions in `chartService.ts`; `useTimeline` picks the right one based on `selectedSection`. Bucket size is chosen client‑side from chart pixel width via `getBucketSize` and converted to the Postgres interval string passed to the RPC.

`ChartContainer` keeps its own local `chartOrder` and reconciles it against incoming `timelines` so drag‑reordering is preserved across data refetches (commits `98ba83f`, `cb5d26d` are the relevant context).

## Conventions worth knowing

- New entities in the editable store always start with `id: -1`; service upsert functions strip that sentinel before insert. Don't change this convention without updating every `upsert*` in `campaignService.ts`.
- Survey question mutations go through the `questionPath` API on `useCampaignConfigEdit` — don't reach into `survey.survey_question` directly from components.
- Use `dayjs` (already a dependency) for date math; `DATE_FORMAT` in `utils/date.ts` is the canonical format for Supabase RPC arguments.
- Tailwind v4 + Flowbite‑React; icons via `@iconify/tailwind4` using class names like `icon-[pajamas--expand-left]`.
