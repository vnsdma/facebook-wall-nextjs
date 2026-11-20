export function formatFbTimestamp(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
      return 'just now';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24 && date.getDate() === now.getDate()) {
      const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
      return `today at ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
      return `yesterday at ${timeStr}`;
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();

    if (year === now.getFullYear()) {
      return `${month} ${day} at ${timeStr}`;
    }

    return `${month} ${day}, ${year} at ${timeStr}`;
  } catch {
    return 'recently';
  }
}
