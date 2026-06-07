import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.SUPABASE_POSTGRES_URL!)

// Exportiere eine Funktion zum Ausführen von Abfragen
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now()
    const res = await sql(text, params)
    const duration = Date.now() - start
    console.log("Ausgeführte Abfrage", { text, duration, rows: res.length })
    return res
  } catch (error) {
    console.error("Datenbankfehler:", error)
    throw error
  }
}
