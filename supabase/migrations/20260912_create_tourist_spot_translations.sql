-- Create tourist_spot_translations table for professional multilingual content
CREATE TABLE IF NOT EXISTS tourist_spot_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID NOT NULL REFERENCES tourist_spots(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  cultural_note TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  best_time_to_visit TEXT,
  distance_from_pakur_station TEXT,
  entry_fee TEXT,
  timing TEXT,
  nearest_railway TEXT,
  seo_title TEXT,
  seo_description TEXT,
  translation_status VARCHAR(20) NOT NULL DEFAULT 'translated',
  source_updated_at TIMESTAMPTZ,
  translated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_spot_language UNIQUE (spot_id, language)
);

CREATE INDEX IF NOT EXISTS idx_spot_translations_spot_lang ON tourist_spot_translations(spot_id, language);

COMMENT ON TABLE tourist_spot_translations IS 'Stores localized destination content generated via Google Cloud Translation and edited by admins.';
