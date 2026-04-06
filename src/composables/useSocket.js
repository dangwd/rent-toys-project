import { getSocket, reconnectSocket, disconnectSocket, resolveSocketUrl } from '@/service/socket';
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';

/**
 * Trạng thái kết nối + instance socket (dùng trong component).
 * @param {{ autoConnect?: boolean }} [options]
 */
export function useSocket(options = {}) {
    const { autoConnect = true } = options;
    const connected = ref(false);
    const socketRef = shallowRef(null);
    const lastError = ref(null);

    function syncState() {
        const s = socketRef.value;
        connected.value = Boolean(s?.connected);
    }

    const onConnect = () => {
        lastError.value = null;
        syncState();
    };
    const onDisconnect = () => syncState();
    const onError = (err) => {
        lastError.value = err;
    };

    onMounted(() => {
        if (!autoConnect) return;
        if (!resolveSocketUrl()) {
            lastError.value = new Error('Thiếu VITE_APP_SOCKET_URL hoặc VITE_APP_API hợp lệ');
            return;
        }
        const s = getSocket();
        socketRef.value = s;
        if (!s) return;
        syncState();
        s.on('connect', onConnect);
        s.on('disconnect', onDisconnect);
        s.on('connect_error', onError);
    });

    onUnmounted(() => {
        const s = socketRef.value;
        if (!s) return;
        s.off('connect', onConnect);
        s.off('disconnect', onDisconnect);
        s.off('connect_error', onError);
    });

    return {
        connected,
        socket: socketRef,
        lastError,
        reconnect: reconnectSocket,
        disconnect: disconnectSocket
    };
}

/**
 * Đăng ký listener event một lần, tự gỡ khi component unmount.
 * @param {string} event
 * @param {(...args: unknown[]) => void} handler
 */
export function useSocketEvent(event, handler) {
    let sock = null;
    onMounted(() => {
        sock = getSocket();
        if (!sock) return;
        sock.on(event, handler);
    });
    onUnmounted(() => {
        if (sock) sock.off(event, handler);
    });
}
