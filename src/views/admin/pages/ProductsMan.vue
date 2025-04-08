<script setup>
import API from '@/api/api-main';
import { usePrimeVue } from 'primevue/config';
import { useToast } from 'primevue/usetoast';
import { formatPrice } from '@/helper/formatPrice';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
const { proxy } = getCurrentInstance();
const toast = useToast();
const $primevue = usePrimeVue();
const SexOpts = ref([
    {
        label: 'Nam',
        value: 'M'
    },
    {
        label: 'Nữ',
        value: 'F'
    }
]);
onMounted(() => {
    fetchAllProducts();
    fetchAllGenres();
    fetchAllBrand();
    fetchNations();
});
const Nations = ref([]);
const keySearch = ref('');
const filterModal = ref(false);
const GenderOpts = ref([
    {
        label: 'Nam',
        value: 'M'
    },
    {
        label: 'Nữ',
        value: 'F'
    },
    {
        label: 'Khác',
        value: 'O'
    }
]);
const BrandOpts = ref([]);
const GenresOpt = ref([]);
const formData = new FormData();
const Products = ref();
const prodDialog = ref(false);
const deleteProductDialog = ref(false);
const productDetail = ref({});
const filter = reactive({
    brand: null,
    genre: null,
    age: null
});
const submitted = ref(false);
const paginator = reactive({
    rows: 10,
    page: 0,
    total: 0
});
const fetchAllProducts = async (query = '') => {
    let url = `products?skip=${paginator.page}&limit=${paginator.rows}`;
    if (query) {
        url += `&${query}`;
    }
    if (keySearch.value) {
        url += `&search=${keySearch.value}`;
    }
    try {
        const res = await API.get(url);
        Products.value = res.data.metadata.result;
        paginator.total = res.data.metadata.total;
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
    prodDialog.value = true;
};
const fetchAllGenres = async () => {
    try {
        const res = await API.get(`genres`);
        GenresOpt.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const fetchAllBrand = async () => {
    try {
        const res = await API.get(`brands`);
        BrandOpts.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
function hideDialog() {
    prodDialog.value = false;
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
    document.getElementById('onUpload').click();
    let FUNC_API = data._id ? API.updatev2(URL_ENDPOINT, formData) : API.create(URL_ENDPOINT, formData);
    try {
        const res = await FUNC_API;
        if (res.data) {
            fetchAllProducts();
            proxy.$notify('S', 'Thao tác thành công!', toast);
            prodDialog.value = false;
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
const FuncUpload = async (files) => {
    files.forEach((file) => {
        formData.append(`images`, file);
    });
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

const onPageChange = (e) => {
    paginator.page = e.page;
    paginator.rows = e.rows;
    fetchAllProducts();
};
const onCustomUpload = async (e) => {
    await FuncUpload(e.files);
};
const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};
const openFilterDlg = () => {
    filterModal.value = true;
};
const confirmFilter = () => {
    let queryArr = [];
    if (filter.brand) {
        queryArr.push(`brand=${filter.brand}`);
    }
    if (filter.genre) {
        queryArr.push(`genre=${filter.genre}`);
    }
    if (filter.sex) {
        queryArr.push(`sex=${filter.sex}`);
    }
    if (filter.age) {
        queryArr.push(`age=${filter.age}`);
    }
    let queryStr = queryArr.join('&');
    fetchAllProducts(queryStr);
};
const fetchNations = async () => {
    try {
        const res = await API.get(`nations?skip=0&limit=1000000`);
        Nations.value = res.data.metadata;
    } catch (error) {}
};
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

            <DataTable lazy @page="onPageChange($event)" showGridlines :value="Products" dataKey="id" :paginator="true" :rows="paginator.rows" :page="paginator.page" :total-records="paginator.total" :rowsPerPageOptions="[5, 10, 25]">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Danh sách sản phẩm</h4>
                        <div class="flex gap-2">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="keySearch" class="w-[300px]" @keyup.enter="fetchAllProducts()" placeholder="Tìm kiếm theo tên..." />
                            </IconField>
                            <Button @click="openFilterDlg()" icon="pi pi-filter" label="Bộ lọc"></Button>
                        </div>
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
                <Column field="productName" style="max-width: 200px" header="Tên sản phẩm">
                    <template #body="{ data }">
                        <span class="line-clamp-2">{{ data.productName }}</span>
                    </template>
                </Column>
                <Column field="images" header="Ảnh">
                    <template #body="sp">
                        <Image crossorigin="anonymous" :src="sp.data.images[0]" alt="Image" width="50" />
                    </template>
                </Column>
                <Column header="Mô tả" style="max-width: 200px">
                    <template #body="{ data }">
                        <div class="line-clamp-5">
                            {{ data.descriptions }}
                        </div>
                    </template>
                </Column>
                <Column field="genre" header="Thể loại">
                    <template #body="{ data }">
                        <span class="line-clamp-3">{{ data.genre?.genreName }}</span>
                    </template>
                </Column>
                <Column field="brand" header="Thương hiệu">
                    <template #body="{ data }">
                        {{ data.brand?.brandName }}
                    </template>
                </Column>
                <Column field="quantity" header="Số lượng"> </Column>
                <Column field="price" header="Giá">
                    <template #body="{ data }">
                        {{ formatPrice(data.price) }}
                    </template>
                </Column>
                <Column field="madeIn" header="Xuất xứ"></Column>
                <Column field="age" header="Độ tuổi"></Column>
                <Column field="sex" header="Giới tính">
                    <template #body="{ data }">
                        {{ data.sex === 'M' ? 'Nam' : data.sex === 'F' ? 'Nữ' : 'Khác' }}
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

        <Dialog v-model:visible="prodDialog" :style="{ width: '70%' }" header="Sản phẩm" :modal="true">
            <div class="flex flex-col gap-2">
                <div class="grid grid-cols-12 gap-3">
                    <div class="col-span-5">
                        <div class="flex flex-col gap-3">
                            <label class="block font-bold">Ảnh sản phẩm</label>
                            <FileUpload name="files" :multiple="true" :auto="false" :customUpload="true" uploadLabel="Đăng bài" :showUploadButton="false" @uploader="onCustomUpload" @select="onFileSelect">
                                <template #empty>
                                    <div class="p-2 text-center">
                                        <span class="text-center">Chọn hoặc kéo thả ảnh vào đây!</span>
                                    </div>
                                </template>
                                <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                                    <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                                        <div class="flex gap-2">
                                            <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary"></Button>
                                            <Button style="display: none" id="onUpload" @click="uploadCallback()" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                                            <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
                                        </div>
                                    </div>
                                </template>
                                <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback, messages }">
                                    <div class="flex flex-col gap-4 w-full">
                                        <div class="w-full" v-if="files.length > 0">
                                            <div class="flex flex-col w-full gap-4">
                                                <div v-for="(file, index) of files" :key="index" class="p-4 rounded-border justify-between flex w-full border border-surface items-center gap-4">
                                                    <div>
                                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                                                    </div>
                                                    <span class="font-semibold text-ellipsis max-w-96 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                                    <div>{{ formatSize(file.size) }}</div>
                                                    <Badge value="Đang xử lý" severity="warn" />
                                                    <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="w-full" v-if="productDetail.images?.length > 0">
                                            <div class="flex flex-col w-full gap-4">
                                                <div v-for="(file, index) of productDetail.images" :key="index" class="p-4 rounded-border justify-between flex w-full border border-surface items-center gap-4">
                                                    <div>
                                                        <img crossorigin="anonymous" role="presentation" :alt="file" :src="file" width="100" height="50" />
                                                    </div>
                                                    <span class="font-semibold text-ellipsis max-w-96 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                                    <div>{{ formatSize(file.size || 0) }}</div>
                                                    <Badge value="Hoàn thành" severity="success" />
                                                    <Button icon="pi pi-times" @click="removeImages(file)" outlined rounded severity="danger" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </FileUpload>
                        </div>
                    </div>
                    <div class="col-span-7">
                        <div class="flex flex-col gap-6">
                            <div>
                                <label for="name" class="block font-bold mb-3">Tên sản phẩm</label>
                                <InputText id="name" v-model="productDetail.productName" required="true" autofocus :invalid="submitted && !productDetail.actorName" fluid />
                            </div>
                            <div>
                                <label for="description" class="block font-bold mb-3">Mô tả</label>
                                <Textarea v-model="productDetail.descriptions" required="true" rows="3" cols="20" fluid />
                            </div>
                            <div>
                                <label class="block font-bold mb-3">Giá tiền</label>
                                <InputNumber v-model="productDetail.price" required="true" autofocus :invalid="submitted && !productDetail.price" fluid />
                            </div>
                            <div>
                                <label class="block font-bold mb-3">Giảm giá</label>
                                <InputNumber v-model="productDetail.discount" :min="0" :max="100" suffix="%" required="true" autofocus fluid />
                            </div>
                            <div class="flex gap-2 justify-between items-center">
                                <div class="w-full">
                                    <label class="block font-bold mb-3">Thể loại</label>
                                    <!-- <InputText v-model="productDetail.genre" required="true" autofocus :invalid="submitted && !productDetail.genre" fluid /> -->
                                    <Select v-model="productDetail.genre" :options="GenresOpt" optionLabel="genreName" class="w-full" optionValue="_id"></Select>
                                </div>
                                <div class="w-full">
                                    <label class="block font-bold mb-3">Thương hiệu</label>
                                    <Select v-model="productDetail.brand" class="w-full" :options="BrandOpts" optionLabel="brandName" optionValue="_id"></Select>
                                </div>
                            </div>
                            <div class="flex gap-2 justify-between items-center">
                                <div class="w-full">
                                    <label class="block font-bold mb-3">Số lượng</label>
                                    <InputNumber v-model="productDetail.quantity" required="true" autofocus :invalid="submitted && !productDetail.quantity" fluid />
                                </div>
                                <div class="w-full">
                                    <label class="block font-bold mb-3">Xuất xứ</label>
                                    <Select v-model="productDetail.madeIn" :options="Nations" option-value="niceName" option-label="niceName" :invalid="submitted && !productDetail.madeIn" fluid />
                                </div>
                            </div>
                            <div class="flex gap-2 justify-between items-center">
                                <div class="w-full">
                                    <label class="block font-bold mb-3">Tuổi</label>
                                    <InputNumber v-model="productDetail.age" required="true" autofocus :invalid="submitted && !productDetail.age" fluid />
                                </div>
                                <div class="w-full">
                                    <label class="block font-bold mb-3">Giới tính</label>
                                    <Dropdown v-model="productDetail.sex" class="w-full" :options="GenderOpts" optionValue="value" optionLabel="label"></Dropdown>
                                </div>
                            </div>
                            <div class="flex gap-2 items-center">
                                <Checkbox v-model="productDetail.type" value="monopoly" binary></Checkbox>
                                <label for="" class="font-bold">Hàng độc quyền</label>
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

        <Dialog v-model:visible="filterModal" :style="{ width: '30%' }" header="Bộ lọc" :modal="true">
            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2 w-full">
                    <label for="">Thể loại</label>
                    <Select v-model="filter.genre" :options="GenresOpt" optionLabel="genreName" class="w-full" optionValue="_id" fluid></Select>
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <label for="">Giới tính</label>
                    <Select v-model="filter.sex" :options="SexOpts" optionLabel="label" optionValue="value" fluid></Select>
                </div>
            </div>
            <template #footer>
                <Button label="Hủy" icon="pi pi-times" severity="secondary" @click="filterModal = false" />
                <Button label="Xác nhận" icon="pi pi-filter" @click="confirmFilter" />
            </template>
        </Dialog>
    </div>
</template>
