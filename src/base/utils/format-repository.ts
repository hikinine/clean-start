export function formatRepository(key: string) {
  let id = ""
  for (let i = 0; i < key.length; i++) {
    id += !(key.charCodeAt(i) < 97 && i > 0)
      ? key.charAt(i).toLowerCase()
      : "_" + key.charAt(i).toLowerCase()
  }
  return id
}
