package de.frogcraft.manager;

/**
 * Klasse zur Verwaltung der Spielerstatistiken
 */
public class PlayerStats {
    private int playtimeMinutes = 0;
    private int deaths = 0;
    private int kills = 0;
    private int blocksBroken = 0;
    private int blocksPlaced = 0;
    
    public int getPlaytimeMinutes() {
        return playtimeMinutes;
    }
    
    public int getDeaths() {
        return deaths;
    }
    
    public int getKills() {
        return kills;
    }
    
    public int getBlocksBroken() {
        return blocksBroken;
    }
    
    public int getBlocksPlaced() {
        return blocksPlaced;
    }
    
    public void incrementPlaytimeMinutes(int minutes) {
        this.playtimeMinutes += minutes;
    }
    
    public void incrementDeaths() {
        this.deaths++;
    }
    
    public void incrementKills() {
        this.kills++;
    }
    
    public void incrementBlocksBroken(int amount) {
        this.blocksBroken += amount;
    }
    
    public void incrementBlocksPlaced(int amount) {
        this.blocksPlaced += amount;
    }
}
