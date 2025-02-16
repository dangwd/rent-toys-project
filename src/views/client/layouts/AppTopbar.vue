<template>
    <div class="h-32 w-full bg-primary drop-shadow-md flex flex-col gap-1 z-50 sticky top-0">
        <div class="mx-auto h-full container w-full items-center flex justify-between gap-3">
            <img class="w-auto h-10" src="../../../assets/img/logo.avif" alt="" />
            <div class="flex gap-2 w-full">
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText class="w-[700px]" v-model="value1" placeholder="Nhập từ khóa tìm kiếm..." />
                </IconField>
            </div>
            <div class="flex items-center gap-2">
                <LoginModal></LoginModal>
                <Carts></Carts>
            </div>
        </div>
        <div class="mx-auto h-full container items-center flex gap-3">
            <div class="flex gap-20 font-semibold">
                <router-link to="/client" style="transition: 0.3s ease" class="hover:text-gray-900 text-white"> Trang chủ </router-link>
                <router-link style="transition: 0.3s ease" class="hover:text-gray-900 text-white"> Hàng mới </router-link>
                <router-link style="transition: 0.3s ease" class="hover:text-gray-900 text-white"> Sản phẩm </router-link>
                <router-link style="transition: 0.3s ease" class="hover:text-gray-900 text-white"> Thương hiệu </router-link>
                <router-link style="transition: 0.3s ease" class="hover:text-gray-900 text-white"> Hàng độc quyền </router-link>
                <router-link style="transition: 0.3s ease" class="hover:text-gray-900 text-white"> Chương trình khuyến mãi </router-link>
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
