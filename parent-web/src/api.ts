export type HttpMethod = 'GET' | 'POST' | 'PUT';

type BaseUrlInput = string | string[];

interface RequestOptions {
  method?: HttpMethod;
  body?: BodyInit | null;
  token?: string | null;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(
  baseUrl: BaseUrlInput,
  path: string,
  { method = 'GET', body = null, token, headers = {} }: RequestOptions = {},
): Promise<T> {
  const normalizedBases = (Array.isArray(baseUrl) ? baseUrl : [baseUrl])
    .map((value) => value?.trim?.() ?? '')
    .filter(Boolean)
    .map((value) => value.replace(/\/$/, ''))
    .filter((value, index, array) => array.indexOf(value) === index);

  if (normalizedBases.length === 0) {
    throw new Error('API base URL missing');
  }

  let lastNetworkError: Error | null = null;

  for (const base of normalizedBases) {
    const url = `${base}${path}`;
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
      const networkError = new Error(
        'Unable to reach the server. Check your connection or try again shortly.',
        { cause: err },
      );
      networkError.name = 'NetworkError';
      lastNetworkError = networkError;
      continue;
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

  throw lastNetworkError ?? new Error('Unable to reach the server. Check your connection or try again shortly.');
}
