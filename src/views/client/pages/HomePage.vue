<script setup>
import API from '@/api/api-main';
import { onMounted, ref } from 'vue';
import ProductsGrid from '../components/ProductsGrid.vue';
import SlidesItem from '../components/SlidesItem.vue';

onMounted(() => {
    fetchAllProducts();
});
const Products = ref([]);
const SectionData = ref([
    {
        title: ''
    },
    {
        title: 'Danh mục HOT'
    }
]);
const fetchAllProducts = async () => {
    try {
        const res = await API.get(`products?skip=0&limit=2000`);
        Products.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};
</script>
<template>
    <body class="font-montserrat text-sm bg-white dark:bg-zinc-900 flex flex-col gap-5">
        <div class="pb-5">
            <SlidesItem></SlidesItem>
        </div>
        <div class="flex flex-col gap-5">
            <section class="w-full container mx-auto">
                <div class="flex gap-2">
                    <router-link to="/client/products-list">
                        <img width="300" :src="'//www.mykingdom.com.vn/cdn/shop/files/1_8b41d900-903d-47fc-849b-522ca3603914.png?v=1741857899'" class="hover:scale-110 transition-all ease-in-out duration-300" />
                    </router-link>
                    <router-link to="/client/new-products">
                        <img width="300" :src="'//www.mykingdom.com.vn/cdn/shop/files/2_540def28-5e1a-4196-b99c-3bac9ec59131.png?v=1741768720'" class="hover:scale-110 transition-all ease-in-out duration-300" />
                    </router-link>

                    <router-link to="/client/new-products">
                        <img width="300" :src="'//www.mykingdom.com.vn/cdn/shop/files/3_473dccab-4bc2-4b62-851d-4e2ab7911eab.png?v=1741857899'" class="hover:scale-110 transition-all ease-in-out duration-300" />
                    </router-link>
                    <router-link to="/client/new-products">
                        <img width="300" :src="'//www.mykingdom.com.vn/cdn/shop/files/4_02934ac5-9a95-4c9e-8a35-f0db314254fb.png?v=1741857899'" class="hover:scale-110 transition-all ease-in-out duration-300" />
                    </router-link>
                </div>
            </section>
            <div class="text-2xl text-center uppercase font-semibold">Ưu Đãi Độc Quyền Website</div>
            <div class="flex min-h-screen container mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto 2xl:border-x-2 2xl:border-gray-200 dark:2xl:border-zinc-700">
                <div class="py-10">
                    <ProductsGrid :data="Products"></ProductsGrid>
                </div>
            </div>
            <section class="w-full container mx-auto">
                <div class="flex gap-3">
                    <router-link to="#" class="flex flex-col gap-2 text-center">
                        <div class="overflow-hidden rounded-lg">
                            <img width="300" :src="'//www.mykingdom.com.vn/cdn/shop/files/D_ch_i_sang_t_o_3377bcb0-e505-4dd0-b9e6-f5ca11b032b0_296x.jpg?v=1741833151'" class="hover:scale-110 transition-all ease-in-out duration-300" />
                        </div>
                        <span class="text-xl font-semibold">Đồ chơi bé trai</span>
                    </router-link>
                    <router-link to="#" class="flex flex-col gap-2 text-center">
                        <div class="overflow-hidden rounded-lg">
                            <img width="300" :src="'//www.mykingdom.com.vn/cdn/shop/files/D_ch_i_be_gai_b3ab4bd5-f01c-4f9d-b4bf-5d626cec6d7b_296x.jpg?v=1741769125'" class="hover:scale-110 transition-all ease-in-out duration-300" />
                        </div>
                        <span class="text-xl font-semibold">Đồ chơi bé gái</span>
                    </router-link>
                    <router-link to="#" class="flex flex-col gap-2 text-center">
                        <div class="overflow-hidden rounded-lg">
                            <img width="300" :src="'//www.mykingdom.com.vn/cdn/shop/files/Hotwheels_9c0aa4d6-39dd-4087-a7f0-1485f14a2588_296x.jpg?v=1741769125'" class="hover:scale-110 transition-all ease-in-out duration-300" />
                        </div>
                        <span class="text-xl font-semibold">Hot Wheels</span>
                    </router-link>
                    <router-link to="#" class="flex flex-col gap-2 text-center">
                        <div class="overflow-hidden rounded-lg">
                            <img width="300" :src="'//www.mykingdom.com.vn/cdn/shop/files/Balo_tui_deo_vali_f2c9b528-4467-4d54-afd5-0097ff32a262_296x.jpg?v=1741769125'" class="hover:scale-110 transition-all ease-in-out duration-300" />
                        </div>
                        <span class="text-xl font-semibold">Ba lô, Túi</span>
                    </router-link>
                </div>
            </section>
            <div class="text-2xl text-center uppercase font-semibold">Ưu Đãi Độc Quyền Website</div>
            <div class="flex min-h-screen container mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto 2xl:border-x-2 2xl:border-gray-200 dark:2xl:border-zinc-700">
                <div class="py-10">
                    <ProductsGrid :data="Products"></ProductsGrid>
                </div>
            </div>
            <img
                height="100"
                class="object-cover"
                src="//www.mykingdom.com.vn/cdn/shop/files/Xay_d_ng_d_i_dua_F1_trong_m_4459342e-2fd9-4f93-a8e0-d0162dc4b478.jpg?v=1742370384&width=375 375w, //www.mykingdom.com.vn/cdn/shop/files/Xay_d_ng_d_i_dua_F1_trong_m_4459342e-2fd9-4f93-a8e0-d0162dc4b478.jpg?v=1742370384&width=550 550w, //www.mykingdom.com.vn/cdn/shop/files/Xay_d_ng_d_i_dua_F1_trong_m_4459342e-2fd9-4f93-a8e0-d0162dc4b478.jpg?v=1742370384&width=750 750w, //www.mykingdom.com.vn/cdn/shop/files/Xay_d_ng_d_i_dua_F1_trong_m_4459342e-2fd9-4f93-a8e0-d0162dc4b478.jpg?v=1742370384&width=1100 1100w, //www.mykingdom.com.vn/cdn/shop/files/Xay_d_ng_d_i_dua_F1_trong_m_4459342e-2fd9-4f93-a8e0-d0162dc4b478.jpg?v=1742370384&width=1500 1500w, //www.mykingdom.com.vn/cdn/shop/files/Xay_d_ng_d_i_dua_F1_trong_m_4459342e-2fd9-4f93-a8e0-d0162dc4b478.jpg?v=1742370384&width=1780 1780w, //www.mykingdom.com.vn/cdn/shop/files/Xay_d_ng_d_i_dua_F1_trong_m_4459342e-2fd9-4f93-a8e0-d0162dc4b478.jpg?v=1742370384&width=2000 2000w, //www.mykingdom.com.vn/cdn/shop/files/Xay_d_ng_d_i_dua_F1_trong_m_4459342e-2fd9-4f93-a8e0-d0162dc4b478.jpg?v=1742370384&width=3000 3000w, //www.mykingdom.com.vn/cdn/shop/files/Xay_d_ng_d_i_dua_F1_trong_m_4459342e-2fd9-4f93-a8e0-d0162dc4b478.jpg?v=1742370384&width=3840 3840w"
                alt=""
            />
        </div>
    </body>
</template>
