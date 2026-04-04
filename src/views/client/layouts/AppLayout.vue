<script setup>
import Snowfall from '@/components/effects/Snowfall.vue';
import AppFooter from './AppFooter.vue';
import AppTopbar from './AppTopbar.vue';
</script>
<template>
    <Toast />
    <Snowfall />
    <AppTopbar></AppTopbar>
    <div class="h-auto mx-auto  text-sm bg-white">
        <router-view></router-view>
    </div>
    <AppFooter></AppFooter>
</template>
