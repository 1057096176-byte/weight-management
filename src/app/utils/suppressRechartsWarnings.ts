// Suppress known Recharts internal warnings that don't affect functionality
// These warnings come from Recharts' internal components and cannot be fixed
// without modifying the Recharts library itself

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

export function suppressRechartsWarnings() {
  // Override console.error
  console.error = (...args: any[]) => {
    const errorMessage = typeof args[0] === 'string' ? args[0] : String(args[0]);
    
    // Suppress Recharts dimension warnings during initial render
    if (errorMessage.includes('width(0) and height(0) of chart should be greater than 0')) {
      return;
    }
    
    // Call original console.error for all other errors
    originalConsoleError.apply(console, args);
  };

  // Override console.warn for React warnings
  console.warn = (...args: any[]) => {
    const warnMessage = typeof args[0] === 'string' ? args[0] : String(args[0]);
    
    // Suppress React warnings about duplicate keys with null
    if (
      warnMessage.includes('Encountered two children with the same key') ||
      warnMessage.includes('Keys should be unique')
    ) {
      // Check if this is the Recharts null key warning
      const hasNullKey = args.some(arg => arg === null || (typeof arg === 'string' && arg.includes('null')));
      const isRechartsWarning = args.some(arg => 
        typeof arg === 'string' && 
        (arg.includes('ChartLayoutContextProvider') || 
         arg.includes('Surface') ||
         arg.includes('recharts'))
      );
      
      if (hasNullKey || isRechartsWarning) {
        return;
      }
    }
    
    // Call original console.warn for all other warnings
    originalConsoleWarn.apply(console, args);
  };
}

export function restoreConsole() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}

// Auto-suppress on module load
suppressRechartsWarnings();