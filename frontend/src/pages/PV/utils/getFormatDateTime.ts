export const getFormatDateTime = (isoString: string): string => {
  const date = new Date(isoString)

  if (isNaN(date.getTime())) return ''

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${month}월 ${day}일 ${hour}:${minute}`
}
