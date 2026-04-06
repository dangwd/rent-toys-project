import {
    clearOrderSocketSubscriptions,
    emitJoin,
    ensureOrderSocket,
    getUserIdFromStorage,
    subscribeConnected,
    subscribeJoinError,
    subscribeOrderUpdated,
    subscribeSocketLifecycle
} from '@/service/orderSocket';
import { disconnectSocket, reconnectSocket, resolveSocketUrl } from '@/service/socket';
import { onUnmounted, ref } from 'vue';

/**
 * Socket đơn hàng: auth JWT (token + accessToken trong handshake), room user_{userId}, sự kiện `order_updated`.
 *
 * Token hết hạn: `connectError` được cập nhật; sau khi refresh JWT (REST) → gọi `reconnectAfterTokenRefresh()`.
 * Logout: `disconnectAndCleanup()` — gọi trước khi xóa user khỏi localStorage.
 *
 * @param {{
 *   enabled?: boolean,
 *   autoSubscribe?: boolean,
 *   onOrderUpdated?: (payload: { orderId: string, status: string }) => void
 * }} [options]
 */
export function useOrderSocket(options = {}) {
    const { enabled = true, autoSubscribe = true, onOrderUpdated: onOrderUpdatedOption } = options;

    const connected = ref(false);
    const room = ref(/** @type {string | null} */ (null));
    const serverUserId = ref(/** @type {string | null} */ (null));
    const joinErrorMessage = ref(/** @type {string | null} */ (null));
    const connectError = ref(/** @type {Error | null} */ (null));
    const lastOrderEvent = ref(/** @type {{ orderId: string, status: string } | null} */ (null));

    /** @type {(() => void)[]} */
    const unsubs = [];

    function attachListeners() {
        if (!enabled || !resolveSocketUrl()) return;

        ensureOrderSocket();

        unsubs.push(
            subscribeSocketLifecycle(({ connected: isOn, error }) => {
                connected.value = isOn;
                if (error) connectError.value = error;
                else if (isOn) connectError.value = null;
            })
        );

        unsubs.push(
            subscribeConnected((payload) => {
                serverUserId.value = payload.userId ?? null;
                room.value = payload.room ?? null;
                joinErrorMessage.value = null;
            })
        );

        unsubs.push(
            subscribeJoinError((payload) => {
                joinErrorMessage.value = payload.message ?? null;
            })
        );

        unsubs.push(
            subscribeOrderUpdated((payload) => {
                lastOrderEvent.value = payload;
                onOrderUpdatedOption?.(payload);
            })
        );
    }

    if (autoSubscribe && enabled) {
        attachListeners();
    }

    onUnmounted(() => {
        unsubs.forEach((fn) => fn());
        unsubs.length = 0;
    });

    return {
        connected,
        room,
        serverUserId,
        joinErrorMessage,
        connectError,
        lastOrderEvent,
        userId: () => getUserIdFromStorage(),
        emitJoin,
        reconnectAfterTokenRefresh: () => {
            reconnectSocket();
            ensureOrderSocket();
        },
        disconnectAndCleanup: () => {
            clearOrderSocketSubscriptions();
            disconnectSocket();
        }
    };
}
