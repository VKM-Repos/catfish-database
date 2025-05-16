export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function extractTimeFromISO(isoString: string): string {
  const date = new Date(isoString)
  return date.toTimeString().substring(0, 5)

  // Alternatively:
  // return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
