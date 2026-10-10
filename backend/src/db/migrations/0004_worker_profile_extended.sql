-- JobConnect Extended Worker Profile Migration
-- Migration: 0004_worker_profile_extended.sql

ALTER TABLE worker_profiles ADD COLUMN phone TEXT;
ALTER TABLE worker_profiles ADD COLUMN education_level TEXT;
ALTER TABLE worker_profiles ADD COLUMN education_institute TEXT;
ALTER TABLE worker_profiles ADD COLUMN education_year INTEGER;
ALTER TABLE worker_profiles ADD COLUMN education_specialization TEXT;
ALTER TABLE worker_profiles ADD COLUMN past_company TEXT;
ALTER TABLE worker_profiles ADD COLUMN experience_description TEXT;
ALTER TABLE worker_profiles ADD COLUMN linkedin_url TEXT;
ALTER TABLE worker_profiles ADD COLUMN linkedin_synced INTEGER DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN digilocker_verified INTEGER DEFAULT 0;
ALTER TABLE worker_profiles ADD COLUMN digilocker_ref TEXT;
ALTER TABLE worker_profiles ADD COLUMN digilocker_name TEXT;
