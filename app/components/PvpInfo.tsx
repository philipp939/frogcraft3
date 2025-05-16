export default function PvpInfo() {
  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg text-left">
      <h2 className="text-xl font-semibold mb-4">Für Server-Administratoren</h2>

      <div className="space-y-4 text-gray-300 text-sm">
        <p>
          Die PVP-Aktivierungen werden in der Datei{" "}
          <code className="bg-gray-700 px-2 py-1 rounded">pvp_players.json</code> im Minecraft-Server-Verzeichnis
          gespeichert.
        </p>

        <div>
          <h3 className="font-medium text-white mb-2">Option 1: Datapack</h3>
          <p>Erstelle ein Datapack mit folgenden Befehlen in einer Funktion, die regelmäßig ausgeführt wird:</p>
          <pre className="bg-gray-700 p-3 rounded mt-2 overflow-x-auto">
            {`# In function.mcfunction:
team add pvp "PVP"
team modify pvp color red
team modify pvp friendlyFire true

team add nopvp "No PVP"
team modify nopvp color green
team modify nopvp friendlyFire false

# Dann für jeden Spieler:
execute if entity @p[name="SpielerName"] run team join pvp SpielerName`}
          </pre>
        </div>

        <div>
          <h3 className="font-medium text-white mb-2">Option 2: Plugin</h3>
          <p>
            Verwende ein Plugin wie EssentialsX oder ein PVP-Management-Plugin und lese die Liste der Spieler aus der
            JSON-Datei.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-white mb-2">Option 3: Manuelle Verwaltung</h3>
          <p>Überprüfe regelmäßig die JSON-Datei und führe Befehle für neue Spieler aus:</p>
          <pre className="bg-gray-700 p-3 rounded mt-2 overflow-x-auto">
            {`/tag SpielerName add pvp
/tellraw @a ["",{"text":"[Server]","color":"gold"},{"text":" SpielerName hat PVP aktiviert!","color":"red"}]`}
          </pre>
        </div>
      </div>
    </div>
  )
}
