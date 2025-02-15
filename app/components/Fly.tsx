export const Fly = ({ position }) => {
  return (
    <div
      className="absolute w-3 h-3 bg-black rounded-full"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    ></div>
  )
}

