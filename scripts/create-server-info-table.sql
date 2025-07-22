-- Server Info Cards Tabelle erstellen
CREATE TABLE IF NOT EXISTS server_info_cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'text',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Standard-Karten einfügen (Maximum 4 Karten)
INSERT INTO server_info_cards (title, content, type, position) VALUES
('Server Start', E'Freitag (21.07) um 20:00 Uhr\nVersion: 1.21.6\nIP: kommt Freitag', 'text', 1),
('Links', E'[FrogCraft1 Modpack](https://www.curseforge.com/minecraft/modpacks/frogcraft1)\n[Discord Server](https://discord.com/invite/H2yX7d8Bmv)', 'text', 2),
('Gewinnspiel', E'20€ Preis!\nBalance-Leader nach 4 Wochen gewinnt', 'text', 3)
ON CONFLICT DO NOTHING;
