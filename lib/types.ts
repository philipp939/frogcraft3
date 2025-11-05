export interface PvpPlayer {
  uuid: string
  username: string
  joined_at: string | null
  last_seen: string | null
  playtime_minutes: number
  pvp_enabled: boolean
  verified: boolean
  deaths: number
  kills: number
  bounty: number
  balance: number
}

export interface ServerSettings {
  id: number
  setting_key: string
  setting_value: string | null
}

export type PvpSetting = "enabled" | "disabled" | "neutral"
