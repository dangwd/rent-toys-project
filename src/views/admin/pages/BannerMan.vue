<script setup>
import API from '@/api/api-main';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref } from 'vue';
const { proxy } = getCurrentInstance();
const toast = useToast();

onMounted(() => {
    fetchAllBanners();
});

const dt = ref();
const Banners = ref();
const bannersDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const bannerDetail = ref({
    title: '',
    images: []
});
const selectedProducts = ref();

const submitted = ref(false);

const fetchAllBanners = async () => {
    try {
        const res = await API.get(`branners?skip=0&limit=20`);
        Banners.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};

const openNew = async (data) => {
    submitted.value = false;

    if (!data._id) {
        bannersDialog.value = true;
        return (bannerDetail.value = {
            title: '',
            images: ['']
        });
    }
    try {
        const res = await API.get(`branner/${data._id}`);
        bannerDetail.value = res.data.metadata;
    } catch (error) {}
    bannersDialog.value = true;
};

function hideDialog() {
    bannersDialog.value = false;
    submitted.value = false;
}

const saveBanner = async () => {
    let data = { ...bannerDetail.value };
    submitted.value = true;

    let API_EP = data._id ? `branner/${data._id}` : `branner`;

    let FUNC_API = data._id ? API.updatev2(API_EP, data) : API.create(API_EP, data);
    try {
        const res = await FUNC_API;
        if (res.data) {
            bannersDialog.value = false;
            proxy.$notify('S', 'Thành công!', toast);
            fetchAllBanners();
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteActorDlg = (data) => {
    bannerDetail.value = data;
    deleteProductDialog.value = true;
};

const confirmDeleteSelected = async () => {
    try {
        const res = await API.delete(`branner/${bannerDetail.value._id}`);
        if (res) {
            fetchAllBanners();
            proxy.$notify('S', 'Thành công!', toast);
            deleteProductDialog.value = false;
        }
    } catch (error) {
        console.log(error);
    }
};
const addBannerLink = () => {
    bannerDetail.value?.images.push('');
};
const removeBannerLink = (index) => {
    bannerDetail.value?.images.splice(index, 1);
};
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <strong class="text-lg">Banner</strong>
                </template>
                <template #end>
                    <Button label="Thêm mới" icon="pi pi-plus" @click="openNew" />
                </template>
            </Toolbar>

            <DataTable v-model:selection="selectedProducts" showGridlines :value="Banners" dataKey="id" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 25]">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Danh Sách Banner</h4>
                        <!-- <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText class="w-[300px]" placeholder="Tìm kiếm  theo tên..." />
                        </IconField> -->
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
                <Column field="title" header="Tiêu đề"></Column>
                <Column field="description" header="Mô tả"></Column>
                <Column header="Ảnh" style="max-width: 300px" class="overflow-auto">
                    <template #body="{ data }">
                        <div class="flex flex-wrap gap-2">
                            <div v-for="i in data.images">
                                <img width="200" :src="i" alt="" />
                            </div>
                        </div>
                    </template>
                </Column>
                <Column header="Thao tác">
                    <template #body="sp">
                        <div class="flex gap-2">
                            <Button @click="openNew(sp.data)" text icon="pi pi-eye"></Button>
                            <Button @click="deleteActorDlg(sp.data)" text icon="pi pi-trash" severity="danger"></Button>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="bannersDialog" :style="{ width: '450px' }" header="Banners" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="name" class="block font-bold mb-3">Tiêu đề</label>
                    <InputText id="name" v-model="bannerDetail.title" required="true" autofocus :invalid="submitted && !bannerDetail.title" fluid />
                    <small v-if="submitted && !bannerDetail.title" class="text-red-500">Tên không được để trống</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Mô tả</label>
                    <Textarea id="description" v-model="bannerDetail.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="name" class="block font-bold mb-3">Banners</label>
                    <div class="flex flex-col gap-2">
                        <div v-for="(item, index) in bannerDetail.images" :key="index" class="flex gap-2 items-center w-full">
                            <InputText fluid v-model="bannerDetail.images[index]"></InputText>
                            <Button @click="removeBannerLink(index)" text icon="pi pi-trash"></Button>
                        </div>
                    </div>
                    <Button @click="addBannerLink" label="Thêm Banner" icon="pi pi-plus" class="w-full" text></Button>
                </div>
            </div>

            <template #footer>
                <Button label="Hủy" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Xác nhận" icon="pi pi-check" @click="saveBanner" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Xác nhận" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="bannerDetail"
                    >Xác nhận xóa <b>{{ bannerDetail.genreName }}</b
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
