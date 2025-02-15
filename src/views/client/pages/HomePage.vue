<script setup>
import { ref } from 'vue';
import banner from '../../../assets/img/banner1.webp';
import banner2 from '../../../assets/img/banner2.webp';
import banner3 from '../../../assets/img/banner3.webp';
import ProductsGrid from '../components/ProductsGrid.vue';
import SlidesItem from '../components/SlidesItem.vue';
const SectionData = ref([
    {
        title: "Lễ tình nhân Valentine's Day",
        banner: banner,
        items: [
            {
                id: 1,
                title: 'Doraemon Movie Story màu - Nobita và chuyến thám hiểm nam cực Kachi Kochi',
                thumbnail: 'https://product.hstatic.net/200000343865/product/mon-movie-story-mau_nobita-va-chuyen-tham-hiem-nam-cuc-kachi-kochi_bia_6b938ec5d12545f4a7a2c266ac0af643_large.jpg',
                price: 31500
            },
            {
                id: 2,
                title: 'Doraemon Plus - Tập 7',
                thumbnail: 'https://product.hstatic.net/200000343865/product/2_69e21e81483a4b4096ab04302f0c0632_large.jpg',
                price: 19800
            },
            {
                id: 3,
                title: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 1',
                thumbnail: 'https://product.hstatic.net/200000343865/product/1_3ee6c2e85753402aa9d952a070404f3b_large.jpg',
                price: 40500
            },
            {
                id: 4,
                title: 'Doraemon Movie Story màu - Tân Nobita và nước Nhật thời nguyên thủy',
                thumbnail: 'https://product.hstatic.net/200000343865/product/doraemon-movie-story-mau_tan-nobita-va-nuoc-nhat-thoi-nguyen-thuy_bia_fe90384047734857b6955a8c97b65d06_large.jpg',
                price: 31500
            },
            {
                id: 5,
                title: 'DT Conan Kaito Kid #2',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-kaito-kid-_2_26e0ef9405354d6a888267b9b2455e5c_master.jpg',
                price: 198000
            },
            {
                id: 6,
                title: 'DT Conan Kaito Kid #1',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-kaito-kid-_1_cff6e6d6dbce4546919546a19ee501cd_master.jpg',
                price: 31500
            },
            {
                id: 7,
                title: 'DT Conan - Black Organization #2',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-black-organization-_2_29ecbf3a427d4e289487093f78cd894c_master.jpg',
                price: 198000
            },
            {
                id: 8,
                title: 'DT Conan - Black Organization #1',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-black-organization-_1_356aebcefe494f6fa9b38b8618131ba1_master.jpg',
                price: 198000
            }
        ]
    },
    {
        title: 'COMBO',
        banner: banner2,
        items: [
            {
                id: 1,
                title: 'Doraemon Movie Story màu - Nobita và chuyến thám hiểm nam cực Kachi Kochi',
                thumbnail: 'https://product.hstatic.net/200000343865/product/mon-movie-story-mau_nobita-va-chuyen-tham-hiem-nam-cuc-kachi-kochi_bia_6b938ec5d12545f4a7a2c266ac0af643_large.jpg',
                price: 31500
            },
            {
                id: 2,
                title: 'Doraemon Plus - Tập 7',
                thumbnail: 'https://product.hstatic.net/200000343865/product/2_69e21e81483a4b4096ab04302f0c0632_large.jpg',
                price: 19800
            },
            {
                id: 3,
                title: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 1',
                thumbnail: 'https://product.hstatic.net/200000343865/product/1_3ee6c2e85753402aa9d952a070404f3b_large.jpg',
                price: 40500
            },
            {
                id: 4,
                title: 'Doraemon Movie Story màu - Tân Nobita và nước Nhật thời nguyên thủy',
                thumbnail: 'https://product.hstatic.net/200000343865/product/doraemon-movie-story-mau_tan-nobita-va-nuoc-nhat-thoi-nguyen-thuy_bia_fe90384047734857b6955a8c97b65d06_large.jpg',
                price: 31500
            },
            {
                id: 5,
                title: 'DT Conan Kaito Kid #2',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-kaito-kid-_2_26e0ef9405354d6a888267b9b2455e5c_master.jpg',
                price: 198000
            },
            {
                id: 6,
                title: 'DT Conan Kaito Kid #1',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-kaito-kid-_1_cff6e6d6dbce4546919546a19ee501cd_master.jpg',
                price: 31500
            },
            {
                id: 7,
                title: 'DT Conan - Black Organization #2',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-black-organization-_2_29ecbf3a427d4e289487093f78cd894c_master.jpg',
                price: 198000
            },
            {
                id: 8,
                title: 'DT Conan - Black Organization #1',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-black-organization-_1_356aebcefe494f6fa9b38b8618131ba1_master.jpg',
                price: 198000
            }
        ]
    },
    {
        title: 'MANGA - COMIC',
        banner: banner3,
        items: [
            {
                id: 1,
                title: 'Doraemon Movie Story màu - Nobita và chuyến thám hiểm nam cực Kachi Kochi',
                thumbnail: 'https://product.hstatic.net/200000343865/product/mon-movie-story-mau_nobita-va-chuyen-tham-hiem-nam-cuc-kachi-kochi_bia_6b938ec5d12545f4a7a2c266ac0af643_large.jpg',
                price: 31500
            },
            {
                id: 2,
                title: 'Doraemon Plus - Tập 7',
                thumbnail: 'https://product.hstatic.net/200000343865/product/2_69e21e81483a4b4096ab04302f0c0632_large.jpg',
                price: 19800
            },
            {
                id: 3,
                title: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 1',
                thumbnail: 'https://product.hstatic.net/200000343865/product/1_3ee6c2e85753402aa9d952a070404f3b_large.jpg',
                price: 40500
            },
            {
                id: 4,
                title: 'Doraemon Movie Story màu - Tân Nobita và nước Nhật thời nguyên thủy',
                thumbnail: 'https://product.hstatic.net/200000343865/product/doraemon-movie-story-mau_tan-nobita-va-nuoc-nhat-thoi-nguyen-thuy_bia_fe90384047734857b6955a8c97b65d06_large.jpg',
                price: 31500
            },
            {
                id: 5,
                title: 'DT Conan Kaito Kid #2',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-kaito-kid-_2_26e0ef9405354d6a888267b9b2455e5c_master.jpg',
                price: 198000
            },
            {
                id: 6,
                title: 'DT Conan Kaito Kid #1',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-kaito-kid-_1_cff6e6d6dbce4546919546a19ee501cd_master.jpg',
                price: 31500
            },
            {
                id: 7,
                title: 'DT Conan - Black Organization #2',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-black-organization-_2_29ecbf3a427d4e289487093f78cd894c_master.jpg',
                price: 198000
            },
            {
                id: 8,
                title: 'DT Conan - Black Organization #1',
                thumbnail: 'https://product.hstatic.net/200000343865/product/dt-conan-black-organization-_1_356aebcefe494f6fa9b38b8618131ba1_master.jpg',
                price: 198000
            }
        ]
    }
]);
</script>
<template>
    <body class="font-montserrat text-sm bg-white dark:bg-zinc-900 flex flex-col gap-5">
        <SlidesItem></SlidesItem>
        <div v-for="(item, index) in SectionData" :key="index" class="flex flex-col gap-5">
            <section>
                <img :src="item.banner" alt="" />
            </section>
            <div class="text-2xl text-center uppercase font-semibold">{{ item.title }}</div>

            <div class="flex min-h-screen container mx-auto 2xl:max-w-screen-2xl 2xl:mx-auto 2xl:border-x-2 2xl:border-gray-200 dark:2xl:border-zinc-700">
                <div class="py-10">
                    <ProductsGrid :data="item.items"></ProductsGrid>
                </div>
            </div>
        </div>
    </body>
</template>
