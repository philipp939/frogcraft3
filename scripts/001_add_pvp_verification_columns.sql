-- Add columns for PVP verification system
-- These columns track the previous PVP state and the timestamp of the change
-- allowing for automatic rollback after 60 seconds if not verified

ALTER TABLE public.pvp_players
ADD COLUMN IF NOT EXISTS pvp_previous_enabled boolean,
ADD COLUMN IF NOT EXISTS pvp_change_timestamp timestamp with time zone;
