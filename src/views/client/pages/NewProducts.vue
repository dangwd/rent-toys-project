<template>
    <div class="h-auto container mx-auto py-10">
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-3 flex flex-col gap-3">
                <div class="border border-gray-300 p-3 rounded-lg shadow">
                    <strong class="text-lg">Danh mục</strong>
                </div>
                <div class="border border-gray-300 p-3 rounded-lg shadow flex flex-col gap-3">
                    <strong class="text-lg">Giá</strong>
                    <div class="flex flex-col gap-3">
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.price" value="199999" @change="handleFilter()"></RadioButton>
                            <span class="text-base">Dưới 200.000</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.price" value="200000:500000" @change="handleFilter()"></RadioButton>
                            <span class="text-base">200.000 - 500.000</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.price" value="500000:1000000" @change="handleFilter()"></RadioButton>
                            <span class="text-base">500.000 - 1.000.000</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.price" value="1000000:2000000" @change="handleFilter()"></RadioButton>
                            <span class="text-base">1.000.000 - 2.000.000</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.price" value="2000000:5000000" @change="handleFilter()"></RadioButton>
                            <span class="text-base">2.000.000 - 5.000.000</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.price" value="" @change="handleFilter()"></RadioButton>
                            <span class="text-base">Tất cả</span>
                        </div>
                    </div>
                </div>
                <div class="border border-gray-300 p-3 rounded-lg shadow flex flex-col gap-3">
                    <strong class="text-lg">Tuổi</strong>
                    <div class="flex flex-col gap-3">
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.age" value="13" @change="handleFilter()"></RadioButton>
                            <span class="text-base">12 tuổi trở lên</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.age" value="6:12" @change="handleFilter()"></RadioButton>
                            <span class="text-base">6 - 12 tuổi</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.age" value="3:6" @change="handleFilter()"></RadioButton>
                            <span class="text-base">3 - 6 tuổi</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.age" value="" @change="handleFilter()"></RadioButton>
                            <span class="text-base">Tất cả</span>
                        </div>
                    </div>
                </div>
                <div class="border border-gray-300 p-3 rounded-lg shadow flex flex-col gap-3">
                    <strong class="text-lg">Giới tính</strong>
                    <div class="flex flex-col gap-3">
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.sex" value="M" @change="handleFilter()"></RadioButton>
                            <span class="text-base">Nam</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.sex" value="F" @change="handleFilter()"></RadioButton>

                            <span class="text-base">Nữ</span>
                        </div>
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.sex" value="" @change="handleFilter()"></RadioButton>

                            <span class="text-base">Khác</span>
                        </div>
                    </div>
                </div>
                <div class="border border-gray-300 p-3 rounded-lg shadow flex flex-col gap-3">
                    <strong class="text-lg">Thuơng hiệu</strong>
                    <div v-for="(item, index) in Brands" :key="index" class="flex flex-col gap-3">
                        <div class="flex gap-2">
                            <RadioButton v-model="filter.genre" :value="item._id" @change="handleFilter()"></RadioButton>
                            <span class="text-base">{{ item.brandName }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="Products?.length > 0" class="col-span-9 flex flex-col gap-2">
                <ProductsGrid :data="Products" :layout="true"></ProductsGrid>
                <Paginator @page="onPageChange($event)" :rows="paginator.rows" :totalRecords="paginator.total"></Paginator>
            </div>
            <div class="col-span-9 text-center" v-else>Không có sản phẩm nào</div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue';
import ProductsGrid from '../components/ProductsGrid.vue';
import API from '@/api/api-main';
const Products = ref([]);
const Brands = ref([]);
const paginator = reactive({
    rows: 10,
    page: 0,
    total: 0
});
const filter = reactive({
    price: '',
    genre: '',
    sex: '',
    age: ''
});
onMounted(() => {
    fetchAllProducts();
    fetchBrand();
});

const fetchAllProducts = async (query = '') => {
    let url = `products?skip=${paginator.page}&limit=${paginator.rows}`;
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
const handleFilter = () => {
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
    let queryStr = queryArr.join('');
    fetchAllProducts(queryStr);
};
const onPageChange = (e) => {
    paginator.page = e.page;
    paginator.rows = e.rows;
    handleFilter();
};
</script>
<style>
</style>