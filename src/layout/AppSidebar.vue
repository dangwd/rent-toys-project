<script setup>
import AppMenu from './AppMenu.vue';
</script>

<template>
    <div class="layout-sidebar">
        <router-link to="/" class="sidebar-header">
            <img src="@/assets/img/logo.avif" alt="Toys Store" class="sidebar-logo" />
            <div class="sidebar-brand-text">
                <span class="sidebar-brand-name">Toys Store</span>
                <span class="sidebar-brand-sub">Admin Dashboard</span>
            </div>
        </router-link>
        <div class="sidebar-menu-wrap">
            <app-menu />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.sidebar-header {
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: background-color var(--element-transition-duration);
    cursor: pointer;

    &:hover { background-color: var(--surface-hover); }
}
</style>
