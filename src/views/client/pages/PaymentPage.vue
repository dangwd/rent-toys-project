<template>
    <div class="payment-flow relative min-h-[calc(100dvh-6rem)] overflow-hidden px-4 py-12 sm:py-16">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_srgb,var(--p-primary-500),transparent_82%),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_srgb,var(--p-primary-400),transparent_88%),transparent)]"
        />
        <div class="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[min(100%,42rem)] -translate-x-1/2 rounded-full bg-primary-500/10 blur-[100px] dark:bg-primary-400/5" aria-hidden="true" />

        <div class="relative mx-auto flex w-full max-w-lg flex-col items-center">
            <div
                class="w-full rounded-[1.75rem] border border-surface-200/80 bg-surface-0/90 p-8 shadow-[0_24px_80px_-24px_rgba(67,56,202,0.18)] backdrop-blur-md dark:border-surface-700/80 dark:bg-surface-900/85 dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.45)] md:p-10"
            >
                <div class="flex flex-col items-center text-center">
                    <div class="relative mb-7">
                        <div class="payment-flow__ring absolute inset-0 rounded-2xl bg-primary-400/20 dark:bg-primary-400/10 motion-safe:animate-[payment-pulse_2.4s_ease-in-out_infinite]" />
                        <div class="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/25">
                            <i class="pi pi-wallet text-2xl" aria-hidden="true" />
                        </div>
                    </div>

                    <p class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">Thanh toán an toàn</p>
                    <h1 class="text-balance text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-0 md:text-[1.65rem]">Đang thực hiện giao dịch</h1>
                    <p class="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-muted-color motion-safe:transition-opacity motion-safe:duration-300" :key="statusIndex">
                        {{ statusLine }}
                    </p>

                    <ProgressBar mode="indeterminate" class="mt-8 w-full [&_.p-progressbar]:h-1.5 [&_.p-progressbar]:overflow-hidden [&_.p-progressbar]:rounded-full" />

                    <ul class="mt-8 w-full space-y-3 text-left text-sm text-surface-600 dark:text-surface-300" role="list">
                        <li class="flex items-start gap-3">
                            <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800">
                                <i class="pi pi-lock text-primary-600 dark:text-primary-400 text-sm" aria-hidden="true" />
                            </span>
                            <span>Kết nối được mã hóa; vui lòng <strong class="font-semibold text-surface-800 dark:text-surface-100">không đóng hoặc làm mới</strong> trang này.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800">
                                <i class="pi pi-clock text-primary-600 dark:text-primary-400 text-sm" aria-hidden="true" />
                            </span>
                            <span>Thời gian xử lý thường từ vài giây đến vài phút tùy ngân hàng / ví điện tử.</span>
                        </li>
                    </ul>

                    <div class="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button label="Về trang chủ" icon="pi pi-home" severity="secondary" outlined class="w-full sm:w-auto" @click="router.push({ name: 'home' })" />
                        <Button label="Xem đơn hàng" icon="pi pi-list" class="w-full sm:w-auto" @click="router.push({ name: 'orderlist' })" />
                    </div>
                </div>
            </div>

            <p class="mt-8 max-w-md text-center text-xs leading-relaxed text-muted-color">Nếu cửa sổ thanh toán không hiển thị, hãy kiểm tra trình chặn popup hoặc thử dùng trình duyệt khác.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const statusMessages = ['Đang kết nối tới cổng thanh toán…', 'Đang xác thực thông tin giao dịch…', 'Đang chờ phản hồi từ đối tác thanh toán…'];

const statusLine = ref(statusMessages[0]);
const statusIndex = ref(0);
let intervalId;

onMounted(() => {
    intervalId = window.setInterval(() => {
        statusIndex.value = (statusIndex.value + 1) % statusMessages.length;
        statusLine.value = statusMessages[statusIndex.value];
    }, 2800);
});

onUnmounted(() => {
    if (intervalId) window.clearInterval(intervalId);
});
</script>

<style scoped>
.payment-flow__ring {
    scale: 1.15;
    filter: blur(12px);
}

@keyframes payment-pulse {
    0%,
    100% {
        opacity: 0.35;
        transform: scale(1);
    }
    50% {
        opacity: 0.85;
        transform: scale(1.08);
    }
}

@media (prefers-reduced-motion: reduce) {
    .payment-flow__ring {
        animation: none;
        opacity: 0.4;
    }
}
</style>
