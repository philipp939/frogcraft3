package de.frogcraft.manager;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

/**
 * Befehl zum Anzeigen der Website-URL für Spielereinstellungen
 */
public class SettingsCommand implements CommandExecutor {
    
    public SettingsCommand(FrogCraftManager plugin) {
        // Plugin-Referenz wird nicht benötigt
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (!(sender instanceof Player)) {
            sender.sendMessage("§cDieser Befehl kann nur von Spielern verwendet werden.");
            return true;
        }
        
        Player player = (Player) sender;
        
        player.sendMessage("§a§l=== FrogCraft Einstellungen ===");
        player.sendMessage("§7Du kannst deine Einstellungen auf unserer Website verwalten:");
        player.sendMessage("§b§nhttps://deine-website.vercel.app/player/" + player.getName());
        player.sendMessage("§7Dort kannst du PVP aktivieren, Teleport-Schutz einrichten und mehr!");
        
        return true;
    }
}
