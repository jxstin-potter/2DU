import { useEffect, useRef } from 'react';

// Performance monitoring for API calls
export const measureApiCall = async <T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await apiCall();
    const duration = performance.now() - start;
    console.log(`API Call ${name} took ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`API Call ${name} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};

// Performance monitoring for component renders
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });
};

// Web Vitals monitoring
export const reportWebVitals = (metric: any) => {
  console.log(metric);
  // Here you would typically send the metric to your analytics service
  // Example: sendToAnalytics(metric);
};

// Memory usage monitoring
export const checkMemoryUsage = () => {
  if (performance.memory) {
    const { usedJSHeapSize, totalJSHeapSize } = performance.memory;
    console.log(`Memory Usage: ${(usedJSHeapSize / 1048576).toFixed(2)}MB / ${(totalJSHeapSize / 1048576).toFixed(2)}MB`);
  }
};

// Component render timing
export const measureRender = (componentName: string) => {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    console.log(`${componentName} render took ${duration.toFixed(2)}ms`);
  };
}; 