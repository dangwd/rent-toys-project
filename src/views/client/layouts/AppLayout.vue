<script setup>
import { clearOrderSocketSubscriptions, ensureOrderSocket, subscribeOrderUpdated } from '@/service/orderSocket';
import { disconnectSocket, reconnectSocket } from '@/service/socket';
import { useAuthStore } from '@/store';
import { useToast } from 'primevue/usetoast';
import { onUnmounted, watch } from 'vue';
import Snowfall from '@/components/effects/Snowfall.vue';
import AppFooter from './AppFooter.vue';
import AppTopbar from './AppTopbar.vue';

const auth = useAuthStore();
const toast = useToast();

/** @type {(() => void) | undefined} */
let unsubOrder;

watch(
    () => auth.user?.metadata?.accessToken,
    (token) => {
        unsubOrder?.();
        unsubOrder = undefined;
        if (token) {
            reconnectSocket();
            ensureOrderSocket();
            unsubOrder = subscribeOrderUpdated((payload) => {
                toast.add({
                    severity: 'info',
                    summary: 'Cập nhật đơn hàng',
                    detail: `Đơn ${payload.orderId}: ${payload.status}`,
                    life: 6000
                });
            });
        } else {
            clearOrderSocketSubscriptions();
            disconnectSocket();
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    unsubOrder?.();
});
</script>
<template>
    <Toast />
    <Snowfall />
    <AppTopbar></AppTopbar>
    <div class="h-auto mx-auto  text-sm bg-white">
        <router-view></router-view>
    </div>
    <AppFooter></AppFooter>
</template>
