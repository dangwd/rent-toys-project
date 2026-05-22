<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/store/index';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AppConfigurator from './AppConfigurator.vue';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const authStore = useAuthStore();
const router = useRouter();

const userName = computed(() => {
    const u = authStore.user?.metadata?.user;
    if (!u) return 'Admin';
    if (typeof u === 'string') return u;
    return u.name ?? 'Admin';
});

const userInitial = computed(() => userName.value?.[0]?.toUpperCase() ?? 'A');

async function handleLogout() {
    try {
        await authStore.logout();
    } finally {
        authStore.loginFail();
        router.push('/auth/login');
    }
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-start">
            <button class="layout-menu-button" @click="onMenuToggle" title="Toggle menu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-brand">
                <img src="@/assets/img/logo.avif" alt="Toys Store" class="topbar-logo-img" />
                <span class="topbar-brand-name">Toys Admin</span>
            </router-link>
        </div>

        <div class="layout-topbar-end">
            <button type="button" class="layout-topbar-action" @click="toggleDarkMode" :title="isDarkTheme ? 'Chế độ sáng' : 'Chế độ tối'">
                <i :class="['pi', isDarkTheme ? 'pi-sun' : 'pi-moon']"></i>
            </button>

            <div class="relative">
                <button
                    v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                    type="button"
                    class="layout-topbar-action layout-topbar-action-highlight"
                    title="Giao diện"
                >
                    <i class="pi pi-palette"></i>
                </button>
                <AppConfigurator />
            </div>

            <button type="button" class="layout-topbar-action p-overlay-badge" title="Thông báo">
                <i class="pi pi-bell"></i>
                <Badge value="4" severity="danger" />
            </button>

            <!-- User dropdown -->
            <div class="relative">
                <button
                    class="topbar-user-btn"
                    v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                >
                    <div class="topbar-user-avatar">{{ userInitial }}</div>
                    <span class="topbar-user-name">{{ userName }}</span>
                    <i class="pi pi-chevron-down topbar-user-chevron"></i>
                </button>

                <div class="topbar-user-menu hidden">
                    <div class="topbar-user-menu-header">
                        <div class="topbar-user-avatar topbar-user-avatar-lg">{{ userInitial }}</div>
                        <div>
                            <div class="topbar-user-menu-name">{{ userName }}</div>
                            <div class="topbar-user-menu-role">Quản trị viên</div>
                        </div>
                    </div>
                    <div class="topbar-user-menu-divider"></div>
                    <button type="button" class="topbar-user-menu-item danger" @click="handleLogout">
                        <i class="pi pi-sign-out"></i>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
