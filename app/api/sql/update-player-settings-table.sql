-- Update the stored procedure to include the verified field
CREATE OR REPLACE FUNCTION create_player_settings_table()
RETURNS void AS $$
BEGIN
 -- Prüfe, ob die Tabelle bereits existiert
 IF NOT EXISTS (
   SELECT FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename = 'player_settings'
 ) THEN
   -- Erstelle die Tabelle für Spielereinstellungen
   CREATE TABLE public.player_settings (
     id SERIAL PRIMARY KEY,
     username TEXT NOT NULL UNIQUE,
     pvp_enabled BOOLEAN DEFAULT false,
     verified BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Erstelle einen Index für schnellere Abfragen nach Benutzernamen
   CREATE INDEX idx_player_settings_username ON public.player_settings(username);
 ELSE
   -- Prüfe, ob die verified Spalte existiert, falls nicht, füge sie hinzu
   IF NOT EXISTS (
     SELECT FROM information_schema.columns 
     WHERE table_schema = 'public' 
     AND table_name = 'player_settings' 
     AND column_name = 'verified'
   ) THEN
     ALTER TABLE public.player_settings ADD COLUMN verified BOOLEAN DEFAULT false;
   END IF;
 END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update the table
SELECT create_player_settings_table();
