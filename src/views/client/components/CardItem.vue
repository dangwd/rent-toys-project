<script setup>
import { formatPrice } from '@/helper/formatPrice.js';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../store/carts';

const props = defineProps(['data']);
const route = useRoute();
const cartStore = useCartStore();

const discountedPrice = computed(() => {
    return props.data.price - (props.data.price * props.data.discount) / 100;
});

const handleAddToCart = () => {
    cartStore.addToCart(props.data);
};
</script>

<template>
    <div class="group relative flex h-full w-full flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <!-- Product Image -->
        <router-link :to="`/client/detail/${props.data._id}`" class="relative block h-48 overflow-hidden rounded-t-[32px] sm:h-56 md:h-64">
            <img
                class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                :src="props.data.images && props.data.images.length > 0 ? props.data.images[0] : 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Toy'"
                :alt="props.data.productName"
                crossorigin="anonymous"
            />
            <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
            <div v-if="props.data.discount" class="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-yellow-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-md">-{{ props.data.discount }}%</div>
        </router-link>

        <!-- Product Info -->
        <div class="flex flex-1 flex-col p-4 sm:p-5">
            <router-link :to="`/client/detail/${props.data._id}`" class="flex-1 min-w-0">
                <h5 class="text-base font-semibold text-slate-900 line-clamp-2 break-words transition-colors duration-300 group-hover:text-indigo-600 dark:text-white sm:text-lg">
                    {{ props.data.productName }}
                </h5>
            </router-link>

            <div class="mt-3 flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <p class="text-sm text-slate-500 dark:text-slate-400">Giá từ</p>
                    <div class="flex items-center gap-2">
                        <span class="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">{{ formatPrice(discountedPrice) }}đ</span>
                        <span v-if="props.data.discount > 0" class="text-xs text-slate-500 line-through dark:text-slate-400 sm:text-sm">{{ formatPrice(props.data.price) }}đ</span>
                    </div>
                </div>
            </div>

            <div class="mt-5 flex items-center justify-between gap-3">
                <button
                    @click="handleAddToCart"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 active:scale-[0.98]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span>Thêm vào giỏ</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add smooth transitions */
.group {
    position: relative;
}
</style>

