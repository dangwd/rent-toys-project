<template>
    <div class="relative">
        <Card style="overflow: hidden; min-height: 550px; transition: 0.3s ease-in-out" class="hover:shadow-xl hover:bg-primary-100">
            <template #header>
                <img alt="user header" crossorigin="anonymous" :src="props.data.images ? props.data.images[0] : `https://placehold.co/600x400`" />
            </template>
            <template #title>
                <strong class="text-base">{{ props.data.productName }}</strong>
            </template>
            <template #content>
                <span class="line-clamp-3">
                    {{ props.data.descriptions }}
                </span>
            </template>
            <template #footer>
                <div class="flex items-center justify-between gap-4 mt-1">
                    <strong class="text-lg text-primary">{{ formatPrice(props.data.price - (props.data.price * props.data.discount) / 100) }}đ</strong>
                    <strong v-if="props.data.discount" class="text-lg text-secondary line-through">{{ formatPrice(props.data.price) }}đ</strong>
                </div>
            </template>
        </Card>
        <div v-if="route.query.t === 'new'" class="absolute block top-0 right-0 bg-red-500 text-white p-2 rounded-tr-xl">New</div>
        <div v-else-if="props.data.discount" class="absolute block top-0 right-0 bg-red-500 text-white p-2 rounded-tr-xl">-{{ props.data.discount }}%</div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps(['data']);

const route = useRoute();

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};
</script>
<style></style>
