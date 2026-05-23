<script setup>
import API from '@/api/api-main';
import { format, isPast } from 'date-fns';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';

const { proxy } = getCurrentInstance();
const toast = useToast();
const confirm = useConfirm();

const couponTypeOpts = [
    { label: 'Giảm theo %', value: 'percent' },
    { label: 'Giảm số tiền cố định (₫)', value: 'fixed' }
];

const keySearch = ref('');
const coupons = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const submitted = ref(false);
const couponDetail = ref({});
const isEdit = computed(() => !!couponDetail.value._id);

const formatVND = (price) => new Intl.NumberFormat('vi-VN').format(price ?? 0);

const couponValueDisplay = (item) => {
    if (item.CouponType === 'percent') return `${item.CouponValue}%`;
    return `${formatVND(item.CouponValue)} ₫`;
};

const isExpired = (date) => isPast(new Date(date));

onMounted(fetchAll);

async function fetchAll() {
    loading.value = true;
    try {
        const res = await API.get(`coupon?skip=0&limit=200&search=${keySearch.value}`);
        coupons.value = res.data.metadata.result;
    } catch {
        proxy.$notify('E', 'Không thể tải danh sách coupon', toast);
    } finally {
        loading.value = false;
    }
}

function openNew() {
    couponDetail.value = { CouponType: 'percent', usageLimit: 100 };
    submitted.value = false;
    dialogVisible.value = true;
}

async function openEdit(data) {
    submitted.value = false;
    try {
        const res = await API.get(`coupon/${data._id}`);
        couponDetail.value = {
            ...res.data.metadata,
            expiryDate: new Date(res.data.metadata.expiryDate)
        };
        dialogVisible.value = true;
    } catch {
        proxy.$notify('E', 'Không thể tải thông tin coupon', toast);
    }
}

function hideDialog() {
    dialogVisible.value = false;
    submitted.value = false;
}

function validateData(data) {
    if (!data.CouponName?.trim()) {
        proxy.$notify('W', 'Vui lòng nhập tên coupon!', toast);
        return false;
    }
    if (!data.CouponType) {
        proxy.$notify('W', 'Vui lòng chọn loại coupon!', toast);
        return false;
    }
    if (!data.CouponValue || data.CouponValue <= 0) {
        proxy.$notify('W', 'Vui lòng nhập giá trị hợp lệ!', toast);
        return false;
    }
    if (data.CouponType === 'percent' && data.CouponValue > 100) {
        proxy.$notify('W', 'Giảm theo % không thể vượt quá 100%!', toast);
        return false;
    }
    if (!data.expiryDate) {
        proxy.$notify('W', 'Vui lòng chọn ngày hết hạn!', toast);
        return false;
    }
    return true;
}

async function saveCoupon() {
    submitted.value = true;
    const data = { ...couponDetail.value };
    if (!validateData(data)) return;

    const endpoint = data._id ? `coupon/${data._id}` : 'coupon';
    const call = data._id ? API.updatev2(endpoint, data) : API.create(endpoint, data);

    try {
        const res = await call;
        if (res?.data) {
            proxy.$notify('S', data._id ? 'Cập nhật thành công!' : 'Tạo coupon thành công!', toast);
            dialogVisible.value = false;
            fetchAll();
        } else {
            const msg = res?.response?.data?.message ?? 'Có lỗi xảy ra';
            proxy.$notify('E', msg, toast);
        }
    } catch (error) {
        proxy.$notify('E', error?.response?.data?.message ?? 'Có lỗi xảy ra', toast);
    }
}

function confirmDelete(data) {
    confirm.require({
        message: `Xác nhận xoá coupon "${data.CouponName}"?`,
        header: 'Xoá coupon',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Huỷ',
        acceptLabel: 'Xoá',
        acceptSeverity: 'danger',
        accept: () => deleteCoupon(data._id)
    });
}

async function deleteCoupon(id) {
    try {
        await API.delete(`coupon/${id}`);
        proxy.$notify('S', 'Xoá thành công!', toast);
        fetchAll();
    } catch {
        proxy.$notify('E', 'Xoá thất bại!', toast);
    }
}
</script>

<template>
    <ConfirmDialog />
    <div class="card">
        <Toolbar class="mb-5">
            <template #start>
                <div class="flex items-center gap-3">
                    <strong class="text-lg">Quản lý Coupon</strong>
                    <Tag v-if="coupons.length" :value="`${coupons.length} coupon`" severity="secondary" />
                </div>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <IconField>
                        <InputIcon><i class="pi pi-search" /></InputIcon>
                        <InputText v-model="keySearch" placeholder="Tìm theo tên..." class="w-52" @keydown.enter="fetchAll" />
                    </IconField>
                    <Button label="Thêm mới" icon="pi pi-plus" @click="openNew" />
                </div>
            </template>
        </Toolbar>

        <DataTable :value="coupons" :loading="loading" showGridlines stripedRows :rows="10" paginator class="text-sm">
            <template #empty>
                <div class="flex flex-col items-center justify-center py-10 text-muted-color gap-2">
                    <i class="pi pi-ticket text-4xl"></i>
                    <span>Không có coupon nào</span>
                </div>
            </template>

            <Column header="STT" style="width: 52px; text-align: center">
                <template #body="{ index }">
                    <span class="text-muted-color">{{ index + 1 }}</span>
                </template>
            </Column>

            <Column field="CouponName" header="Mã coupon" style="min-width: 140px">
                <template #body="{ data }">
                    <span class="font-mono font-bold text-primary">{{ data.CouponName }}</span>
                </template>
            </Column>

            <Column header="Loại" style="min-width: 120px">
                <template #body="{ data }">
                    <Tag
                        :value="data.CouponType === 'percent' ? 'Phần trăm' : 'Cố định'"
                        :severity="data.CouponType === 'percent' ? 'info' : 'secondary'"
                    />
                </template>
            </Column>

            <Column header="Giá trị" style="min-width: 130px">
                <template #body="{ data }">
                    <span class="font-semibold text-green-600 dark:text-green-400">{{ couponValueDisplay(data) }}</span>
                </template>
            </Column>

            <Column header="Đơn tối thiểu" style="min-width: 140px">
                <template #body="{ data }">
                    <span>{{ formatVND(data.minOrderValue) }} ₫</span>
                </template>
            </Column>

            <Column header="Còn lại" style="min-width: 90px; text-align: center">
                <template #body="{ data }">
                    <Tag
                        :value="String(data.usageLimit)"
                        :severity="data.usageLimit === 0 ? 'danger' : data.usageLimit <= 10 ? 'warn' : 'success'"
                    />
                </template>
            </Column>

            <Column header="Hết hạn" style="min-width: 140px">
                <template #body="{ data }">
                    <div class="flex flex-col gap-1">
                        <span :class="isExpired(data.expiryDate) ? 'text-red-500 line-through' : ''">
                            {{ format(new Date(data.expiryDate), 'dd/MM/yyyy') }}
                        </span>
                        <Tag v-if="isExpired(data.expiryDate)" value="Hết hạn" severity="danger" class="w-fit" />
                        <Tag v-else value="Còn hạn" severity="success" class="w-fit" />
                    </div>
                </template>
            </Column>

            <Column header="Thao tác" style="width: 100px; text-align: center">
                <template #body="{ data }">
                    <div class="flex gap-1 justify-center">
                        <Button @click="openEdit(data)" text rounded icon="pi pi-pencil" severity="info" />
                        <Button @click="confirmDelete(data)" text rounded icon="pi pi-trash" severity="danger" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- Create / Edit dialog -->
    <Dialog v-model:visible="dialogVisible" :style="{ width: '480px' }" :header="isEdit ? 'Chỉnh sửa coupon' : 'Tạo coupon mới'" modal>
        <div class="flex flex-col gap-5 pt-2">
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold">Tên coupon <span class="text-red-500">*</span></label>
                <InputText
                    v-model="couponDetail.CouponName"
                    :invalid="submitted && !couponDetail.CouponName"
                    placeholder="VD: SUMMER10"
                    :disabled="isEdit"
                    class="font-mono uppercase"
                    fluid
                />
                <small v-if="isEdit" class="text-muted-color">Không thể thay đổi tên coupon sau khi tạo</small>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold">Loại giảm giá <span class="text-red-500">*</span></label>
                    <Select
                        v-model="couponDetail.CouponType"
                        :options="couponTypeOpts"
                        optionLabel="label"
                        optionValue="value"
                        :invalid="submitted && !couponDetail.CouponType"
                        fluid
                    />
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold">
                        Giá trị
                        <span class="font-normal text-muted-color">({{ couponDetail.CouponType === 'percent' ? '%' : '₫' }})</span>
                        <span class="text-red-500">*</span>
                    </label>
                    <InputNumber
                        v-model="couponDetail.CouponValue"
                        :suffix="couponDetail.CouponType === 'percent' ? '%' : ' ₫'"
                        :max="couponDetail.CouponType === 'percent' ? 100 : undefined"
                        :min="0"
                        :invalid="submitted && !couponDetail.CouponValue"
                        fluid
                    />
                </div>
            </div>

            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold">Đơn hàng tối thiểu (₫)</label>
                <InputNumber v-model="couponDetail.minOrderValue" :min="0" suffix=" ₫" placeholder="0 = không giới hạn" fluid />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold">Số lượt dùng</label>
                    <InputNumber v-model="couponDetail.usageLimit" :min="1" :invalid="submitted && !couponDetail.usageLimit" fluid />
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold">Ngày hết hạn <span class="text-red-500">*</span></label>
                    <DatePicker
                        v-model="couponDetail.expiryDate"
                        dateFormat="dd/mm/yy"
                        :minDate="new Date()"
                        :invalid="submitted && !couponDetail.expiryDate"
                        fluid
                    />
                </div>
            </div>

            <!-- Preview -->
            <div v-if="couponDetail.CouponValue && couponDetail.CouponType" class="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/40 p-4">
                <p class="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider mb-1">Xem trước</p>
                <p class="text-sm text-green-800 dark:text-green-300">
                    Giảm <strong>{{ couponValueDisplay(couponDetail) }}</strong>
                    <span v-if="couponDetail.minOrderValue"> cho đơn từ <strong>{{ formatVND(couponDetail.minOrderValue) }} ₫</strong></span>
                </p>
            </div>
        </div>

        <template #footer>
            <Button label="Huỷ" severity="secondary" text @click="hideDialog" />
            <Button :label="isEdit ? 'Cập nhật' : 'Tạo coupon'" icon="pi pi-check" @click="saveCoupon" />
        </template>
    </Dialog>
</template>
