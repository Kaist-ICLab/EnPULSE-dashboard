# EnPULSE Dashboard
**EnPULSE Dashboard** is a dashboard component that you can easily use to configure campaigns and monitor collected data for quality assurance.

## Security
> [!WARNING]
> **Do not host this dashboard on a public server.** Anyone who can open it can read, change, and delete everything in your database, including participant data.

The dashboard connects to Supabase with the service role key, which has full admin access and bypasses row-level security. That key is included in the JavaScript sent to the browser, and the dashboard has no login, so anyone who can load the page can extract it.

- **Local use is the default.** `npm run dev` and `npm start` only accept connections from your own machine.
- **Sharing it with a team:** run it on a private network where everyone with access is trusted, and listen on that network's address with `npm start -- -H <private-ip>`.
- **If the key may have been exposed:** generate new Supabase keys, update `.env`, and rebuild.

## Setup

### Prerequisites
- [Node.js](https://nodejs.org) 20.9 or newer
- A running [EnPULSE Backend](https://github.com/Kaist-ICLab/EnPULSE-backend), which provides the database, API, and edge functions. Follow the Quick Start in that repository, which uses Docker.

> [!NOTE]
> The backend's `schema.sql` does not yet include everything this version of the dashboard uses, such as the `campaign_webapp` table and the `campaign-webapp-icons` storage bucket. Until it is updated, campaign pages won't load on a database created from that file.

### 1. Install
```bash
git clone https://github.com/Kaist-ICLab/EnPULSE-dashboard.git
cd EnPULSE-dashboard
npm install
```

### 2. Configure
Copy the example file, then edit `.env`:
```bash
cp .example.env .env
```

| Variable | Required | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | The URL of your Supabase API, such as `http://localhost:8000`. It must be reachable from the browser. |
| `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` | Yes | `SERVICE_ROLE_KEY` from the `.env` file in your Supabase folder. |
| `NEXT_PUBLIC_PENDING_IMPORTED_CONFIG_KEY` | No | Leave as it is. |
| `NEXT_PUBLIC_DATABASE_TIMEZONE` | No | The Postgres `TimeZone` setting, such as `Asia/Seoul`. The default is `UTC`. The Daily Overview uses it to show counts in the browser's time zone. |

These values are fixed when the app is built, so rebuild after changing them.

### 3. Run
For development:
```bash
npm run dev
```

For a production build:
```bash
npm run build
npm start
```

Then open `http://localhost:3000`.

## Development
These checks also run automatically on every pull request. The tests need Node.js 22.12 or newer.
```bash
npm run lint
npx tsc --noEmit
npm test
```

## Troubleshooting
- **"Something went wrong" page:** the dashboard could not load data from Supabase. Check that the backend is running and that the values in `.env` are correct. The server terminal shows the actual error, because production builds hide it from the browser.
- **`Package subpath './version.js' is not defined` when building:** run `npx flowbite-react patch`. `npm install` normally does this for you.

## Technical Stack
- [Next.js](https://nextjs.org) - Framework supporting folder structure-based routing and starting template of our dashboard 
- [Zustand](https://github.com/pmndrs/zustand) - Framework for React state management
  - [Zundo](https://github.com/charkour/zundo) - For easy undo/redo implementation
- [visx](https://github.com/airbnb/visx) - Framework for data visualization
- [TailwindCSS](https://tailwindcss.com/) - CSS utility framework
- [Iconify](https://iconify.design/docs/usage/css/tailwind/tailwind4/) - Icon library, we use Iconify for TailwindCSS
- [Flowbite-React](https://flowbite-react.com/) - Our basic components were implemented by adapting components from Flowbite-React
- [Supabase-js](https://github.com/supabase/supabase-js?tab=readme-ov-file) - For communication between the dashboard and Supabase backend

## Related Repositories
- [EnPULSE](https://github.com/Kaist-ICLab/EnPULSE/tree/main): Android library, mobile and smartwatch app for data collection.
- [EnPULSE Backend](https://github.com/Kaist-ICLab/EnPULSE-backend): Supabase setup, database schema, and edge functions.

## License
[MIT](LICENSE)
