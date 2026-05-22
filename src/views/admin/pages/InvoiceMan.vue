<script setup>
import API from '@/api/api-main';
import DetailOrder from '@/components/DetailOrder.vue';
import { formatPrice } from '@/helper/formatPrice';
import { formatStatusOrder, getOrderStatusSeverity, getPaymentStatusSeverity } from '@/helper/formatStatusOrder';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';

const { proxy } = getCurrentInstance();
const toast = useToast();

const LIMIT = 10;
const loading = ref(false);
const invoices = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const filterDialog = ref(false);

const filter = reactive({ status: null, search: '' });

const statusOpts = [
    { label: 'Tất cả', value: null },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đã xác nhận', value: 'confirmed' },
    { label: 'Đang giao', value: 'shipped' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'cancelled' }
];

async function fetchAllOrder() {
    loading.value = true;
    try {
        const skip = (currentPage.value - 1) * LIMIT;
        const params = new URLSearchParams({ skip, limit: LIMIT });
        if (filter.status) params.append('status', filter.status);
        if (filter.search.trim()) params.append('search', filter.search.trim());

        const res = await API.get(`order?${params.toString()}`);
        invoices.value = res.data.metadata.result;
        totalRecords.value = res.data.metadata.total;
    } catch (error) {
        proxy.$notify('E', 'Không thể tải danh sách đơn hàng', toast);
    } finally {
        loading.value = false;
    }
}

function onPageChange(event) {
    currentPage.value = event.page + 1;
    fetchAllOrder();
}

function applyFilter() {
    currentPage.value = 1;
    filterDialog.value = false;
    fetchAllOrder();
}

function resetFilter() {
    filter.status = null;
    filter.search = '';
    currentPage.value = 1;
    filterDialog.value = false;
    fetchAllOrder();
}

const paymentMethodLabel = (method) => (method === 'cod' ? 'COD' : method === 'zalo' ? 'ZaloPay' : method ?? '—');

onMounted(fetchAllOrder);
</script>

<template>
    <ConfirmDialog />
    <div class="card">
        <Toolbar class="mb-5">
            <template #start>
                <div class="flex items-center gap-3">
                    <strong class="text-lg">Quản lý đơn hàng</strong>
                    <Tag v-if="totalRecords" :value="`${totalRecords} đơn`" severity="secondary" />
                </div>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <InputText
                        v-model="filter.search"
                        placeholder="Tìm kiếm..."
                        class="w-48"
                        @keyup.enter="applyFilter"
                    />
                    <Button icon="pi pi-search" severity="secondary" outlined @click="applyFilter" />
                    <Button
                        icon="pi pi-filter"
                        :label="filter.status ? 'Đang lọc' : 'Bộ lọc'"
                        :severity="filter.status ? 'primary' : 'secondary'"
                        outlined
                        @click="filterDialog = true"
                    />
                    <Button v-if="filter.status || filter.search" icon="pi pi-times" severity="secondary" text @click="resetFilter" title="Xoá bộ lọc" />
                </div>
            </template>
        </Toolbar>

        <DataTable
            :value="invoices"
            :loading="loading"
            show-gridlines
            stripedRows
            lazy
            :rows="LIMIT"
            :total-records="totalRecords"
            :first="(currentPage - 1) * LIMIT"
            paginator
            @page="onPageChange"
            class="text-sm"
        >
            <template #empty>
                <div class="flex flex-col items-center justify-center py-12 text-muted-color gap-3">
                    <i class="pi pi-inbox text-4xl"></i>
                    <span>Không có đơn hàng nào</span>
                </div>
            </template>

            <Column header="#" style="width: 50px; text-align: center">
                <template #body="{ index }">
                    <span class="text-muted-color">{{ (currentPage - 1) * LIMIT + index + 1 }}</span>
                </template>
            </Column>

            <Column header="Khách hàng" style="min-width: 140px">
                <template #body="{ data }">
                    <div class="flex flex-col gap-0.5">
                        <span class="font-medium">{{ data.user?.name ?? '—' }}</span>
                        <span class="text-xs text-muted-color">{{ data.user?.phone ?? '' }}</span>
                    </div>
                </template>
            </Column>

            <Column header="Sản phẩm" style="min-width: 180px">
                <template #body="{ data }">
                    <div class="flex flex-col gap-0.5">
                        <span class="line-clamp-2">{{ data.items?.map((el) => el.productName).join(', ') }}</span>
                        <span class="text-xs text-muted-color">{{ data.items?.length }} sản phẩm</span>
                    </div>
                </template>
            </Column>

            <Column header="Thanh toán" style="min-width: 120px">
                <template #body="{ data }">
                    <div class="flex flex-col gap-1">
                        <Tag :severity="getPaymentStatusSeverity(data.paymentStatus)" :value="formatStatusOrder(data.paymentStatus)" />
                        <span class="text-xs text-muted-color">{{ paymentMethodLabel(data.paymentMethod) }}</span>
                    </div>
                </template>
            </Column>

            <Column header="Giá trị" style="min-width: 130px">
                <template #body="{ data }">
                    <div class="flex flex-col gap-0.5">
                        <span class="font-semibold text-primary">{{ formatPrice(data.finalPrice) }}đ</span>
                        <span v-if="data.finalPrice !== data.totalPrice" class="text-xs text-muted-color line-through">{{ formatPrice(data.totalPrice) }}đ</span>
                    </div>
                </template>
            </Column>

            <Column header="Ngày đặt" style="min-width: 110px">
                <template #body="{ data }">
                    <span class="text-muted-color">{{ format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm') }}</span>
                </template>
            </Column>

            <Column header="Trạng thái đơn" style="min-width: 140px">
                <template #body="{ data }">
                    <Tag :severity="getOrderStatusSeverity(data.status)" :value="formatStatusOrder(data.status)" />
                </template>
            </Column>

            <Column header="Thao tác" style="width: 80px; text-align: center">
                <template #body="{ data }">
                    <DetailOrder :data="data" @updated="fetchAllOrder" />
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- Filter dialog -->
    <Dialog v-model:visible="filterDialog" header="Bộ lọc đơn hàng" :style="{ width: '380px' }" modal>
        <div class="flex flex-col gap-4 pt-2">
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Trạng thái đơn hàng</label>
                <Select
                    v-model="filter.status"
                    :options="statusOpts"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                    placeholder="Tất cả trạng thái"
                />
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Tìm kiếm</label>
                <InputText v-model="filter.search" placeholder="Tên khách hàng, mã đơn..." class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="Đặt lại" severity="secondary" text @click="resetFilter" />
            <Button label="Áp dụng" icon="pi pi-check" @click="applyFilter" />
        </template>
    </Dialog>
</template>
