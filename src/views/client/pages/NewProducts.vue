<template>
    <div class="h-auto container mx-auto py-10">
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-3 flex flex-col gap-3">
                <div class="border border-gray-300 p-3 rounded-lg">danh muc</div>
                <div class="border border-gray-300 p-3 rounded-lg">Giá</div>
                <div class="border border-gray-300 p-3 rounded-lg">Tuổi</div>
                <div class="border border-gray-300 p-3 rounded-lg">Giới tính</div>
                <div class="border border-gray-300 p-3 rounded-lg">Thuơng hiệu</div>
            </div>
            <div class="col-span-9">
                <ProductsGrid :data="Products" :layout="true"></ProductsGrid>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import ProductsGrid from '../components/ProductsGrid.vue';
import API from '@/api/api-main';
const Products = ref([]);

onMounted(() => {
    fetchAllProducts();
});

const fetchAllProducts = async () => {
    try {
        const res = await API.get(`products?skip=0&limit=2000`);
        Products.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};
</script>
<style>
</style>