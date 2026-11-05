# Campaign trigger data format

The dashboard saves each trigger as a row in the `campaign_trigger` table. The table itself is defined in [EnPULSE Backend](https://github.com/Kaist-ICLab/EnPULSE-backend). This page describes the JSON the dashboard stores in it, which the [EnPULSE Android app](https://github.com/Kaist-ICLab/EnPULSE) reads. The types are defined in `src/types/trigger.ts`.

## `condition`

A tree of conditions. `and`, `or` and `not` can be nested to any depth.

| `type` | Other fields |
| --- | --- |
| `detection` | `sensor`, `value` |
| `and`, `or` | `children`: a list of conditions |
| `not` | `child`: one condition |

`sensor` is `stress`, `physical_activity`, `gesture` or `timing`. The allowed values depend on the sensor:

- **`stress`, `physical_activity`, `gesture`:** listed in `STATIC_TRIGGER_SENSOR_VALUES`. These must match what the Android library emits. A saved value that is removed from the list stays in the database, but no longer appears in the dropdown.
- **`timing`:** the names of the campaign's own schedules, stored in the `config` of its `timing_sensor` table.

## `action`

A list of actions, all of which run when the trigger fires. The column name is singular for historical reasons. Older rows may hold a single object instead of a list; `loadActions` accepts both, and the next save rewrites them as a list.

| `kind` | Fields | Effect |
| --- | --- | --- |
| `ema` | `survey_id`, `minIntervalMillis` | Sends a survey to the phone |
| `watch_ema` | `survey_id`, `minIntervalMillis` | Sends a survey to the smartwatch |
| `notification` | `title`, `description`, `url` (optional), `deviceType`, `minIntervalMillis` | Shows a notification |
| `broadcast` | `action`, `targetPackage` (optional), `extras`, `minIntervalMillis` (optional) | Sends an Android broadcast |

`minIntervalMillis` limits how often an action can fire again. In a `broadcast`, the app treats a missing value as 0.

### Broadcasts

Each item in `extras` has a `key`, a `valueType` (`string`, `int`, `long`, `boolean`, `float` or `double`) and a `value`. The `value` is always stored as a string, and the Android side parses it according to `valueType`.

The phone only acts on one broadcast: `OPEN_WEBAPP_BROADCAST_ACTION`, which opens a web app. The editor's **Open Web App** action (`open_webapp`) is saved as this broadcast, with `survey_id` and `webapp_id` extras, so `open_webapp` never appears in the database.

### Survey and web app IDs

While a campaign is being edited, actions refer to surveys and web apps by their position in the list (`surveyIndex`, `webappIndex`), because new ones don't have IDs yet. `persistAction` replaces these with the real IDs when saving, and `loadAction` converts them back.

## Updating the generated types

`src/lib/schema.ts` is generated from the database, so don't edit it by hand. After a backend schema change, regenerate it:

```bash
npx supabase gen types typescript --db-url "$DATABASE_URL" --schema public > src/lib/schema.ts
```
