# EnPULSE Dashboard
**EnPULSE Dashboard** is a dashboard component that you can easily configure campaign and monitor collected data for quality assurance.

## How to Use
The dashboard utilizes `SUPABASE_SERVICE_ROLE_KEY`, which means that it has admin privilleges. **DO NOT HOST THE DASHBOARD ON SERVERS** or malicious attackers can read, update, delete all data in the dashboard! The dashboard is suited for local use. But if you do need to host, do it in a private network so that annonymous people can't access it. 

### Supabase key configuration
1. Copy the `.example.env` file and rename it to `.env`. Supabase key values will be read there.
2. Set the value of `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` according to the `.env` file in your self-hosted supabase folder.

## Tehcnical Stacks
- [Next.js](https://nextjs.org) - Framework supporting Folder structure-based routing and starting template of our dashboard 
- [Zustand](https://github.com/pmndrs/zustand) - Framework for react state management
  - [Zundo](https://github.com/charkour/zundo) - For easy undo/redo implementation
- [visx](https://github.com/airbnb/visx) - Framework for data visualization
- [TailwindCSS](https://tailwindcss.com/) - CSS Utility framework
- [Iconify](https://iconify.design/docs/usage/css/tailwind/tailwind4/) - Icon library, we use Iconify for TailwindCSS
- [Flowbite-React](https://flowbite-react.com/) - Our basic components were implemented by adapting components from Flowbite-Resact
- [Supabase-js](https://github.com/supabase/supabase-js?tab=readme-ov-file) - For communication between the dashboard and Supabase backend

## Related Repositories
- [EnPULSE](https://github.com/Kaist-ICLab/EnPULSE/tree/main): Android library, mobile and smartwatch app for data collection.
