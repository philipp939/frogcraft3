import Image from "next/image"

export default function Header() {
  return (
    <header className="text-center mb-2">
      <div className="mb-2">
        <Image
          src="/placeholder.svg?height=60&width=60"
          alt="FrogCraft Logo"
          width={60}
          height={60}
          className="mx-auto"
        />
      </div>
    </header>
  )
}
