<template>
    <router-link :to="`/client/detail/${props.data._id}`">
        <CardItem :data="props.data"></CardItem>
    </router-link>
</template>
<script setup>
import { onMounted } from 'vue';
import CardItem from './CardItem.vue';
const props = defineProps(['data']);
</script>
<style></style>
