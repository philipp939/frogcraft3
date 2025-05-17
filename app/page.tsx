import PlayerSearch from "./components/PlayerSearch"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Minecraft Server Management</h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Gib deinen Minecraft-Benutzernamen ein, um deine Einstellungen anzuzeigen und zu verwalten.
          </p>

          <PlayerSearch />

          <div className="mt-12 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Über dieses Portal</h2>
            <p className="text-gray-400">
              Hier kannst du verschiedene Einstellungen für deinen Spieler auf unserem Minecraft-Server verwalten. Du
              kannst PVP aktivieren, Teleport-Schutz einrichten und vieles mehr.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Minecraft Server Management</p>
      </footer>
    </div>
  )
}
