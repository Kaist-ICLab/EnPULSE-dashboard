// 'use client'
// import Plotly, { Data, Layout } from 'plotly.js';


// const DnDPlotlyChart: React.FC<{
//   title: string;
//   height: number;
//   traces: Data[][];
// }> = ({ title, height, traces }) => {
//   const layout: Partial<Layout> = {
//     margin: { t: 20, b: 40, l: 0, r: 0 },
//     grid: { rows: traces.length, columns: 1, pattern: 'coupled' },
//     xaxis: {
//       type: 'date',
//     },
//     yaxis: {
//       range: [0, 100]
//     },
//     bargap: 0.01,
//   };

//   const handleRelayout = (event: any) => {
//     console.log('=== Relayout Event ===');
//     console.log('Event object:', event);
    
//     if (event['xaxis.range[0]'] !== undefined) {
//       const start = new Date(event['xaxis.range[0]']);
//       const end = new Date(event['xaxis.range[1]']);
//       console.log('X-axis range changed:', {
//         start: start.toISOString(),
//         end: end.toISOString()
//       });
//     }
//   };

//   return (<div className='w-full flex flex-row justify-center items-center'>
//     <h2 className='text-md font-bold text-gray-800'>{title}</h2>
//     <Plot
//       data={traces.map((plots,idx) => (
//         plots.map(plot => ({
//           ...plot,
//           yaxis: `y${idx+1}`,
//           xaxis: `x1`
//         }))
//       )).flat()}
//       layout={layout}
//       style={{ width: '100%', height: `${height}px` }}
//       config={{
//         modeBarButtonsToRemove: [
//           'select2d',
//           'lasso2d',
//           'hoverClosestCartesian',
//           'hoverCompareCartesian',
//           'toggleSpikelines',
//           'toImage',
//         ],
//         displaylogo: false,
//         responsive: true,
//         scrollZoom: true
//       }}
//       onRelayout={handleRelayout}
//     />
//   </div>
//   );
// }


// export const PlotlyNumericalTimelineTrace = (timestamp: number[], value: number[]): Data[] => {
//   return [{
//     x: timestamp,
//     y: value,
//     type: 'bar',
//     marker: { color: '#3b82f6' },
//   }]
// }

// export const PlotlyCategoricalTimlineTrace = (timestamp: number[], value: string[], categories: string[]): Data[] => {
//   const colors = [
//     '#3b82f6',
//     '#10b981',
//     '#f59e0b',
//     '#ef4444',
//     '#8b5cf6',
//   ];
//   const categoryColorMap: { [key: string]: string } = {};
//   categories.forEach((category, index) => {
//     categoryColorMap[category] = colors[(index % 5)];
//   });
//   return categories.map(category => ({
//     x: timestamp,
//     y: value.map(v => v === category ? 1 : 0), // Fixed height of 1 for matching categories
//     type: 'bar',
//     name: category,
//     marker: { color: categoryColorMap[category] },
//   }));
// }

// export default DnDPlotlyChart;