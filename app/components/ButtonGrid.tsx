import DiscordButton from "./DiscordButton"
import RulesButton from "./RulesButton"
import CommandsButton from "./CommandsButton"
import KeybindsButton from "./KeybindsButton"
import ModpackButton from "./ModpackButton"

export default function ButtonGrid() {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-12 gap-4 mt-8 max-w-4xl mx-auto w-full">
      <div className="col-span-6 sm:col-span-12">
        <DiscordButton />
      </div>
      <div className="col-span-3 sm:col-span-4">
        <RulesButton />
      </div>
      <div className="col-span-3 sm:col-span-4">
        <CommandsButton />
      </div>
      <div className="col-span-6 sm:col-span-4">
        <KeybindsButton />
      </div>
      <div className="col-span-6 sm:col-span-12">
        <ModpackButton />
      </div>
    </div>
  )
}

