import InfoButton from "./InfoButton"
import RulesButton from "./RulesButton"
import CommandsButton from "./CommandsButton"
import KeybindsButton from "./KeybindsButton"
import DiscordButton from "./DiscordButton"
import ModpackButton from "./ModpackButton"

export default function ButtonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <InfoButton />
      <RulesButton />
      <CommandsButton />
      <KeybindsButton />
      <DiscordButton />
      <ModpackButton />
    </div>
  )
}
