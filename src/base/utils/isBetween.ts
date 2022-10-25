export function isBetween(value: number, interval: [number, number]) {
  const [start, end] = interval
  return (value > start) && (value < end)
}