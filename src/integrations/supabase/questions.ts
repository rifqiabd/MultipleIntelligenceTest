import { supabase } from './client';
import { Question } from '@/data/testQuestions';
import { ApiError } from './api';

// Table name for questions - must match the name in questions_setup.sql
const QUESTIONS_TABLE = 'test_questions';

/**
 * Try fetching questions from different possible table names
 * @returns Promise with data from the first successful table query
 */
async function tryFetchFromPossibleTables() {
  // Table names to try, in priority order
  const possibleTables = [
    QUESTIONS_TABLE,        // The main table name (now 'test_questions')
    'table_questions',      // Legacy name that might be used
    'questions'             // Simple name that might be used
  ];
  
  let lastError = null;
  
  // Try each table name until one works
  for (const tableName of possibleTables) {
    try {
      console.log(`Attempting to fetch questions from table: ${tableName}`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('type')
        .order('id');
        
      if (error) {
        console.warn(`Could not fetch from ${tableName}:`, error);
        lastError = error;
        continue; // Try next table
      }
      
      console.log(`Success! Found ${data?.length || 0} questions in table '${tableName}'`);
      return { data, tableName };
    } catch (err) {
      console.warn(`Error with table ${tableName}:`, err);
      lastError = err;
    }
  }
  
  // If we get here, all attempts failed
  throw new ApiError(
    `Failed to fetch questions from any known table name. Last error: ${lastError?.message || 'Unknown'}`,
    lastError?.code || 'MULTIPLE_TABLE_FAILURE'
  );
}

/**
 * Get all questions
 * @returns Promise with questions data
 */
export async function getAllQuestions() {
  try {
    console.log('Fetching questions from Supabase...');
    
    // Try to get data from any available table
    const { data, tableName } = await tryFetchFromPossibleTables();
    
    console.log(`Successfully retrieved ${data?.length || 0} questions from table '${tableName}'`);
    
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
    
    // Log raw response for debugging
    console.log('Raw response from getAllQuestions:', { success: false, error });
    
    // If we failed to get questions from Supabase, fall back to static questions
    // This ensures the app will work even if database connection fails
    try {
      console.log('Falling back to static questions from testQuestions.ts');
      
      // Import static questions from the data file
      const { questions } = await import('@/data/testQuestions');
      
      if (questions && Array.isArray(questions) && questions.length > 0) {
        console.log(`Loaded ${questions.length} static questions as fallback`);
        return {
          success: true,
          data: questions,
          source: 'static' // Flag to indicate these came from static data
        };
      } else {
        console.error('No valid data returned from getAllQuestions');
        return { success: false, error, data: [] };
      }
    } catch (fallbackError) {
      console.error('Failed to load static questions fallback:', fallbackError);
      return { 
        success: false, 
        error,
        fallbackError
      };
    }
  }
}

/**
 * Get questions by type
 * @param type Intelligence type
 * @returns Promise with filtered questions data
 */
export async function getQuestionsByType(type: string) {
  try {
    // Try to fetch using the main table first
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
    } catch (tableError) {
      // If main table fails, try the alternative tables
      console.log(`Failed to get ${type} questions from ${QUESTIONS_TABLE}, trying alternatives`);
      
      // Try to get all questions and filter by type
      const allQuestionsResult = await getAllQuestions();
      
      if (allQuestionsResult.success && allQuestionsResult.data) {
        const filteredQuestions = allQuestionsResult.data.filter(q => q.type === type);
        console.log(`Filtered ${filteredQuestions.length} questions of type ${type}`);
        
        return {
          success: true,
          data: filteredQuestions
        };
      } else {
        throw tableError; // Re-throw the original error
      }
    }
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
    console.log(`Adding new question to table ${QUESTIONS_TABLE}:`, question.id);
    const { data, error } = await supabase
      .from(QUESTIONS_TABLE)
      .insert(question)
      .select();

    if (error) throw new ApiError(error.message, error.code);
    
    console.log(`Successfully added question ${question.id}`);
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
