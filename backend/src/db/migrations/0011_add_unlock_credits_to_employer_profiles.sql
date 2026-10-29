-- Migration 0011: Add unlock_credits to employer_profiles table
ALTER TABLE employer_profiles ADD COLUMN unlock_credits INTEGER DEFAULT 3;
