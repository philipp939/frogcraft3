-- Erstelle die Funktion zum Erstellen der player_stats-Tabelle
CREATE OR REPLACE FUNCTION create_player_stats_table()
RETURNS void AS $$
BEGIN
  -- Prüfe, ob die Tabelle bereits existiert
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'player_stats'
  ) THEN
    -- Erstelle die Tabelle für Spielerstatistiken
    CREATE TABLE public.player_stats (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      playtime_minutes INTEGER DEFAULT 0,
      deaths INTEGER DEFAULT 0,
      kills INTEGER DEFAULT 0,
      last_online TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Erstelle einen Index für schnellere Abfragen nach Benutzernamen
    CREATE INDEX idx_player_stats_username ON public.player_stats(username);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Führe die Funktion aus, um die Tabelle zu erstellen
SELECT create_player_stats_table();
