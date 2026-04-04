<script setup>
import API from '@/api/api-main';
import { computed, onMounted, ref } from 'vue';
import ProductsGrid from '../components/ProductsGrid.vue';
import SlidesItem from '../components/SlidesItem.vue';

// --- Reactive Data ---
const allProducts = ref([]);
const categories = ref([
    { name: 'Đồ chơi sáng tạo', img: '/src/assets/img/1.webp', path: '/client/products-list', color: 'from-sky-400 to-blue-500' },
    { name: 'Đồ chơi bé gái', img: '/src/assets/img/2.webp', path: '/client/products-list', color: 'from-pink-400 to-rose-500' },
    { name: 'Siêu xe Hot Wheels', img: '/src/assets/img/3.webp', path: '/client/products-list', color: 'from-amber-400 to-orange-500' },
    { name: 'Ba lô & Phụ kiện', img: '/src/assets/img/4.webp', path: '/client/products-list', color: 'from-lime-400 to-green-500' }
]);

// --- Lifecycle Hooks ---
onMounted(() => {
    fetchAllProducts();
});

// --- Computed Properties ---
const newProducts = computed(() => allProducts.value.slice(0, 8));
const bestSellers = computed(() => allProducts.value.slice(8, 16));

// --- API Methods ---
const fetchAllProducts = async () => {
    try {
        // This fetch should be optimized in a real-world scenario
        const res = await API.get(`products?skip=0&limit=50`);
        allProducts.value = res.data.metadata.result;
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
};
</script>

<template>
    <div class="bg-gray-50 dark:bg-zinc-900">
        <!-- Hero Slides -->
        <section class="pt-8 mb-12 md:pt-12 md:mb-20">
            <SlidesItem />
        </section>

        <!-- New Products Section -->
        <section class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <div class="mb-10 text-center md:mb-12">
                    <h2 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">✨ Đồ Chơi Mới Về</h2>
                    <p class="mx-auto max-w-2xl text-base text-gray-500 dark:text-gray-400 md:text-lg">Khám phá những món đồ chơi mới nhất và thú vị nhất cho bé yêu của bạn.</p>
                </div>
                <ProductsGrid :data="newProducts" />
                <div class="mt-10 text-center md:mt-12">
                    <router-link
                        to="/client/products-list"
                        class="transform-gpu inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/40"
                    >
                        <span>Xem Tất Cả</span>
                        <i class="pi pi-arrow-right text-sm"></i>
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Categories Section -->
        <section class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <div class="mb-10 text-center md:mb-12">
                    <h2 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">🎯 Khám Phá Danh Mục</h2>
                    <p class="text-base text-gray-500 dark:text-gray-400 md:text-lg">Tìm kiếm theo loại sản phẩm bé yêu thích.</p>
                </div>
                <div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    <router-link v-for="category in categories" :key="category.name" :to="category.path" class="group-hover:shadow-2xl group block transform-gpu overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1.5">
                        <div class="relative">
                            <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                                <img :src="category.img" :alt="category.name" class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                            </div>
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div class="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                                <h3 class="text-base font-bold text-white transition-colors duration-300 md:text-lg">{{ category.name }}</h3>
                            </div>
                            <div class="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r transition-transform duration-300 ease-in-out group-hover:scale-x-100" :class="category.color"></div>
                        </div>
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Best Sellers Section -->
        <section class="py-12 md:py-16">
            <div class="container mx-auto px-4">
                <div class="mb-10 text-center md:mb-12">
                    <h2 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">🔥 Bán Chạy Nhất Tuần</h2>
                    <p class="mx-auto max-w-2xl text-base text-gray-500 dark:text-gray-400 md:text-lg">Những sản phẩm được các bạn nhỏ và phụ huynh yêu thích nhất.</p>
                </div>
                <ProductsGrid :data="bestSellers" />
            </div>
        </section>

        <!-- Promotional Banner -->
        <section class="container mx-auto px-4 py-12 md:py-16">
            <router-link to="/client/products-list" class="group relative block overflow-hidden rounded-3xl">
                <img src="/src/assets/img/banner2.webp" class="h-72 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
                    <h3 class="mb-3 text-3xl font-extrabold drop-shadow-lg md:text-5xl">🎉 Ưu Đãi Độc Quyền</h3>
                    <p class="text-lg font-semibold drop-shadow-md md:text-2xl">Giảm giá lên đến 50% cho khách hàng mới</p>
                </div>
            </router-link>
        </section>
    </div>
</template>
