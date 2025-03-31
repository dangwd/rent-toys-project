<script setup>
import API from '@/api/api-main';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
const { proxy } = getCurrentInstance();
onMounted(() => {
    fetchAll();
});

const toast = useToast();
const dt = ref();
const Brands = ref();
const brandDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const brandDetail = ref({});
const selectedProducts = ref();
const keySearch = ref('');
const paginator = reactive({
    page: 0,
    rows: 100,
    total: 0
});
const submitted = ref(false);

const fetchAll = async () => {
    try {
        const res = await API.get(`brands?skip=${paginator.page}&limit=${paginator.rows}&search=${keySearch.value}`);
        Brands.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};

function openNew(data = '') {
    brandDetail.value = data;
    submitted.value = false;
    brandDialog.value = true;
}

function hideDialog() {
    brandDialog.value = false;
    submitted.value = false;
}

const saveBrand = async () => {
    submitted.value = true;
    let data = { ...brandDetail.value };
    let URL_EP = data._id ? `brand/${data._id}` : `brand`;
    let FUNC_API = data._id ? API.updatev2(URL_EP, data) : API.create(URL_EP, data);
    try {
        const res = await FUNC_API;
        if (res) {
            brandDialog.value = false;
            fetchAll();
            proxy.$notify('S', 'Thành công!', toast);
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteActorDlg = (data) => {
    brandDetail.value = data;
    deleteProductDialog.value = true;
};

const confirmDeleteSelected = async () => {
    try {
        const res = await API.delete(`brand/${brandDetail.value._id}`);
        if (res.data) {
            fetchAll();
            deleteProductDialog.value = false;
            proxy.$notify('S', 'Xóa thành công!', toast);
        }
    } catch (error) {
        console.log(error);
    }
};

function deleteSelectedProducts() {
    Brands.value = Brands.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <strong class="text-lg">Danh sách Thương hiệu</strong>
                </template>
                <template #end>
                    <Button label="Thêm mới" icon="pi pi-plus" @click="openNew" />
                </template>
            </Toolbar>

            <DataTable ref="dt" v-model:selection="selectedProducts" showGridlines :value="Brands" dataKey="id" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 25]">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Danh Sách Thương hiệu</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="keySearch" @keyup.enter="fetchAll()" class="w-[300px]" placeholder="Tìm kiếm theo tên..." />
                        </IconField>
                    </div>
                </template>
                <template #empty>
                    <div class="text-center p-2">Dữ liệu liệu trống</div>
                </template>
                <Column header="STT">
                    <template #body="sp">
                        {{ sp.index + 1 }}
                    </template>
                </Column>
                <Column field="brandName" header="Tên Thương hiệu"></Column>
                <Column header="Ảnh thương hiệu">
                    <template #body="{ data }">
                        <img :src="data.imageLink" alt="" />
                    </template>
                </Column>

                <Column field="brandDescription" header="Mô tả"></Column>
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

        <Dialog v-model:visible="brandDialog" :style="{ width: '450px' }" header="Thương hiệu" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Tên Thương hiệu</label>
                    <InputText id="name" v-model="brandDetail.brandName" required="true" autofocus :invalid="submitted && !brandDetail.brandName" fluid />
                    <small v-if="submitted && !brandDetail.brandName" class="text-red-500">brandName is required.</small>
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Link ảnh thương hiệu</label>
                    <InputText id="name" v-model="brandDetail.imageLink" required="true" autofocus :invalid="submitted && !brandDetail.imageLink" fluid />
                </div>
                <div>
                    <label for="movieDescription" class="block font-bold mb-3">Mô tả</label>
                    <Textarea id="movieDescription" v-model="brandDetail.brandDescription" required="true" rows="3" cols="20" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Hủy" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Xác nhận" icon="pi pi-check" @click="saveBrand" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Xác nhận" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="brandDetail"
                    >Xác nhận xóa <b>{{ brandDetail.actorName }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="Hủy" icon="pi pi-times" severity="secondary" @click="deleteProductDialog = false" />
                <Button label="Xác nhận" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="brandDetail">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
