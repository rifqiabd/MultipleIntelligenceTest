/**
 * Format time in mm:ss format
 * @param seconds Total seconds
 * @returns Formatted time string (mm:ss)
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format date in a localized format
 * @param dateString Date string to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', options);
}
