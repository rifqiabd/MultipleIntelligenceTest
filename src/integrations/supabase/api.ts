import { supabase } from './client';
import type { TestResult } from '@/data/testResultsTypes';

/**
 * Maps frontend TestResult object to database format
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
  
  console.log("[Supabase] Mapped data:", dbData);
  return dbData;
}

/**
 * Maps database result back to frontend TestResult format
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

// Save test result to Supabase
export async function saveTestResult(resultData: TestResult) {
  try {
    console.log("[Supabase] Attempting to save test result:", resultData);
    
    // Validate the data types before inserting
    const dbData = mapToDbFormat(resultData);
    
    console.log("[Supabase] Mapped data for DB:", dbData);
    console.log("[Supabase] Using URL:", import.meta.env.VITE_SUPABASE_URL);
    
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
    
    console.log("[Supabase] Sending data to Supabase...");
    const { data, error } = await supabase
      .from('test_results')
      .insert(dbData)
      .select();
    
    if (error) {
      console.error("[Supabase] Insert error details:", error);
      throw error;
    }
    
    console.log("[Supabase] Successfully saved to Supabase:", data);
    return { success: true, data };
  } catch (error) {
    console.error('[Supabase] Error saving test result:', error);
    return { success: false, error };
  }
}

// Get all test results with filtering options
export async function getAllTestResults(filters?: {
  studentClass?: string;
  startDate?: string;
  endDate?: string;
  searchName?: string;
  dominantType?: string;
}) {
  try {
    let query = supabase
      .from('test_results')
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

// Delete a test result
export async function deleteTestResult(id: string) {
  try {
    const { error } = await supabase
      .from('test_results')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting test result:', error);
    return { success: false, error };
  }
}
