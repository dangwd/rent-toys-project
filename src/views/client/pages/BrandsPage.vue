<template>
    <div class="bg-gray-50 dark:bg-zinc-900 min-h-screen">
        <!-- Brands strip -->
        <section class="border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div class="container mx-auto px-4 py-10">
                <div class="mb-8 text-center">
                    <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Các Thương Hiệu Nổi Tiếng</h1>
                    <p class="mt-2 text-gray-500 dark:text-zinc-400">Chọn thương hiệu để xem sản phẩm liên quan</p>
                </div>

                <div v-if="brandsLoading" class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    <Skeleton v-for="i in 8" :key="i" height="100px" borderRadius="16px" />
                </div>

                <div v-else class="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    <!-- All brands -->
                    <button
                        @click="selectBrand(null)"
                        :class="['brand-card', !activeBrand ? 'brand-card--active' : 'brand-card--idle']"
                    >
                        <div class="brand-logo-wrap">
                            <i class="pi pi-th-large text-xl text-indigo-500"></i>
                        </div>
                        <span class="mt-2 text-xs font-bold">Tất cả</span>
                    </button>

                    <button
                        v-for="brand in Brands"
                        :key="brand._id"
                        @click="selectBrand(brand)"
                        :class="['brand-card', activeBrand?._id === brand._id ? 'brand-card--active' : 'brand-card--idle']"
                    >
                        <div class="brand-logo-wrap">
                            <img v-if="brand.imageLink" :src="brand.imageLink" :alt="brand.brandName" class="h-10 w-full object-contain" />
                            <i v-else class="pi pi-tag text-xl text-slate-400"></i>
                        </div>
                        <span class="mt-2 line-clamp-1 text-xs font-bold">{{ brand.brandName }}</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- Products section -->
        <section class="container mx-auto px-4 py-10">
            <div class="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                        {{ activeBrand ? activeBrand.brandName : 'Tất cả sản phẩm' }}
                    </h2>
                    <p v-if="!productsLoading" class="mt-0.5 text-sm text-slate-500">{{ paginator.total }} sản phẩm</p>
                </div>
                <button
                    v-if="activeBrand"
                    @click="selectBrand(null)"
                    class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-red-300 hover:text-red-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                    <i class="pi pi-times text-[10px]"></i>
                    Bỏ lọc
                </button>
            </div>

            <!-- Loading skeleton -->
            <div v-if="productsLoading" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <Skeleton v-for="i in 8" :key="i" height="320px" borderRadius="16px" />
            </div>

            <!-- Empty -->
            <div v-else-if="!Products.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-slate-400 dark:border-zinc-700 dark:bg-zinc-900">
                <i class="pi pi-box mb-4 text-5xl opacity-20"></i>
                <p class="font-bold">Không có sản phẩm nào</p>
                <button @click="selectBrand(null)" class="mt-3 text-sm text-indigo-600 hover:underline">Xem tất cả sản phẩm</button>
            </div>

            <!-- Grid -->
            <template v-else>
                <ProductsGrid :data="Products" />
                <Paginator
                    v-if="paginator.total > paginator.rows"
                    :rows="paginator.rows"
                    :totalRecords="paginator.total"
                    :first="paginator.page * paginator.rows"
                    class="mt-8 rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                    @page="onPageChange"
                />
            </template>
        </section>
    </div>
</template>

<script setup>
import API from '@/api/api-main';
import { onMounted, reactive, ref } from 'vue';
import ProductsGrid from '../components/ProductsGrid.vue';

const Brands = ref([]);
const Products = ref([]);
const activeBrand = ref(null);
const brandsLoading = ref(false);
const productsLoading = ref(false);

const paginator = reactive({ rows: 12, page: 0, total: 0 });

onMounted(() => {
    fetchAllBrands();
    fetchProducts();
});

const fetchAllBrands = async () => {
    brandsLoading.value = true;
    try {
        const res = await API.get('brands');
        Brands.value = res.data.metadata;
    } catch {
    } finally {
        brandsLoading.value = false;
    }
};

const fetchProducts = async () => {
    productsLoading.value = true;
    const skip = paginator.page * paginator.rows;
    let url = `products?skip=${skip}&limit=${paginator.rows}`;
    if (activeBrand.value) url += `&genre=${activeBrand.value._id}`;
    try {
        const res = await API.get(url);
        Products.value = res.data.metadata.result;
        paginator.total = res.data.metadata.total;
    } catch {
        Products.value = [];
    } finally {
        productsLoading.value = false;
    }
};

const selectBrand = (brand) => {
    activeBrand.value = brand;
    paginator.page = 0;
    fetchProducts();
};

const onPageChange = (e) => {
    paginator.page = e.page;
    paginator.rows = e.rows;
    fetchProducts();
};
</script>

<style scoped>
.brand-card {
    @apply flex flex-col items-center rounded-2xl border-2 p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer;
}

.brand-card--idle {
    @apply border-slate-100 bg-white dark:border-zinc-800 dark:bg-zinc-900;
}

.brand-card--active {
    @apply border-indigo-500 bg-indigo-50 shadow-md dark:border-indigo-600 dark:bg-indigo-950/40;
}

.brand-logo-wrap {
    @apply flex h-12 w-full items-center justify-center;
}
</style>
