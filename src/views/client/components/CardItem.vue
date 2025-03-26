<template>
    <Card style="overflow: hidden; min-height: 550px; transition: 0.3s ease-in-out" class="hover:shadow-xl hover:bg-primary-100">
        <template #header>
            <img alt="user header" crossorigin="anonymous" :src="props.data.images ? props.data.images[0] : `https://placehold.co/600x400`" />
        </template>
        <template #title>
            <strong class="text-base">{{ props.data.productName }}</strong>
        </template>

        <template #footer>
            <div class="flex items-center justify-between gap-4 mt-1">
                <strong class="text-lg text-primary">{{ formatPrice(props.data.price) }}đ</strong>
                <strong class="text-lg text-secondary line-through">{{ formatPrice(props.data.price) }}đ</strong>
            </div>
        </template>
    </Card>
</template>

<script setup>
const props = defineProps(['data']);

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};
</script>
<style></style>
