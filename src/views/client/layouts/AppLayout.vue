<script setup>
import AppTopbar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';
import Snowfall from '@/components/effects/Snowfall.vue';
</script>
<template>
    <Toast />
    <Snowfall />
    <AppTopbar></AppTopbar>
    <div class="h-auto text-sm bg-white">
        <router-view></router-view>
    </div>
    <AppFooter></AppFooter>
</template>
