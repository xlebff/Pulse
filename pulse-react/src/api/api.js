const API = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Ошибка ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  register: (data) =>
    request('/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data) =>
    request('/login', { method: 'POST', body: JSON.stringify(data) }),

  createOrder: (data) =>
    request('/orders', { method: 'POST', body: JSON.stringify(data) }),

  getMyOrders: (userId) => request(`/orders/my?userId=${userId}`),

  deleteOrder: (id, userId) =>
    request(`/orders/${id}?userId=${userId}`, { method: 'DELETE' }),

  getMyImages: (userId) => request(`/uploads?userId=${userId}`),

  uploadImage: async (file, userId) => {
    const fd = new FormData()
    fd.append('image', file)

    const res = await fetch(`${API}/uploads?userId=${userId}`, {
      method: 'POST',
      body: fd,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Ошибка ${res.status}`)
    }
    return res.json()
  },

  deleteImage: (id) => request(`/uploads/${id}`, { method: 'DELETE' }),
}