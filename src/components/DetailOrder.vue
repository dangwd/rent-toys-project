<template>
    <div>
        <Button @click="openDetail()" icon="pi pi-eye" text></Button>

        <Dialog v-model:visible="visible" modal header="Chi tiết đơn hàng" :style="{ width: '50%' }">
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                    <strong>Mã đơn hàng: HOANGGAYLO123</strong>
                    <Tag value="pending"></Tag>
                </div>
                <span class="font-normal">Ngày tạo đơn: 5:20 25/3/2025</span>
                <div class="border border-gray-300 p-3 rounded-lg">
                    <div v-for="(item, index) in detailOrder.items" :key="index" class="flex flex-col gap-2">
                        <div class="flex gap-2">
                            <img src="" alt="" />
                            <div class="flex flex-col gap-2">
                                <strong>{{ item }}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Đóng" severity="secondary" @click="visible = false"></Button>
                    <Button type="button" label="Lưu" @click="visible = false"></Button>
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { ref } from 'vue';

const props = defineProps(['data']);
const visible = ref(false);
const detailOrder = ref({});
const openDetail = () => {
    fetchDetailOrder();
    visible.value = true;
};

const fetchDetailOrder = async () => {
    try {
        const res = await API.get(`order/${props.data._id}`);
        detailOrder.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
</script>
<style>
</style>