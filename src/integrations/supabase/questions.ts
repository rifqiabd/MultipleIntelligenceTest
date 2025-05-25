import { supabase } from './client';
import { Question } from '@/data/testQuestions';
import { ApiError } from './api';

// Table name for questions
const QUESTIONS_TABLE = 'table_questions';

/**
 * Try fetching from alternative table names in case the main one doesn't exist
 * @returns Data and error from Supabase
 */
async function tryFetchFromPossibleTables() {
  // Possible table names in order of priority
  const possibleTableNames = [
    'table_questions',   // Provided name
    'test_questions',    // Name from setup files
    'questions'          // Simplified name
  ];
  
  // Try each table name until one works
  for (const tableName of possibleTableNames) {
    console.log(`Attempting to fetch from table: ${tableName}`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('type')
      .order('id');
      
    if (!error) {
      // If successful, update the constant for future use
      console.log(`Successfully fetched from table: ${tableName}`);
      return { data, error, tableName };
    }
    
    console.log(`Table ${tableName} check result:`, error ? 'Error' : 'Success');
  }
  
  // If all fail, return the error from the first attempt
  const { data, error } = await supabase
    .from(QUESTIONS_TABLE)
    .select('*');
    
  return { data, error, tableName: QUESTIONS_TABLE };
}

/**
 * Get all questions
 * @returns Promise with questions data
 */
export async function getAllQuestions() {
  try {
    console.log('Attempting to fetch questions from Supabase...');
    const { data, error, tableName } = await tryFetchFromPossibleTables();

    if (error) {
      console.error(`Supabase error when fetching questions from ${tableName}:`, error);
      throw new ApiError(error.message, error.code);
    }
    
    console.log(`Received ${data?.length || 0} questions from Supabase`);
    
    // Validate that the data has the correct structure
    if (data && Array.isArray(data)) {
      // Verify that each question has required fields
      const validQuestions = data.filter(q => q.id && q.text && q.type);
      if (validQuestions.length < data.length) {
        console.warn(`Filtered out ${data.length - validQuestions.length} invalid questions`);
      }
      
      return { 
        success: true, 
        data: validQuestions as Question[] 
      };
    } else {
      console.warn('Received non-array data from Supabase');
      return { 
        success: true, 
        data: [] 
      };
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    return { 
      success: false, 
      error
    };
  }
}

/**
 * Get questions by type
 * @param type Intelligence type
 * @returns Promise with filtered questions data
 */
export async function getQuestionsByType(type: string) {
  try {
    const { data, error } = await supabase
      .from(QUESTIONS_TABLE)
      .select('*')
      .eq('type', type)
      .order('id');

    if (error) throw new ApiError(error.message, error.code);
    
    return { 
      success: true, 
      data: data as Question[] 
    };
  } catch (error) {
    console.error(`Error fetching ${type} questions:`, error);
    return { 
      success: false, 
      error
    };
  }
}

/**
 * Add a new question
 * @param question Question object to add
 * @returns Promise with the added question
 */
export async function addQuestion(question: Question) {
  try {
    const { data, error } = await supabase
      .from(QUESTIONS_TABLE)
      .insert(question)
      .select();

    if (error) throw new ApiError(error.message, error.code);
    
    return { 
      success: true, 
      data: data[0] as Question 
    };
  } catch (error) {
    console.error('Error adding question:', error);
    return { 
      success: false, 
      error
    };
  }
}

/**
 * Update an existing question
 * @param id Question ID
 * @param question Updated question data
 * @returns Promise with update status
 */
export async function updateQuestion(id: string, question: Partial<Question>) {
  try {
    const { data, error } = await supabase
      .from(QUESTIONS_TABLE)
      .update(question)
      .eq('id', id)
      .select();

    if (error) throw new ApiError(error.message, error.code);
    
    return { 
      success: true, 
      data: data[0] as Question 
    };
  } catch (error) {
    console.error('Error updating question:', error);
    return { 
      success: false, 
      error
    };
  }
}

/**
 * Delete a question
 * @param id Question ID to delete
 * @returns Promise with delete status
 */
export async function deleteQuestion(id: string) {
  try {
    const { error } = await supabase
      .from(QUESTIONS_TABLE)
      .delete()
      .eq('id', id);

    if (error) throw new ApiError(error.message, error.code);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { 
      success: false, 
      error
    };
  }
}

/**
 * Import multiple questions at once
 * @param questions Array of questions to import
 * @returns Promise with import status
 */
export async function importQuestions(questions: Question[]) {
  try {
    const { data, error } = await supabase
      .from(QUESTIONS_TABLE)
      .insert(questions)
      .select();

    if (error) throw new ApiError(error.message, error.code);
    
    return { 
      success: true, 
      count: data.length 
    };
  } catch (error) {
    console.error('Error importing questions:', error);
    return { 
      success: false, 
      error
    };
  }
}
