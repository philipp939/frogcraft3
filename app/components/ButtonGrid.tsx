import DiscordButton from "./DiscordButton"
import RulesButton from "./RulesButton"
import CommandsButton from "./CommandsButton"
import KeybindsButton from "./KeybindsButton"
import ModpackButton from "./ModpackButton"

export default function ButtonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto place-items-center">
      <DiscordButton />
      <RulesButton />
      <CommandsButton />
      <KeybindsButton />
      <ModpackButton />
    </div>
  )
}