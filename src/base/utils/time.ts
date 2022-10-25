export const seconds = (ms: number) => ms * 1000
export const minutes = (ms: number) => ms * 1000 * 60
export const hours = (ms: number) => ms * 1000 * 60 * 60
export const days = (ms: number) => ms * 1000 * 60 * 60 * 24
export const weeks = (ms: number) => ms * 1000 * 60 * 60 * 24 * 7



export const NUMBER = (n: number) => n?.toLocaleString("pt-br", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})