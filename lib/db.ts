import { sql } from "@vercel/postgres"

// Exportiere eine Funktion zum Ausführen von Abfragen
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now()
    const res = await sql.query(text, params)
    const duration = Date.now() - start
    console.log("Ausgeführte Abfrage", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Datenbankfehler:", error)
    throw error
  }
}
