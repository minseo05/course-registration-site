const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function api(path, options = {}) {
  const tokenKey = options.tokenType === 'admin' ? 'adminAccessToken' : 'accessToken';
  const token = localStorage.getItem(tokenKey);

  const { tokenType, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(fetchOptions.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(tokenKey);
    }

    throw new Error(data?.message || '요청 처리에 실패했습니다.');
  }

  return data;
}