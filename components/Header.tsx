import Image from "next/image"

export default function Header() {
  return (
    <header className="text-center">
      <div className="mb-4">
        <Image
          src="/placeholder.svg?height=100&width=100"
          alt="FrogCraft Logo"
          width={100}
          height={100}
          className="mx-auto"
        />
      </div>
      <h1 className="text-5xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        Willkommen auf FrogCraft
      </h1>
      <p className="text-xl text-gray-300">Dein ultimatives Minecraft-Abenteuer beginnt hier!</p>
    </header>
  )
}

