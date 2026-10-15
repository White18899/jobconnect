-- Migration: 0007_add_trade_title.sql
-- Add trade_title column to separate professional title from legal name

ALTER TABLE worker_profiles ADD COLUMN trade_title TEXT;
