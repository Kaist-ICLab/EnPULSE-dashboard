# EnPULSE Dashboard
**EnPULSE Dashboard** is a dashboard component that you can easily use to configure campaigns and monitor collected data for quality assurance.

## How to Use
The dashboard utilizes `SUPABASE_SERVICE_ROLE_KEY`, which means that it has admin privileges. **DO NOT HOST THE DASHBOARD ON PUBLIC SERVERS** or malicious attackers can read, update, and delete all data in the dashboard! The dashboard is suited for local use. But if you do need to host it, do it in a private network so that anonymous people can't access it. 

### Supabase Key Configuration
1. Copy the `.example.env` file and rename it to `.env`. Supabase key values will be read there.
2. Set the value of `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` according to the `.env` file in your self-hosted supabase folder.
3. (Optional) Set `NEXT_PUBLIC_DATABASE_TIMEZONE` to the time zone of the database (the Postgres `TimeZone` setting, `UTC` by default on a fresh install), e.g. `Asia/Seoul`. The Daily Overview uses it to show counts in the browser's time zone. Rebuild after changing it.
4. (Optional) Set `NEXT_PUBLIC_DEMO_MODE=true` when the dashboard is used in a public demo. This hides destructive actions such as removing a campaign. The value is read at build time, so rebuild after changing it.

### Running the Project
To run the dashboard locally, make sure you have Node.js installed, then follow these steps:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   Alternatively, build and start for production:
   ```bash
   npm run build
   npm start
   ```
3. Open `http://localhost:3000` in your browser.

## Important Information & Recent Changes
- **State Management**: The dashboard leverages `Zustand` and `Zundo` to seamlessly preserve local configuration modifications, enabling rapid campaign prototyping without unintended data loss.
- **Deployment Warning**: Remember that the dashboard uses a Service Role Key that has full admin access to the database. It is intended for localized network access only and should **NOT** be hosted publicly without robust network access controls.

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
