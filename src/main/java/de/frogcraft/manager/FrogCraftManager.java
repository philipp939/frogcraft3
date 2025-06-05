package de.frogcraft.manager;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;

public class FrogCraftManager extends JavaPlugin implements Listener {
    
    private String apiUrl;
    private String apiKey;
    private int refreshInterval;
    
    // Cache für Spielereinstellungen
    private final Map<String, Map<String, Boolean>> playerSettings = new ConcurrentHashMap<>();
    
    // Cache für Spielerstatistiken
    private final Map<String, PlayerStats> playerStats = new ConcurrentHashMap<>();

    private ActionRequestManager actionRequestManager;
    
    @Override
    public void onEnable() {
        // Konfiguration speichern/laden
        saveDefaultConfig();
        
        // API-Konfiguration laden
        apiUrl = getConfig().getString("api.url", "https://deine-website.vercel.app/api/minecraft");
        apiKey = getConfig().getString("api.key", "dein-api-key");
        refreshInterval = getConfig().getInt("refresh-interval", 300); // Standardwert: 5 Minuten
        
        // ActionRequestManager initialisieren
        actionRequestManager = new ActionRequestManager(this);
        
        // Event-Listener registrieren
        getServer().getPluginManager().registerEvents(this, this);
        
        // Befehle registrieren
        if (getCommand("settings") != null) {
            getCommand("settings").setExecutor(new SettingsCommand(this));
        }
        if (getCommand("requests") != null) {
            getCommand("requests").setExecutor(new ActionRequestCommand(this, actionRequestManager));
        }
        
        // Spielereinstellungen beim Start laden
        loadPlayerSettings();
        
        // Regelmäßiges Neuladen der Einstellungen planen
        new BukkitRunnable() {
            @Override
            public void run() {
                loadPlayerSettings();
            }
        }.runTaskTimerAsynchronously(this, 20 * refreshInterval, 20 * refreshInterval);
        
        // Regelmäßiges Senden von Spielerstatistiken
        new BukkitRunnable() {
            @Override
            public void run() {
                sendPlayerStats();
            }
        }.runTaskTimerAsynchronously(this, 20 * 60 * 15, 20 * 60 * 15); // Alle 15 Minuten
        
        getLogger().info("FrogCraftManager aktiviert!");
    }
    
    @Override
    public void onDisable() {
        // Spielerstatistiken vor dem Herunterfahren senden
        sendPlayerStats();
        getLogger().info("FrogCraftManager deaktiviert!");
    }
    
    /**
     * Lädt die Spielereinstellungen von der API
     */
    private void loadPlayerSettings() {
        new BukkitRunnable() {
            @Override
            public void run() {
                try {
                    // API-Anfrage senden
                    URI uri = new URI(apiUrl + "?key=" + apiKey);
                    HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
                    conn.setRequestMethod("GET");
                    conn.setRequestProperty("Accept", "application/json");
                    
                    // Antwort lesen
                    if (conn.getResponseCode() != 200) {
                        getLogger().warning("Fehler beim Abrufen der Spielereinstellungen: HTTP-Fehler " + conn.getResponseCode());
                        return;
                    }
                    
                    StringBuilder response = new StringBuilder();
                    try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                            response.append(line);
                        }
                    }
                    
                    // JSON parsen
                    JsonObject jsonObject = JsonParser.parseString(response.toString()).getAsJsonObject();
                    JsonArray playersArray = jsonObject.getAsJsonArray("players");
                    
                    // Spielereinstellungen aktualisieren
                    Map<String, Map<String, Boolean>> newSettings = new HashMap<>();
                    
                    for (JsonElement playerElement : playersArray) {
                        JsonObject playerObject = playerElement.getAsJsonObject();
                        String username = playerObject.get("username").getAsString().toLowerCase();
                        
                        Map<String, Boolean> settings = new HashMap<>();
                        JsonObject settingsObject = playerObject.getAsJsonObject("settings");
                        
                        for (Map.Entry<String, JsonElement> entry : settingsObject.entrySet()) {
                            settings.put(entry.getKey(), entry.getValue().getAsBoolean());
                        }
                        
                        newSettings.put(username, settings);
                    }
                    
                    // Auf dem Hauptthread aktualisieren
                    Bukkit.getScheduler().runTask(FrogCraftManager.this, () -> {
                        playerSettings.clear();
                        playerSettings.putAll(newSettings);
                        getLogger().info("Spielereinstellungen aktualisiert: " + playerSettings.size() + " Spieler");
                    });
                    
                } catch (IOException | URISyntaxException e) {
                    getLogger().log(Level.WARNING, "Fehler beim Laden der Spielereinstellungen", e);
                }
            }
        }.runTaskAsynchronously(this);
    }

    /**
     * Aktualisiert eine Spielereinstellung
     */
    public boolean updatePlayerSetting(UUID playerUuid, String settingName, boolean value) {
        try {
            // Hier würde die tatsächliche Implementierung erfolgen
            // z.B. Speichern in einer Konfigurationsdatei oder Datenbank
            
            // Für dieses Beispiel aktualisieren wir nur den Cache
            String username = getPlayerNameByUuid(playerUuid);
            if (username != null) {
                Map<String, Boolean> settings = playerSettings.computeIfAbsent(username.toLowerCase(), k -> new HashMap<>());
                settings.put(settingName, value);
                
                getLogger().info("Einstellung aktualisiert für " + username + ": " + settingName + " = " + value);
                return true;
            }
            
            return false;
        } catch (Exception e) {
            getLogger().log(Level.WARNING, "Fehler beim Aktualisieren der Einstellung", e);
            return false;
        }
    }
    
    /**
     * Sendet die Spielerstatistiken an die API
     */
    private void sendPlayerStats() {
        if (playerStats.isEmpty()) {
            return;
        }
        
        new BukkitRunnable() {
            @Override
            public void run() {
                try {
                    // Statistiken in JSON umwandeln
                    JsonArray statsArray = new JsonArray();
                    
                    for (Map.Entry<String, PlayerStats> entry : playerStats.entrySet()) {
                        JsonObject statObject = new JsonObject();
                        statObject.addProperty("username", entry.getKey());
                        statObject.addProperty("playtime", entry.getValue().getPlaytimeMinutes());
                        statObject.addProperty("deaths", entry.getValue().getDeaths());
                        statObject.addProperty("kills", entry.getValue().getKills());
                        statObject.addProperty("blocks_broken", entry.getValue().getBlocksBroken());
                        statObject.addProperty("blocks_placed", entry.getValue().getBlocksPlaced());
                        
                        statsArray.add(statObject);
                    }
                    
                    JsonObject requestBody = new JsonObject();
                    requestBody.add("playerStats", statsArray);
                    
                    // API-Anfrage senden
                    URI uri = new URI(apiUrl + "?key=" + apiKey);
                    HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setRequestProperty("Accept", "application/json");
                    conn.setDoOutput(true);
                    
                    // Request-Body schreiben
                    try (OutputStream os = conn.getOutputStream()) {
                        byte[] input = requestBody.toString().getBytes("utf-8");
                        os.write(input, 0, input.length);
                    }
                    
                    // Antwort lesen
                    if (conn.getResponseCode() != 200) {
                        getLogger().warning("Fehler beim Senden der Spielerstatistiken: HTTP-Fehler " + conn.getResponseCode());
                        return;
                    }
                    
                    getLogger().info("Spielerstatistiken erfolgreich gesendet: " + playerStats.size() + " Spieler");
                    
                } catch (IOException | URISyntaxException e) {
                    getLogger().log(Level.WARNING, "Fehler beim Senden der Spielerstatistiken", e);
                }
            }
        }.runTaskAsynchronously(this);
    }
    
    /**
     * Prüft, ob ein Spieler eine bestimmte Einstellung aktiviert hat
     */
    public boolean hasSettingEnabled(String username, String settingName) {
        Map<String, Boolean> settings = playerSettings.get(username.toLowerCase());
        return settings != null && Boolean.TRUE.equals(settings.get(settingName));
    }

    /**
     * Ermittelt den Spielernamen anhand der UUID
     */
    private String getPlayerNameByUuid(UUID uuid) {
        Player player = Bukkit.getPlayer(uuid);
        if (player != null) {
            return player.getName();
        }
        
        // Offline-Spieler suchen
        for (Map.Entry<String, Map<String, Boolean>> entry : playerSettings.entrySet()) {
            Player offlinePlayer = Bukkit.getOfflinePlayer(uuid).getPlayer();
            if (offlinePlayer != null && offlinePlayer.getUniqueId().equals(uuid)) {
                return entry.getKey();
            }
        }
        
        return null;
    }
    
    /**
     * Aktualisiert die Statistiken eines Spielers
     */
    public void updatePlayerStat(String username, String statType, int amount) {
        PlayerStats stats = playerStats.computeIfAbsent(username.toLowerCase(), k -> new PlayerStats());
        
        switch (statType) {
            case "death" -> stats.incrementDeaths();
            case "kill" -> stats.incrementKills();
            case "block_break" -> stats.incrementBlocksBroken(amount);
            case "block_place" -> stats.incrementBlocksPlaced(amount);
            case "playtime" -> stats.incrementPlaytimeMinutes(amount);
        }
    }
    
    /**
     * Event-Handler für Spieler-Login
     */
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        String username = player.getName().toLowerCase();
        
        // Spielzeit-Tracking starten
        new BukkitRunnable() {
            @Override
            public void run() {
                if (player.isOnline()) {
                    updatePlayerStat(username, "playtime", 1); // 1 Minute
                } else {
                    this.cancel();
                }
            }
        }.runTaskTimerAsynchronously(this, 20 * 60, 20 * 60); // Jede Minute
    }
    
    /**
     * Event-Handler für PVP
     */
    @EventHandler
    public void onEntityDamage(EntityDamageByEntityEvent event) {
        if (!(event.getDamager() instanceof Player) || !(event.getEntity() instanceof Player)) {
            return;
        }
        
        Player attacker = (Player) event.getDamager();
        Player victim = (Player) event.getEntity();
        
        // PVP-Einstellung prüfen
        boolean attackerHasPvp = hasSettingEnabled(attacker.getName(), "pvp_enabled");
        boolean victimHasPvp = hasSettingEnabled(victim.getName(), "pvp_enabled");
        
        if (!attackerHasPvp || !victimHasPvp) {
            event.setCancelled(true);
            if (!attackerHasPvp) {
                attacker.sendMessage("§cDu hast PVP nicht aktiviert!");
            } else {
                attacker.sendMessage("§c" + victim.getName() + " hat PVP nicht aktiviert!");
            }
        }
    }
}
