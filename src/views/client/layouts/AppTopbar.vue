<script setup>
import API from '@/api/api-main';
import NotificationBell from '@/components/NotificationBell.vue';
import { formatPrice } from '@/helper/formatPrice';
import { useAuthStore } from '@/store';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Carts from '../components/Carts.vue';
import LoginModal from '../components/LoginModal.vue';

const router = useRouter();
const route = useRoute();
const isScrolled = ref(false);
const itemSearch = ref([]);
const value = ref('');
const showMobileNav = ref(false); // Changed from showMobileSearch
const showQuickMenu = ref(false);
const quickMenuRef = ref(null);
const authStore = useAuthStore();

const currentUser = computed(() => authStore?.user?.metadata?.user || null);
const avatarUrl = computed(() => currentUser.value?.thumbnail || null);
const displayName = computed(() => currentUser.value?.name || currentUser.value?.email || 'Tài khoản');

const logout = async () => {
    try {
        await authStore.logout?.();
    } catch (e) {
        // ignore
    }
    localStorage.removeItem('user');
    showQuickMenu.value = false;
    router.push('/auth/login');
};

const navLinks = ref([
    { to: '/client', label: 'Trang chủ', icon: 'pi pi-home' },
    { to: '/client/products-list', label: 'Sản phẩm', icon: 'pi pi-th-large' },
    { to: '/client/new-products', label: 'Hàng Mới', icon: 'pi pi-sparkles' },
    { to: '/client/brands-page', label: 'Thương hiệu', icon: 'pi pi-tag' },
    { to: '/client/monopoly', label: 'Sale', icon: 'pi pi-bolt' }
]);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 10;
};

const search = async () => {
    if (!value.value.trim()) {
        itemSearch.value = [];
        return;
    }
    try {
        const res = await API.get(`products?search=${value.value}`);
        itemSearch.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', onGlobalClick);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('click', onGlobalClick);
});

const onGlobalClick = (e) => {
    if (!showQuickMenu.value) return;
    const el = quickMenuRef.value;
    if (el && !el.contains(e.target)) showQuickMenu.value = false;
};

// Close mobile nav on route change
watch(
    () => route.path,
    () => {
        showMobileNav.value = false;
        showQuickMenu.value = false;
    }
);
</script>

<template>
    <header
        :class="{ 'shadow-md': isScrolled, 'shadow-sm': !isScrolled }"
        class="fixed left-0 right-0 top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-lg transition-shadow duration-300 ease-in-out dark:border-zinc-700/80 dark:bg-zinc-900/80"
    >
        <!-- Top Bar -->
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-20 items-center justify-between">
                <!-- Logo -->
                <router-link to="/client" class="flex-shrink-0 duration-300 ease-out transition-transform hover:scale-105">
                    <div class="flex items-center gap-2">
                        <img width="140" src="../../../assets/img/logo.avif" alt="Rent Toys Logo" class="h-14 object-contain" />
                    </div>
                </router-link>

                <!-- Desktop Navigation Menu -->
                <nav class="hidden lg:flex lg:h-full lg:items-center lg:justify-center">
                    <div class="flex h-full items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                        <router-link
                            v-for="link in navLinks"
                            :key="link.to"
                            :to="link.to"
                            class="nav-link relative flex h-full items-center px-3 text-sm transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            active-class="!text-indigo-600 dark:!text-indigo-400"
                        >
                            <span>{{ link.label }}</span>
                            <span v-if="link.label === 'Sale'" class="ml-2 rounded-md bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/50 dark:text-red-300">Hot</span>
                        </router-link>
                    </div>
                </nav>

                <!-- Right Side -->
                <div class="flex items-center gap-2 sm:gap-4">
                    <!-- Desktop Search Bar -->
                    <div class="relative hidden sm:block">
                        <!-- <InputText v-model="value" @input="search" placeholder="Tìm kiếm..." class="w-40 rounded-full bg-gray-100 px-4 py-2 text-sm transition-all duration-300 focus:w-64 dark:bg-zinc-800" /> -->
                        <!-- <i class="pi pi-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i> -->
                        <!-- Autocomplete Panel for Search -->
                        <div v-if="value && itemSearch.length" class="absolute right-0 top-full z-10 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
                            <div
                                v-for="item in itemSearch"
                                :key="item._id"
                                @click="
                                    () => {
                                        router.push(`/client/detail/${item._id}`);
                                        value = '';
                                        itemSearch = [];
                                    }
                                "
                                class="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                <img :src="item.images ? item.images[0] : ''" class="h-12 w-12 rounded-md object-cover" alt="" />
                                <div class="flex-1">
                                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ item.productName }}</p>
                                    <p class="text-sm font-bold text-indigo-600">{{ formatPrice(item.price) }} đ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Login & Cart -->
                    <NotificationBell :isScrolled="isScrolled" />

                    <!-- Avatar menu (Account + Cart) -->
                    <div ref="quickMenuRef" class="relative">
                        <button
                            type="button"
                            @click.stop="showQuickMenu = !showQuickMenu"
                            class="flex items-center gap-2 rounded-full p-1.5 text-gray-700 transition-all duration-300 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                            aria-label="Mở menu tài khoản"
                        >
                            <Avatar v-if="avatarUrl" crossorigin="anonymous" :image="avatarUrl" shape="circle" class="h-9 w-9 overflow-hidden object-cover" />
                            <Avatar v-else icon="pi pi-user" shape="circle" class="h-9 w-9" />
                            <span class="hidden max-w-36 truncate text-sm font-semibold sm:block">{{ displayName }}</span>
                            <i class="pi pi-angle-down text-xs opacity-70"></i>
                        </button>

                        <div v-if="showQuickMenu" class="absolute right-0 top-full z-20 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                            <div v-if="currentUser" class="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-zinc-800/70">
                                <Avatar v-if="avatarUrl" crossorigin="anonymous" :image="avatarUrl" size="large" shape="circle" class="overflow-hidden object-cover" />
                                <Avatar v-else icon="pi pi-user" size="large" shape="circle" />
                                <div class="min-w-0">
                                    <p class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{{ currentUser?.name || 'Khách hàng' }}</p>
                                    <p class="truncate text-xs text-gray-600 dark:text-gray-300">{{ currentUser?.email }}</p>
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <template v-if="currentUser">
                                    <button
                                        v-if="currentUser?.role === 'A'"
                                        type="button"
                                        @click="
                                            router.push('/');
                                            showQuickMenu = false;
                                        "
                                        class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                                    >
                                        <i class="pi pi-chart-pie"></i>
                                        <span>Trang quản trị</span>
                                    </button>
                                    <button
                                        type="button"
                                        @click="
                                            router.push('/client/order-list');
                                            showQuickMenu = false;
                                        "
                                        class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                                    >
                                        <i class="pi pi-user"></i>
                                        <span>Thông tin tài khoản</span>
                                    </button>
                                    <button
                                        type="button"
                                        @click="
                                            router.push('/client/orders');
                                            showQuickMenu = false;
                                        "
                                        class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800"
                                    >
                                        <i class="pi pi-list"></i>
                                        <span>Đơn hàng của bạn</span>
                                    </button>
                                    <button type="button" @click="logout" class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <i class="pi pi-sign-out"></i>
                                        <span>Đăng xuất</span>
                                    </button>
                                </template>
                                <template v-else>
                                    <LoginModal :isScrolled="isScrolled" />
                                </template>

                                <div class="h-px bg-gray-200 dark:bg-zinc-700"></div>
                                <Carts :isScrolled="isScrolled" />
                            </div>
                        </div>
                    </div>

                    <!-- Mobile Hamburger Menu -->
                    <button @click="showMobileNav = !showMobileNav" class="p-2.5 text-gray-700 transition-all duration-300 dark:text-gray-200 lg:hidden">
                        <i class="pi" :class="showMobileNav ? 'pi-times' : 'pi-bars'"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Navigation Panel -->
        <transition name="slide-fade">
            <div v-if="showMobileNav" class="border-t border-gray-200 dark:border-zinc-700 lg:hidden">
                <nav class="flex flex-col gap-1 p-4">
                    <router-link
                        v-for="link in navLinks"
                        :key="link.to"
                        :to="link.to"
                        class="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-zinc-800"
                        active-class="!bg-indigo-50 !text-indigo-600 dark:!bg-zinc-800 dark:!text-indigo-400"
                    >
                        <i :class="link.icon" class="w-6 text-center text-lg"></i>
                        <span>{{ link.label }}</span>
                        <span v-if="link.label === 'Sale'" class="ml-auto rounded-md bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-900/50 dark:text-red-300">Hot</span>
                    </router-link>
                </nav>
            </div>
        </transition>
    </header>

    <!-- Spacer to prevent content overlap -->
    <div class="h-20"></div>
</template>

<style scoped>
.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #818cf8, #6366f1);
    border-radius: 2px;
    transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-link.router-link-exact-active::after,
.nav-link:hover::after {
    width: 60%;
}

/* Slide-Fade Animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>
