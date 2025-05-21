/**
 * Central export file for all utilities
 * This makes imports cleaner in other files
 */

// Re-export all utilities
export * from './arrays';
export * from './chartConfig';
export * from './constants';
export * from './formatters';
export * from './storage';
export * from './validation';

// Re-export specific types and functions directly
export { 
  shuffleArray, 
  groupBy 
} from './arrays';

export { 
  formatTime, 
  formatDate 
} from './formatters';

export { 
  getRadarChartOptions, 
  getBarChartOptions,
  registerChartComponents 
} from './chartConfig';

export {
  getFromSession,
  saveToSession,
  removeFromSession,
  clearSession
} from './storage';

export {
  validateUserData,
  validateTestResult,
  formatValidationErrors
} from './validation';
