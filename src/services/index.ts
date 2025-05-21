/**
 * Central export file for all services
 */

// Export API service as default
import apiService from './api';
export default apiService;

// Named export for when we have multiple services
export { default as apiService } from './api';
