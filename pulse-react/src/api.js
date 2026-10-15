const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'neon_token';

export function imageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch(path, options = {}) {
    const token = getToken();

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    // 204 No Content — тела нет
    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));

    // 401 — токен протух/невалидный, разлогиниваем
    if (res.status === 401) {
        setToken(null);
        localStorage.removeItem('neon_current_user');
    }

    if (!res.ok) {
        throw new Error(data.error || `Ошибка ${res.status}`);
    }
    return data;
}