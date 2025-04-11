export const Frog = ({ position }) => {
  return (
    <div
      className="absolute w-10 h-10 bg-green-600 rounded-full"
      style={{ left: `${position.x}%`, top: `${position.y}%`, transform: "translate(-50%, -50%)" }}
    >
      <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full"></div>
      <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full"></div>
    </div>
  )
}
