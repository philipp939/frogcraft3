package de.frogcraft.manager;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

import de.frogcraft.manager.ActionRequestManager.ActionRequest;
import net.md_5.bungee.api.chat.ClickEvent;
import net.md_5.bungee.api.chat.HoverEvent;
import net.md_5.bungee.api.chat.TextComponent;
import net.md_5.bungee.api.chat.hover.content.Text;

import java.util.List;

public class ActionRequestCommand implements CommandExecutor {
    
    private final ActionRequestManager requestManager;
    
    public ActionRequestCommand(FrogCraftManager plugin, ActionRequestManager requestManager) {
        this.requestManager = requestManager;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage("§cDieser Befehl kann nur von Spielern verwendet werden.");
            return true;
        }
        
        Player player = (Player) sender;
        
        if (args.length == 0) {
            // Ausstehende Anfragen anzeigen
            player.sendMessage("§a§l=== Ausstehende Aktionsanfragen ===");
            player.sendMessage("§7Lade Anfragen...");
            
            requestManager.loadPendingRequests(player, new ActionRequestManager.RequestCallback() {
                @Override
                public void onSuccess(List<ActionRequest> requests) {
                    if (requests.isEmpty()) {
                        player.sendMessage("§7Du hast keine ausstehenden Anfragen.");
                        return;
                    }
                    
                    player.sendMessage("§7Du hast §e" + requests.size() + " §7ausstehende Anfragen:");
                    
                    for (ActionRequest request : requests) {
                        // Interaktive Nachricht erstellen
                        TextComponent message = new TextComponent("§e" + request.getDisplayName() + " ");
                        
                        TextComponent acceptButton = new TextComponent("§a[Annehmen]");
                        acceptButton.setClickEvent(new ClickEvent(ClickEvent.Action.RUN_COMMAND, "/requests accept " + request.getId()));
                        acceptButton.setHoverEvent(new HoverEvent(HoverEvent.Action.SHOW_TEXT, new Text("§aKlicke, um diese Anfrage anzunehmen")));
                        
                        TextComponent rejectButton = new TextComponent(" §c[Ablehnen]");
                        rejectButton.setClickEvent(new ClickEvent(ClickEvent.Action.RUN_COMMAND, "/requests reject " + request.getId()));
                        rejectButton.setHoverEvent(new HoverEvent(HoverEvent.Action.SHOW_TEXT, new Text("§cKlicke, um diese Anfrage abzulehnen")));
                        
                        message.addExtra(acceptButton);
                        message.addExtra(rejectButton);
                        
                        player.spigot().sendMessage(message);
                    }
                }
                
                @Override
                public void onFailure(String errorMessage) {
                    player.sendMessage("§cFehler beim Laden der Anfragen: " + errorMessage);
                }
            });
            
            return true;
        } else if (args.length == 2) {
            String action = args[0].toLowerCase();
            int requestId;
            
            try {
                requestId = Integer.parseInt(args[1]);
            } catch (NumberFormatException e) {
                player.sendMessage("§cUngültige Anfrage-ID.");
                return true;
            }
            
            if (action.equals("accept")) {
                // Anfrage annehmen
                player.sendMessage("§7Verarbeite Anfrage...");
                
                requestManager.loadPendingRequests(player, new ActionRequestManager.RequestCallback() {
                    @Override
                    public void onSuccess(List<ActionRequest> requests) {
                        ActionRequest targetRequest = null;
                        
                        for (ActionRequest request : requests) {
                            if (request.getId() == requestId) {
                                targetRequest = request;
                                break;
                            }
                        }
                        
                        if (targetRequest == null) {
                            player.sendMessage("§cAnfrage nicht gefunden oder nicht mehr ausstehend.");
                            return;
                        }
                        
                        // Aktion ausführen
                        boolean success = requestManager.executeAction(player, targetRequest);
                        
                        if (success) {
                            // Status aktualisieren
                            requestManager.updateRequestStatus(requestId, "approved", "Vom Spieler im Spiel bestätigt", new ActionRequestManager.StatusCallback() {
                                @Override
                                public void onSuccess() {
                                    player.sendMessage("§aAnfrage erfolgreich angenommen und ausgeführt.");
                                }
                                
                                @Override
                                public void onFailure(String errorMessage) {
                                    player.sendMessage("§cFehler beim Aktualisieren des Anfragestatus: " + errorMessage);
                                }
                            });
                        } else {
                            player.sendMessage("§cFehler beim Ausführen der Aktion.");
                        }
                    }
                    
                    @Override
                    public void onFailure(String errorMessage) {
                        player.sendMessage("§cFehler beim Laden der Anfragen: " + errorMessage);
                    }
                });
                
                return true;
            } else if (action.equals("reject")) {
                // Anfrage ablehnen
                player.sendMessage("§7Verarbeite Anfrage...");
                
                requestManager.updateRequestStatus(requestId, "rejected", "Vom Spieler im Spiel abgelehnt", new ActionRequestManager.StatusCallback() {
                    @Override
                    public void onSuccess() {
                        player.sendMessage("§aAnfrage erfolgreich abgelehnt.");
                    }
                    
                    @Override
                    public void onFailure(String errorMessage) {
                        player.sendMessage("§cFehler beim Aktualisieren des Anfragestatus: " + errorMessage);
                    }
                });
                
                return true;
            }
        }
        
        player.sendMessage("§cVerwendung: /requests [accept|reject] [id]");
        return true;
    }
}
