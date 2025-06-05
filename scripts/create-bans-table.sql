-- Bans-Tabelle erstellen
CREATE TABLE IF NOT EXISTS bans (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  banned_by VARCHAR(16) NOT NULL,
  reason TEXT NOT NULL,
  banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  ban_type VARCHAR(20) DEFAULT 'temporary'
);
