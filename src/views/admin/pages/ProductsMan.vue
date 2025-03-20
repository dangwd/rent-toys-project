<script setup>
import API from '@/api/api-main';
import { useToast } from 'primevue/usetoast';

import { getCurrentInstance, onMounted, ref } from 'vue';
const { proxy } = getCurrentInstance();
const toast = useToast();

onMounted(() => {
    fetchAllProducts();
});

const formData = new FormData();
const dt = ref();
const Actors = ref();
const actorDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const productDetail = ref({});
const selectedProducts = ref();
const statuses = ref([
    {
        label: 'Hoạt động',
        value: true
    },
    {
        label: 'Dừng Hoạt động',
        value: false
    }
]);
const submitted = ref(false);

const fetchAllProducts = async () => {
    try {
        const res = await API.get(`products?skip=0&limit=20`);
        Actors.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};

const openNew = async (data) => {
    if (data._id) {
        try {
            const res = await API.get(`product/${data._id}`);
            console.log(res.data);
            productDetail.value = res.data.metadata;
        } catch (error) {
            console.log(error);
        }
    }
    submitted.value = false;
    actorDialog.value = true;
};

function hideDialog() {
    actorDialog.value = false;
    submitted.value = false;
}

const saveProduct = async () => {
    submitted.value = true;

    let data = { ...productDetail.value };
    if (data._id) {
        delete productDetail.value.images;
    }
    let URL_ENDPOINT = data._id ? `product/${data._id}` : `product`;
    formData.append('items', JSON.stringify(data));
    let FUNC_API = data._id ? API.updatev2(URL_ENDPOINT, formData) : API.create(URL_ENDPOINT, formData);
    try {
        const res = await FUNC_API;
        if (res.data) {
            fetchAllProducts();
            proxy.$notify('S', 'Thao tác thành công!', toast);
            actorDialog.value = false;
        }
    } catch (error) {
        console.log(error);
    } finally {
        formData.delete('items');
        formData.delete('images');
    }
};

const deleteActorDlg = (data) => {
    productDetail.value = data;
    deleteProductDialog.value = true;
};

const confirmDeleteSelected = async () => {
    try {
        const res = await API.delete(`product/${productDetail.value._id}`);
        if (res.data) {
            fetchAllProducts();
            deleteProductDialog.value = false;
            proxy.$notify('S', 'Xóa thành công!', toast);
        }
    } catch (error) {}
};
const Openfile = () => {
    document.querySelectorAll('.click-file')[0].click();
};
const UploadFileLocal = async (event, index) => {
    const file = event.target.files[0];
    formData.append('images', file);
    document.querySelectorAll('.click-file')[index].value = '';
    productDetail.value.files = URL.createObjectURL(file);
};
function deleteSelectedProducts() {
    Actors.value = Actors.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
}
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <strong class="text-lg">Danh sách sản phẩm</strong>
                </template>
                <template #end>
                    <Button label="Thêm mới" icon="pi pi-plus" @click="openNew" />
                </template>
            </Toolbar>

            <DataTable ref="dt" v-model:selection="selectedProducts" showGridlines :value="Actors" dataKey="id" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 25]">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Danh sách sản phẩm</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText class="w-[300px]" placeholder="Tìm kiếm theo tên..." />
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
                <Column field="productName" style="max-width: 200px" header="Tên sản phẩm"></Column>
                <Column field="images" header="Ảnh">
                    <template #body="sp">
                        <Image crossorigin="anonymous" :src="sp.data.images[0]" alt="Image" width="50" />
                    </template>
                </Column>

                <Column field="genre" header="Thể loại"></Column>
                <Column field="brand" header="Thương hiệu"></Column>
                <Column field="quantity" header="Số lượng">
                    <template #body="sp">
                        {{ sp.data.birthDay }}
                    </template>
                </Column>
                <Column field="madeIn" header="Xuất xứ"></Column>
                <Column field="age" header="Độ tuổi"></Column>
                <Column field="sex" header="Giới tính"></Column>
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

        <Dialog v-model:visible="actorDialog" :style="{ width: '70%' }" header="Sản phẩm" :modal="true">
            <div class="grid grid-cols-12">
                <div class="col-span-4">
                    <div class="flex flex-col items-center gap-2">
                        <div class="rounded-full">
                            <Image crossorigin="anonymous" :src="actorDetail?.images ? actorDetail?.images[0] : `https://placehold.co/600x400`" alt="Image" width="200" />
                        </div>
                        <div>
                            <Button label="Chọn ảnh" icon="pi pi-cloud-upload" class="btn-up-file" raised @click="Openfile(index)" />
                        </div>
                        <input type="file" class="hidden click-file" @change="UploadFileLocal($event, 0)" />
                    </div>
                </div>
                <div class="col-span-8">
                    <div class="flex flex-col gap-6">
                        <div>
                            <label for="name" class="block font-bold mb-3">Tên sản phẩm</label>
                            <InputText id="name" v-model="productDetail.productName" required="true" autofocus :invalid="submitted && !productDetail.actorName" fluid />
                        </div>
                        <div>
                            <label for="description" class="block font-bold mb-3">Mô tả</label>
                            <Textarea v-model="productDetail.description" required="true" rows="3" cols="20" fluid />
                        </div>
                        <div class="flex gap-2 justify-between items-center">
                            <div class="w-full">
                                <label class="block font-bold mb-3">Thể loại</label>
                                <InputText v-model="productDetail.genre" required="true" autofocus :invalid="submitted && !productDetail.genre" fluid />
                            </div>
                            <div class="w-full">
                                <label class="block font-bold mb-3">Thương hiệu</label>
                                <InputText v-model.trim="productDetail.brand" required="true" autofocus :invalid="submitted && !productDetail.brand" fluid />
                            </div>
                        </div>
                        <div class="flex gap-2 justify-between items-center">
                            <div class="w-full">
                                <label class="block font-bold mb-3">Số lượng</label>
                                <InputNumber v-model="productDetail.quantity" required="true" autofocus :invalid="submitted && !productDetail.quantity" fluid />
                            </div>
                            <div class="w-full">
                                <label class="block font-bold mb-3">Xuất xứ</label>
                                <InputNumber v-model="productDetail.madeIn" required="true" autofocus :invalid="submitted && !productDetail.madeIn" fluid />
                            </div>
                        </div>
                        <div class="flex gap-2 justify-between items-center">
                            <div class="w-full">
                                <label class="block font-bold mb-3">Tuổi</label>
                                <InputNumber v-model="productDetail.age" required="true" autofocus :invalid="submitted && !productDetail.age" fluid />
                            </div>
                            <div class="w-full">
                                <label class="block font-bold mb-3">Giới tính</label>
                                <InputNumber v-model="productDetail.sex" required="true" autofocus :invalid="submitted && !productDetail.sex" fluid />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Hủy" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Xác nhận" icon="pi pi-check" @click="saveProduct()" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Xác nhận" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="productDetail"
                    >Xác nhận xóa <b>{{ productDetail.actorName }}</b
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
