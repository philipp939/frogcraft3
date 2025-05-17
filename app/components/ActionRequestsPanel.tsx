"use client"

import { useEffect, useState } from "react"
import { Clock, Check, X, AlertTriangle } from "lucide-react"

interface ActionRequest {
  id: number
  action: string
  created_at: string
  status: string
  processed_at: string | null
  response_message: string | null
}

interface ActionRequestsPanelProps {
  username: string
}

export default function ActionRequestsPanel({ username }: ActionRequestsPanelProps) {
  const [actionRequests, setActionRequests] = useState<ActionRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActionRequests = async () => {
      try {
        const response = await fetch(`/api/action-requests?username=${encodeURIComponent(username)}`)

        if (!response.ok) {
          throw new Error("Fehler beim Laden der Aktionsanfragen")
        }

        const data = await response.json()
        setActionRequests(data.actionRequests || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActionRequests()
  }, [username])

  // Formatiere die Aktion für die Anzeige
  const formatAction = (action: string) => {
    const [actionType, value] = action.split(":")

    if (actionType.startsWith("toggle_")) {
      const settingName = actionType.replace("toggle_", "")
      const displayName = settingName
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return `${displayName} ${value === "true" ? "aktivieren" : "deaktivieren"}`
    }

    return action
  }

  // Formatiere das Datum
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Statusicon und Farbe
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { icon: <Clock className="w-5 h-5 text-yellow-400" />, color: "text-yellow-400", bg: "bg-yellow-400/10" }
      case "approved":
        return { icon: <Check className="w-5 h-5 text-green-400" />, color: "text-green-400", bg: "bg-green-400/10" }
      case "rejected":
        return { icon: <X className="w-5 h-5 text-red-400" />, color: "text-red-400", bg: "bg-red-400/10" }
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-gray-400" />,
          color: "text-gray-400",
          bg: "bg-gray-400/10",
        }
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center text-gray-400">Aktionsanfragen werden geladen...</div>
  }

  if (error) {
    return <div className="p-4 text-center text-red-400">{error}</div>
  }

  if (actionRequests.length === 0) {
    return <div className="p-4 text-center text-gray-400">Keine Aktionsanfragen vorhanden</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Aktionsanfragen</h3>

      {actionRequests.map((request) => {
        const statusInfo = getStatusInfo(request.status)

        return (
          <div
            key={request.id}
            className={`p-4 rounded-lg border ${
              request.status === "pending"
                ? "border-yellow-800 bg-yellow-900/10"
                : request.status === "approved"
                  ? "border-green-800 bg-green-900/10"
                  : request.status === "rejected"
                    ? "border-red-800 bg-red-900/10"
                    : "border-gray-700 bg-gray-800/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {statusInfo.icon}
                  <span className={`font-medium ${statusInfo.color}`}>
                    {request.status === "pending"
                      ? "Ausstehend"
                      : request.status === "approved"
                        ? "Genehmigt"
                        : request.status === "rejected"
                          ? "Abgelehnt"
                          : request.status}
                  </span>
                </div>
                <p className="text-gray-300">{formatAction(request.action)}</p>
                <p className="text-sm text-gray-500 mt-1">Erstellt am {formatDate(request.created_at)}</p>

                {request.processed_at && (
                  <p className="text-sm text-gray-500 mt-1">Bearbeitet am {formatDate(request.processed_at)}</p>
                )}

                {request.response_message && (
                  <p className="mt-2 text-sm p-2 rounded bg-gray-800/50 border border-gray-700">
                    {request.response_message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
        <p className="text-sm text-blue-300">
          Hinweis: Aktionsanfragen müssen im Spiel bestätigt werden. Verwende den Befehl <code>/settings</code> im
          Spiel, um deine ausstehenden Anfragen zu sehen und zu bestätigen.
        </p>
      </div>
    </div>
  )
}
