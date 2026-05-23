<template>
    <div class="bg-gray-50 dark:bg-zinc-900 min-h-screen">
        <!-- Hero banner -->
        <div class="relative overflow-hidden">
            <img src="/src/assets/img/banner2.webp" class="h-64 w-full object-cover md:h-80" alt="Ưu đãi độc quyền" />
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-black/40"></div>
            <div class="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16">
                <span class="mb-2 rounded-full bg-indigo-500/30 px-3 py-1 text-xs font-black uppercase tracking-widest text-indigo-200 backdrop-blur-sm">Chỉ có tại website</span>
                <h1 class="text-3xl font-extrabold tracking-tight text-white drop-shadow md:text-5xl">Ưu Đãi Độc Quyền</h1>
                <p class="mt-2 text-base font-medium text-indigo-100 drop-shadow md:text-lg">Những sản phẩm giảm giá đặc biệt dành riêng cho khách hàng trực tuyến</p>
            </div>
        </div>

        <div class="container mx-auto px-4 py-10">
            <!-- Header -->
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Sản Phẩm Khuyến Mãi</h2>
                    <p v-if="!loading" class="mt-1 text-sm text-slate-500">{{ paginator.total }} sản phẩm đang có ưu đãi</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="hidden rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 sm:inline">Hot Deal</span>
                </div>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <Skeleton v-for="i in 12" :key="i" height="320px" borderRadius="16px" />
            </div>

            <!-- Empty -->
            <div v-else-if="!Products.length" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-slate-400 dark:border-zinc-700 dark:bg-zinc-900">
                <i class="pi pi-tag mb-4 text-5xl opacity-20"></i>
                <p class="font-bold">Chưa có sản phẩm khuyến mãi</p>
            </div>

            <!-- Grid + paginator -->
            <template v-else>
                <ProductsGrid :data="Products" />
                <Paginator
                    v-if="paginator.total > paginator.rows"
                    :rows="paginator.rows"
                    :totalRecords="paginator.total"
                    :first="paginator.page * paginator.rows"
                    :rowsPerPageOptions="[12, 24, 48]"
                    class="mt-8 rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                    @page="onPageChange"
                />
            </template>
        </div>
    </div>
</template>

<script setup>
import API from '@/api/api-main';
import { onMounted, reactive, ref } from 'vue';
import ProductsGrid from '../components/ProductsGrid.vue';

const Products = ref([]);
const loading = ref(false);
const paginator = reactive({ rows: 12, page: 0, total: 0 });

onMounted(fetchProducts);

async function fetchProducts() {
    loading.value = true;
    const skip = paginator.page * paginator.rows;
    try {
        // Filter products that have a discount > 0 (exclusive deals)
        const res = await API.get(`products?skip=${skip}&limit=${paginator.rows}&price=0:99999999`);
        const all = res.data.metadata.result ?? [];
        // Show products with discount first, then the rest
        Products.value = [...all].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        paginator.total = res.data.metadata.total;
    } catch {
        Products.value = [];
    } finally {
        loading.value = false;
    }
}

const onPageChange = (e) => {
    paginator.page = e.page;
    paginator.rows = e.rows;
    fetchProducts();
};
</script>
