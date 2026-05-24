<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Tổng quan',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Báo cáo doanh thu', icon: 'pi pi-fw pi-chart-line', to: '/man/revenue-report' }
        ]
    },
    {
        label: 'Quản lý',
        items: [
            { label: 'Người dùng', icon: 'pi pi-fw pi-users', to: '/man/users' },
            { label: 'Sản phẩm', icon: 'pi pi-fw pi-box', to: '/man/products' },
            { label: 'Đơn hàng', icon: 'pi pi-fw pi-file-edit', to: '/man/invoice' },
            { label: 'Coupon', icon: 'pi pi-fw pi-ticket', to: '/man/coupon' },
            { label: 'Banner', icon: 'pi pi-fw pi-image', to: '/man/banners' }
        ]
    },
    {
        label: 'Danh mục',
        items: [
            { label: 'Thương hiệu', icon: 'pi pi-fw pi-tag', to: '/man/brands' },
            { label: 'Thể loại', icon: 'pi pi-fw pi-list', to: '/man/genres' }
        ]
    },
    {
        label: 'Khác',
        items: [{ label: 'Trang khách hàng', icon: 'pi pi-fw pi-globe', to: '/client' }]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" />
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>
