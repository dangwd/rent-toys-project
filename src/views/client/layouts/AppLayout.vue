<script setup>
import AppTopbar from './AppTopbar.vue';
</script>
<template>
    <Toast />
    <AppTopbar></AppTopbar>
    <body class="font-montserrat text-sm bg-white">
        <router-view></router-view>
    </body>
</template>
