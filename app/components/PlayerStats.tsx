"use client"

interface PlayerStatsProps {
  stats: {
    playtime_minutes: number
    deaths: number
    kills: number
    blocks_broken: number
    blocks_placed: number
    last_updated: string
  }
}

export default function PlayerStats({ stats }: PlayerStatsProps) {
  // Formatiere die Spielzeit in Stunden und Minuten
  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Formatiere das Datum
  const formatDate = (dateString: string) => {
    if (!dateString) return "Nie"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Berechne K/D-Ratio
  const kdRatio = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats.kills > 0 ? "∞" : "0"

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-xl font-semibold mb-4">Spieler-Statistiken</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Spielzeit:</span>
            <span>{formatPlaytime(stats.playtime_minutes || 0)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Tode:</span>
            <span>{stats.deaths || 0}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Kills:</span>
            <span>{stats.kills || 0}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">K/D-Ratio:</span>
            <span>{kdRatio}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Blöcke abgebaut:</span>
            <span>{stats.blocks_broken || 0}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Blöcke platziert:</span>
            <span>{stats.blocks_placed || 0}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Zuletzt aktualisiert:</span>
            <span>{formatDate(stats.last_updated)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
