/**
 *  Return the relative time betweeen a chosen moment and the current time
 * @param previous : time we want to get difference 
 */
export function timeDifference(previous) {
  const current = new Date()
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerWeek = msPerDay * 7
  const elapsed = current - previous

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago'
  } else if (elapsed < msPerWeek) {
    return Math.round(elapsed / msPerDay) + ' days ago'
  } else {
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return new Date(previous).toLocaleString(undefined, dateOptions).replace(/\//g, '.')
  }
}
