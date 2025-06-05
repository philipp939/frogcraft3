package de.frogcraft.manager;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;

public class ActionRequestManager {
    
    private final FrogCraftManager plugin;
    private final String apiUrl;
    private final String apiKey;
    
    public ActionRequestManager(FrogCraftManager plugin) {
        this.plugin = plugin;
        this.apiUrl = plugin.getConfig().getString("api.url", "https://deine-website.vercel.app/api/minecraft");
        this.apiKey = plugin.getConfig().getString("api.key", "dein-api-key");
    }
    
    /**
     * Lädt ausstehende Aktionsanfragen für einen Spieler
     */
    public void loadPendingRequests(Player player, RequestCallback callback) {
        new BukkitRunnable() {
            @Override
            public void run() {
                try {
                    // API-Anfrage senden
                    URI uri = new URI(apiUrl + "/action-requests?key=" + apiKey + "&uuid=" + player.getUniqueId().toString() + "&status=pending");
                    HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
                    conn.setRequestMethod("GET");
                    conn.setRequestProperty("Accept", "application/json");
                    
                    // Antwort lesen
                    if (conn.getResponseCode() != 200) {
                        plugin.getLogger().warning("Fehler beim Abrufen der Aktionsanfragen: HTTP-Fehler " + conn.getResponseCode());
                        Bukkit.getScheduler().runTask(plugin, () -> callback.onFailure("HTTP-Fehler " + conn.getResponseCode()));
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
                    JsonArray requestsArray = jsonObject.getAsJsonArray("actionRequests");
                    
                    List<ActionRequest> requests = new ArrayList<>();
                    
                    for (int i = 0; i < requestsArray.size(); i++) {
                        JsonObject requestObject = requestsArray.get(i).getAsJsonObject();
                        int id = requestObject.get("id").getAsInt();
                        String action = requestObject.get("action").getAsString();
                        String createdAt = requestObject.get("created_at").getAsString();
                        
                        requests.add(new ActionRequest(id, action, createdAt));
                    }
                    
                    // Auf dem Hauptthread zurückgeben
                    Bukkit.getScheduler().runTask(plugin, () -> callback.onSuccess(requests));
                    
                } catch (IOException | URISyntaxException e) {
                    plugin.getLogger().log(Level.WARNING, "Fehler beim Laden der Aktionsanfragen", e);
                    Bukkit.getScheduler().runTask(plugin, () -> callback.onFailure(e.getMessage()));
                }
            }
        }.runTaskAsynchronously(plugin);
    }
    
    /**
     * Aktualisiert den Status einer Aktionsanfrage
     */
    public void updateRequestStatus(int requestId, String status, String responseMessage, StatusCallback callback) {
        new BukkitRunnable() {
            @Override
            public void run() {
                try {
                    // JSON-Objekt erstellen
                    JsonObject requestBody = new JsonObject();
                    requestBody.addProperty("requestId", requestId);
                    requestBody.addProperty("status", status);
                    requestBody.addProperty("responseMessage", responseMessage);
                    
                    // API-Anfrage senden
                    URI uri = new URI(apiUrl + "/action-requests?key=" + apiKey);
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
                        plugin.getLogger().warning("Fehler beim Aktualisieren der Aktionsanfrage: HTTP-Fehler " + conn.getResponseCode());
                        Bukkit.getScheduler().runTask(plugin, () -> callback.onFailure("HTTP-Fehler " + conn.getResponseCode()));
                        return;
                    }
                    
                    // Auf dem Hauptthread zurückgeben
                    Bukkit.getScheduler().runTask(plugin, () -> callback.onSuccess());
                    
                } catch (IOException | URISyntaxException e) {
                    plugin.getLogger().log(Level.WARNING, "Fehler beim Aktualisieren der Aktionsanfrage", e);
                    Bukkit.getScheduler().runTask(plugin, () -> callback.onFailure(e.getMessage()));
                }
            }
        }.runTaskAsynchronously(plugin);
    }
    
    /**
     * Führt eine Aktion aus
     */
    public boolean executeAction(Player player, ActionRequest request) {
        String[] actionParts = request.getAction().split(":");
        if (actionParts.length != 2) {
            return false;
        }
        
        String actionType = actionParts[0];
        String actionValue = actionParts[1];
        
        if (actionType.startsWith("toggle_")) {
            String settingName = actionType.replace("toggle_", "");
            boolean value = Boolean.parseBoolean(actionValue);
            
            // Einstellung aktualisieren
            return plugin.updatePlayerSetting(player.getUniqueId(), settingName, value);
        }
        
        return false;
    }
    
    /**
     * Klasse für Aktionsanfragen
     */
    public static class ActionRequest {
        private final int id;
        private final String action;
        private final String createdAt;
        
        public ActionRequest(int id, String action, String createdAt) {
            this.id = id;
            this.action = action;
            this.createdAt = createdAt;
        }
        
        public int getId() {
            return id;
        }
        
        public String getAction() {
            return action;
        }
        
        public String getCreatedAt() {
            return createdAt;
        }
        
        public String getDisplayName() {
            String[] actionParts = action.split(":");
            if (actionParts.length != 2) {
                return action;
            }
            
            String actionType = actionParts[0];
            String actionValue = actionParts[1];
            
            if (actionType.startsWith("toggle_")) {
                String settingName = actionType.replace("toggle_", "");
                String displayName = settingName
                    .replace("_", " ")
                    .toLowerCase();
                
                return displayName + " " + (Boolean.parseBoolean(actionValue) ? "aktivieren" : "deaktivieren");
            }
            
            return action;
        }
    }
    
    /**
     * Callback-Interface für Anfragen
     */
    public interface RequestCallback {
        void onSuccess(List<ActionRequest> requests);
        void onFailure(String errorMessage);
    }
    
    /**
     * Callback-Interface für Status-Updates
     */
    public interface StatusCallback {
        void onSuccess();
        void onFailure(String errorMessage);
    }
}
