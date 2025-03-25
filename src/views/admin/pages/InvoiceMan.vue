<script setup>
import API from '@/api/api-main';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { formatPrice } from '@/helper/formatPrice';
import { format } from 'date-fns';
const { proxy } = getCurrentInstance();
const toast = useToast();

onMounted(() => {
    fetchAllGenres();
});

const paginator = reactive({
    rows: 5,
    page: 0,
    total: 0
});
const Invoices = ref();
const genresDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const orderDetail = ref({});
const selectedProducts = ref();

const submitted = ref(false);

const fetchAllGenres = async () => {
    try {
        const res = await API.get(`order?skip=0&limit=20`);
        Invoices.value = res.data.metadata.result;
        paginator.total = res.data.metadata.total;
    } catch (error) {
        console.log(error);
    }
};

const openNew = async (data) => {
    submitted.value = false;

    if (!data._id) {
        genresDialog.value = true;
        return (orderDetail.value = {});
    }
    try {
        const res = await API.get(`order/${data._id}`);
        orderDetail.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
    genresDialog.value = true;
};

function hideDialog() {
    genresDialog.value = false;
    submitted.value = false;
}
const validateData = (data) => {
    if (!data.genreName) {
        proxy.$notify('W', 'Vui lòng nhập tên thể loại!', toast);
        return false;
    }
    return true;
};
const saveGenre = async () => {
    let data = { ...orderDetail.value };
    submitted.value = true;
    if (!validateData(data)) return;
    let API_EP = data._id ? `genre/${data._id}` : `genre`;
    let FUNC_API = data._id ? API.updatev2(API_EP, data) : API.create(API_EP, data);
    try {
        const res = await FUNC_API;
        if (res.data) {
            genresDialog.value = false;
            proxy.$notify('S', 'Thành công!', toast);
            fetchAllGenres();
        }
    } catch (error) {
        console.log(error);
    }
};

const confirmDeleteSelected = async () => {
    try {
        const res = await API.delete(`genre/${orderDetail.value._id}`);
        if (res) {
            fetchAllGenres();
            proxy.$notify('S', 'Thành công!', toast);
            deleteProductDialog.value = false;
        }
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <strong class="text-lg">Đơn hàng</strong>
                </template>
                <template #end>
                    <!-- <Button label="Thêm mới" icon="pi pi-plus" @click="openNew" /> -->
                </template>
            </Toolbar>

            <DataTable :value="Invoices" show-gridlines paginator :rows="paginator.rows" :page="paginator.page" :total-records="paginator.total" lazy>
                <Column header="#">
                    <template #body="{ index }">
                        {{ index + 1 }}
                    </template>
                </Column>
                <Column header="Sản phẩm" style="max-width: 200px">
                    <template #body="{ data }">
                        {{ data.items.map((el) => el.productName).join(', ') }}
                    </template>
                </Column>
                <Column header="Số lượng">
                    <template #body="{ data }">
                        {{ data.items.map((el) => el.quantity).join(', ') }}
                    </template>
                </Column>
                <Column header="KM">
                    <template #body="{ data }">
                        {{ data.coupon ? `${data?.coupon?.CouponName} (${formatPrice(data?.coupon?.CouponValue)})` : `Không KM` }}
                    </template>
                </Column>
                <Column header="Giá trị đơn hàng">
                    <template #body="{ data }">
                        {{ formatPrice(data.totalPrice) }}
                    </template>
                </Column>
                <Column header="Đơn giá sau KM">
                    <template #body="{ data }">
                        {{ formatPrice(data.finalPrice) }}
                    </template>
                </Column>
                <Column header="Ngày đặt hàng">
                    <template #body="{ data }">
                        {{ format(data.createdAt, 'dd/MM/yyyy') }}
                    </template>
                </Column>
                <Column header="Trạng thái">
                    <template #body="{ data }">
                        {{ data.status }}
                    </template>
                </Column>
                <Column header="Thao tác">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <Button @click="openNew(data)" icon="pi pi-eye" text></Button>
                            <Button icon="pi pi-trash" text></Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="genresDialog" :style="{ width: '450px' }" header="Thể loại" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Thể loại</label>
                    <InputText id="name" v-model="orderDetail.genreName" required="true" autofocus :invalid="submitted && !orderDetail.genreName" fluid />
                    <small v-if="submitted && !orderDetail.genreName" class="text-red-500">Tên không được để trống</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Mô tả</label>
                    <Textarea id="description" v-model="orderDetail.genreDescription" required="true" rows="3" cols="20" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Hủy" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Xác nhận" icon="pi pi-check" @click="saveGenre" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Xác nhận" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="orderDetail"
                    >Xác nhận xóa <b>{{ orderDetail.genreName }}</b
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
