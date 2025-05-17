import { createServerSupabaseClient } from "../../lib/supabase"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()

  // Authentifizierung prüfen
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Moderator-Berechtigung prüfen
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .in("role", ["moderator", "admin"])

  if (!roles || roles.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Zugriff verweigert</h1>
          <p className="text-gray-300 mb-6">Du hast keine Berechtigung, auf den Admin-Bereich zuzugreifen.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  // Admin-Daten abrufen
  const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/admin`, {
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Fehler</h1>
          <p className="text-gray-300 mb-6">Die Admin-Daten konnten nicht abgerufen werden.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  const { players, pendingSettings, logs } = await response.json()

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Zurück zur Startseite
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Admin-Bereich</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Spieler ({players.length})</h2>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2">Benutzername</th>
                      <th className="text-left py-2">Registriert am</th>
                      <th className="text-left py-2">Letzter Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player: any) => (
                      <tr key={player.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-2">
                          <Link
                            href={`/player/${encodeURIComponent(player.username)}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {player.username}
                          </Link>
                        </td>
                        <td className="py-2">{new Date(player.created_at).toLocaleDateString("de-DE")}</td>
                        <td className="py-2">
                          {player.last_login ? new Date(player.last_login).toLocaleDateString("de-DE") : "Nie"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Ausstehende Genehmigungen ({pendingSettings.length})</h2>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 h-[400px] overflow-y-auto">
                {pendingSettings.length === 0 ? (
                  <p className="text-gray-400">Keine ausstehenden Genehmigungen.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingSettings.map((setting: any) => (
                      <div key={setting.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{setting.players.username}</span>
                          <span className="text-sm text-gray-400">
                            {new Date(setting.updated_at).toLocaleString("de-DE")}
                          </span>
                        </div>
                        <p className="mb-4">
                          Möchte <span className="font-medium">{setting.setting_name}</span> auf{" "}
                          <span className={setting.setting_value ? "text-green-400" : "text-red-400"}>
                            {setting.setting_value ? "Aktiviert" : "Deaktiviert"}
                          </span>{" "}
                          setzen.
                        </p>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                            Genehmigen
                          </button>
                          <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                            Ablehnen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Server-Logs</h2>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2">Zeitpunkt</th>
                    <th className="text-left py-2">Typ</th>
                    <th className="text-left py-2">Spieler</th>
                    <th className="text-left py-2">Nachricht</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-2 whitespace-nowrap">{new Date(log.created_at).toLocaleString("de-DE")}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            log.log_type === "error"
                              ? "bg-red-900/50 text-red-300"
                              : log.log_type === "warning"
                                ? "bg-yellow-900/50 text-yellow-300"
                                : log.log_type === "success"
                                  ? "bg-green-900/50 text-green-300"
                                  : "bg-blue-900/50 text-blue-300"
                          }`}
                        >
                          {log.log_type}
                        </span>
                      </td>
                      <td className="py-2">
                        {log.players ? (
                          <Link
                            href={`/player/${encodeURIComponent(log.players.username)}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {log.players.username}
                          </Link>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Minecraft Server Management</p>
      </footer>
    </div>
  )
}
