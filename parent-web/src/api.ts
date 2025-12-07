export type HttpMethod = 'GET' | 'POST' | 'PUT';

interface RequestOptions {
  method?: HttpMethod;
  body?: BodyInit | null;
  token?: string | null;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(
  baseUrl: string,
  path: string,
  { method = 'GET', body = null, token, headers = {} }: RequestOptions = {},
): Promise<T> {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const finalHeaders: Record<string, string> = { ...headers };
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }
  const isFormData = body instanceof FormData;
  if (!isFormData && body !== null && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body,
    });
  } catch (err) {
    throw new Error(
      'Unable to reach the server. Check your connection or try again shortly.',
    );
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorData = await response.json();
      message = errorData?.message ?? message;
    } catch {
      const text = await response.text().catch(() => '');
      if (text) {
        message = text;
      }
    }
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
