<script setup>
import API from '@/api/api-main';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    fetchAll();
});

const formData = new FormData();
const toast = useToast();
const dt = ref();
const Authors = ref();
const authorDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const authorDetail = ref({});
const selectedProducts = ref();

const submitted = ref(false);

const fetchAll = async () => {
    try {
        const res = await API.get(`author?skip=0&limit=20`);
        Authors.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};

function openNew(data = '') {
    authorDetail.value = data;
    submitted.value = false;
    authorDialog.value = true;
}

function hideDialog() {
    authorDialog.value = false;
    submitted.value = false;
}

const saveAuthor = async () => {
    submitted.value = true;
    let data = { ...authorDetail.value };
    formData.append('items', JSON.stringify(data));
    try {
        const res = await API.create(`author`, formData);
        console.log(res);
    } catch (error) {
        console.log(error);
    }
};

const deleteActorDlg = (data) => {
    authorDetail.value = data;
    deleteProductDialog.value = true;
};

const confirmDeleteSelected = async () => {
    try {
        const res = await API.delete(`author/${authorDetail.value.slug}`);
        if (res.data) {
            deleteProductDialog.value = true;
        }
    } catch (error) {}
};

function deleteSelectedProducts() {
    Authors.value = Authors.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
}
const Openfile = () => {
    document.querySelectorAll('.click-file')[0].click();
};
const UploadFileLocal = async (event, index) => {
    const file = event.target.files[0];
    formData.append('files', file);
    document.querySelectorAll('.click-file')[index].value = '';
};
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <strong class="text-lg">Danh sách Tác giả</strong>
                </template>
                <template #end>
                    <Button label="Thêm mới" icon="pi pi-plus" @click="openNew" />
                </template>
            </Toolbar>

            <DataTable ref="dt" v-model:selection="selectedProducts" showGridlines :value="Authors" dataKey="id" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 25]">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Danh Sách Tác giả</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText class="w-[300px]" placeholder="Tìm kiếm phim theo tên..." />
                        </IconField>
                    </div>
                </template>
                <Column header="STT">
                    <template #body="sp">
                        {{ sp.index + 1 }}
                    </template>
                </Column>
                <Column field="authorName" header="Tên tác giả"></Column>
                <Column field="authorImage" header="Ảnh">
                    <template #body="sp">
                        <Image crossorigin="anonymous" width="80" :src="sp.data.authorImage"></Image>
                    </template>
                </Column>
                <Column field="bio" header="Mô tả"></Column>
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

        <Dialog v-model:visible="authorDialog" :style="{ width: '450px' }" header="Tác giả" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <Button label="Tải lên" icon="pi pi-cloud-upload" class="btn-up-file" raised @click="Openfile(index)" />
                </div>
                <input type="file" class="hidden click-file" @change="UploadFileLocal($event, 0)" />
                <div>
                    <label for="name" class="block font-bold mb-3">Tên tác giả</label>
                    <InputText id="name" v-model.trim="authorDetail.authorName" required="true" autofocus :invalid="submitted && !authorDetail.movieName" fluid />
                    <small v-if="submitted && !authorDetail.authorName" class="text-red-500">movieName is required.</small>
                </div>
                <div>
                    <label for="movieDescription" class="block font-bold mb-3">Mô tả</label>
                    <Textarea id="movieDescription" v-model="authorDetail.bio" required="true" rows="3" cols="20" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Hủy" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Xác nhận" icon="pi pi-check" @click="saveAuthor" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Xác nhận" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="authorDetail"
                    >Xác nhận xóa <b>{{ authorDetail.actorName }}</b
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
                <span v-if="authorDetail">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
