-- Fix tables in Supabase database for Multiple Intelligence Test
-- Run this file if you're having issues with table names or structure

-- Check if the test_questions table exists, if not create it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'test_questions') THEN
    RAISE NOTICE 'Creating test_questions table';
    
    -- Create test_questions table
    CREATE TABLE public.test_questions (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Add RLS policies for test_questions
    ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;

    -- Allow authenticated users to read questions
    CREATE POLICY "Authenticated users can read questions" ON public.test_questions
      FOR SELECT
      TO authenticated
      USING (true);

    -- Allow authenticated users to insert questions
    CREATE POLICY "Authenticated users can create questions" ON public.test_questions
      FOR INSERT
      TO authenticated
      WITH CHECK (true);

    -- Allow authenticated users to update questions
    CREATE POLICY "Authenticated users can update questions" ON public.test_questions
      FOR UPDATE
      TO authenticated
      USING (true);

    -- Allow authenticated users to delete questions
    CREATE POLICY "Authenticated users can delete questions" ON public.test_questions
      FOR DELETE
      TO authenticated
      USING (true);

    -- Add trigger to update the updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_questions_timestamp
    BEFORE UPDATE ON public.test_questions
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at();
    
    -- Add comments
    COMMENT ON TABLE public.test_questions IS 'Questions for the multiple intelligence test';
    COMMENT ON COLUMN public.test_questions.id IS 'Unique question ID (e.g. L1, M2)';
    COMMENT ON COLUMN public.test_questions.text IS 'Question text';
    COMMENT ON COLUMN public.test_questions.type IS 'Intelligence type this question measures';
  ELSE
    RAISE NOTICE 'test_questions table already exists';
  END IF;
  
  -- Check if there are any rows in the test_questions table
  IF (SELECT COUNT(*) FROM public.test_questions) = 0 THEN
    RAISE NOTICE 'test_questions table is empty, importing default questions';
    
    -- Run the import_questions.sql content here
    -- Linguistic Intelligence
    INSERT INTO public.test_questions (id, text, type) VALUES
    ('L1', 'Saya suka membaca buku dan artikel di waktu luang saya', 'linguistic'),
    ('L2', 'Saya merasa mudah menjelaskan ide-ide kompleks kepada orang lain', 'linguistic'),
    ('L3', 'Saya menikmati permainan kata seperti teka-teki silang atau Scrabble', 'linguistic'),
    ('L4', 'Saya pandai mengingat kutipan atau frasa', 'linguistic'),
    ('L5', 'Saya dapat mengekspresikan diri dengan baik dalam tulisan', 'linguistic');

    -- Logical-Mathematical Intelligence
    INSERT INTO public.test_questions (id, text, type) VALUES
    ('M1', 'Saya dapat dengan mudah melakukan perhitungan di kepala saya', 'logical'),
    ('M2', 'Saya suka memecahkan teka-teki atau asah otak', 'logical'),
    ('M3', 'Saya suka menganalisis masalah secara sistematis', 'logical'),
    ('M4', 'Saya pandai mengenali pola dan hubungan', 'logical'),
    ('M5', 'Saya sering bertanya tentang bagaimana sesuatu bekerja', 'logical');
    
    -- Continue with the rest of the questions...
    -- (Add more INSERT statements here from import_questions.sql)
  ELSE
    RAISE NOTICE 'test_questions table already has data';
  END IF;
END $$;

-- Create a view that combines both possible table names
-- This helps with backward compatibility if code uses different table names
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_views WHERE schemaname = 'public' AND viewname = 'all_questions') THEN
    EXECUTE 'CREATE VIEW public.all_questions AS 
      SELECT * FROM public.test_questions';
      
    COMMENT ON VIEW public.all_questions IS 'View that provides access to questions regardless of table name changes';
  END IF;
END $$;

-- Optional: Copy data from table_questions to test_questions if table_questions exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'table_questions') THEN
    RAISE NOTICE 'table_questions found, copying data to test_questions';
    
    -- Copy data that doesn't already exist in test_questions
    INSERT INTO public.test_questions (id, text, type, created_at, updated_at)
    SELECT tq.id, tq.text, tq.type, tq.created_at, tq.updated_at
    FROM public.table_questions tq
    WHERE NOT EXISTS (
      SELECT 1 FROM public.test_questions ttq WHERE ttq.id = tq.id
    );
    
    RAISE NOTICE 'Data migration complete';
  END IF;
END $$;
