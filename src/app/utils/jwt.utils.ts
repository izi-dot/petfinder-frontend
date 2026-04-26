export function decodeJwt<T = Record<string, unknown>>(token: string): T | undefined {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // UTF-8 safe dekódovanie
    const jsonString = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );

    return JSON.parse(jsonString) as T;
  } catch {
    return undefined;
  }
}