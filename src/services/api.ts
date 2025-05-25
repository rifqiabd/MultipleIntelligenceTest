/**
 * API service to handle all API requests with type safety
 * Centralizes API operations for better maintainability
 */

import { TestResult } from "@/data/testResultsTypes";
import { Question } from "@/data/testQuestions";
import { getAllTestResults, saveTestResult, deleteTestResult } from "@/integrations/supabase/api";
import { 
  getAllQuestions, 
  getQuestionsByType, 
  addQuestion, 
  updateQuestion, 
  deleteQuestion,
  importQuestions
} from "@/integrations/supabase/questions";
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

  /**
   * Question operations
   */
  questions: {
    /**
     * Get all questions with optional filters
     */
    getAll: (filters?: { 
      type?: string;
      search?: string;
    }) => Promise<Question[]>;
    
    /**
     * Get questions by type
     */
    getByType: (type: string) => Promise<Question[]>;
    
    /**
     * Add a new question
     */
    add: (question: Question) => Promise<{
      success: boolean;
      data?: Question | null;
      error?: Error | null;
    }>;
    
    /**
     * Update an existing question
     */
    update: (question: Question) => Promise<{
      success: boolean;
      error?: Error | null;
    }>;
    
    /**
     * Delete a question by ID
     */
    delete: (id: string) => Promise<{
      success: boolean;
      error?: Error | null;
    }>;
    
    /**
     * Import questions from a file
     */
    import: (file: File) => Promise<{
      success: boolean;
      error?: Error | null;
    }>;
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
  },

  questions: {
    getAll: async (filters) => {
      try {
        let data;
        
        // If type filter is provided, use getQuestionsByType
        if (filters?.type && filters.type !== 'all') {
          const response = await getQuestionsByType(filters.type);
          data = response.data;
        } else {
          // Otherwise get all questions
          const response = await getAllQuestions();
          console.log("Raw response from getAllQuestions:", response);
          
          if (response && response.data) {
            data = response.data;
            console.log(`Retrieved ${data.length} questions from database`);
          } else {
            console.warn("No valid data returned from getAllQuestions");
            data = [];
          }
        }
        
        // Apply search filter if provided
        if (filters?.search && data) {
          const searchTerm = filters.search.toLowerCase();
          data = data.filter(q => 
            q.text.toLowerCase().includes(searchTerm) || 
            q.id.toLowerCase().includes(searchTerm)
          );
        }
        
        console.log("Final question data:", data);
        return data || [];
      } catch (err) {
        console.error("Error fetching questions:", err);
        return [];
      }
    },
    
    getByType: async (type) => {
      try {
        const { data, error } = await getQuestionsByType(type);
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error(`Error fetching ${type} questions:`, err);
        return [];
      }
    },
    
    add: async (question) => {
      try {
        const response = await addQuestion(question);
        return {
          success: response.success,
          data: response.data,
          error: response.error ? new Error(String(response.error)) : undefined
        };
      } catch (err) {
        console.error("Error adding question:", err);
        return {
          success: false,
          error: err instanceof Error ? err : new Error(String(err))
        };
      }
    },
    
    update: async (question) => {
      try {
        const response = await updateQuestion(question.id, question);
        return {
          success: response.success,
          error: response.error ? new Error(String(response.error)) : undefined
        };
      } catch (err) {
        console.error("Error updating question:", err);
        return {
          success: false,
          error: err instanceof Error ? err : new Error(String(err))
        };
      }
    },
    
    delete: async (id) => {
      try {
        const response = await deleteQuestion(id);
        return {
          success: response.success,
          error: response.error ? new Error(String(response.error)) : undefined
        };
      } catch (err) {
        console.error("Error deleting question:", err);
        return {
          success: false,
          error: err instanceof Error ? err : new Error(String(err))
        };
      }
    },
    
    import: async (file) => {
      try {
        // Process the file to get questions array
        const text = await file.text();
        let questions: Question[] = [];
        
        try {
          questions = JSON.parse(text);
          
          // Validate parsed data (basic validation)
          if (!Array.isArray(questions) || !questions.every(q => q.id && q.text && q.type)) {
            throw new Error("Invalid questions format");
          }
        } catch (parseError) {
          throw new Error("Cannot parse file. Make sure it's a valid JSON array of questions.");
        }
        
        // Import questions to database
        const response = await importQuestions(questions);
        
        return {
          success: response.success,
          error: response.error ? new Error(String(response.error)) : undefined
        };
      } catch (err) {
        console.error("Error importing questions:", err);
        return {
          success: false,
          error: err instanceof Error ? err : new Error(String(err))
        };
      }
    }
  }
};

export default apiService;
