-- Schema for Vercel Postgres
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for search functionality
CREATE INDEX idx_prompts_title ON prompts(title);
CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_difficulty ON prompts(difficulty);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE
    ON prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();