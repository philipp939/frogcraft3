import Link from "next/link"
import { Users, Shield, Settings, BarChart3, Gamepad2, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">FrogCraft</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-purple-300">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" className="text-white hover:text-purple-300">
                  <Crown className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Willkommen bei <span className="text-purple-400">FrogCraft</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dein ultimatives Minecraft-Erlebnis mit erweiterten Features, Spielerverwaltung und Community-Tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Users className="h-5 w-5 mr-2" />
                Spieler Dashboard
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                <Shield className="h-5 w-5 mr-2" />
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Server Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-purple-400" />
                  Spieler-Einstellungen
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Verwalte deine persönlichen Spieleinstellungen
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li>• PVP Ein-/Ausschalten</li>
                  <li>• Teleport-Schutz</li>
                  <li>• Chat-Einstellungen</li>
                  <li>• Freundschaftssystem</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-400" />
                  Ban-Management
                </CardTitle>
                <CardDescription className="text-gray-400">Erweiterte Moderation und Ban-System</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li>• Temporäre Bans</li>
                  <li>• Permanente Bans</li>
                  <li>• Ban-Historie</li>
                  <li>• Automatische Entbannungen</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
                  Statistiken
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Detaillierte Spieler- und Server-Statistiken
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li>• Spielzeit-Tracking</li>
                  <li>• Kill/Death Ratio</li>
                  <li>• Block-Statistiken</li>
                  <li>• Server-Aktivität</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Server Info */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Server Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Server IP</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-purple-400 text-lg font-mono">frog-craft.de</code>
                <p className="text-gray-400 mt-2">Minecraft Version 1.19+</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Discord</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="https://discord.gg/H2yX7d8Bmv"
                  target="_blank"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Tritt unserer Community bei
                </Link>
                <p className="text-gray-400 mt-2">Für Support und Updates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 FrogCraft. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}
