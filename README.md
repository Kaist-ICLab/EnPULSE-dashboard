# Tracker Dashboard
## Tehcnical Stacks

- [Next.js](https://nextjs.org) - Framework supporting Folder structure-based routing and starting template of our dashboard 
- [Zustand](https://github.com/pmndrs/zustand) - Framework for react state management
- [Plotly.js](https://plotly.com/javascript/) - Framework for data visualization
- [TailwindCSS](https://tailwindcss.com/) - CSS Utility framework
- [Iconify](https://iconify.design/docs/usage/css/tailwind/tailwind4/) - Icon library, we use Iconify for TailwindCSS
- [Flowbite-React]()https://flowbite-react.com/ - Our basic components were implemented by adapting components from Flowbite-Resact

## Routing

- `/`: Redirect to `/campaigns`
- `/campaigns`: List up existing campaigns
- `/campaigns/[id]`: Redirect to `/campaigns/[id]/dashboard` (i.e., use dashboard tab as a default tab)
- `/campaigns/[id]/dashbaord`: The page for exploring data for check missingness
- `/campaigns/[id]/messaging`: The page for managing and communicate with participants
- `/campaigns/[id]/settings`: The page for configuring settings for the campaign