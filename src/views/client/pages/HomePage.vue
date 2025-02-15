<script setup>
import { ref } from 'vue';
import banner2 from '../../../assets/img/banner4.webp';
import ProductsGrid from '../components/ProductsGrid.vue';
import SlidesItem from '../components/SlidesItem.vue';
const SectionData = ref([
    {
        title: 'Ưu đãi độc quyền online từ 15-21/02',
        banner: banner2,
        items: [
            {
                id: 1,
                title: 'Đồ chơi lắp ráp Siêu Xe Lamborghini Huracán Tecnica LEGO TECHNIC 42161',
                thumbnail: 'https://www.mykingdom.com.vn/cdn/shop/files/42161_d5649b1a-7db4-47a5-b841-02ba476300c9.jpg?v=1725519736&width=990',
                price: 31500
            },
            {
                id: 2,
                title: 'Đồ chơi mô hình tỷ lệ 1:16 xe tải cần cẩu SCANIA BRUDER BRU03570',
                thumbnail: 'https://www.mykingdom.com.vn/cdn/shop/files/BRU03570.jpg?v=1736388709&width=990',
                price: 19800
            },
            {
                id: 3,
                title: 'Xe scooter 3 bánh light up HF-6405B Xanh HF-6405B',
                thumbnail: 'https://www.mykingdom.com.vn/cdn/shop/files/2ad9cbc8a5456c3f1b748b94b6eb622d.jpg?v=1706828979&width=990',
                price: 40500
            },
            {
                id: 4,
                title: 'Đồ chơi lắp ráp Tàu vũ trụ chở hàng VTOL LT81 LEGO TECHNIC 42181',
                thumbnail: 'https://www.mykingdom.com.vn/cdn/shop/files/42181.jpg?v=1725613327&width=990',
                price: 31500
            },
            {
                id: 5,
                title: 'Giá Đỡ Điều Chỉnh Tư Thế Ngồi Pro-Posture Xanh CLEVERHIPPO PP2401',
                thumbnail: 'https://www.mykingdom.com.vn/cdn/shop/files/gia-do-dieu-chinh-tu-the-ngoi-pro-posture-xanh-cleverhippo-pp2401.jpg?v=1719828975&width=990',
                price: 198000
            },
            {
                id: 6,
                title: 'Đồ Chơi Lắp Ráp Thùng Gạch Trung Classic Sáng Tạo LEGO CLASSIC 10696',
                thumbnail: 'https://www.mykingdom.com.vn/cdn/shop/files/10696_7d115577-7174-438d-9b64-a520c1674914.jpg?v=1725529622&width=990',
                price: 31500
            },
            {
                id: 7,
                title: 'Đồ Chơi Lắp Ráp Tàu Tốc Hành Vận Chuyển Hành Khách LEGO CITY 60337',
                thumbnail: 'https://www.mykingdom.com.vn/cdn/shop/files/60337_d481fb65-037b-4493-b7ea-67f345a6f69c.jpg?v=1725530007&width=990',
                price: 198000
            },
            {
                id: 8,
                title: 'Con Quay BX-31 Random Booster Vol.3 BEYBLADE X 914532',
                thumbnail: 'https://www.mykingdom.com.vn/cdn/shop/files/con-quay-bx-31-random-booster-vol-3-beyblade-x-914532_2.jpg?v=1727152377&width=990',
                price: 198000
            }
        ]
    }
]);
</script>
<template>
    <body class="font-montserrat text-sm bg-white dark:bg-zinc-900 flex flex-col gap-5">
        <div class="py-5">
            <SlidesItem></SlidesItem>
        </div>
        <div v-for="(item, index) in SectionData" :key="index" class="flex flex-col gap-5">
            <section class="w-full container mx-auto">
                <img :src="item.banner" class="rounded-xl" />
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
