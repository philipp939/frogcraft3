-- Spieler-Tabelle
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(36),
  username VARCHAR(16) UNIQUE NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  playtime_minutes INTEGER DEFAULT 0,
  pvp_enabled BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  deaths INTEGER DEFAULT 0,
  kills INTEGER DEFAULT 0,
  bounty INTEGER DEFAULT 0
);

-- Beispiel-Daten für Leaderboard
INSERT INTO players (username, kills, bounty, joined_at) VALUES
('TestPlayer1', 25, 1500, NOW()),
('TestPlayer2', 18, 2300, NOW()),
('TestPlayer3', 32, 800, NOW()),
('TestPlayer4', 12, 3200, NOW()),
('TestPlayer5', 41, 950, NOW())
ON CONFLICT (username) DO UPDATE SET
kills = EXCLUDED.kills,
bounty = EXCLUDED.bounty;
