<template>
    <div class="flex flex-col gap-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="(item, index) in props.data" :key="index">
                <ProductCard :data="item"></ProductCard>
            </div>
        </div>
    </div>
</template>
<script setup>
import ProductCard from './ProductCard.vue';
const props = defineProps(['data', 'layout']);
</script>
<style></style>
