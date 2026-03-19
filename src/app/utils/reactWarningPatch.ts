// Aggressive React warning suppression for known Recharts issues
// This patches React's internal warning system

const originalError = console.error;

// Patch console.error which is what React uses for warnings in development
console.error = function(...args: any[]) {
  // Convert all args to strings for checking
  const stringArgs = args.map(arg => {
    if (typeof arg === 'string') return arg;
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    try {
      return String(arg);
    } catch {
      return '';
    }
  }).join(' ');

  // Filter out Recharts-related duplicate key warnings
  if (
    stringArgs.includes('Encountered two children with the same key') &&
    (stringArgs.includes('null') || args.includes(null))
  ) {
    return; // Suppress this warning
  }

  // Filter out Recharts dimension warnings
  if (stringArgs.includes('width(0) and height(0) of chart should be greater than 0')) {
    return; // Suppress this warning
  }

  // Filter out any warning mentioning Recharts internal components
  if (
    stringArgs.includes('ChartLayoutContextProvider') ||
    stringArgs.includes('CategoricalChartWrapper') ||
    stringArgs.includes('CategoricalChart2')
  ) {
    // Only suppress if it's about keys
    if (stringArgs.includes('same key') || stringArgs.includes('Keys should be unique')) {
      return;
    }
  }

  // Pass through all other errors/warnings
  originalError.apply(console, args);
};

export {}; // Make this a module
