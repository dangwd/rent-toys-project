<template>
    <swiper
        v-if="images?.length > 0"
        :modules="[Autoplay, Navigation, Pagination]"
        :slides-per-view="1"
        :space-between="10"
        :loop="true"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        class="mySwiper mt-10"
    >
        <swiper-slide v-for="(image, index) in images" :key="index">
            <img :src="image" alt="Slide image" class="slide-image" />
        </swiper-slide>
    </swiper>
</template>
<script setup>
import apiMain from '@/api/api-main';
import { onMounted, ref } from 'vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
const images = ref([]);

onMounted(() => {
    fetchBanners();
});
const fetchBanners = async () => {
    try {
        const res = await apiMain.get(`branners`);
        images.value = res.data.metadata.map((el) => el.images).flatMap((el) => el);
    } catch (error) {
        console.log(error);
    }
};
</script>
<style>
.mySwiper {
    width: 90%;
    height: 100%;
    border-radius: 25px;
}
.slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
