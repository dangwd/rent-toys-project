<script setup>
import API from '@/api/api-main';
import { formatPrice } from '@/helper/formatPrice';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';

const { proxy } = getCurrentInstance();
const toast = useToast();

const LIMIT = 10;
const loading = ref(false);
const users = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const keySearch = ref('');
const selectedTier = ref(null);

const tierOptions = [
    { label: 'Tất cả', value: null },
    { label: 'Bronze', value: 'bronze' },
    { label: 'Silver', value: 'silver' },
    { label: 'Gold', value: 'gold' },
    { label: 'Platinum', value: 'platinum' }
];

const tierSeverityMap = {
    bronze: 'secondary',
    silver: 'info',
    gold: 'warn',
    platinum: 'success'
};

const tierLabelMap = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum'
};

const statusSeverityMap = {
    active: 'success',
    inactive: 'warn',
    deleted: 'danger'
};

const statusLabelMap = {
    active: 'Hoạt động',
    inactive: 'Tạm ngưng',
    deleted: 'Đã xóa'
};

async function fetchUsers() {
    loading.value = true;
    try {
        const skip = (currentPage.value - 1) * LIMIT;
        const params = new URLSearchParams({ skip, limit: LIMIT });
        if (keySearch.value.trim()) params.append('search', keySearch.value.trim());
        if (selectedTier.value) params.append('tier', selectedTier.value);

        const res = await API.get(`users?${params.toString()}`);
        users.value = res.data.metadata.result;
        totalRecords.value = res.data.metadata.total;
    } catch {
        proxy.$notify('E', 'Không thể tải danh sách người dùng', toast);
    } finally {
        loading.value = false;
    }
}

function onPageChange(event) {
    currentPage.value = event.page + 1;
    fetchUsers();
}

function onSearch() {
    currentPage.value = 1;
    fetchUsers();
}

function onTierChange() {
    currentPage.value = 1;
    fetchUsers();
}

function formatDate(date) {
    if (!date) return '—';
    return format(new Date(date), 'dd/MM/yyyy');
}

onMounted(fetchUsers);
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <strong class="text-lg">Danh sách Người dùng</strong>
                </template>
            </Toolbar>

            <DataTable
                :value="users"
                :loading="loading"
                showGridlines
                dataKey="_id"
                lazy
                :paginator="true"
                :rows="LIMIT"
                :totalRecords="totalRecords"
                :rowsPerPageOptions="[10, 20, 50]"
                @page="onPageChange"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Hiển thị {first}–{last} / {totalRecords} người dùng"
            >
                <template #header>
                    <div class="flex flex-wrap gap-3 items-center justify-between">
                        <h4 class="m-0">Danh Sách Người dùng</h4>
                        <div class="flex gap-2 items-center">
                            <Select
                                v-model="selectedTier"
                                :options="tierOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Lọc hạng thẻ"
                                class="w-[160px]"
                                @change="onTierChange"
                            />
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText
                                    v-model="keySearch"
                                    @keyup.enter="onSearch"
                                    class="w-[280px]"
                                    placeholder="Tìm theo tên hoặc email..."
                                />
                            </IconField>
                            <Button icon="pi pi-search" @click="onSearch" />
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center p-4">Không có dữ liệu</div>
                </template>

                <Column header="STT" style="width: 60px; text-align: center">
                    <template #body="{ index }">
                        {{ (currentPage - 1) * LIMIT + index + 1 }}
                    </template>
                </Column>

                <Column header="Ảnh" style="width: 70px">
                    <template #body="{ data }">
                        <img
                            v-if="data.thumbnail"
                            :src="data.thumbnail"
                            alt="avatar"
                            class="w-10 h-10 rounded-full object-cover"
                        />
                        <div v-else class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <i class="pi pi-user text-sm" />
                        </div>
                    </template>
                </Column>

                <Column field="name" header="Họ tên" />

                <Column field="email" header="Email" />

                <Column field="phone" header="Số điện thoại">
                    <template #body="{ data }">
                        {{ data.phone || '—' }}
                    </template>
                </Column>

                <Column header="Trạng thái" style="width: 130px">
                    <template #body="{ data }">
                        <Tag :severity="statusSeverityMap[data.status]" :value="statusLabelMap[data.status] || data.status" />
                    </template>
                </Column>

                <Column header="Hạng thẻ" style="width: 120px">
                    <template #body="{ data }">
                        <Tag :severity="tierSeverityMap[data.membershipTier]" :value="tierLabelMap[data.membershipTier] || data.membershipTier" />
                    </template>
                </Column>

                <Column header="Tổng chi tiêu" style="width: 150px">
                    <template #body="{ data }">
                        <span class="font-medium">{{ formatPrice(data.totalSpent || 0) }}đ</span>
                    </template>
                </Column>

                <Column header="Ngày tạo" style="width: 120px">
                    <template #body="{ data }">
                        {{ formatDate(data.createdAt) }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style></style>
