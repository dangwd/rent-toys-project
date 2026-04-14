<script setup>
import { formatPrice } from '@/helper/formatPrice.js';
import { computed } from 'vue';

const props = defineProps(['data']);

const discountedPrice = computed(() => {
    return props.data.price - (props.data.price * props.data.discount) / 100;
});
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
            <router-link :to="`/client/detail/${props.data._id}`" class="min-w-0 flex-1">
                <h5 class="line-clamp-2 break-words text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-indigo-600 dark:text-white sm:text-lg">
                    {{ props.data.productName }}
                </h5>
            </router-link>

            <p v-if="props.data.descriptions" class="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {{ props.data.descriptions }}
            </p>

            <div v-if="props.data.genre?.genreName || props.data.brand?.brandName || props.data.age != null" class="mt-3 flex flex-wrap gap-2">
                <span v-if="props.data.genre?.genreName" class="inline-flex max-w-full items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                    {{ props.data.genre.genreName }}
                </span>
                <span v-if="props.data.brand?.brandName" class="inline-flex max-w-full items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {{ props.data.brand.brandName }}
                </span>
                <span v-if="props.data.age != null" class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"> {{ props.data.age }}+ tuổi </span>
            </div>

            <div class="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-zinc-800">
                <div class="min-w-0">
                    <p class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Giá từ</p>
                    <div class="mt-0.5 flex flex-wrap items-baseline gap-2">
                        <span class="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">{{ formatPrice(discountedPrice) }}đ</span>
                        <span v-if="props.data.discount > 0" class="text-xs text-slate-500 line-through dark:text-slate-400 sm:text-sm">{{ formatPrice(props.data.price) }}đ</span>
                    </div>
                </div>
                <router-link :to="`/client/detail/${props.data._id}`" class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Chi tiết
                    <i class="pi pi-arrow-right text-xs"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.group {
    position: relative;
}
</style>
