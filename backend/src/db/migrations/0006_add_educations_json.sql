-- Migration: 0006_add_educations_json.sql
-- Store multiple education and technical qualifications as a JSON array

ALTER TABLE worker_profiles ADD COLUMN educations TEXT;
