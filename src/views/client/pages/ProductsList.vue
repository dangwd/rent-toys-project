<template>
    <div class="bg-gray-50 dark:bg-zinc-900">
        <div class="container mx-auto px-4 py-10">
            <div class="mb-8 text-center">
                <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Tất Cả Sản Phẩm</h1>
                <p class="mt-2 text-lg text-gray-500">Tìm kiếm đồ chơi hoàn hảo cho bé</p>
            </div>

            <div class="grid grid-cols-12 gap-8">
                <!-- Filters Sidebar -->
                <aside class="col-span-12 lg:col-span-3">
                    <div class="space-y-6 rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-800">
                        <!-- Price Filter -->
                        <div>
                            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Lọc theo giá</h3>
                            <div class="flex flex-col gap-3">
                                <div v-for="priceRange in priceFilters" :key="priceRange.value" class="flex items-center gap-3">
                                    <RadioButton v-model="filter.price" :inputId="`price_${priceRange.value}`" :name="priceRange.label" :value="priceRange.value" @change="handleFilter()" />
                                    <label :for="`price_${priceRange.value}`" class="text-base text-gray-700 dark:text-gray-300">{{ priceRange.label }}</label>
                                </div>
                            </div>
                        </div>

                        <hr class="dark:border-zinc-700" />

                        <!-- Age Filter -->
                        <div>
                            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Lọc theo tuổi</h3>
                            <div class="flex flex-col gap-3">
                                <div v-for="ageRange in ageFilters" :key="ageRange.value" class="flex items-center gap-3">
                                    <RadioButton v-model="filter.age" :inputId="`age_${ageRange.value}`" :name="ageRange.label" :value="ageRange.value" @change="handleFilter()" />
                                    <label :for="`age_${ageRange.value}`" class="text-base text-gray-700 dark:text-gray-300">{{ ageRange.label }}</label>
                                </div>
                            </div>
                        </div>

                        <hr class="dark:border-zinc-700" />

                        <!-- Gender Filter -->
                        <div>
                            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Giới tính</h3>
                            <div class="flex flex-col gap-3">
                                <div v-for="gender in genderFilters" :key="gender.value" class="flex items-center gap-3">
                                    <RadioButton v-model="filter.sex" :inputId="`gender_${gender.value}`" :name="gender.label" :value="gender.value" @change="handleFilter()" />
                                    <label :for="`gender_${gender.value}`" class="text-base text-gray-700 dark:text-gray-300">{{ gender.label }}</label>
                                </div>
                            </div>
                        </div>

                        <hr class="dark:border-zinc-700" />

                        <!-- Brand Filter -->
                        <div>
                            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">Thương hiệu</h3>
                            <div class="flex max-h-60 flex-col gap-3 overflow-y-auto pr-2">
                                <div v-for="brand in brandFilters" :key="brand.value" class="flex items-center gap-3">
                                    <RadioButton v-model="filter.genre" :inputId="`brand_${brand.value}`" :name="brand.label" :value="brand.value" @change="handleFilter()" />
                                    <label :for="`brand_${brand.value}`" class="text-base text-gray-700 dark:text-gray-300">{{ brand.label }}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Products Grid -->
                <main v-if="Products?.length > 0" class="col-span-12 flex flex-col gap-8 lg:col-span-9">
                    <ProductsGrid :data="Products" :layout="true"></ProductsGrid>
                    <Paginator v-if="paginator.total > paginator.rows" @page="onPageChange($event)" :rows="paginator.rows" :totalRecords="paginator.total" class="mt-4"></Paginator>
                </main>
                <div class="col-span-12 text-center lg:col-span-9" v-else>
                    <div class="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-lg dark:bg-zinc-800">
                        <i class="pi pi-search-plus text-6xl text-gray-400"></i>
                        <h3 class="mt-6 text-2xl font-bold text-gray-800 dark:text-white">Không tìm thấy sản phẩm</h3>
                        <p class="mt-2 text-gray-500">Vui lòng thử lại với bộ lọc khác.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, reactive, computed } from 'vue';
import ProductsGrid from '../components/ProductsGrid.vue';
import API from '@/api/api-main';

const Products = ref([]);
const Brands = ref([]);
const paginator = reactive({
    rows: 9,
    page: 0,
    total: 0
});
const filter = reactive({
    price: '',
    genre: '',
    sex: '',
    age: ''
});

const priceFilters = ref([
    { label: 'Dưới 200.000', value: '199999' },
    { label: '200.000 - 500.000', value: '200000:500000' },
    { label: '500.000 - 1.000.000', value: '500000:1000000' },
    { label: '1.000.000 - 2.000.000', value: '1000000:2000000' },
    { label: '2.000.000 - 5.000.000', value: '2000000:5000000' },
    { label: 'Tất cả', value: '' }
]);

const ageFilters = ref([
    { label: '12 tuổi trở lên', value: '13' },
    { label: '6 - 12 tuổi', value: '6:12' },
    { label: '3 - 6 tuổi', value: '3:6' },
    { label: 'Tất cả', value: '' }
]);

const genderFilters = ref([
    { label: 'Nam', value: 'M' },
    { label: 'Nữ', value: 'F' },
    { label: 'Khác', value: '' }
]);

const brandFilters = computed(() => {
    const brands = Brands.value.map((b) => ({ label: b.brandName, value: b._id }));
    brands.unshift({ label: 'Tất cả', value: '' });
    return brands;
});

onMounted(() => {
    fetchAllProducts();
    fetchBrand();
});

const fetchAllProducts = async (query = '') => {
    let url = `products?skip=${paginator.page * paginator.rows}&limit=${paginator.rows}`;
    if (query) {
        url += `${query}`;
    }
    try {
        const res = await API.get(url);
        Products.value = res.data.metadata.result;
        paginator.total = res.data.metadata.total;
    } catch (error) {
        console.log(error);
    }
};

const fetchBrand = async () => {
    try {
        const res = await API.get(`brands`);
        Brands.value = res.data.metadata;
    } catch (error) {}
};

const buildQuery = () => {
    let queryArr = [];
    if (filter.price) {
        queryArr.push(`&price=${filter.price}`);
    }
    if (filter.age) {
        queryArr.push(`&age=${filter.age}`);
    }
    if (filter.sex) {
        queryArr.push(`&sex=${filter.sex}`);
    }
    if (filter.genre) {
        queryArr.push(`&genre=${filter.genre}`);
    }
    return queryArr.join('');
};

const handleFilter = () => {
    paginator.page = 0;
    const query = buildQuery();
    fetchAllProducts(query);
};

const onPageChange = (e) => {
    paginator.page = e.page;
    paginator.rows = e.rows;
    const query = buildQuery();
    fetchAllProducts(query);
};
</script>
<style>
/* Customizing PrimeVue RadioButton */
.p-radiobutton .p-radiobutton-box.p-highlight {
    border-color: #6366f1 !important;
    background: #6366f1 !important;
}
.p-radiobutton .p-radiobutton-box:not(.p-disabled):not(.p-highlight):hover {
    border-color: #818cf8 !important;
}
</style>