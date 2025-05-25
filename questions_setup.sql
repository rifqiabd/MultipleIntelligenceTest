-- Create test_questions table
CREATE TABLE IF NOT EXISTS test_questions (
  id TEXT PRIMARY KEY,         -- ID soal (e.g. L1, M2, etc)
  text TEXT NOT NULL,          -- Text pertanyaan
  type TEXT NOT NULL,          -- Tipe kecerdasan
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies for test_questions
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read questions
CREATE POLICY "Authenticated users can read questions" ON test_questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert questions
CREATE POLICY "Authenticated users can create questions" ON test_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update questions
CREATE POLICY "Authenticated users can update questions" ON test_questions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete questions
CREATE POLICY "Authenticated users can delete questions" ON test_questions
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
BEFORE UPDATE ON test_questions
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();

-- Import existing questions from testQuestions.ts file
-- Note: You'll need to manually insert these from the application
-- using the import function or manually from the Supabase dashboard

COMMENT ON TABLE test_questions IS 'Questions for the multiple intelligence test';
COMMENT ON COLUMN test_questions.id IS 'Unique question ID (e.g. L1, M2)';
COMMENT ON COLUMN test_questions.text IS 'Question text';
COMMENT ON COLUMN test_questions.type IS 'Intelligence type this question measures';
