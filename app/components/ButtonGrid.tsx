import InfoButton from "./InfoButton"
import RulesButton from "./RulesButton"
import CommandsButton from "./CommandsButton"
import KeybindsButton from "./KeybindsButton"
import DiscordButton from "./DiscordButton"
import ModpackButton from "./ModpackButton"
import SponsorButton from "./SponsorButton"

export default function ButtonGrid() {
  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <InfoButton />
        <RulesButton />
        <CommandsButton />
        <KeybindsButton />
        <DiscordButton />
        <ModpackButton />
      </div>
      <div className="flex justify-center mt-4">
        <SponsorButton />
      </div>
    </div>
  )
}

