-- Migration 0012: Add maps_url to jobs and employer_profiles
ALTER TABLE jobs ADD COLUMN maps_url TEXT;
ALTER TABLE employer_profiles ADD COLUMN maps_url TEXT;
