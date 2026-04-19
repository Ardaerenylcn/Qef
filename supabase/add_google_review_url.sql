-- Google Reviews özelliği için yeni kolon
-- Supabase SQL Editor'da çalıştırın
ALTER TABLE cafes ADD COLUMN IF NOT EXISTS google_review_url TEXT NOT NULL DEFAULT '';
