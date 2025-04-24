'use client'

let plotlyPromise: Promise<any> | null = null;

const isClient = typeof window !== 'undefined';

export const loadPlotly = async (): Promise<any> => {
  if (!plotlyPromise) {
    plotlyPromise = new Promise((resolve, reject) => {
      try {
        import('plotly.js-dist-min')
          .then((module) => {
            resolve(module.default);
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }
  return plotlyPromise;
};

// Helper function to create a plot with dynamic loading
export const createPlot = async (
  element: HTMLElement,
  data: any[],
  layout: Record<string, any>,
  config?: Record<string, any>
): Promise<any> => {
  if (!isClient) return null;

  try {
    const Plot = await loadPlotly();
    return Plot.newPlot(element, data, layout, config);
  } catch (error) {
    console.error('Error creating plot:', error);
    return null;
  }
}; 