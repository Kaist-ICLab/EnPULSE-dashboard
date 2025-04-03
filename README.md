# Tracker Dashboard
## Tehcnical Stacks

- [Next.js](https://nextjs.org) - Framework supporting Folder structure-based routing and starting template of our dashboard 
- [Zustand](https://github.com/pmndrs/zustand) - Framework for react state management
- [Chart.js](https://www.chartjs.org/) - Framework for drawing chart
- [TailwindCSS](https://tailwindcss.com/) - CSS Utility framework

## Routing

- `/`: Redirect to `/campaigns`
- `/campaigns`: List up existing campaigns
- `/campaigns/[id]`: Redirect to `/campaigns/[id]/dashboard` (i.e., use dashboard tab as a default tab)
- `/campaigns/[id]/dashbaord`: The page for exploring data for check missingness
- `/campaigns/[id]/messaging`: The page for managing and communicate with participants
- `/campaigns/[id]/settings`: The page for configuring settings for the campaign

## TODOs
- [x] Fix Error: Route "/campaigns/[id]" used `params.id`. `params` should be awaited before using its properties.
    - Location: `src/app/campaigns/[id]/page.tsx:9:32`
    - Required Action - change to async function
- [ ] Fix Error: 매번 Loading시 Campaign에서 default 값이 보이는 문제 해결
- [ ] Corner case 처리: 유효하지 않는 Campaign 값으로 들어왔을 때 Notfound 404로 처리