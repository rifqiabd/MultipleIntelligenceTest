import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Explicitly check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug check for environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing! Check your .env file.');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)