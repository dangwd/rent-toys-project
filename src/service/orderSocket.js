/**
 * Đăng ký một lần trên mỗi instance socket các sự kiện: connected, join_error, order_updated,
 * và emit join + ack sau mỗi lần connect / reconnect.
 * Server chỉ emit vào room user_{userId} — không broadcast toàn cục.
 */

import { getSocket, getAccessToken, reconnectSocket, resolveSocketUrl } from '@/service/socket';

/** @typedef {{ orderId: string, status: string }} OrderUpdatedPayload */
/** @typedef {(payload: OrderUpdatedPayload) => void} OrderUpdatedHandler */
/** @typedef {{ userId: string, room: string }} ConnectedPayload */
/** @typedef {(payload: ConnectedPayload) => void} ConnectedHandler */
/** @typedef {{ message: string }} JoinErrorPayload */
/** @typedef {(payload: JoinErrorPayload) => void} JoinErrorHandler */

/** @type {Set<OrderUpdatedHandler>} */
const orderUpdatedSubs = new Set();
/** @type {Set<ConnectedHandler>} */
const connectedSubs = new Set();
/** @type {Set<JoinErrorHandler>} */
const joinErrorSubs = new Set();

/** @typedef {(state: { connected: boolean, error?: Error }) => void} LifecycleHandler */
/** @type {Set<LifecycleHandler>} */
const lifecycleSubs = new Set();

/** Tránh gắn trùng listener trên cùng instance socket (sau reconnect instance mới → gắn lại). */
/** @type {import('socket.io-client').Socket | null} */
let handlersBoundFor = null;

function parseJwtPayload(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const json = atob(padded);
        return JSON.parse(
            decodeURIComponent(
                json
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            )
        );
    } catch {
        return null;
    }
}

/**
 * userId phải trùng JWT (field userId). Fallback: metadata.user._id / id, sub.
 */
export function getUserIdFromStorage() {
    const token = getAccessToken();
    if (token) {
        const payload = parseJwtPayload(token);
        if (payload?.userId != null) return String(payload.userId);
        if (payload?.sub != null) return String(payload.sub);
    }
    try {
        const raw = localStorage.getItem('user');
        if (!raw) return null;
        const user = JSON.parse(raw);
        const u = user?.metadata?.user;
        if (u?._id != null) return String(u._id);
        if (u?.id != null) return String(u.id);
    } catch {
        /* ignore */
    }
    return null;
}

function emitJoinWithAck() {
    const s = getSocket();
    const userId = getUserIdFromStorage();
    if (!s || !userId) return;

    s.emit('join', { userId }, (ack) => {
        if (ack && ack.ok === false) {
            const msg = ack.message || 'join failed';
            joinErrorSubs.forEach((fn) => fn({ message: msg }));
        }
    });
}

function bindHandlersForCurrentSocket() {
    const s = getSocket();
    if (!s) return;
    if (handlersBoundFor === s) return;
    handlersBoundFor = s;

    s.on('connected', (payload) => {
        connectedSubs.forEach((fn) => fn(payload));
    });

    s.on('join_error', (payload) => {
        joinErrorSubs.forEach((fn) => fn(payload));
    });

    s.on('order_updated', (payload) => {
        orderUpdatedSubs.forEach((fn) => fn(payload));
    });

    s.on('connect', () => {
        lifecycleSubs.forEach((fn) => fn({ connected: true }));
        emitJoinWithAck();
    });

    s.on('disconnect', () => {
        lifecycleSubs.forEach((fn) => fn({ connected: false }));
    });

    s.on('connect_error', (err) => {
        const e = err instanceof Error ? err : new Error(String(err?.message || err));
        lifecycleSubs.forEach((fn) => fn({ connected: false, error: e }));
    });

    if (s.connected) {
        emitJoinWithAck();
    }
}

/**
 * Bảo đảm socket đã tạo và listener đã gắn.
 */
export function ensureOrderSocket() {
    if (!resolveSocketUrl()) return null;
    getSocket();
    bindHandlersForCurrentSocket();
    return getSocket();
}

/**
 * @param {OrderUpdatedHandler} fn
 * @returns {() => void}
 */
export function subscribeOrderUpdated(fn) {
    orderUpdatedSubs.add(fn);
    ensureOrderSocket();
    return () => {
        orderUpdatedSubs.delete(fn);
    };
}

/**
 * @param {ConnectedHandler} fn
 * @returns {() => void}
 */
export function subscribeConnected(fn) {
    connectedSubs.add(fn);
    ensureOrderSocket();
    return () => {
        connectedSubs.delete(fn);
    };
}

/**
 * @param {JoinErrorHandler} fn
 * @returns {() => void}
 */
export function subscribeJoinError(fn) {
    joinErrorSubs.add(fn);
    ensureOrderSocket();
    return () => {
        joinErrorSubs.delete(fn);
    };
}

/**
 * Trạng thái kết nối Socket.IO (một listener duy nhất trên socket — tránh trùng khi nhiều component).
 * @param {LifecycleHandler} fn
 * @returns {() => void}
 */
export function subscribeSocketLifecycle(fn) {
    lifecycleSubs.add(fn);
    ensureOrderSocket();
    const s = getSocket();
    if (s) {
        fn({ connected: s.connected });
    }
    return () => {
        lifecycleSubs.delete(fn);
    };
}

export function clearOrderSocketSubscriptions() {
    orderUpdatedSubs.clear();
    connectedSubs.clear();
    joinErrorSubs.clear();
    lifecycleSubs.clear();
}

/**
 * @param {(ack: { ok?: boolean, room?: string, message?: string }) => void} [ack]
 */
export function emitJoin(ack) {
    const s = ensureOrderSocket();
    const userId = getUserIdFromStorage();
    if (!s || !userId) return;
    if (typeof ack === 'function') {
        s.emit('join', { userId }, ack);
    } else {
        s.emit('join', { userId });
    }
}

export { reconnectSocket } from '@/service/socket';
