const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!RAW_API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL이 설정되지 않았습니다.');
}

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, '');

export async function api(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const tokenKey = options.tokenType === 'admin' ? 'adminAccessToken' : 'accessToken';
  const token = localStorage.getItem(tokenKey);

  const { tokenType, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
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