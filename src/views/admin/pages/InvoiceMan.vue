<script setup>
import API from '@/api/api-main';
import DetailOrder from '@/components/DetailOrder.vue';
import { formatPrice } from '@/helper/formatPrice';
import { formatStatusOrder } from '@/helper/formatStatusOrder';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
const { proxy } = getCurrentInstance();
const toast = useToast();

onMounted(() => {
    fetchAllOrder();
});
const filter = reactive({
    status: ''
});
const paginator = reactive({
    rows: 5,
    page: 0,
    total: 0
});
const Invoices = ref();
const orderDialog = ref(false);
const filterDialog = ref(false);
const orderDetail = ref({});

const submitted = ref(false);
const statusOpts = ref([
    {
        label: 'Đã đặt hàng',
        value: 'pending'
    },
    {
        label: 'Đã thanh toán',
        value: 'paid'
    },
    {
        label: 'Đã hủy',
        value: 'cancelled'
    },
    {
        label: 'Đã giao hàng',
        value: 'delivered'
    },
    {
        label: 'Đã hủy',
        value: 'cancelled'
    }
]);
const fetchAllOrder = async (query = '') => {
    try {
        const res = await API.get(`order?skip=0&limit=20&status=${query}`);
        Invoices.value = res.data.metadata.result;
        paginator.total = res.data.metadata.total;
    } catch (error) {
        console.log(error);
    }
};

function hideDialog() {
    orderDialog.value = false;
    submitted.value = false;
}

const saveGenre = async () => {
    let data = { ...orderDetail.value };
    submitted.value = true;
    let API_EP = data._id ? `genre/${data._id}` : `genre`;
    let FUNC_API = data._id ? API.updatev2(API_EP, data) : API.create(API_EP, data);
    try {
        const res = await FUNC_API;
        if (res.data) {
            orderDialog.value = false;
            proxy.$notify('S', 'Thành công!', toast);
            fetchAllOrder();
        }
    } catch (error) {
        console.log(error);
    }
};
const openFilter = () => {
    filterDialog.value = true;
};
const handleFilter = () => {
    let queryArr = [];
    if (filter.status) {
        queryArr.push(`status=${filter.status}`);
    }
    let queryStr = queryArr.join('');
    fetchAllOrder(queryStr);
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
                    <Button label="Bộ lọc" icon="pi pi-filter" @click="openFilter()" />
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
                <Column header="Tên khách hàng">
                    <template #body="{ data }">
                        {{ data.user?.name }}
                    </template>
                </Column>
                <Column header="Số điện thoại">
                    <template #body="{ data }">
                        {{ data.user?.phone }}
                    </template>
                </Column>
                <Column header="Phương thức thanh toán">
                    <template #body="{ data }">
                        {{ data.paymentMethod == 'cod' ? `COD` : `Zalopay` }}
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
                        <Tag :severity="data.status == 'confirmed' ? `success` : `primary`" :value="formatStatusOrder(data.status)"></Tag>
                    </template>
                </Column>
                <Column header="Thao tác">
                    <template #body="{ data }">
                        <DetailOrder :data="data"></DetailOrder>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="orderDialog" :style="{ width: '450px' }" header="Thể loại" :modal="true">
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

        <Dialog v-model:visible="filterDialog" :style="{ width: '450px' }" header="Bộ lọc" :modal="true">
            <label for="">Trạng thái đơn hàng</label>
            <Dropdown v-model="filter.status" optionValue="value" optionLabel="label" class="w-full" :options="statusOpts"></Dropdown>
            <template #footer>
                <Button @click="handleFilter()" label="Lọc"></Button>
            </template>
        </Dialog>
    </div>
</template>
