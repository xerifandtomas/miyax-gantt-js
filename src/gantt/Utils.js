export function calculateDays(start, end) {
  const dayAsMilliseconds = 86400000 // 1000 * 60 * 60 * 24
  const diffInTime = start.getTime() - end.getTime()
  return Math.abs(Math.round(diffInTime / dayAsMilliseconds)) + 1
}

export function addDays(date, days) {
  const copy = new Date(date)
  copy.setDate(date.getDate() + days)
  return copy
}

export const DAYS_OF_WEEK_ARRAY = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export const MONTHS_OF_YEAR_ARRAY = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]
