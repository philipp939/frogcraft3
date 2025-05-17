import { createServerSupabaseClient } from "@/lib/supabase"
import SettingsPanel from "@/app/components/SettingsPanel"
import PlayerStats from "@/app/components/PlayerStats"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
// Add the import for ActionRequestsPanel
import ActionRequestsPanel from "@/app/components/ActionRequestsPanel"

export default async function PlayerPage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username)

  // Spielerdaten abrufen
  const supabase = createServerSupabaseClient()
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/player?username=${encodeURIComponent(username)}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  if (!response.ok) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Fehler</h1>
          <p className="text-gray-300 mb-6">
            Der Spieler konnte nicht gefunden werden oder es ist ein Fehler aufgetreten.
          </p>
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    )
  }

  const data = await response.json()

  // Update the return statement to include ActionRequestsPanel
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Startseite
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Spieler: {username}</h1>
            <p className="text-gray-400">
              Hier kannst du deine Einstellungen verwalten und deine Statistiken einsehen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Einstellungen</h2>
                <SettingsPanel username={username} initialSettings={data.settings} />
              </div>

              <div>
                <ActionRequestsPanel username={username} />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Statistiken</h2>
              <PlayerStats stats={data.stats} />
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
