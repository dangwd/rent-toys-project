import { io } from 'socket.io-client';

/** @type {import('socket.io-client').Socket | null} */
let socket = null;

/**
 * Bearer token — cùng cấu trúc với AuthHeader (localStorage user.metadata.accessToken)
 */
export function getAccessToken() {
    try {
        const raw = localStorage.getItem('user');
        if (!raw) return null;
        const user = JSON.parse(raw);
        return user?.metadata?.accessToken ?? null;
    } catch {
        return null;
    }
}

/**
 * URL Socket.IO — cùng host với API HTTP (vd http://localhost:3000), không path riêng ngoài /socket.io mặc định.
 */
export function resolveSocketUrl() {
    const explicit = import.meta.env.VITE_APP_SOCKET_URL;
    if (explicit) {
        return String(explicit).replace(/\/$/, '');
    }
    const api = import.meta.env.VITE_APP_API || '';
    try {
        const u = new URL(api);
        return `${u.protocol}//${u.host}`;
    } catch {
        console.warn('[socket] Không suy ra được URL từ VITE_APP_API. Đặt VITE_APP_SOCKET_URL trong .env');
        return '';
    }
}

/**
 * Handshake auth theo backend: chấp nhận `auth.token` hoặc `auth.accessToken` (cùng JWT).
 * Lưu ý: trên trình duyệt, Socket.IO không gửi custom header cho WebSocket; handshake HTTP đầu tiên dùng object `auth`.
 * (Header Authorization chỉ áp dụng rõ ràng trong môi trường Node / một số adapter.)
 */
function buildAuth() {
    const jwt = getAccessToken();
    if (!jwt) return {};
    return {
        token: jwt,
        accessToken: jwt
    };
}

function buildSocketOptions() {
    const path = import.meta.env.VITE_APP_SOCKET_PATH || '/socket.io';
    return {
        path,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        auth: buildAuth()
    };
}

/**
 * Tạo lại instance socket với JWT mới trong localStorage (sau login / refresh token).
 * Token hết hạn: thường gặp `connect_error` (401 / unauthorized). Khi đó:
 * 1) refresh access token qua API REST nếu có,
 * 2) gọi `reconnectSocket()` để tạo socket mới với `auth` mới (hoặc `disconnectSocket` rồi `getSocket()`).
 */
export function getSocket() {
    const url = resolveSocketUrl();
    if (!url) {
        return null;
    }
    if (socket) {
        return socket;
    }
    socket = io(url, buildSocketOptions());
    socket.on('connect', () => {
        console.log('[socket] connected', socket.id);
    });
    socket.on('disconnect', (reason) => {
        console.log('[socket] disconnected', reason);
    });
    socket.on('connect_error', (err) => {
        console.error('[socket] connect_error', err.message);
    });
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
}

export function reconnectSocket() {
    disconnectSocket();
    return getSocket();
}

/** Gán auth mới rồi kết nối lại (sau khi đã cập nhật token trong localStorage). */
export function refreshSocketAuth() {
    return reconnectSocket();
}

export function isSocketConnected() {
    return Boolean(socket?.connected);
}
