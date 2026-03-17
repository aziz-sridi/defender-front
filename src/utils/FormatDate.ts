export type DateFormatOptions = {
  dateStyle?: 'full' | 'long' | 'medium' | 'short'
  timeStyle?: 'full' | 'long' | 'medium' | 'short'
  locale?: string
}

/**
 * Format a date using Intl.DateTimeFormat
 * @param date - A Date, string, or timestamp
 * @param options - Formatting options
 * @returns formatted date string
 */
export function formatDate(date: Date | string | number, options: DateFormatOptions = {}): string {
  const { locale = 'en-GB', dateStyle = 'medium', timeStyle } = options

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
  })

  return formatter.format(new Date(date))
}

/**
 * Format a date as DD/MM/YYYY (fixed format)
 * @param date - A Date, string, or timestamp
 * @returns date string like "28/09/2025"
 */
export function formatDateCustom(date: Date | string | number): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
