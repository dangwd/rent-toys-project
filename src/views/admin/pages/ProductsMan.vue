<script setup>
import API from '@/api/api-main';
import { formatPrice } from '@/helper/formatPrice';
import { usePrimeVue } from 'primevue/config';
import { useToast } from 'primevue/usetoast';
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

const imageFileName = (url) => {
    if (!url || typeof url !== 'string') return '';
    try {
        const path = decodeURIComponent(new URL(url).pathname);
        return path.split('/').pop() || url;
    } catch {
        const seg = url.split('/').pop() || url;
        return seg.split('?')[0];
    }
};

const onFileSelect = () => {};

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
};

const removeImages = (imageUrl) => {
    if (!productDetail.value.images?.length) return;
    const i = productDetail.value.images.indexOf(imageUrl);
    if (i !== -1) productDetail.value.images.splice(i, 1);
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

        <Dialog v-model:visible="prodDialog" :style="{ width: 'min(96vw,70%)' }" header="Sản phẩm" :modal="true" :pt="{ content: { class: 'pt-2' } }">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                    <div class="lg:col-span-5">
                        <div class="flex h-full flex-col gap-3 rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-sm dark:border-surface-700 dark:bg-surface-900">
                            <div class="flex items-start gap-3">
                                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-400/10">
                                    <i class="pi pi-images text-lg"></i>
                                </span>
                                <div>
                                    <span class="block font-semibold leading-tight">Ảnh sản phẩm</span>
                                    <span class="text-muted-color mt-1 block text-sm leading-snug">Chọn nhiều ảnh; có thể kéo thả trực tiếp vào khung bên dưới.</span>
                                </div>
                            </div>
                            <FileUpload
                                name="files"
                                class="product-fileupload [&_.p-fileupload-content]:border-0 [&_.p-fileupload-content]:p-0 [&_.p-fileupload-header]:border-b-0 [&_.p-fileupload-header]:bg-transparent [&_.p-fileupload-header]:pb-0"
                                :multiple="true"
                                :auto="false"
                                :customUpload="true"
                                uploadLabel="Đăng bài"
                                :showUploadButton="false"
                                @uploader="onCustomUpload"
                                @select="onFileSelect"
                            >
                                <template #empty>
                                    <div class="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-surface-300 bg-surface-50 px-4 py-10 dark:border-surface-600 dark:bg-surface-800/40">
                                        <i class="pi pi-cloud-upload text-4xl text-primary opacity-80"></i>
                                        <p class="m-0 text-center text-sm text-muted-color">Kéo thả ảnh vào đây hoặc dùng nút chọn ảnh phía trên</p>
                                    </div>
                                </template>
                                <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                                    <div class="flex flex-wrap items-center justify-between gap-3">
                                        <div class="flex flex-wrap gap-2">
                                            <Button title="Chọn ảnh" type="button" @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary" />
                                            <Button style="display: none" id="onUpload" type="button" @click="uploadCallback()" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0" />
                                            <Button title="Xóa ảnh đang chọn" type="button" @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0" />
                                        </div>
                                    </div>
                                </template>
                                <template #content="{ files, removeFileCallback }">
                                    <div class="flex w-full flex-col gap-3">
                                        <div v-if="files.length > 0" class="flex flex-col gap-2">
                                            <span class="text-xs font-semibold uppercase tracking-wide text-muted-color">Ảnh mới</span>
                                            <div v-for="(file, index) of files" :key="'new-' + index" class="flex flex-col gap-3 rounded-lg border border-surface-200 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-surface-700">
                                                <div class="flex min-w-0 flex-1 items-center gap-3">
                                                    <img class="h-14 w-20 shrink-0 rounded-md object-cover shadow-sm" role="presentation" :alt="file.name" :src="file.objectURL" />
                                                    <div class="min-w-0 flex-1">
                                                        <p class="m-0 truncate font-medium">{{ file.name }}</p>
                                                        <p class="m-0 text-sm text-muted-color">{{ formatSize(file.size) }}</p>
                                                    </div>
                                                </div>
                                                <div class="flex shrink-0 items-center gap-2 self-end sm:self-center">
                                                    <Badge value="Chờ gửi" severity="warn" />
                                                    <Button type="button" icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" />
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="productDetail.images?.length > 0" class="flex flex-col gap-2">
                                            <span class="text-xs font-semibold uppercase tracking-wide text-muted-color">Ảnh đã lưu</span>
                                            <div
                                                v-for="(file, index) of productDetail.images"
                                                :key="'saved-' + index"
                                                class="flex flex-col gap-3 rounded-lg border border-surface-200 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-surface-700"
                                            >
                                                <div class="flex min-w-0 flex-1 items-center gap-3">
                                                    <img class="h-14 w-20 shrink-0 rounded-md object-cover shadow-sm" crossorigin="anonymous" role="presentation" :alt="imageFileName(file)" :src="file" />
                                                    <div class="min-w-0 flex-1">
                                                        <p class="m-0 truncate font-medium">{{ imageFileName(file) }}</p>
                                                        <p class="m-0 text-sm text-muted-color">Đã tải lên</p>
                                                    </div>
                                                </div>
                                                <div class="flex shrink-0 items-center gap-2 self-end sm:self-center">
                                                    <Badge value="Đã lưu" severity="success" />
                                                    <Button type="button" icon="pi pi-times" @click="removeImages(file)" outlined rounded severity="danger" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </FileUpload>
                        </div>
                    </div>
                    <div class="lg:col-span-7">
                        <div class="flex flex-col gap-6">
                            <Fieldset legend="Thông tin chung" :toggleable="false" class="rounded-xl border-surface-200 dark:border-surface-700">
                                <div class="flex flex-col gap-4">
                                    <div class="flex flex-col gap-2">
                                        <label for="name" class="font-semibold">Tên sản phẩm <span class="text-red-500">*</span></label>
                                        <InputText id="name" v-model="productDetail.productName" required autofocus :invalid="submitted && !productDetail.productName" fluid placeholder="Nhập tên sản phẩm" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label for="description" class="font-semibold">Mô tả <span class="text-red-500">*</span></label>
                                        <Textarea id="description" v-model="productDetail.descriptions" required rows="4" fluid placeholder="Mô tả ngắn gọn về sản phẩm" />
                                    </div>
                                </div>
                            </Fieldset>

                            <Fieldset legend="Giá & khuyến mãi" :toggleable="false" class="rounded-xl border-surface-200 dark:border-surface-700">
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="flex flex-col gap-2">
                                        <label for="price" class="font-semibold">Giá <span class="text-red-500">*</span></label>
                                        <InputNumber id="price" v-model="productDetail.price" required :invalid="submitted && !productDetail.price" fluid placeholder="0" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label for="discount" class="font-semibold">Giảm giá (%)</label>
                                        <InputNumber id="discount" v-model="productDetail.discount" :min="0" :max="100" suffix="%" fluid placeholder="0" />
                                    </div>
                                </div>
                            </Fieldset>

                            <Fieldset legend="Phân loại & kho" :toggleable="false" class="rounded-xl border-surface-200 dark:border-surface-700">
                                <div class="flex flex-col gap-4">
                                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div class="flex flex-col gap-2">
                                            <label for="genre" class="font-semibold">Thể loại</label>
                                            <Select id="genre" v-model="productDetail.genre" :options="GenresOpt" optionLabel="genreName" class="w-full" optionValue="_id" placeholder="Chọn thể loại" fluid />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label for="brand" class="font-semibold">Thương hiệu</label>
                                            <Select id="brand" v-model="productDetail.brand" class="w-full" :options="BrandOpts" optionLabel="brandName" optionValue="_id" placeholder="Chọn thương hiệu" fluid />
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div class="flex flex-col gap-2">
                                            <label for="quantity" class="font-semibold">Số lượng <span class="text-red-500">*</span></label>
                                            <InputNumber id="quantity" v-model="productDetail.quantity" required :invalid="submitted && !productDetail.quantity" fluid :min="0" placeholder="0" />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label for="madeIn" class="font-semibold">Xuất xứ <span class="text-red-500">*</span></label>
                                            <Select id="madeIn" v-model="productDetail.madeIn" :options="Nations" option-value="niceName" option-label="niceName" :invalid="submitted && !productDetail.madeIn" fluid placeholder="Chọn quốc gia" />
                                        </div>
                                    </div>
                                </div>
                            </Fieldset>

                            <Fieldset legend="Đối tượng" :toggleable="false" class="rounded-xl border-surface-200 dark:border-surface-700">
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div class="flex flex-col gap-2">
                                        <label for="age" class="font-semibold">Độ tuổi phù hợp <span class="text-red-500">*</span></label>
                                        <InputNumber id="age" v-model="productDetail.age" required :invalid="submitted && !productDetail.age" fluid :min="0" placeholder="Tuổi" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label for="sex" class="font-semibold">Giới tính</label>
                                        <Dropdown id="sex" v-model="productDetail.sex" class="w-full" :options="GenderOpts" optionValue="value" optionLabel="label" placeholder="Chọn" />
                                    </div>
                                </div>
                                <div class="mt-4 flex items-center gap-3 rounded-lg border border-surface-200 bg-surface-50 px-4 py-3 dark:border-surface-700 dark:bg-surface-800/50">
                                    <Checkbox inputId="monopoly" v-model="productDetail.type" value="monopoly" binary />
                                    <label for="monopoly" class="m-0 cursor-pointer font-semibold">Hàng độc quyền</label>
                                </div>
                            </Fieldset>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Hủy" icon="pi pi-times" text severity="secondary" @click="hideDialog" />
                <Button label="Lưu sản phẩm" icon="pi pi-check" @click="saveProduct()" />
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
