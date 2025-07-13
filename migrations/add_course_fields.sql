-- Add new fields to courses table to match AddCourseForm
ALTER TABLE courses ADD COLUMN IF NOT EXISTS objectives TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS modules TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS passing_score INTEGER DEFAULT 70;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS difficulty TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS has_auto_marking BOOLEAN DEFAULT true;

-- Update existing courses to have auto-marking enabled
UPDATE courses SET has_auto_marking = true WHERE has_auto_marking IS NULL;
UPDATE courses SET passing_score = 70 WHERE passing_score IS NULL;