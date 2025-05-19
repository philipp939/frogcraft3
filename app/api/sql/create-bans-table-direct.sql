-- Direkte Tabellenerstellung ohne RPC-Funktion
CREATE TABLE IF NOT EXISTS public.bans (
  id SERIAL PRIMARY KEY,
  uuid TEXT, -- Explizit als TEXT definiert, nicht UUID
  username TEXT NOT NULL,
  reason TEXT NOT NULL,
  banned_by TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER DEFAULT 0,
  source TEXT DEFAULT 'web',
  active BOOLEAN DEFAULT true
);

-- Erstelle Indizes für schnellere Abfragen
CREATE INDEX IF NOT EXISTS idx_bans_username ON public.bans(username);
CREATE INDEX IF NOT EXISTS idx_bans_uuid ON public.bans(uuid);
CREATE INDEX IF NOT EXISTS idx_bans_active ON public.bans(active);
