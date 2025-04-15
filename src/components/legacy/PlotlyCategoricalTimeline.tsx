// 'use client'
// import dynamic from 'next/dynamic';
// import { Data, Layout } from 'plotly.js';

// const Plot = dynamic(
//   () => import('react-plotly.js'),
//   {
//       ssr: false,
//       loading: () => <></>
//   },
// );

// interface Colors {
//   [key: string]: string;
// }

// const PlotlyCategoricalTimeline: React.FC<{
//   title: string;
//   timestamp: number[];
//   value: string[];
//   height: number;
//   categories: string[];  
// }> = ({ title, timestamp, value, categories, height }) => {
//   // Default colors for categories
//   const defaultColors: Colors = {
//     'default': '#3b82f6',
//     'category1': '#10b981',
//     'category2': '#f59e0b',
//     'category3': '#ef4444',
//     'category4': '#8b5cf6',
//   };

//   // Assign colors to each category
//   const categoryColors: Colors = {};
//   categories.forEach((category, index) => {
//     categoryColors[category] = defaultColors[`category${(index % 4) + 1}`] || defaultColors['default'];
//   });

//   // Create traces for each category
//   const traces: Data[] = categories.map(category => ({
//     x: timestamp,
//     y: value.map(v => v === category ? 1 : 0), // Fixed height of 1 for matching categories
//     type: 'bar',
//     name: category,
//     marker: { color: categoryColors[category] },
//     width: 0.8, // Adjust bar width
//   }));

//   const layout: Partial<Layout> = {
//     margin: { t: 20, b: 40, l: 0, r: 0 },
//     xaxis: {
//       type: 'date'
//     },
//     yaxis: {
//       range: [0, 1],
//       showticklabels: false,
//       showgrid: false,
//     },
//     barmode: 'stack',
//     bargap: 0.01,
//     showlegend: true,
//     legend: {
//       orientation: 'h',
//       y: -0.2,
//     }
//   };

//   return (
//     <div className='w-full flex flex-row justify-center items-center'>
//       <h2 className='text-md font-bold text-gray-800 mb-2'>{title}</h2>
//       <Plot
//         data={traces}
//         layout={layout}
//         style={{ width: '100%', height: `${height}px` }}
//         config={{
//           modeBarButtonsToRemove: [
//             'zoom2d',
//             'pan2d',
//             'select2d',
//             'lasso2d',
//             'zoomIn2d',
//             'zoomOut2d',
//             'autoScale2d',
//             'hoverClosestCartesian',
//             'hoverCompareCartesian',
//             'toggleSpikelines',
//             'toImage',
//           ],
//           displaylogo: false,
//           responsive: true
//         }}
//       />
//     </div>
//   );
// }

// export default PlotlyCategoricalTimeline; 