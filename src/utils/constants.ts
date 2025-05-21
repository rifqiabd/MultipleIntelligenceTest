/**
 * Constants used throughout the application
 */

/**
 * Locale to use for date formatting
 */
export const DEFAULT_LOCALE = 'id-ID';

/**
 * Chart colors
 */
export const CHART_COLORS = {
  primary: {
    background: 'rgba(136, 132, 216, 0.2)',
    border: 'rgba(136, 132, 216, 1)',
  },
  secondary: {
    background: 'rgba(59, 130, 246, 0.2)',
    border: 'rgba(59, 130, 246, 1)',
  },
  success: {
    background: 'rgba(16, 185, 129, 0.2)',
    border: 'rgba(16, 185, 129, 1)',
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.2)',
    border: 'rgba(245, 158, 11, 1)',
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: 'rgba(239, 68, 68, 1)',
  },
  bar: [
    'rgba(99, 102, 241, 0.8)',   // Indigo
    'rgba(16, 185, 129, 0.8)',   // Emerald
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(245, 158, 11, 0.8)',   // Amber
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(5, 150, 105, 0.8)'     // Green
  ]
};

/**
 * Keys used for session storage
 */
export const STORAGE_KEYS = {
  userData: 'userData',
  testResult: 'testResult',
  resultSaved: 'resultSavedToSupabase',
};

/**
 * Table names in Supabase
 */
export const SUPABASE_TABLES = {
  testResults: 'test_results',
  users: 'users',
};
