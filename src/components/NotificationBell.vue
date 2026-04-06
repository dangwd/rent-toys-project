<template>
    <div v-if="isLoggedIn" class="relative">
        <Button
            :text="!isScrolled"
            rounded
            icon="pi pi-bell"
            aria-label="Thông báo"
            @click="toggle"
            class="relative"
        />

        <span
            v-if="unreadCount > 0"
            class="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white shadow"
        >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>

        <Popover ref="op">
            <div class="w-[min(92vw,26rem)]">
                <div class="flex items-center justify-between gap-3 border-b border-surface-200 dark:border-surface-700 px-4 py-3">
                    <div class="min-w-0">
                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Thông báo</p>
                        <p class="m-0 mt-0.5 text-xs text-muted-color">
                            {{ total }} thông báo • {{ unreadCount }} chưa đọc
                        </p>
                    </div>

                    <div class="flex items-center gap-2">
                        <Button
                            icon="pi pi-refresh"
                            text
                            rounded
                            aria-label="Tải lại"
                            :loading="loading"
                            @click="refresh"
                        />
                        <Button
                            v-if="unreadCount > 0"
                            label="Đã đọc"
                            icon="pi pi-check"
                            size="small"
                            text
                            @click="markAllReadLocal"
                        />
                    </div>
                </div>

                <div class="px-2 py-2">
                    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                        {{ error }}
                    </div>

                    <div v-else-if="loading && items.length === 0" class="px-3 py-8 text-center text-sm text-muted-color">
                        Đang tải thông báo…
                    </div>

                    <div v-else-if="items.length === 0" class="px-3 py-10 text-center">
                        <i class="pi pi-inbox mb-3 text-2xl text-muted-color" aria-hidden="true" />
                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Chưa có thông báo</p>
                        <p class="m-0 mt-1 text-xs text-muted-color">Khi có cập nhật, bạn sẽ thấy tại đây.</p>
                    </div>

                    <div v-else class="max-h-[26rem] overflow-auto">
                        <button
                            v-for="(n, idx) in items"
                            :key="n._id || n.id || idx"
                            type="button"
                            class="group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-surface-50 dark:hover:bg-surface-800/40"
                            @click="markReadLocal(n)"
                        >
                            <span
                                class="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
                                :class="isUnread(n) ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-700'"
                                aria-hidden="true"
                            />
                            <div class="min-w-0 flex-1">
                                <p class="m-0 text-sm font-medium text-surface-900 dark:text-surface-0">
                                    {{ n.title || n.subject || 'Thông báo' }}
                                </p>
                                <p class="m-0 mt-0.5 text-xs leading-relaxed text-surface-600 dark:text-surface-300">
                                    {{ n.content || n.message || n.body || '' }}
                                </p>
                                <p v-if="n.createdAt" class="m-0 mt-1 text-[11px] text-muted-color">
                                    {{ formatTime(n.createdAt) }}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                <div class="border-t border-surface-200 dark:border-surface-700 px-4 py-3">
                    <Button
                        label="Xem tất cả"
                        icon="pi pi-external-link"
                        text
                        class="w-full justify-center"
                        @click="goToAll"
                    />
                </div>
            </div>
        </Popover>
    </div>
</template>

<script setup>
import { fetchMyNotifications } from '@/service/notification.service';
import { ensureOrderSocket } from '@/service/orderSocket';
import { getSocket } from '@/service/socket';
import { useAuthStore } from '@/store';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    isScrolled: { type: Boolean, default: false }
});

const router = useRouter();
const toast = useToast();
const { proxy } = getCurrentInstance();
const auth = useAuthStore();

const isLoggedIn = computed(() => Boolean(auth.user?.metadata?.accessToken));

const op = ref();
const loading = ref(false);
const error = ref('');
const items = ref([]);
const unreadCount = ref(0);
const total = ref(0);

function toggle(event) {
    op.value?.toggle(event);
}

function formatTime(dt) {
    try {
        return format(new Date(dt), 'dd/MM/yyyy HH:mm');
    } catch {
        return String(dt);
    }
}

function normalizeMeta(res) {
    const meta = res?.data?.metadata;
    items.value = meta?.result || [];
    total.value = meta?.total || 0;
    unreadCount.value = meta?.unreadCount || 0;
}

async function refresh() {
    if (!isLoggedIn.value) return;
    loading.value = true;
    error.value = '';
    try {
        const res = await fetchMyNotifications({ skip: 0, limit: 20 });
        if (res?.status >= 400 || res?.response) {
            const msg = res?.response?.data?.message || res?.message || 'Không tải được thông báo';
            error.value = msg;
            return;
        }
        normalizeMeta(res);
    } catch (e) {
        error.value = e?.message || 'Không tải được thông báo';
    } finally {
        loading.value = false;
    }
}

function isUnread(n) {
    return n?.read === false || n?.isRead === false || n?.seen === false;
}

function markReadLocal(n) {
    if (!n) return;
    if (n.read === false) n.read = true;
    if (n.isRead === false) n.isRead = true;
    if (n.seen === false) n.seen = true;
    // cập nhật unreadCount local (không gọi API — vì backend chưa cung cấp endpoint mark-read)
    unreadCount.value = Math.max(0, unreadCount.value - 1);
}

function markAllReadLocal() {
    items.value = (items.value || []).map((n) => ({ ...n, read: true, isRead: true, seen: true }));
    unreadCount.value = 0;
    proxy?.$notify?.('S', 'Đã đánh dấu đã đọc (local).', toast);
}

function goToAll() {
    // Nếu sau này có page /client/notifications thì đổi route tại đây
    op.value?.hide?.();
    proxy?.$notify?.('I', 'Chưa có trang danh sách thông báo.', toast);
}

/**
 * Realtime qua socket:
 * Vì backend chưa cung cấp tên event trong yêu cầu, component sẽ lắng nghe nhiều alias phổ biến.
 * - notification / notification_created / notification:new / notifications
 * - order_updated (tận dụng flow đơn hàng đã có): sẽ thêm một notification local
 */
let sock;
const socketHandlers = [];

function bindSocket() {
    if (!isLoggedIn.value) return;
    ensureOrderSocket(); // đảm bảo socket + join room user_{userId}
    sock = getSocket();
    if (!sock) return;

    const onNotification = (payload) => {
        // payload có thể là object notification hoặc { notification, unreadCount, ... }
        const n = payload?.notification || payload;
        if (!n) return;
        items.value = [n, ...(items.value || [])].slice(0, 50);
        unreadCount.value = Number.isFinite(payload?.unreadCount) ? payload.unreadCount : unreadCount.value + 1;
        total.value = Math.max(total.value, items.value.length);
        proxy?.$notify?.('I', n?.message || 'Bạn có thông báo mới', toast);
    };

    const onOrderUpdated = (payload) => {
        const n = {
            _id: `order_${payload?.orderId || Date.now()}`,
            title: 'Cập nhật đơn hàng',
            message: `Đơn ${payload?.orderId}: ${payload?.status}`,
            read: false,
            createdAt: new Date().toISOString()
        };
        items.value = [n, ...(items.value || [])].slice(0, 50);
        unreadCount.value += 1;
        total.value = Math.max(total.value, items.value.length);
    };

    const events = ['notification', 'notification_created', 'notification:new', 'notifications'];
    events.forEach((ev) => {
        sock.on(ev, onNotification);
        socketHandlers.push(() => sock?.off(ev, onNotification));
    });

    sock.on('order_updated', onOrderUpdated);
    socketHandlers.push(() => sock?.off('order_updated', onOrderUpdated));
}

function unbindSocket() {
    socketHandlers.splice(0).forEach((fn) => fn());
    sock = null;
}

watch(
    () => auth.user?.metadata?.accessToken,
    async (token) => {
        unbindSocket();
        items.value = [];
        unreadCount.value = 0;
        total.value = 0;
        if (token) {
            await refresh();
            bindSocket();
        }
    },
    { immediate: true }
);

onMounted(() => {
    // refresh lại khi popover mở (tránh stale)
    const el = op.value?.$el;
    if (!el) return;
});

onUnmounted(() => {
    unbindSocket();
});
</script>

