import { Pool } from "pg"

// Erstelle einen Connection Pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Exportiere eine Funktion zum Ausführen von Abfragen
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Ausgeführte Abfrage", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Datenbankfehler:", error)
    throw error
  }
}

// Exportiere den Pool für direkte Verwendung
export { pool }
