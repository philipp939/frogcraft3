-- Server Info Cards Tabelle erstellen
CREATE TABLE IF NOT EXISTS server_info_cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'text',
  url TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Standard-Karten einfügen
INSERT INTO server_info_cards (title, content, type, url, position) VALUES
('Server IP', E'Minecraft Version 1.21.6\nIP wird ein paar Stunden vor Server Start hier stehen', 'text', NULL, 1),
('Server Start', '21.07.2025 um 20:00 Uhr', 'text', NULL, 2),
('FrogCraft1 Modpack', 'Download auf CurseForge', 'link', 'https://www.curseforge.com/minecraft/modpacks/frogcraft1', 3),
('Discord Server', 'Tritt unserer Community bei', 'link', 'https://discord.com/invite/H2yX7d8Bmv', 4),
('Gewinnspiel', E'20€ Preis!\nBalance-Leader nach 4 Wochen gewinnt', 'text', NULL, 5)
ON CONFLICT DO NOTHING;
