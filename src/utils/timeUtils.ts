export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  // Convert milliseconds to seconds
  const seconds = Math.floor(diff / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'Now';
  }
  
  // Convert to minutes
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}${minutes === 1 ? 'm' : 'm'}`;
  }
  
  // Convert to hours
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}${hours === 1 ? 'h' : 'h'}`;
  }
  
  // Convert to days
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}${days === 1 ? 'd' : 'd'}`;
  }
  
  // Convert to weeks
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks}${weeks === 1 ? 'w' : 'w'}`;
  }
  
  // Convert to months
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}${months === 1 ? 'm' : 'm'}`;
  }
  
  // Convert to years
  const years = Math.floor(days / 365);
  return `${years}${years === 1 ? 'y' : 'y'}`;
}