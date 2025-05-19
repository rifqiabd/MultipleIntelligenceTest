-- Create test_results table
create table test_results (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  age integer not null,
  gender text not null,
  student_class text not null,
  date timestamp with time zone default now(),
  results jsonb not null,
  dominant_type text not null
);

-- Enable Row Level Security
alter table test_results enable row level security;

-- Create policies
-- Allow anyone to insert test results
create policy "Anyone can insert test results" 
on test_results for insert 
with check (true);

-- Only authenticated users can view test results
create policy "Authenticated users can view test results" 
on test_results for select 
using (auth.role() = 'authenticated');

-- Only authenticated users can delete test results
create policy "Authenticated users can delete test results" 
on test_results for delete 
using (auth.role() = 'authenticated');

-- Comment on table
comment on table test_results is 'Stores results of multiple intelligence test';
