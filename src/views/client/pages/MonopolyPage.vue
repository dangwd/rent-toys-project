<template>
    <div>
        <img class="w-full" src="https://cdn.shopify.com/s/files/1/0731/6514/4343/files/1280X496.webp?v=1741944098" alt="" />
        <div class="container mx-auto text-center py-10">
            <strong class="text-2xl capitalize text-primary">Ưu đãi độc quyền Website</strong>
            <ProductsGrid :data="Products"></ProductsGrid>
        </div>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { onMounted, ref } from 'vue';
import ProductsGrid from '../components/ProductsGrid.vue';

const Products = ref([]);

onMounted(() => {
    fetchAllProducts();
});
const fetchAllProducts = async () => {
    try {
        const res = await API.get(`products`);
        Products.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};
</script>
<style></style>
