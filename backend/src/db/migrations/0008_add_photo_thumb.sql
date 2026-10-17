-- Migration 0008: Add photo_thumb for 16:9 workshop cover thumbnail
ALTER TABLE worker_profiles ADD COLUMN photo_thumb TEXT;
