// 'use client'
// import dynamic from 'next/dynamic';
// import { Data, Layout } from 'plotly.js';

// const Plot = dynamic(
//   () => import('react-plotly.js'),
//   {
//     ssr: false,
//     loading: () => <></>
//   },
// );

// const TestPlotlyChart: React.FC = () => {
//   // Sample data for testing
//   const timestamps = Array.from({ length: 30 }, (_, i) => {
//     const date = new Date();
//     date.setDate(date.getDate() - (29 - i));
//     return date.getTime();
//   });

//   const values = timestamps.map(() => Math.random() * 100);

//   const data: Data[] = [{
//     x: timestamps,
//     y: values,
//     type: 'scatter',
//     mode: 'lines+markers',
//     name: 'Test Data'
//   }];

//   const layout: Partial<Layout> = {
//     title: 'Test Chart',
//     xaxis: {
//       type: 'date',
//       fixedrange: false // Ensure x-axis is not fixed
//     },
//     yaxis: {
//       title: 'Value',
//       fixedrange: false // Ensure y-axis is not fixed
//     }
//   };

//   return (
//     <div className="w-full h-[500px] p-4">
//       <Plot
//         data={data}
//         layout={layout}
//         style={{ width: '100%', height: '100%' }}
//         config={{
//           displaylogo: false,
//           responsive: true,
//           scrollZoom: true,
//           modeBarButtonsToRemove: [
//             'select2d',
//             'lasso2d',
//             'hoverClosestCartesian',
//             'hoverCompareCartesian',
//             'toggleSpikelines',
//             'toImage'
//           ]
//         }}
//         onRelayout={(event) => {
//           if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
//             console.log('X-axis range changed:', {
//               start: new Date(event['xaxis.range[0]']).toISOString(),
//               end: new Date(event['xaxis.range[1]']).toISOString()
//             });
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default TestPlotlyChart; 