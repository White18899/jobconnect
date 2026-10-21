-- Migration 0010: Add max_applications to jobs table
ALTER TABLE jobs ADD COLUMN max_applications INTEGER DEFAULT 0;
