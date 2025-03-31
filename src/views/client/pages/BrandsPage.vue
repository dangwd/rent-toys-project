<template>
    <div class="container flex flex-col gap-3 mx-auto h-auto py-10">
        <strong class="text-xl">Các thương hiệu nổi tiếng</strong>

        <div class="flex gap-3">
            <div v-for="(item, index) in Brands" :key="index">
                <img :src="item.imageLink" :alt="item.imageLink" />
            </div>
        </div>
        <strong class="text-xl">Sản phẩm có thể bạn sẽ quan tâm</strong>
        <ProductsGrid :data="Products"></ProductsGrid>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import ProductsGrid from '../components/ProductsGrid.vue';
import { onMounted, ref } from 'vue';

const Brands = ref([]);
const Products = ref([]);
onMounted(() => {
    fetchAllProducts();
    fetchAllBrands();
});
const fetchAllBrands = async () => {
    try {
        const res = await API.get(`brands`);
        Brands.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const fetchAllProducts = async () => {
    try {
        const res = await API.get(`products`);
        Products.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};
</script>
<style>
</style>