export function checkUpdateAvailable(dateTimeString: string): boolean {
  const date = new Date(dateTimeString)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  return diffHours >= 24
}
