<script setup>
import { formatPrice } from '@/helper/formatPrice.js';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../store/carts';

const props = defineProps(['data']);
const route = useRoute();
const cartStore = useCartsStore();

const discountedPrice = computed(() => {
    return props.data.price - (props.data.price * props.data.discount) / 100;
});

const handleAddToCart = () => {
    cartStore.addToCart(props.data);
};
</script>

<template>
    <div
        class="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-2xl dark:bg-zinc-800"
    >
        <!-- Product Image -->
        <router-link :to="`/client/detail/${props.data._id}`" class="relative block h-48 overflow-hidden sm:h-56 md:h-64">
            <img
                class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                :src="props.data.images && props.data.images.length > 0 ? props.data.images[0] : 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Toy'"
                :alt="props.data.productName"
                crossorigin="anonymous"
            />
            <!-- Discount Badge -->
            <div v-if="props.data.discount" class="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-center text-yellow-900 shadow-md">
                <span class="text-sm font-bold">-{{ props.data.discount }}%</span>
            </div>
        </router-link>

        <!-- Product Info -->
        <div class="flex flex-1 flex-col p-4 sm:p-5">
            <!-- Title -->
            <router-link :to="`/client/detail/${props.data._id}`" class="flex-1">
                <h5 class="text-base font-bold text-gray-800 line-clamp-2 transition-colors duration-300 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 sm:text-lg">
                    {{ props.data.productName }}
                </h5>
            </router-link>

            <!-- Price & Add to Cart -->
            <div class="mt-4 flex items-end justify-between">
                <!-- Price Section -->
                <div class="flex flex-col items-start">
                    <span class="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">{{ formatPrice(discountedPrice) }}đ</span>
                    <span v-if="props.data.discount > 0" class="text-xs text-gray-500 line-through dark:text-gray-400 sm:text-sm">{{ formatPrice(props.data.price) }}đ</span>
                </div>

                <!-- Action Button -->
                <button
                    @click="handleAddToCart"
                    class="group-hover:w-32 relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white transition-all duration-300 ease-out active:scale-95 sm:h-12 sm:w-12 sm:group-hover:w-36"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="absolute left-3 h-5 w-5 transition-all duration-300 sm:h-6 sm:w-6"
                        :class="{ 'opacity-100 group-hover:opacity-0': true }"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span class="group-hover:opacity-100 absolute font-semibold text-xs opacity-0 transition-opacity duration-300 group-hover:delay-200 sm:text-sm">Thêm vào giỏ</span>
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

