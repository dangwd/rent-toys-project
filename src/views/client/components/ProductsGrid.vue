<template>
    <div class="flex flex-col gap-5">
        <div :class="{ '!grid-cols-3': props.layout }" class="grid grid-cols-4 gap-4">
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
