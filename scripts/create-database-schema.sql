-- Spieler-Tabelle
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  username VARCHAR(16) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_online BOOLEAN DEFAULT FALSE
);

-- Bans-Tabelle
CREATE TABLE IF NOT EXISTS bans (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  banned_by VARCHAR(16) NOT NULL,
  reason TEXT NOT NULL,
  banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  ban_type VARCHAR(20) DEFAULT 'temporary' -- 'temporary', 'permanent'
);

-- Spieler-Einstellungen
CREATE TABLE IF NOT EXISTS player_settings (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  setting_name VARCHAR(50) NOT NULL,
  setting_value BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, setting_name)
);

-- Verfügbare Einstellungen
CREATE TABLE IF NOT EXISTS available_settings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  default_value BOOLEAN DEFAULT FALSE,
  category VARCHAR(50) DEFAULT 'general'
);

-- Server-Logs
CREATE TABLE IF NOT EXISTS server_logs (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
  log_type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Benutzerrollen für Admins
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Standardeinstellungen einfügen
INSERT INTO available_settings (name, display_name, description, default_value, category) VALUES
('pvp_enabled', 'PVP aktiviert', 'Ermöglicht es anderen Spielern, dich zu töten', FALSE, 'combat'),
('teleport_protection', 'Teleport-Schutz', 'Verhindert ungewollte Teleportationen', TRUE, 'protection'),
('chat_notifications', 'Chat-Benachrichtigungen', 'Erhalte Benachrichtigungen für wichtige Events', TRUE, 'communication'),
('friend_requests', 'Freundschaftsanfragen', 'Andere Spieler können dir Freundschaftsanfragen senden', TRUE, 'social')
ON CONFLICT (name) DO NOTHING;
