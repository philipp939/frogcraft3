-- Erstelle die Funktion zum Erstellen der bans-Tabelle
CREATE OR REPLACE FUNCTION create_bans_table()
RETURNS void AS $$
BEGIN
  -- Prüfe, ob die Tabelle bereits existiert
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'bans'
  ) THEN
    -- Erstelle die Tabelle für Banns
    CREATE TABLE public.bans (
      id SERIAL PRIMARY KEY,
      uuid TEXT, -- Geändert von UUID zu TEXT
      username TEXT NOT NULL,
      reason TEXT NOT NULL,
      banned_by TEXT NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      duration_minutes INTEGER DEFAULT 0,
      source TEXT DEFAULT 'web',
      active BOOLEAN DEFAULT true
    );

    -- Erstelle Indizes für schnellere Abfragen
    CREATE INDEX idx_bans_username ON public.bans(username);
    CREATE INDEX idx_bans_uuid ON public.bans(uuid);
    CREATE INDEX idx_bans_active ON public.bans(active);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Führe die Funktion aus, um die Tabelle zu erstellen
SELECT create_bans_table();
