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
- [x] CategoricalTimeline 및 NumericalTimeline 다듬기
    - [x] DnD로 변경 중에 Plotly.js로 변경함
- [ ] Flowbite-React로 일부 component 수정 및 업데이트
    - [x] Card -> Card
    - [ ] Dropdown -> Inline Dropdown
    - [ ] Sidebar -> Sidebar
    - [x] Loading -> Spinner
- [ ] URL/DB file validation logic Database에 맞게 추가

- [x] Categorical Chart도 구현하기
- [x] DnD 리스트로 구현
    - [ ] Top에 기타 상태 표 표시 (Pin 및 넘어가기)
    - [ ] Title / Legend / Pin 상태 표시
- [ ] Relayouting으로 Plot interaction 걸기 (Throttling issue로 보임...)
- [ ] Plotly.js issue - self is not defined error....

1. Brush + Pan
 - 유저가 특정 시간 구간을 드래그로 선택 (brush)
 - 줌 상태에서 좌우 이동 가능 (pan)
2. Dynamic Update by Time Range
 - 전체 데이터를 한 번에 안 그리고
 - 현재 보이는 시간 범위에 맞춰 서버에서 데이터 fetch
3. Multi-Plot (Subplot) Layout
 - 시간축을 공유하는 여러 시계열 subplot 시각화
 - 각 subplot은 drag & drop으로 순서 변경, pinning (위 고정) 가능