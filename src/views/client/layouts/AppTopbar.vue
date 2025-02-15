<template>
    <div class="h-32 w-full bg-white border-b border-gray-100 drop-shadow-md flex flex-col gap-1 z-50 sticky top-0">
        <div class="mx-auto h-full container w-full items-center flex justify-between gap-3">
            <img class="w-auto h-10" src="../../../assets/img/3.png" alt="" />
            <div class="flex gap-2 w-full">
                <InputText placeholder="Hôm nay đọc gì nhỉ ?" class="w-[500px]"></InputText>
                <Button icon="pi pi-search" label="Tìm kiếm" severity="info"></Button>
            </div>
            <div class="flex items-center gap-2">
                <LoginModal></LoginModal>
                <Carts></Carts>
            </div>
        </div>
        <div class="mx-auto h-full container items-center flex gap-3">
            <Button class="w-48" icon="pi pi-th-large" label="Danh mục"></Button>
            <div class="flex gap-5 font-semibold">
                <router-link to="/client" style="transition: 0.3s ease" class="hover:text-primary"> Trang chủ </router-link>
                <router-link style="transition: 0.3s ease" class="hover:text-primary"> Thể loại </router-link>
                <router-link style="transition: 0.3s ease" class="hover:text-primary"> Giảm giá </router-link>
                <router-link style="transition: 0.3s ease" class="hover:text-primary"> Mới </router-link>
                <router-link style="transition: 0.3s ease" class="hover:text-primary"> Về chúng tôi </router-link>
            </div>
            <div></div>
        </div>
    </div>
</template>
<script setup>
import Carts from '../components/Carts.vue';
import LoginModal from '../components/LoginModal.vue';
</script>
<style></style>
