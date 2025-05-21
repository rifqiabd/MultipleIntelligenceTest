/**
 * API service to handle all API requests with type safety
 * Centralizes API operations for better maintainability
 */

import { TestResult } from "@/data/testResultsTypes";
import { getAllTestResults, saveTestResult, deleteTestResult } from "@/integrations/supabase/api";
import { checkSupabaseConnection, getTestResultsCount, getUniqueClasses } from "@/integrations/supabase/utils";

interface ApiService {
  /**
   * Connection operations
   */
  connection: {
    /**
     * Check if connection to database is available
     */
    checkConnection: () => Promise<boolean>;
    /**
     * Get total count of test results
     */
    getResultsCount: () => Promise<number>;
  };
  
  /**
   * Test results operations
   */
  results: {
    /**
     * Get all test results with optional filters
     */
    getAll: (filters?: { 
      studentClass?: string;
      dateFrom?: string;
      dateTo?: string;
      search?: string;
    }) => Promise<TestResult[]>;
    
    /**
     * Save a test result
     */
    save: (result: TestResult) => Promise<{
      success: boolean;
      data?: TestResult | null;
      error?: Error | null;
    }>;
    
    /**
     * Delete a test result by ID
     */
    delete: (id: string) => Promise<{
      success: boolean;
      error?: Error | null;
    }>;
    
    /**
     * Get unique class names from test results
     */
    getUniqueClasses: () => Promise<string[]>;
  };
}

/**
 * API service implementation
 */
const apiService: ApiService = {
  connection: {
    checkConnection: checkSupabaseConnection,
    getResultsCount: getTestResultsCount,
  },
  
  results: {
    getAll: async (filters) => {
      try {
        const { data, error } = await getAllTestResults(filters);
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching test results:", err);
        return [];
      }
    },
    
    save: async (result) => {
      try {
        const response = await saveTestResult(result);
        // Ensure proper type handling for the response
        return {
          success: response.success,
          data: response.data ? (Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null) : null,
          error: response.error ? new Error(String(response.error)) : undefined
        };
      } catch (err) {
        console.error("Error saving test result:", err);
        return {
          success: false,
          error: err instanceof Error ? err : new Error(String(err))
        };
      }
    },
    
    delete: async (id) => {
      try {
        await deleteTestResult(id);
        return { success: true };
      } catch (err) {
        console.error("Error deleting test result:", err);
        return {
          success: false,
          error: err instanceof Error ? err : new Error(String(err))
        };
      }
    },
    
    getUniqueClasses: async () => {
      try {
        return await getUniqueClasses();
      } catch (err) {
        console.error("Error fetching unique classes:", err);
        return [];
      }
    }
  }
};

export default apiService;
