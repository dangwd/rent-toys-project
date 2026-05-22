<script setup>
import API from '@/api/api-main';
import { useLayout } from '@/layout/composables/layout';
import { computed, onMounted, ref, watch } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const loading = ref(true);
const dashboardData = ref(null);

const revenue = computed(() => dashboardData.value?.revenue || {});
const orders = computed(() => dashboardData.value?.orders || {});
const users = computed(() => dashboardData.value?.users || {});
const products = computed(() => dashboardData.value?.products || {});
const last7Days = computed(() => dashboardData.value?.last7DaysRevenue || []);
const topProducts = computed(() => dashboardData.value?.topSellingProducts || []);
const recentOrders = computed(() => dashboardData.value?.recentOrders || []);

const revenueChartData = ref(null);
const revenueChartOptions = ref(null);
const orderStatusChartData = ref(null);
const orderStatusChartOptions = ref(null);

async function fetchDashboard() {
    loading.value = true;
    try {
        const res = await API.get('dashboard');
        if (res?.data?.metadata) {
            dashboardData.value = res.data.metadata;
            buildCharts();
        }
    } finally {
        loading.value = false;
    }
}

function buildCharts() {
    buildRevenueChart();
    buildOrderStatusChart();
}

function buildRevenueChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = last7Days.value;

    revenueChartData.value = {
        labels: data.map((d) => {
            const date = new Date(d.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        }),
        datasets: [
            {
                label: 'Doanh thu (₫)',
                data: data.map((d) => d.revenue),
                fill: true,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-100') + '80',
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                tension: 0.4,
                pointBackgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                pointRadius: 4
            }
        ]
    };

    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    revenueChartOptions.value = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${formatVND(ctx.raw)}`
                }
            }
        },
        scales: {
            x: {
                ticks: { color: textMutedColor },
                grid: { color: 'transparent', borderColor: 'transparent' }
            },
            y: {
                ticks: {
                    color: textMutedColor,
                    callback: (v) => formatVNDShort(v)
                },
                grid: { color: borderColor, borderColor: 'transparent', drawTicks: false }
            }
        }
    };
}

function buildOrderStatusChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const byStatus = orders.value.byStatus || {};

    orderStatusChartData.value = {
        labels: ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'],
        datasets: [
            {
                data: [byStatus.pending || 0, byStatus.confirmed || 0, byStatus.shipped || 0, byStatus.delivered || 0, byStatus.cancelled || 0],
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-orange-400'),
                    documentStyle.getPropertyValue('--p-blue-400'),
                    documentStyle.getPropertyValue('--p-cyan-400'),
                    documentStyle.getPropertyValue('--p-green-400'),
                    documentStyle.getPropertyValue('--p-red-400')
                ],
                borderWidth: 0
            }
        ]
    };

    orderStatusChartOptions.value = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
                    padding: 16,
                    font: { size: 12 }
                }
            }
        },
        cutout: '65%'
    };
}

const formatVND = (value) => {
    if (!value && value !== 0) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
};

const formatVNDShort = (value) => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return value;
};

const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const orderStatusMap = {
    pending: { label: 'Chờ xác nhận', severity: 'warn' },
    confirmed: { label: 'Đã xác nhận', severity: 'info' },
    shipped: { label: 'Đang giao', severity: 'secondary' },
    delivered: { label: 'Đã giao', severity: 'success' },
    cancelled: { label: 'Đã hủy', severity: 'danger' }
};

const paymentStatusMap = {
    paid: { label: 'Đã thanh toán', severity: 'success' },
    pending: { label: 'Chưa thanh toán', severity: 'warn' },
    failed: { label: 'Thất bại', severity: 'danger' }
};

onMounted(fetchDashboard);

watch([getPrimary, getSurface, isDarkTheme], () => {
    if (dashboardData.value) buildCharts();
});
</script>

<template>
    <div class="grid grid-cols-12 gap-6">
        <!-- Stat Cards -->
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0 h-full">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-2 text-sm">Doanh thu hôm nay</span>
                        <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">
                            <Skeleton v-if="loading" width="8rem" height="2rem" />
                            <span v-else>{{ formatVND(revenue.today) }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-xl" style="width: 3rem; height: 3rem">
                        <i class="pi pi-dollar text-blue-500 text-xl"></i>
                    </div>
                </div>
                <div class="flex items-center gap-2 mt-2">
                    <span v-if="!loading" :class="[revenue.todayGrowth >= 0 ? 'text-green-500' : 'text-red-500', 'font-semibold text-sm flex items-center gap-1']">
                        <i :class="revenue.todayGrowth >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"></i>
                        {{ Math.abs(revenue.todayGrowth) }}%
                    </span>
                    <span class="text-muted-color text-sm">so với hôm qua ({{ formatVND(revenue.yesterday) }})</span>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0 h-full">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-2 text-sm">Tổng đơn hàng</span>
                        <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">
                            <Skeleton v-if="loading" width="5rem" height="2rem" />
                            <span v-else>{{ orders.total }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-xl" style="width: 3rem; height: 3rem">
                        <i class="pi pi-shopping-cart text-orange-500 text-xl"></i>
                    </div>
                </div>
                <div class="flex items-center gap-2 mt-2">
                    <span class="text-primary font-semibold text-sm">+{{ orders.newToday }} hôm nay</span>
                    <span class="text-muted-color text-sm">· {{ orders.newThisMonth }} tháng này</span>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0 h-full">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-2 text-sm">Người dùng</span>
                        <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">
                            <Skeleton v-if="loading" width="5rem" height="2rem" />
                            <span v-else>{{ users.total }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-xl" style="width: 3rem; height: 3rem">
                        <i class="pi pi-users text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <div class="flex items-center gap-2 mt-2">
                    <span class="text-primary font-semibold text-sm">+{{ users.newToday }} hôm nay</span>
                    <span class="text-muted-color text-sm">· {{ users.newThisMonth }} tháng này</span>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0 h-full">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-2 text-sm">Sản phẩm</span>
                        <div class="text-surface-900 dark:text-surface-0 font-bold text-2xl">
                            <Skeleton v-if="loading" width="5rem" height="2rem" />
                            <span v-else>{{ products.total }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-xl" style="width: 3rem; height: 3rem">
                        <i class="pi pi-box text-purple-500 text-xl"></i>
                    </div>
                </div>
                <div class="flex items-center gap-2 mt-2">
                    <span v-if="products.outOfStock > 0" class="text-red-500 font-semibold text-sm">{{ products.outOfStock }} hết hàng</span>
                    <span v-if="products.lowStock > 0" class="text-orange-500 font-semibold text-sm">· {{ products.lowStock }} sắp hết</span>
                    <span v-if="!products.outOfStock && !products.lowStock" class="text-green-500 font-semibold text-sm">Tồn kho ổn định</span>
                </div>
            </div>
        </div>

        <!-- Revenue Chart -->
        <div class="col-span-12 xl:col-span-8">
            <div class="card h-full">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <div class="font-semibold text-xl">Doanh thu 7 ngày qua</div>
                        <div class="text-muted-color text-sm mt-1">Tháng này: {{ formatVND(revenue.thisMonth) }}</div>
                    </div>
                    <div class="text-right">
                        <div :class="[revenue.monthGrowth >= 0 ? 'text-green-500' : 'text-red-500', 'font-bold text-lg flex items-center gap-1 justify-end']">
                            <i :class="revenue.monthGrowth >= 0 ? 'pi pi-trending-up' : 'pi pi-trending-down'"></i>
                            {{ revenue.monthGrowth }}%
                        </div>
                        <div class="text-muted-color text-sm">so với tháng trước</div>
                    </div>
                </div>
                <div v-if="loading" class="flex items-center justify-center" style="height: 280px">
                    <i class="pi pi-spin pi-spinner text-4xl text-muted-color"></i>
                </div>
                <Chart v-else type="line" :data="revenueChartData" :options="revenueChartOptions" style="height: 280px" />
            </div>
        </div>

        <!-- Order Status Doughnut -->
        <div class="col-span-12 xl:col-span-4">
            <div class="card h-full">
                <div class="font-semibold text-xl mb-2">Trạng thái đơn hàng</div>
                <div class="text-muted-color text-sm mb-6">Tổng {{ orders.total }} đơn</div>
                <div v-if="loading" class="flex items-center justify-center" style="height: 280px">
                    <i class="pi pi-spin pi-spinner text-4xl text-muted-color"></i>
                </div>
                <div v-else>
                    <Chart type="doughnut" :data="orderStatusChartData" :options="orderStatusChartOptions" style="height: 220px" />
                    <div class="grid grid-cols-2 gap-2 mt-4">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-orange-400 shrink-0"></span>
                            <span class="text-sm text-muted-color"
                                >Chờ: <span class="font-semibold text-surface-900 dark:text-surface-0">{{ orders.byStatus?.pending || 0 }}</span></span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-blue-400 shrink-0"></span>
                            <span class="text-sm text-muted-color"
                                >Xác nhận: <span class="font-semibold text-surface-900 dark:text-surface-0">{{ orders.byStatus?.confirmed || 0 }}</span></span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-cyan-400 shrink-0"></span>
                            <span class="text-sm text-muted-color"
                                >Giao: <span class="font-semibold text-surface-900 dark:text-surface-0">{{ orders.byStatus?.shipped || 0 }}</span></span
                            >
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-green-400 shrink-0"></span>
                            <span class="text-sm text-muted-color"
                                >Hoàn thành: <span class="font-semibold text-surface-900 dark:text-surface-0">{{ orders.byStatus?.delivered || 0 }}</span></span
                            >
                        </div>
                        <div class="flex items-center gap-2 col-span-2">
                            <span class="w-3 h-3 rounded-full bg-red-400 shrink-0"></span>
                            <span class="text-sm text-muted-color"
                                >Hủy: <span class="font-semibold text-surface-900 dark:text-surface-0">{{ orders.byStatus?.cancelled || 0 }}</span></span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Orders -->
        <div class="col-span-12 xl:col-span-7">
            <div class="card">
                <div class="font-semibold text-xl mb-6">Đơn hàng gần đây</div>
                <div v-if="loading">
                    <Skeleton v-for="i in 3" :key="i" height="3rem" class="mb-2" />
                </div>
                <DataTable v-else :value="recentOrders" :rows="5" responsiveLayout="scroll" class="text-sm">
                    <Column header="Khách hàng" style="min-width: 140px">
                        <template #body="{ data }">
                            <div class="flex items-center gap-3">
                                <Avatar :image="data.customerAvatar || undefined" :label="data.customerAvatar ? undefined : data.customer?.[0]?.toUpperCase()" class="shrink-0" size="small" shape="circle" />
                                <span class="font-medium">{{ data.customer }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column header="Trạng thái" style="min-width: 130px">
                        <template #body="{ data }">
                            <Tag :value="orderStatusMap[data.status]?.label || data.status" :severity="orderStatusMap[data.status]?.severity" />
                        </template>
                    </Column>
                    <Column header="Thanh toán" style="min-width: 130px">
                        <template #body="{ data }">
                            <Tag :value="paymentStatusMap[data.paymentStatus]?.label || data.paymentStatus" :severity="paymentStatusMap[data.paymentStatus]?.severity" />
                        </template>
                    </Column>
                    <Column header="Tổng tiền" style="min-width: 120px">
                        <template #body="{ data }">
                            <span class="font-semibold text-primary">{{ formatVND(data.finalPrice) }}</span>
                        </template>
                    </Column>
                    <Column header="Thời gian" style="min-width: 130px">
                        <template #body="{ data }">
                            <span class="text-muted-color">{{ formatDate(data.createdAt) }}</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Top Selling Products -->
        <div class="col-span-12 xl:col-span-5">
            <div class="card h-full">
                <div class="font-semibold text-xl mb-6">Sản phẩm bán chạy</div>
                <div v-if="loading">
                    <Skeleton v-for="i in 3" :key="i" height="3.5rem" class="mb-3" />
                </div>
                <div v-else-if="topProducts.length === 0" class="flex flex-col items-center justify-center py-12 text-muted-color">
                    <i class="pi pi-inbox text-4xl mb-3"></i>
                    <span>Chưa có dữ liệu</span>
                </div>
                <ul v-else class="list-none p-0 m-0">
                    <li v-for="(product, index) in topProducts" :key="product.productId" class="flex items-center gap-4 py-3" :class="{ 'border-b border-surface': index < topProducts.length - 1 }">
                        <div
                            class="flex items-center justify-center font-bold text-sm rounded-lg shrink-0"
                            :class="[
                                index === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-400/10' : index === 1 ? 'bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-200' : 'bg-orange-100 text-orange-600 dark:bg-orange-400/10'
                            ]"
                            style="width: 2rem; height: 2rem"
                        >
                            {{ index + 1 }}
                        </div>
                        <img v-if="product.images?.length" :src="product.images[0]" :alt="product.productName" class="w-10 h-10 rounded-lg object-cover shrink-0 bg-surface-100" />
                        <div v-else class="w-10 h-10 rounded-lg shrink-0 bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                            <i class="pi pi-image text-muted-color"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-surface-900 dark:text-surface-0 truncate">{{ product.productName }}</div>
                            <div class="text-muted-color text-xs mt-0.5">{{ formatVND(product.price) }} / đơn</div>
                        </div>
                        <div class="text-right shrink-0">
                            <div class="font-bold text-primary">{{ product.totalSold }}</div>
                            <div class="text-muted-color text-xs">lượt mua</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
