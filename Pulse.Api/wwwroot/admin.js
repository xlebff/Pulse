const API = '/api';
const KEY_STORAGE = 'pulse_admin_key';

const keyInput = document.getElementById('keyInput');
const keyError = document.getElementById('keyError');
const content = document.getElementById('content');

let adminKey = sessionStorage.getItem(KEY_STORAGE) || '';

if (adminKey) {
    keyInput.value = adminKey;
    tryLoadAll().catch(() => {
        adminKey = '';
        sessionStorage.removeItem(KEY_STORAGE);
    });
}

document.getElementById('loginBtn').addEventListener('click', async () => {
    keyError.textContent = '';

    const key = keyInput.value.trim();
    if (!key) {
        keyError.textContent = 'Введите ключ';
        return;
    }

    adminKey = key;
    try {
        await tryLoadAll();
        sessionStorage.setItem(KEY_STORAGE, adminKey);
    } catch (err) {
        adminKey = '';
        keyError.textContent = err.message;
    }
});

async function api(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-Admin-Key': adminKey,
            ...(options.headers || {}),
        },
    });

    if (res.status === 401 || res.status === 403) {
        content.classList.add('hidden');
        throw new Error('Неверный ключ администратора');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Ошибка ${res.status}`);
    }
    return res.json();
}

async function loadUsers() {
    const users = await api('/admin/users');
    const tbody = document.querySelector('#usersTable tbody');
    const userSelect = document.getElementById('userSelect');

    tbody.innerHTML = '';
    userSelect.innerHTML = '';

    users.forEach((u) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(u.name)}</td>
            <td>${escapeHtml(u.email)}</td>
            <td>${escapeHtml(u.role)}</td>
            <td>${u.ordersCount}</td>
            <td>${new Date(u.createdAt).toLocaleString('ru-RU')}</td>
            <td><button class="btn btn--danger btn--sm" data-user-id="${u.id}">Удалить</button></td>
        `;
        tbody.appendChild(tr);

        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = `${u.name} (${u.email})`;
        userSelect.appendChild(opt);
    });
}

async function loadOrders() {
    const [orders, statuses] = await Promise.all([
        api('/admin/orders'),
        api('/admin/statuses'),
    ]);

    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';

    orders.forEach((o) => {
        const statusOptions = statuses
            .map(
                (s) =>
                    `<option value="${escapeHtml(s.name)}" ${s.name === o.status ? 'selected' : ''
                    }>${escapeHtml(s.name)}</option>`
            )
            .join('');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(o.title)}</td>
            <td>${escapeHtml(o.userName)}<br><small>${escapeHtml(o.userEmail)}</small></td>
            <td>${o.months} мес</td>
            <td>${o.total.toLocaleString('ru-RU')} ₽</td>
            <td><span class="badge badge--${escapeHtml(o.status)}">${escapeHtml(o.status)}</span></td>
            <td>${new Date(o.createdAt).toLocaleString('ru-RU')}</td>
            <td><select data-order-id="${o.id}">${statusOptions}</select></td>
        `;
        tbody.appendChild(tr);
    });
}

async function loadGallery() {
    const images = await api('/uploads');
    const box = document.getElementById('gallery');

    if (images.length === 0) {
        box.innerHTML = '<p class="error" style="color: var(--muted)">Пока нет загруженных изображений</p>';
        return;
    }

    box.innerHTML = images
        .map(
            (i) => `
            <figure class="gallery__item">
                <img class="gallery__thumb" src="${escapeHtml(i.path)}" alt="" />
                <figcaption class="gallery__caption">
                    <strong>${escapeHtml(i.userName)}</strong>
                </figcaption>
                <button class="btn btn--danger btn--sm" data-image-id="${i.id}">Удалить</button>
            </figure>
        `
        )
        .join('');
}

document.querySelector('#usersTable').addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.userId;
    if (!confirm('Удалить пользователя и все его абонементы?')) return;

    try {
        await api(`/admin/users/${id}`, { method: 'DELETE' });
        await Promise.all([loadUsers(), loadOrders()]);
    } catch (err) {
        alert(err.message);
    }
});

document.querySelector('#ordersTable').addEventListener('change', async (e) => {
    if (e.target.tagName !== 'SELECT') return;

    const id = e.target.dataset.orderId;
    const status = e.target.value;

    try {
        await api(`/admin/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        await loadOrders();
    } catch (err) {
        alert(err.message);
    }
});

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const userId = document.getElementById('userSelect').value;
    const file = document.getElementById('fileInput').files[0];
    const status = document.getElementById('uploadStatus');

    status.textContent = '';

    if (!userId) {
        status.textContent = 'Выберите пользователя';
        return;
    }

    if (!file) {
        status.textContent = 'Выберите файл';
        return;
    }

    const fd = new FormData();
    fd.append('image', file);

    try {
        const res = await fetch(`${API}/uploads?userId=${userId}`, {
            method: 'POST',
            headers: { 'X-Admin-Key': adminKey },
            body: fd,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Ошибка ${res.status}`);
        }

        document.getElementById('fileInput').value = '';
        await loadGallery();
    } catch (err) {
        status.textContent = err.message;
    }
});

document.getElementById('gallery').addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.imageId;
    if (!confirm('Удалить изображение?')) return;

    try {
        await api(`/uploads/${id}`, { method: 'DELETE' });
        await loadGallery();
    } catch (err) {
        alert(err.message);
    }
});

function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

async function tryLoadAll() {
    await Promise.all([loadUsers(), loadOrders(), loadGallery()]);
    content.classList.remove('hidden');
}