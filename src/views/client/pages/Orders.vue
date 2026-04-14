<template>
    <div class="mx-auto min-h-[60vh] w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">Đơn hàng của tôi</h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Theo dõi trạng thái thanh toán và giao hàng.</p>
            <p v-if="!isLoading && paginator.total > 0" class="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ paginator.total }} đơn hàng</p>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center gap-4 py-24">
            <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="4" />
            <span class="text-sm font-medium text-slate-500">Đang tải đơn hàng...</span>
        </div>

        <div v-else-if="Orders.length === 0" class="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <i class="pi pi-inbox text-2xl"></i>
            </div>
            <p class="mt-4 text-lg font-bold text-slate-900 dark:text-white">Chưa có đơn hàng</p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Đơn của bạn sẽ hiển thị tại đây sau khi đặt hàng thành công.</p>
            <router-link to="/client" class="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
                <i class="pi pi-arrow-left text-xs"></i>
                Tiếp tục mua sắm
            </router-link>
        </div>

        <div v-else class="space-y-4">
            <article
                v-for="(data, index) in Orders"
                :key="data._id || index"
                class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-900"
            >
                <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5">
                    <!-- Thumb -->
                    <router-link v-if="primaryImage(data) && firstProductId(data)" :to="`/client/detail/${firstProductId(data)}`" class="relative shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-900 sm:h-24 sm:w-24 sm:self-center">
                        <img crossorigin="anonymous" :src="primaryImage(data)" alt="" class="h-28 w-full object-cover sm:h-full sm:w-full" />
                    </router-link>
                    <div v-else-if="primaryImage(data)" class="relative shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-900 sm:h-24 sm:w-24 sm:self-center">
                        <img crossorigin="anonymous" :src="primaryImage(data)" alt="" class="h-28 w-full object-cover sm:h-full sm:w-full" />
                    </div>
                    <div v-else class="flex h-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-zinc-900 sm:h-24 sm:w-24">
                        <i class="pi pi-image text-2xl"></i>
                    </div>

                    <!-- Main -->
                    <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-start justify-between gap-2">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Đặt ngày</p>
                                <p class="font-semibold text-slate-900 dark:text-white">
                                    {{ data.createdAt ? format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm') : '—' }}
                                </p>
                            </div>
                            <p class="font-mono text-xs text-slate-500 dark:text-slate-400" :title="data._id">#{{ shortOrderId(data._id) }}</p>
                        </div>

                        <p class="mt-2 line-clamp-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                            {{ productSummary(data) }}
                        </p>

                        <div class="mt-3 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-stretch">
                            <div class="status-block status-block--payment">
                                <div class="status-block__label">
                                    <i class="pi pi-credit-card status-block__icon" aria-hidden="true"></i>
                                    <span>Thanh toán</span>
                                </div>
                                <Tag :value="paymentStatusDisplay(data.paymentStatus)" :severity="statusSeverity(data.paymentStatus)" rounded class="status-block__tag !text-xs !font-bold" />
                            </div>
                            <div class="status-block status-block--order">
                                <div class="status-block__label">
                                    <i class="pi pi-box status-block__icon" aria-hidden="true"></i>
                                    <span>Đơn hàng</span>
                                </div>
                                <Tag :value="statusLabel(data.status)" :severity="statusSeverity(data.status)" rounded class="status-block__tag !text-xs !font-bold" />
                            </div>
                            <div v-if="data.coupon" class="status-block status-block--coupon">
                                <div class="status-block__label">
                                    <i class="pi pi-ticket status-block__icon" aria-hidden="true"></i>
                                    <span>Khuyến mãi</span>
                                </div>
                                <Tag :value="data.coupon?.CouponName || '—'" severity="success" rounded class="status-block__tag !text-xs !font-bold" />
                            </div>
                        </div>
                    </div>

                    <!-- Price + action -->
                    <div class="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                        <div class="text-left sm:text-right">
                            <p class="text-xs text-slate-500 dark:text-slate-400">Thành tiền</p>
                            <p class="text-xl font-black text-indigo-600 dark:text-indigo-400">{{ formatPrice(data.finalPrice) }}đ</p>
                            <p v-if="data.totalPrice != null && data.totalPrice !== data.finalPrice" class="text-xs text-slate-400 line-through">{{ formatPrice(data.totalPrice) }}đ</p>
                        </div>
                        <DetailOrder :client="true" :data="data" />
                    </div>
                </div>
            </article>

            <Paginator
                v-if="paginator.total > 0"
                :rows="paginator.rows"
                :totalRecords="paginator.total"
                :first="paginator.page * paginator.rows"
                :rowsPerPageOptions="[5, 10, 25]"
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                class="orders-paginator mt-6"
                @page="onPageChange"
            />
        </div>
    </div>
</template>

<script setup>
import API from '@/api/api-main';
import DetailOrder from '@/components/DetailOrder.vue';
import { formatPrice } from '@/helper/formatPrice';
import { formatStatusOrder } from '@/helper/formatStatusOrder';
import { format } from 'date-fns';
import { onMounted, reactive, ref } from 'vue';

const Orders = ref([]);
const isLoading = ref(true);
const paginator = reactive({
    rows: 5,
    page: 0,
    total: 0
});

const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipped: 'Đang giao hàng',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
    paid: 'Đã thanh toán'
};

const statusLabel = (status) => STATUS_LABELS[status] || formatStatusOrder(status) || status || '—';

/** Nhãn riêng cho cột thanh toán (tránh nhầm với trạng thái đơn cùng key `pending`, ...) */
const PAYMENT_LABELS = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    cancelled: 'Đã hủy thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền'
};

const paymentStatusDisplay = (status) => {
    if (status === undefined || status === null || status === '') return '—';
    return PAYMENT_LABELS[status] || formatStatusOrder(status) || STATUS_LABELS[status] || String(status);
};

const statusSeverity = (status) => {
    const map = {
        pending: 'warn',
        confirmed: 'info',
        shipped: 'primary',
        delivered: 'success',
        cancelled: 'danger',
        paid: 'success'
    };
    return map[status] || 'secondary';
};

const shortOrderId = (id) => {
    if (!id || typeof id !== 'string') return '—';
    return id.length > 10 ? id.slice(-8) : id;
};

const primaryImage = (order) => order.items?.[0]?.images?.[0] || '';

const firstProductId = (order) => order.items?.[0]?.productId || order.items?.[0]?.product?._id || '';

const productSummary = (order) => {
    if (!order.items?.length) return '—';
    return order.items.map((el) => el.productName).join(', ');
};

onMounted(() => {
    fetchAllOrder();
});

const fetchAllOrder = async () => {
    isLoading.value = true;
    try {
        const skip = paginator.page * paginator.rows;
        const res = await API.get(`order/me?skip=${skip}&limit=${paginator.rows}`);
        Orders.value = res.data.metadata.result;
        paginator.total = res.data.metadata.total;
    } catch (error) {
        console.log(error);
        Orders.value = [];
    } finally {
        isLoading.value = false;
    }
};

const onPageChange = (e) => {
    paginator.rows = e.rows;
    paginator.page = e.page;
    fetchAllOrder();
};
</script>

<style scoped>
:deep(.orders-paginator.p-paginator) {
    @apply justify-center rounded-2xl border border-slate-200 bg-white py-3 dark:border-zinc-800 dark:bg-zinc-950;
}

.status-block {
    @apply flex min-w-0 flex-col gap-1.5 rounded-xl border px-3 py-2.5 sm:inline-flex sm:max-w-[260px] sm:flex-1 sm:flex-col;
}

.status-block__label {
    @apply flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400;
}

.status-block__icon {
    @apply text-sm opacity-90;
}

.status-block--payment {
    @apply border-emerald-200 bg-emerald-50/90 dark:border-emerald-900/60 dark:bg-emerald-950/40;
}

.status-block--payment .status-block__label {
    @apply text-emerald-800 dark:text-emerald-300;
}

.status-block--order {
    @apply border-indigo-200 bg-indigo-50/90 dark:border-indigo-900/50 dark:bg-indigo-950/40;
}

.status-block--order .status-block__label {
    @apply text-indigo-900 dark:text-indigo-200;
}

.status-block--coupon {
    @apply border-amber-200 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30;
}

.status-block--coupon .status-block__label {
    @apply text-amber-900 dark:text-amber-200;
}

:deep(.status-block__tag.p-tag) {
    @apply w-fit max-w-full;
}
</style>
