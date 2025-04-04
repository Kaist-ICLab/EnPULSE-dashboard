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
- Table 수정 사항:
    - [ ] Date Picker에 따라서 Query 되도록 수정
    - [ ] Rows per page 및 Paging 동작하도록 수정
    - [ ] EMAIL/UID 클릭시 Detail of One으로 이동
    - [ ] Check box 클릭된 참가자들에 대한 state 관리
    - [ ] 가이드 버튼 팝업 구현
    - [ ] Maximum 값 (Timeline, Daily Count) 모두 전역 변수로 관리 - 추후 Setting에서 바꿀 수 있도록
    - [ ] Send 버튼 추후 연결 (Messaging Tab으로...)
    - [ ] Tooltip 추가
- [ ] CategoricalTimeline 및 NumericalTimeline 다듬기
- [ ] Flowbite-React로 일부 component 수정 및 업데이트
    - [ ] Sidebar -> Sidebar
    - [ ] Card -> Card
    - [ ] Dropdown -> Inline Dropdown
    - [ ] Loading -> Spinner
