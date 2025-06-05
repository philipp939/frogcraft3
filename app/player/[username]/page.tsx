import { createServerSupabaseClient } from "@/lib/supabase"
import SettingsPanel from "@/app/components/SettingsPanel"
import PlayerStats from "@/app/components/PlayerStats"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function PlayerPage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username)

  try {
    // Spielerdaten direkt von Supabase abrufen
    const supabase = createServerSupabaseClient()

    const { data: player, error } = await supabase
      .from("players")
      .select("*")
      .eq("username", username.toLowerCase())
      .single()

    if (error) {
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

    const settings = {
      pvp_enabled: player.pvp_enabled || false,
      verified: player.verified || false,
    }

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
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-4">Einstellungen</h2>
                <SettingsPanel username={username} initialSettings={settings} />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Statistiken</h2>
                <PlayerStats stats={player} />
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Minecraft Server Management</p>
        </footer>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Fehler</h1>
          <p className="text-gray-300 mb-6">Ein unerwarteter Fehler ist aufgetreten.</p>
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    )
  }
}
