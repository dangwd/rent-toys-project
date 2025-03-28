<script setup>
import API from '@/api/api-main';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref } from 'vue';
const { proxy } = getCurrentInstance();
const toast = useToast();

onMounted(() => {
    fetchAllGenres();
});

const dt = ref();
const Genres = ref();
const genresDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const genreDetail = ref({});
const selectedProducts = ref();
const keySearch = ref('');
const submitted = ref(false);

const fetchAllGenres = async () => {
    try {
        const res = await API.get(`genres?skip=0&limit=200&search=${keySearch.value}`);
        Genres.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};

const openNew = async (data) => {
    submitted.value = false;

    if (!data._id) {
        genresDialog.value = true;
        return (genreDetail.value = {});
    }
    try {
        const res = await API.get(`genre/${data._id}`);
        genreDetail.value = res.data.metadata;
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
    let data = { ...genreDetail.value };
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

const deleteActorDlg = (data) => {
    genreDetail.value = data;
    deleteProductDialog.value = true;
};

const confirmDeleteSelected = async () => {
    try {
        const res = await API.delete(`genre/${genreDetail.value._id}`);
        if (res) {
            fetchAllGenres();
            proxy.$notify('S', 'Thành công!', toast);
            deleteProductDialog.value = false;
        }
    } catch (error) {
        console.log(error);
    }
};

function deleteSelectedProducts() {
    Genres.value = Genres.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <strong class="text-lg">Thể loại</strong>
                </template>
                <template #end>
                    <Button label="Thêm mới" icon="pi pi-plus" @click="openNew" />
                </template>
            </Toolbar>

            <DataTable ref="dt" v-model:selection="selectedProducts" showGridlines :value="Genres" dataKey="id" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 25]">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Danh Sách Thể loại</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="keySearch" @keydown.enter="fetchAllGenres" class="w-[300px]" placeholder="Tìm kiếm  theo tên..." />
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
                <Column field="genreName" header="Thể loại"></Column>
                <Column field="genreDescription" header="Mô tả"></Column>
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

        <Dialog v-model:visible="genresDialog" :style="{ width: '450px' }" header="Thể loại" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Thể loại</label>
                    <InputText id="name" v-model="genreDetail.genreName" required="true" autofocus :invalid="submitted && !genreDetail.genreName" fluid />
                    <small v-if="submitted && !genreDetail.genreName" class="text-red-500">Tên không được để trống</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Mô tả</label>
                    <Textarea id="description" v-model="genreDetail.genreDescription" required="true" rows="3" cols="20" fluid />
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
                <span v-if="genreDetail"
                    >Xác nhận xóa <b>{{ genreDetail.genreName }}</b
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
                <span v-if="genreDetail">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
