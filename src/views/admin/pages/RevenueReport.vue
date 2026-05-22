<script setup>
import API from '@/api/api-main';
import authHeader from '@/service/AuthHeader';
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const loading = ref(false);
const exporting = ref(false);

const filterType = ref('week');
const filterYear = ref(new Date().getFullYear());
const filterMonth = ref(new Date().getMonth() + 1);
const filterWeek = ref(getCurrentISOWeek());

const summary = ref(null);
const breakdown = ref([]);

const chartData = ref(null);
const chartOptions = ref(null);

const typeOptions = [
    { label: 'Theo tuần', value: 'week' },
    { label: 'Theo tháng', value: 'month' },
    { label: 'Theo năm', value: 'year' }
];

const yearOptions = computed(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => ({ label: String(current - i), value: current - i }));
});

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `Tháng ${i + 1}`,
    value: i + 1
}));

const weekOptions = computed(() => {
    return Array.from({ length: 53 }, (_, i) => ({ label: `Tuần ${i + 1}`, value: i + 1 }));
});

function getCurrentISOWeek() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

const DAY_VI = {
    Monday: 'Thứ Hai', Tuesday: 'Thứ Ba', Wednesday: 'Thứ Tư',
    Thursday: 'Thứ Năm', Friday: 'Thứ Sáu', Saturday: 'Thứ Bảy', Sunday: 'Chủ Nhật'
};

const MONTH_VI = {
    January: 'Tháng 1', February: 'Tháng 2', March: 'Tháng 3',
    April: 'Tháng 4', May: 'Tháng 5', June: 'Tháng 6',
    July: 'Tháng 7', August: 'Tháng 8', September: 'Tháng 9',
    October: 'Tháng 10', November: 'Tháng 11', December: 'Tháng 12'
};

function translateLabel(label) {
    return DAY_VI[label] || MONTH_VI[label] || label;
}

function buildParams() {
    const params = { type: filterType.value, year: filterYear.value };
    if (filterType.value === 'month') params.month = filterMonth.value;
    if (filterType.value === 'week') params.week = filterWeek.value;
    return params;
}

async function fetchReport() {
    loading.value = true;
    try {
        const params = buildParams();
        const query = new URLSearchParams(params).toString();
        const res = await API.get(`report/revenue?${query}`);
        if (res?.data?.metadata) {
            summary.value = res.data.metadata.summary;
            breakdown.value = res.data.metadata.breakdown;
            buildChart();
        }
    } finally {
        loading.value = false;
    }
}

async function exportExcel() {
    exporting.value = true;
    try {
        const params = buildParams();
        const api = import.meta.env.VITE_APP_API;
        const response = await axios.get(`${api}report/revenue/export`, {
            params,
            headers: authHeader(),
            responseType: 'blob'
        });
        const url = URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const disposition = response.headers['content-disposition'];
        const filename = disposition?.split('filename=')[1]?.replace(/"/g, '') ?? 'bao-cao-doanh-thu.xlsx';
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    } finally {
        exporting.value = false;
    }
}

function buildChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    chartData.value = {
        labels: breakdown.value.map((d) => translateLabel(d.label)),
        datasets: [
            {
                type: 'bar',
                label: 'Doanh thu (₫)',
                data: breakdown.value.map((d) => d.revenue),
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400') + 'CC',
                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
                yAxisID: 'y'
            },
            {
                type: 'line',
                label: 'Số đơn',
                data: breakdown.value.map((d) => d.orderCount),
                borderColor: documentStyle.getPropertyValue('--p-orange-400'),
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: documentStyle.getPropertyValue('--p-orange-400'),
                yAxisID: 'y2'
            }
        ]
    };

    chartOptions.value = {
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textMutedColor,
                    padding: 16,
                    font: { size: 12 }
                }
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        if (ctx.dataset.yAxisID === 'y') return ` Doanh thu: ${formatVND(ctx.raw)}`;
                        return ` Đơn hàng: ${ctx.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: textMutedColor, maxRotation: 45 },
                grid: { color: 'transparent' }
            },
            y: {
                position: 'left',
                ticks: {
                    color: textMutedColor,
                    callback: (v) => formatVNDShort(v)
                },
                grid: { color: borderColor, drawTicks: false }
            },
            y2: {
                position: 'right',
                ticks: { color: documentStyle.getPropertyValue('--p-orange-400'), stepSize: 1 },
                grid: { display: false }
            }
        }
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
    return new Date(iso).toLocaleDateString('vi-VN');
};

const avgRevenue = computed(() => {
    if (!breakdown.value.length) return 0;
    const nonZero = breakdown.value.filter((d) => d.revenue > 0);
    if (!nonZero.length) return 0;
    return Math.round(nonZero.reduce((s, d) => s + d.revenue, 0) / nonZero.length);
});

const peakDay = computed(() => {
    if (!breakdown.value.length) return null;
    return breakdown.value.reduce((max, d) => (d.revenue > (max?.revenue ?? 0) ? d : max), null);
});

const periodLabel = computed(() => {
    if (filterType.value === 'week') return `Tuần ${filterWeek.value} — Năm ${filterYear.value}`;
    if (filterType.value === 'month') return `Tháng ${filterMonth.value} — Năm ${filterYear.value}`;
    return `Năm ${filterYear.value}`;
});

watch([getPrimary, getSurface, isDarkTheme], () => {
    if (breakdown.value.length) buildChart();
});

onMounted(fetchReport);
</script>

<template>
    <div class="grid grid-cols-12 gap-6">

        <!-- Header -->
        <div class="col-span-12">
            <div class="card mb-0">
                <div class="flex flex-col md:flex-row md:items-end gap-4">
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-1">Báo cáo doanh thu</h2>
                        <p class="text-muted-color text-sm">{{ periodLabel }}</p>
                    </div>

                    <!-- Filters -->
                    <div class="flex flex-wrap items-end gap-3">
                        <div class="flex flex-col gap-1">
                            <label class="text-xs text-muted-color font-medium">Loại báo cáo</label>
                            <Select v-model="filterType" :options="typeOptions" optionLabel="label" optionValue="value" class="w-40" />
                        </div>

                        <div v-if="filterType === 'week'" class="flex flex-col gap-1">
                            <label class="text-xs text-muted-color font-medium">Tuần</label>
                            <Select v-model="filterWeek" :options="weekOptions" optionLabel="label" optionValue="value" class="w-32" />
                        </div>

                        <div v-if="filterType === 'month'" class="flex flex-col gap-1">
                            <label class="text-xs text-muted-color font-medium">Tháng</label>
                            <Select v-model="filterMonth" :options="monthOptions" optionLabel="label" optionValue="value" class="w-32" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label class="text-xs text-muted-color font-medium">Năm</label>
                            <Select v-model="filterYear" :options="yearOptions" optionLabel="label" optionValue="value" class="w-28" />
                        </div>

                        <Button
                            label="Xem báo cáo"
                            icon="pi pi-search"
                            :loading="loading"
                            @click="fetchReport"
                        />
                        <Button
                            label="Xuất Excel"
                            icon="pi pi-download"
                            severity="secondary"
                            outlined
                            :loading="exporting"
                            @click="exportExcel"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- KPI Cards -->
        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card mb-0 h-full">
                <div class="flex justify-between items-start mb-3">
                    <span class="text-muted-color text-sm font-medium">Tổng doanh thu</span>
                    <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-400/10 flex items-center justify-center shrink-0">
                        <i class="pi pi-wallet text-blue-500"></i>
                    </div>
                </div>
                <Skeleton v-if="loading" width="10rem" height="2.2rem" class="mb-2" />
                <div v-else class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-1">
                    {{ formatVND(summary?.totalRevenue ?? 0) }}
                </div>
                <div class="text-xs text-muted-color">
                    {{ formatDate(summary?.from) }} – {{ formatDate(summary?.to) }}
                </div>
            </div>
        </div>

        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card mb-0 h-full">
                <div class="flex justify-between items-start mb-3">
                    <span class="text-muted-color text-sm font-medium">Tổng đơn hàng</span>
                    <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-400/10 flex items-center justify-center shrink-0">
                        <i class="pi pi-shopping-bag text-orange-500"></i>
                    </div>
                </div>
                <Skeleton v-if="loading" width="6rem" height="2.2rem" class="mb-2" />
                <div v-else class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-1">
                    {{ summary?.totalOrders ?? 0 }}
                </div>
                <div class="text-xs text-muted-color">đơn trong kỳ</div>
            </div>
        </div>

        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card mb-0 h-full">
                <div class="flex justify-between items-start mb-3">
                    <span class="text-muted-color text-sm font-medium">Doanh thu trung bình</span>
                    <div class="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-400/10 flex items-center justify-center shrink-0">
                        <i class="pi pi-chart-bar text-cyan-500"></i>
                    </div>
                </div>
                <Skeleton v-if="loading" width="9rem" height="2.2rem" class="mb-2" />
                <div v-else class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-1">
                    {{ formatVND(avgRevenue) }}
                </div>
                <div class="text-xs text-muted-color">mỗi kỳ có doanh thu</div>
            </div>
        </div>

        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card mb-0 h-full">
                <div class="flex justify-between items-start mb-3">
                    <span class="text-muted-color text-sm font-medium">Kỳ đỉnh</span>
                    <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-400/10 flex items-center justify-center shrink-0">
                        <i class="pi pi-arrow-up text-green-500"></i>
                    </div>
                </div>
                <Skeleton v-if="loading" width="9rem" height="2.2rem" class="mb-2" />
                <template v-else>
                    <div class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-1">
                        {{ formatVND(peakDay?.revenue ?? 0) }}
                    </div>
                    <div class="text-xs text-muted-color">
                        {{ peakDay ? translateLabel(peakDay.label) : '—' }}
                        <span v-if="peakDay?.date"> ({{ formatDate(peakDay.date) }})</span>
                    </div>
                </template>
            </div>
        </div>

        <!-- Chart -->
        <div class="col-span-12">
            <div class="card">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <div class="font-semibold text-xl">Biểu đồ doanh thu & đơn hàng</div>
                        <div class="text-muted-color text-sm mt-1">{{ periodLabel }}</div>
                    </div>
                </div>

                <div v-if="loading" class="flex items-center justify-center" style="height: 360px">
                    <i class="pi pi-spin pi-spinner text-4xl text-muted-color"></i>
                </div>
                <div v-else-if="!breakdown.length" class="flex flex-col items-center justify-center text-muted-color" style="height: 360px">
                    <i class="pi pi-chart-line text-5xl mb-4"></i>
                    <span>Không có dữ liệu cho kỳ này</span>
                </div>
                <Chart v-else type="bar" :data="chartData" :options="chartOptions" style="height: 360px" />
            </div>
        </div>

        <!-- Detail Table -->
        <div class="col-span-12">
            <div class="card">
                <div class="flex items-center justify-between mb-6">
                    <div class="font-semibold text-xl">Chi tiết theo kỳ</div>
                    <span class="text-muted-color text-sm">{{ breakdown.length }} bản ghi</span>
                </div>

                <div v-if="loading">
                    <Skeleton v-for="i in 7" :key="i" height="3rem" class="mb-2" />
                </div>
                <DataTable
                    v-else
                    :value="breakdown"
                    :rows="20"
                    :paginator="breakdown.length > 20"
                    responsiveLayout="scroll"
                    class="text-sm"
                    stripedRows
                    showGridlines
                >
                    <Column header="STT" style="width: 60px; text-align: center">
                        <template #body="{ index }">
                            <span class="text-muted-color">{{ index + 1 }}</span>
                        </template>
                    </Column>
                    <Column header="Kỳ" style="min-width: 140px">
                        <template #body="{ data }">
                            <span class="font-medium">{{ translateLabel(data.label) }}</span>
                        </template>
                    </Column>
                    <Column header="Ngày / Tháng" style="min-width: 120px">
                        <template #body="{ data }">
                            <span class="text-muted-color">
                                {{ data.date ? formatDate(data.date) : (data.month ? `Tháng ${data.month}` : '—') }}
                            </span>
                        </template>
                    </Column>
                    <Column header="Doanh thu" style="min-width: 160px">
                        <template #body="{ data }">
                            <span :class="data.revenue > 0 ? 'text-primary font-semibold' : 'text-muted-color'">
                                {{ formatVND(data.revenue) }}
                            </span>
                        </template>
                    </Column>
                    <Column header="Số đơn" style="min-width: 100px; text-align: center">
                        <template #body="{ data }">
                            <Tag v-if="data.orderCount > 0" :value="String(data.orderCount)" severity="info" />
                            <span v-else class="text-muted-color">0</span>
                        </template>
                    </Column>
                    <Column header="Trung bình / đơn" style="min-width: 160px">
                        <template #body="{ data }">
                            <span class="text-muted-color">
                                {{ data.orderCount > 0 ? formatVND(Math.round(data.revenue / data.orderCount)) : '—' }}
                            </span>
                        </template>
                    </Column>
                    <Column header="% tổng DT" style="min-width: 140px">
                        <template #body="{ data }">
                            <div v-if="summary?.totalRevenue > 0" class="flex items-center gap-2">
                                <div class="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden" style="height: 6px">
                                    <div
                                        class="bg-primary h-full rounded-full"
                                        :style="{ width: Math.min(100, (data.revenue / summary.totalRevenue) * 100).toFixed(1) + '%' }"
                                    ></div>
                                </div>
                                <span class="text-xs text-muted-color shrink-0">
                                    {{ ((data.revenue / summary.totalRevenue) * 100).toFixed(1) }}%
                                </span>
                            </div>
                            <span v-else class="text-muted-color text-xs">—</span>
                        </template>
                    </Column>
                </DataTable>

                <!-- Footer tổng -->
                <div v-if="!loading && breakdown.length" class="mt-4 pt-4 border-t border-surface flex flex-wrap gap-6 items-center justify-end">
                    <div class="text-right">
                        <div class="text-xs text-muted-color mb-1">Tổng doanh thu</div>
                        <div class="font-bold text-primary text-lg">{{ formatVND(summary?.totalRevenue ?? 0) }}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-muted-color mb-1">Tổng đơn hàng</div>
                        <div class="font-bold text-surface-900 dark:text-surface-0 text-lg">{{ summary?.totalOrders ?? 0 }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
