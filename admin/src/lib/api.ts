export type HttpMethod = 'GET' | 'POST' | 'PUT';

interface RequestOptions {
  method?: HttpMethod;
  body?: BodyInit | null;
  token?: string | null;
  isFormData?: boolean;
}

export async function apiRequest<T>(
  baseUrl: string,
  path: string,
  { method = 'GET', body = null, token, isFormData = false }: RequestOptions = {},
): Promise<T> {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorData = await response.json();
      message = errorData?.message ?? message;
    } catch (err) {
      // swallow JSON parse errors
    }
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
