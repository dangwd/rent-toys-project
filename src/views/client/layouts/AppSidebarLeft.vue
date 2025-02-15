<template>
    <div class="flex flex-col justify-between h-[92vh]">
        <div class="flex flex-col gap-y-2">
            <div class="font-bold text-lg flex items-center gap-x-3 w-full">
                <svg class="h-8 w-8 fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M10 15.5v-7c0-.41.47-.65.8-.4l4.67 3.5c.27.2.27.6 0 .8l-4.67 3.5c-.33.25-.8.01-.8-.4Zm11.96-4.45c.58 6.26-4.64 11.48-10.9 10.9 -4.43-.41-8.12-3.85-8.9-8.23 -.26-1.42-.19-2.78.12-4.04 .14-.58.76-.9 1.31-.7v0c.47.17.75.67.63 1.16 -.2.82-.27 1.7-.19 2.61 .37 4.04 3.89 7.25 7.95 7.26 4.79.01 8.61-4.21 7.94-9.12 -.51-3.7-3.66-6.62-7.39-6.86 -.83-.06-1.63.02-2.38.2 -.49.11-.99-.16-1.16-.64v0c-.2-.56.12-1.17.69-1.31 1.79-.43 3.75-.41 5.78.37 3.56 1.35 6.15 4.62 6.5 8.4ZM5.5 4C4.67 4 4 4.67 4 5.5 4 6.33 4.67 7 5.5 7 6.33 7 7 6.33 7 5.5 7 4.67 6.33 4 5.5 4Z"
                    ></path>
                </svg>
                <div class="tracking-wide dark:text-white">WMovie<span class="text-primary">.</span></div>
            </div>
            <ul class="layout-menu">
                <template v-for="(item, i) in model" :key="item">
                    <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                    <li v-if="item.separator" class="menu-separator"></li>
                </template>
            </ul>
        </div>
        <div v-if="currentUser" class="card py-3 px-4 border rounded-2xl flex justify-between items-center shadow-xl">
            <div class="flex items-center">
                <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                <span>{{ currentUser.email }}</span>
            </div>
            <Button @click="handleLogout" text icon="pi pi-sign-out"></Button>
        </div>
        <div v-else class="card py-3 px-4 flex items-center rounded-2xl shadow-xl">
            <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            <router-link to="/auth/login">Đăng nhập</router-link>
        </div>
    </div>
</template>
<script setup>
import { useAuthStore } from '@/store';
import AppMenuItem from '../../../layout/AppMenuItem.vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
const store = useAuthStore();
const router = useRouter();
const currentUser = store?.user?.metadata.user;
const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Trang chủ', icon: 'pi pi-fw pi-home', to: '/client' }]
    }
]);

const handleLogout = async () => {
    localStorage.removeItem('user');
    router.push({ name: 'login' });
};
</script>
<style></style>
