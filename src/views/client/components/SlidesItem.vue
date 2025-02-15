<template>
    <swiper :modules="[Autoplay, Navigation, Pagination]" :slides-per-view="1" :space-between="10" :loop="true" :autoplay="{ delay: 5000, disableOnInteraction: false }" :pagination="{ clickable: true }" :navigation="true" class="mySwiper">
        <swiper-slide v-for="(image, index) in images" :key="index">
            <img :src="image.link" alt="Slide image" class="slide-image" />
        </swiper-slide>
    </swiper>
</template>
<script setup>
import image3 from '@/assets/img/1.webp';
import image7 from '@/assets/img/2.webp';
import image5 from '@/assets/img/3.webp';
import image6 from '@/assets/img/4.webp';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
const images = [
    {
        link: image3
    },
    {
        link: image7
    },
    {
        link: image5
    },
    {
        link: image6
    }
];
</script>
<style>
.mySwiper {
    width: 80%;
    height: 600px;
    border-radius: 25px;
}
.slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
