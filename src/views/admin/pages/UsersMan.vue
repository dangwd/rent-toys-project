<script setup>
import API from '@/api/api-main';
import { formatPrice } from '@/helper/formatPrice';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref } from 'vue';

const { proxy } = getCurrentInstance();
const toast = useToast();

const LIMIT = 10;
const loading = ref(false);
const users = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const keySearch = ref('');
const selectedTier = ref(null);

const detailVisible = ref(false);
const detailLoading = ref(false);
const selectedUser = ref(null);

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

const tierConfig = {
    bronze: {
        label: 'Bronze',
        emoji: '🥉',
        benefit: 'Thành viên cơ bản',
        cardStyle: 'background: linear-gradient(135deg, #78350f 0%, #b45309 100%); box-shadow: 0 8px 32px rgba(180,83,9,0.35)',
        ringColor: '#b45309'
    },
    silver: {
        label: 'Silver',
        emoji: '🥈',
        benefit: 'Giảm giá 3% mỗi đơn hàng',
        cardStyle: 'background: linear-gradient(135deg, #1f2937 0%, #6b7280 100%); box-shadow: 0 8px 32px rgba(107,114,128,0.35)',
        ringColor: '#6b7280'
    },
    gold: {
        label: 'Gold',
        emoji: '🥇',
        benefit: 'Giảm giá 5% mỗi đơn hàng',
        cardStyle: 'background: linear-gradient(135deg, #92400e 0%, #d97706 100%); box-shadow: 0 8px 32px rgba(217,119,6,0.4)',
        ringColor: '#f59e0b'
    },
    platinum: {
        label: 'Platinum',
        emoji: '💎',
        benefit: 'Freeship + Voucher đặc biệt',
        cardStyle: 'background: linear-gradient(135deg, #3b0764 0%, #7c3aed 100%); box-shadow: 0 8px 32px rgba(124,58,237,0.4)',
        ringColor: '#7c3aed'
    }
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

async function viewUser(id) {
    detailVisible.value = true;
    detailLoading.value = true;
    selectedUser.value = null;
    try {
        const res = await API.get(`users/${id}`);
        selectedUser.value = res.data.metadata;
    } catch {
        proxy.$notify('E', 'Không thể tải thông tin người dùng', toast);
        detailVisible.value = false;
    } finally {
        detailLoading.value = false;
    }
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
                            <Select v-model="selectedTier" :options="tierOptions" optionLabel="label" optionValue="value" placeholder="Lọc hạng thẻ" class="w-[160px]" @change="onTierChange" />
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="keySearch" @keyup.enter="onSearch" class="w-[280px]" placeholder="Tìm theo tên hoặc email..." />
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
                        <img v-if="data.thumbnail" :src="data.thumbnail" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
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

                <Column header="Thao tác" style="width: 90px; text-align: center">
                    <template #body="{ data }">
                        <Button icon="pi pi-eye" text rounded severity="info" @click="viewUser(data._id)" v-tooltip.top="'Xem chi tiết'" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Detail Dialog -->
        <Dialog v-model:visible="detailVisible" modal header="Chi tiết người dùng" :style="{ width: '560px' }">
            <div v-if="detailLoading" class="flex justify-center items-center py-16 p-2">
                <ProgressSpinner style="width: 48px; height: 48px" />
            </div>

            <div v-else-if="selectedUser" class="flex flex-col gap-5 p-2">
                <!-- Avatar + tên + badges -->
                <div class="flex items-center gap-5">
                    <div class="shrink-0">
                        <img
                            v-if="selectedUser.thumbnail"
                            :src="selectedUser.thumbnail"
                            alt="avatar"
                            class="w-20 h-20 rounded-full object-cover"
                            :style="{ outline: `4px solid ${tierConfig[selectedUser.membershipTier]?.ringColor || '#e5e7eb'}`, outlineOffset: '3px' }"
                        />
                        <div
                            v-else
                            class="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center"
                            :style="{ outline: `4px solid ${tierConfig[selectedUser.membershipTier]?.ringColor || '#e5e7eb'}`, outlineOffset: '3px' }"
                        >
                            <i class="pi pi-user text-3xl text-surface-400" />
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-xl font-bold truncate">{{ selectedUser.name }}</div>
                        <div class="text-sm text-surface-500 truncate mt-0.5">{{ selectedUser.email }}</div>
                        <div class="flex flex-wrap gap-2 mt-2">
                            <Tag :severity="statusSeverityMap[selectedUser.status]" :value="statusLabelMap[selectedUser.status] || selectedUser.status" />
                            <Tag :value="selectedUser.role === 'A' ? 'Admin' : 'Khách hàng'" severity="secondary" />
                        </div>
                    </div>
                </div>

                <!-- Membership Tier Card -->
                <div class="rounded-2xl p-5 text-white relative overflow-hidden" :style="tierConfig[selectedUser.membershipTier]?.cardStyle">
                    <div class="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white opacity-10 pointer-events-none" />
                    <div class="absolute -right-10 -bottom-8 w-36 h-36 rounded-full bg-white opacity-[0.07] pointer-events-none" />
                    <div class="relative z-10 flex items-center justify-between gap-4">
                        <div>
                            <div class="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Hạng thành viên</div>
                            <div class="text-3xl font-extrabold leading-tight">{{ tierConfig[selectedUser.membershipTier]?.label }}</div>
                            <div class="text-sm opacity-75 mt-1.5">{{ tierConfig[selectedUser.membershipTier]?.benefit }}</div>
                        </div>
                        <div class="text-right shrink-0">
                            <div class="text-5xl leading-none">{{ tierConfig[selectedUser.membershipTier]?.emoji }}</div>
                            <div class="mt-2">
                                <div class="text-xs opacity-70">Tổng chi tiêu</div>
                                <div class="text-lg font-bold">{{ formatPrice(selectedUser.totalSpent || 0) }}đ</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Info grid -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-surface-50 dark:bg-surface-800 rounded-xl p-4">
                        <div class="flex items-center gap-1.5 text-surface-400 mb-1.5">
                            <i class="pi pi-phone text-xs" />
                            <span class="text-xs font-medium uppercase tracking-wide">Điện thoại</span>
                        </div>
                        <div class="font-semibold text-sm">{{ selectedUser.phone || '—' }}</div>
                    </div>
                    <div class="bg-surface-50 dark:bg-surface-800 rounded-xl p-4">
                        <div class="flex items-center gap-1.5 text-surface-400 mb-1.5">
                            <i class="pi pi-calendar text-xs" />
                            <span class="text-xs font-medium uppercase tracking-wide">Ngày tham gia</span>
                        </div>
                        <div class="font-semibold text-sm">{{ formatDate(selectedUser.createdAt) }}</div>
                    </div>
                </div>

                <!-- Address -->
                <div class="bg-surface-50 dark:bg-surface-800 rounded-xl p-4">
                    <div class="flex items-center gap-1.5 text-surface-400 mb-1.5">
                        <i class="pi pi-map-marker text-xs" />
                        <span class="text-xs font-medium uppercase tracking-wide">Địa chỉ</span>
                    </div>
                    <div class="font-medium text-sm">
                        {{ [selectedUser.addressLine, selectedUser.ward, selectedUser.district, selectedUser.province].filter(Boolean).join(', ') || '—' }}
                    </div>
                </div>

                <!-- Footer -->
                <div class="text-xs text-surface-400 text-right">Cập nhật lần cuối: {{ formatDate(selectedUser.updatedAt) }}</div>
            </div>
        </Dialog>
    </div>
</template>

<style></style>
