export function formatDateTime(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('bg-BG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function avatarFallback(name?: string): string {
  return (
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(name || 'Потребител') +
    '&background=16a34a&color=fff&size=128&bold=true'
  );
}

export function safeCount(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}