-- Bounty und Kills Felder zur players Tabelle hinzufügen
ALTER TABLE players 
ADD COLUMN IF NOT EXISTS kills INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bounty INTEGER DEFAULT 0;

-- Beispiel-Daten für Leaderboard
INSERT INTO players (username, uuid, kills, bounty, created_at) VALUES
('TestPlayer1', 'uuid-1', 25, 1500, NOW()),
('TestPlayer2', 'uuid-2', 18, 2300, NOW()),
('TestPlayer3', 'uuid-3', 32, 800, NOW()),
('TestPlayer4', 'uuid-4', 12, 3200, NOW()),
('TestPlayer5', 'uuid-5', 41, 950, NOW())
ON CONFLICT (username) DO UPDATE SET
kills = EXCLUDED.kills,
bounty = EXCLUDED.bounty;
