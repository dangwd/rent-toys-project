<script setup>
import AppTopbar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';
</script>
<template>
    <Toast />
    <AppTopbar></AppTopbar>
    <body class="font-montserrat h-auto text-sm bg-white">
        <router-view></router-view>
    </body>
    <AppFooter></AppFooter>
</template>
