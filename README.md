# EnPULSE Dashboard
## Tehcnical Stacks

- [Next.js](https://nextjs.org) - Framework supporting Folder structure-based routing and starting template of our dashboard 
- [Zustand](https://github.com/pmndrs/zustand) - Framework for react state management
- [Plotly.js](https://plotly.com/javascript/) - Framework for data visualization
- [TailwindCSS](https://tailwindcss.com/) - CSS Utility framework
- [Iconify](https://iconify.design/docs/usage/css/tailwind/tailwind4/) - Icon library, we use Iconify for TailwindCSS
- [Flowbite-React](https://flowbite-react.com/) - Our basic components were implemented by adapting components from Flowbite-Resact
- [Supabase]() -

## Routing

- `/`: Redirect to `/campaigns`
- `/campaigns`: List up existing campaigns
- `/campaigns/[id]`: Redirect to `/campaigns/[id]/dashboard` (i.e., use dashboard tab as a default tab)
- `/campaigns/[id]/dashbaord`: The page for exploring data for check missingness
- `/campaigns/[id]/messaging`: The page for managing and communicate with participants
- `/campaigns/[id]/settings`: The page for configuring settings for the campaign
- `/campaigns/create`: Create new campaign here


Campaigns
- getCampaigns(): Campaign[] - Campaign의 정보만 들고 있으면 됨
- updateCampaignName(name: String): Status & Message - Campaign의 정보를 rename할 수 있도록
- getCampaignTables(campaignId): Table[] -  

%아래 내용은 Campaign Import/Create에서만 지원
- updateDBUrl(campaignId, url): Status & Message -
- updateDBwithFile(campaignId, ) - 

- getCampaignTableSchmea(campaignTableId): Column[]
- updateCampaignTableDailyCountThreshold(campaignTableId, ): 

Messages
- message - WebSocket 처리
- openSocket(campaignId)
- closeSocket(campaignId)
- getMessages(campaignId, userId)
- sendMessages(campaignId, messages: Message[])


SensorData
- getUsers()
- getUserDailySummary(userId,)
- getSensor(userId, datumName, range= (start, end), aggLevel)

SSR로 처리할 것 CSR로 처리할 것에 대한 구분 명확히 필요
