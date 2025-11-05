import { getPvpSetting, setPvpSetting } from "@/lib/db"
import type { PvpSetting } from "@/lib/types"

export async function GET() {
  try {
    const setting = await getPvpSetting()
    return Response.json({ setting })
  } catch (error) {
    console.error("Error fetching PVP setting:", error)
    return Response.json({ error: "Failed to fetch PVP setting" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { setting } = body

    if (!["enabled", "disabled", "neutral"].includes(setting)) {
      return Response.json({ error: "Invalid PVP setting" }, { status: 400 })
    }

    const success = await setPvpSetting(setting as PvpSetting)

    if (success) {
      return Response.json({ success: true })
    } else {
      return Response.json({ error: "Failed to update PVP setting" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating PVP setting:", error)
    return Response.json({ error: "Failed to update PVP setting" }, { status: 500 })
  }
}
