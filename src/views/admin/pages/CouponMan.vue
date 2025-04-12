<script setup>
import API from '@/api/api-main';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref } from 'vue';
const { proxy } = getCurrentInstance();
const toast = useToast();

onMounted(() => {
    fetchAllGenres();
});

const couponTypeOpts = ref([
    {
        name: '%',
        value: 'percent'
    },
    {
        name: 'fixed',
        value: 'fixed'
    }
]);
const keySearch = ref('');
const Coupons = ref();
const couponsDialog = ref(false);
const deleteProductDialog = ref(false);
const couponDetail = ref({});
const selectedProducts = ref();

const submitted = ref(false);

const fetchAllGenres = async () => {
    try {
        const res = await API.get(`coupon?skip=0&limit=200&search=${keySearch.value}`);
        Coupons.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};

const openNew = async (data) => {
    submitted.value = false;

    if (!data._id) {
        couponsDialog.value = true;
        return (couponDetail.value = {});
    }
    try {
        const res = await API.get(`coupon/${data._id}`);
        couponDetail.value = res.data.metadata;
        couponDetail.value.expiryDate = new Date(res.data?.metadata.expiryDate);
    } catch (error) {
        console.log(error);
    }
    couponsDialog.value = true;
};

function hideDialog() {
    couponsDialog.value = false;
    submitted.value = false;
}
const validateData = (data) => {
    if (!data.CouponName) {
        proxy.$notify('W', 'Vui lòng nhập teen thể loại!', toast);
        return false;
    }
    return true;
};
const saveCoupon = async () => {
    let data = {
        ...couponDetail.value,
        CouponType: 'percent'
    };
    submitted.value = true;
    if (!validateData(data)) return;
    let API_EP = data._id ? `coupon/${data._id}` : `coupon`;
    let FUNC_API = data._id ? API.updatev2(API_EP, data) : API.create(API_EP, data);
    try {
        const res = await FUNC_API;
        if (res.data) {
            couponsDialog.value = false;
            proxy.$notify('S', 'Thành công!', toast);
            fetchAllGenres();
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteActorDlg = (data) => {
    couponDetail.value = data;
    deleteProductDialog.value = true;
};

const confirmDeleteSelected = async () => {
    try {
        const res = await API.delete(`coupon/${couponDetail.value._id}`);
        if (res) {
            fetchAllGenres();
            proxy.$notify('S', 'Thành công!', toast);
            deleteProductDialog.value = false;
        }
    } catch (error) {
        console.log(error);
    }
};
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <strong class="text-lg">Coupon</strong>
                </template>
                <template #end>
                    <Button label="Thêm mới" icon="pi pi-plus" @click="openNew" />
                </template>
            </Toolbar>

            <DataTable v-model:selection="selectedProducts" showGridlines :value="Coupons" dataKey="id" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 25]">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Danh Sách Coupon</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="keySearch" class="w-[300px]" @keydown.enter="fetchAllGenres(s)" placeholder="Tìm kiếm  theo tên..." />
                        </IconField>
                    </div>
                </template>
                <template #empty>
                    <div class="text-center p-2">Dữ liệu trống</div>
                </template>
                <Column header="STT">
                    <template #body="sp">
                        {{ sp.index + 1 }}
                    </template>
                </Column>
                <Column field="CouponName" header="Coupon"></Column>
                <!-- <Column field="CouponType" header="Loại"> </Column> -->
                <Column field="CouponValue" header="Giá trị Coupon">
                    <template #body="{ data }">
                        {{ formatPrice(data.CouponValue) }}
                    </template>
                </Column>
                <Column field="minOrderValue" header="Giá trị tối thiểu">
                    <template #body="{ data }">
                        {{ formatPrice(data.minOrderValue) }}
                    </template>
                </Column>
                <Column field="expiryDate" header="Thời hạn áp dụng">
                    <template #body="{ data }">
                        {{ format(data.expiryDate, 'dd/MM/yyyy') }}
                    </template>
                </Column>
                <Column field="" header="Thao tác">
                    <template #body="sp">
                        <div class="flex gap-2">
                            <Button @click="openNew(sp.data)" text icon="pi pi-eye"></Button>
                            <Button @click="deleteActorDlg(sp.data)" text icon="pi pi-trash" severity="danger"></Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="couponsDialog" :style="{ width: '450px' }" header="Coupon" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Tên Coupon</label>
                    <InputText id="name" v-model="couponDetail.CouponName" required="true" autofocus :invalid="submitted && !couponDetail.CouponName" fluid />
                </div>
                <!-- <div>
                    <label class="block font-bold mb-3">Loại</label>
                    <Dropdown v-model="couponDetail.CouponType" :options="couponTypeOpts" optionValue="value" optionLabel="name" required="true" autofocus :invalid="submitted && !couponDetail.CouponType" fluid />
                </div> -->
                <div>
                    <label for="name" class="block font-bold mb-3">Giá trị Coupon</label>
                    <InputNumber id="name" :max="100" :min="0" suffix="%" v-model="couponDetail.CouponValue" required="true" autofocus :invalid="submitted && !couponDetail.CouponValue" fluid />
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Áp dụng cho sản phẩm từ</label>
                    <InputNumber id="name" v-model="couponDetail.minOrderValue" required="true" autofocus :invalid="submitted && !couponDetail.minOrderValue" fluid />
                </div>
                <div>
                    <label class="block font-bold mb-3">Số lượng</label>
                    <InputNumber v-model="couponDetail.usageLimit" required="true" autofocus :invalid="submitted && !couponDetail.usageLimit" fluid />
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Hạn sử dụng</label>
                    <DatePicker id="name" v-model="couponDetail.expiryDate" dateFormat="dd/mm/yy" required="true" autofocus :invalid="submitted && !couponDetail.expiryDate" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Hủy" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Xác nhận" icon="pi pi-check" @click="saveCoupon" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Xác nhận" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="couponDetail"
                    >Xác nhận xóa <b>{{ couponDetail.couponName }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="Hủy" icon="pi pi-times" severity="secondary" @click="deleteProductDialog = false" />
                <Button label="Xác nhận" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" />
            </template>
        </Dialog>
    </div>
</template>
