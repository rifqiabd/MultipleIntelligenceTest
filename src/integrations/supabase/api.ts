import { supabase } from './client';
import type { TestResult } from '@/data/testResultsTypes';
import { SUPABASE_TABLES } from '@/utils/constants';

/**
 * Custom error class for API operations
 */
export class ApiError extends Error {
  constructor(
    message: string, 
    public code?: string, 
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Maps frontend TestResult object to database format
 * @param resultData Frontend test result data
 * @returns Database-formatted test result object
 */
function mapToDbFormat(resultData: TestResult) {
  // Generate a complete DB format object and validate values
  const dbData = {
    // Include ID only if it exists and is not empty
    ...(resultData.id && resultData.id.trim() !== "" ? { id: resultData.id } : {}),
    name: resultData.name || "",
    age: Number(resultData.age) || 0,
    gender: resultData.gender || "",
    student_class: resultData.studentClass || "",
    date: resultData.date || new Date().toISOString(),
    results: resultData.results || {},
    dominant_type: resultData.dominantType || "logical"
  };
  
  return dbData;
}

/**
 * Maps database result back to frontend TestResult format
 * @param dbResult Database result object
 * @returns Frontend-formatted test result object
 */
function mapFromDbFormat(dbResult: any): TestResult {
  return {
    id: dbResult.id,
    name: dbResult.name,
    age: dbResult.age,
    gender: dbResult.gender,
    studentClass: dbResult.student_class,
    date: dbResult.date,
    results: dbResult.results,
    dominantType: dbResult.dominant_type
  };
}

/**
 * Save test result to Supabase
 * @param resultData Test result data to save
 * @returns Object with success status and data or error
 */
export async function saveTestResult(resultData: TestResult) {
  try {
    // Validate the data types before inserting
    const dbData = mapToDbFormat(resultData);
    
    // Ensure date is a valid ISO string
    if (!dbData.date) {
      dbData.date = new Date().toISOString();
    }
    
    // Make sure age is a number
    dbData.age = Number(dbData.age);
    
    // Ensure ID is removed if it's empty (let Supabase generate it)
    if (dbData.id === "") {
      delete dbData.id; // Remove empty ID to let Supabase generate one
    }
    
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.testResults)
      .insert(dbData)
      .select();
    
    if (error) {
      console.error("Insert error details:", error);
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving test result:', error);
    return { success: false, error };
  }
}

/**
 * Get all test results with filtering options
 * @param filters Optional filters for the query
 * @returns Object with success status and data or error
 */
export async function getAllTestResults(filters?: {
  studentClass?: string;
  startDate?: string;
  endDate?: string;
  searchName?: string;
  dominantType?: string;
}) {
  try {
    let query = supabase
      .from(SUPABASE_TABLES.testResults)
      .select('*');
    
    // Apply filters if they exist
    if (filters) {
      // Filter by class
      if (filters.studentClass && filters.studentClass !== 'all') {
        query = query.eq('student_class', filters.studentClass);
      }
      
      // Filter by date range
      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
      }
      
      if (filters.endDate) {
        // Add one day to include the end date in the results
        const endDate = new Date(filters.endDate);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('date', endDate.toISOString().split('T')[0]);
      }
      
      // Filter by name (case insensitive search)
      if (filters.searchName && filters.searchName.trim() !== '') {
        query = query.ilike('name', `%${filters.searchName}%`);
      }
      
      // Filter by dominant intelligence type
      if (filters.dominantType && filters.dominantType !== 'all') {
        query = query.eq('dominant_type', filters.dominantType);
      }
    }
    
    // Apply ordering
    query = query.order('date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Map database results to frontend format
    const mappedResults = data.map(mapFromDbFormat);
    
    return { success: true, data: mappedResults };
  } catch (error) {
    console.error('Error fetching test results:', error);
    return { success: false, error };
  }
}

/**
 * Delete a test result
 * @param id ID of the test result to delete
 * @returns Object with success status and error if any
 */
export async function deleteTestResult(id: string) {
  try {
    const { error } = await supabase
      .from(SUPABASE_TABLES.testResults)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting test result:', error);
    return { success: false, error };
  }
}
