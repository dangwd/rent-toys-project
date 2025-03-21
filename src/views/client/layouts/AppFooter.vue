<template>
    <div class="container mx-auto h-auto p-3">
        <div class="grid grid-cols-12">
            <div class="col-span-7 flex flex-col gap-3">
                <img height="200" width="200" src="https://www.mykingdom.com.vn/cdn/shop/files/LOGO_477ead77-117e-48bb-ab79-6bc282183e5b.png?v=1741751960" alt="" />
                <strong>Tham gia ngay để nhận về tay thông tin ưu đãi và hữu ích từ Mykingdom</strong>
            </div>
            <div class="col-span-5">
                <div class="flex flex-col gap-3">
                    <span class="text-xl font-semibold text-primary">Follow Us</span>
                    <div class="flex justify-between w-[50%]">
                        <img v-for="i in socialMedia" width="40" class="object-cover rounded-lg" :src="i" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
const socialMedia = ref([
    'https://cdn-icons-png.flaticon.com/256/124/124010.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/640px-Instagram_icon.png',
    'https://static-00.iconduck.com/assets.00/tiktok-icon-1890x2048-ihin0vop.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png'
]);
</script>
<style >
</style>