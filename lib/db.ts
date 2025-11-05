import { supabase } from "./supabase"
import type { PvpPlayer, PvpSetting } from "./types"

export async function getPlayerByUsername(username: string): Promise<PvpPlayer | null> {
  const { data, error } = await supabase.from("pvp_players").select("*").ilike("username", username).single()

  if (error) return null
  return data
}

export async function getTopBounty(limit = 5): Promise<PvpPlayer[]> {
  const { data, error } = await supabase
    .from("pvp_players")
    .select("*")
    .order("bounty", { ascending: false })
    .limit(limit)

  return data || []
}

export async function getTopBalance(limit = 5): Promise<PvpPlayer[]> {
  const { data, error } = await supabase
    .from("pvp_players")
    .select("*")
    .order("balance", { ascending: false })
    .limit(limit)

  return data || []
}

export async function getTopPlaytime(limit = 5): Promise<PvpPlayer[]> {
  const { data, error } = await supabase
    .from("pvp_players")
    .select("*")
    .order("playtime_minutes", { ascending: false })
    .limit(limit)

  return data || []
}

export async function updatePlayerPvpStatus(uuid: string, pvpEnabled: boolean): Promise<boolean> {
  const { data: currentPlayer } = await supabase.from("pvp_players").select("pvp_enabled").eq("uuid", uuid).single()

  const { error } = await supabase
    .from("pvp_players")
    .update({
      pvp_enabled: pvpEnabled,
      verified: false,
      pvp_previous: currentPlayer?.pvp_enabled,
      pvp_change_timestamp: new Date().toISOString(),
    })
    .eq("uuid", uuid)

  return !error
}

export async function checkAndRollbackIfUnverified(uuid: string): Promise<void> {
  const { data } = await supabase
    .from("pvp_players")
    .select("verified, pvp_previous, pvp_change_timestamp")
    .eq("uuid", uuid)
    .single()

  if (data && data.verified === false && data.pvp_change_timestamp) {
    const changeTime = new Date(data.pvp_change_timestamp).getTime()
    const now = new Date().getTime()

    // If 60 seconds have passed and still not verified, rollback
    if (now - changeTime >= 60000) {
      await supabase
        .from("pvp_players")
        .update({
          pvp_enabled: data.pvp_previous,
          verified: false,
          pvp_previous: null,
          pvp_change_timestamp: null,
        })
        .eq("uuid", uuid)
    }
  }
}

export async function verifyPlayerPvp(uuid: string): Promise<boolean> {
  const { error } = await supabase
    .from("pvp_players")
    .update({
      verified: true,
      pvp_previous: null,
      pvp_change_timestamp: null,
    })
    .eq("uuid", uuid)

  return !error
}

export async function getPvpSetting(): Promise<PvpSetting> {
  const { data, error } = await supabase
    .from("server_settings")
    .select("setting_value")
    .eq("setting_key", "pvp_mode")
    .single()

  if (error || !data?.setting_value) return "neutral"
  const value = data.setting_value
  if (value === "true") return "enabled"
  if (value === "false") return "disabled"
  return "neutral"
}

export async function updateAllPlayersPvpStatus(enabled: boolean | null): Promise<boolean> {
  if (enabled === null) {
    // Neutral mode - don't change existing statuses
    return true
  }

  const { error } = await supabase
    .from("pvp_players")
    .update({
      pvp_enabled: enabled,
      verified: true,
    })
    .neq("pvp_enabled", enabled) // Only update if different

  return !error
}

export async function setPvpSetting(value: PvpSetting): Promise<boolean> {
  const dbValue = value === "enabled" ? "true" : value === "disabled" ? "false" : null

  const { data: existing, error: fetchError } = await supabase
    .from("server_settings")
    .select("id")
    .eq("setting_key", "pvp_mode")
    .single()

  const updateSuccess = await updateAllPlayersPvpStatus(
    value === "enabled" ? true : value === "disabled" ? false : null,
  )

  if (!updateSuccess) return false

  if (existing) {
    const { error } = await supabase
      .from("server_settings")
      .update({ setting_value: dbValue })
      .eq("setting_key", "pvp_mode")
    return !error
  } else {
    const { error } = await supabase.from("server_settings").insert({ setting_key: "pvp_mode", setting_value: dbValue })
    return !error
  }
}
