import Cookies from 'js-cookie';

export function getAccessToken(): string | undefined {
  return Cookies.get('accessToken');
}

export function setAccessToken(token: string): void {
  Cookies.set('accessToken', token, {
    secure: import.meta.env.PROD,
    sameSite: 'Lax',
  });
}

export function clearTokens(): void {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'High':
      return 'text-red-600';
    case 'Medium':
      return 'text-orange-600';
    case 'Low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
