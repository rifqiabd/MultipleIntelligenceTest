import { supabase } from './client';

/**
 * Check if the Supabase connection is working
 * @returns Promise<boolean> true if connection is working
 */
export async function checkSupabaseConnection() {
  try {
    // Try to ping the database with a simple query
    const { data, error } = await supabase
      .from('test_results')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
}

/**
 * Get the total number of test results in the database
 * @returns Promise<number> the count of test results
 */
export async function getTestResultsCount() {
  try {
    const { count, error } = await supabase
      .from('test_results')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error counting test results:', error);
    return 0;
  }
}

/**
 * Get all unique student classes/majors from the database
 * @returns Promise<string[]> array of unique class names
 */
export async function getUniqueClasses() {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('student_class')
      .order('student_class');
    
    if (error) throw error;
    
    // Extract unique class names
    const classes = new Set(data.map(item => item.student_class));
    return Array.from(classes);
  } catch (error) {
    console.error('Error fetching unique classes:', error);
    return [];
  }
}
