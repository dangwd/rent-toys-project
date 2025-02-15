<script setup>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const videoElement = ref(null);
let player = null;

const props = defineProps(['url']);
onMounted(() => {
    player = videojs(videoElement.value, {
        controls: true,
        autoplay: false,
        fluid: true,
        responsive: true,
        sources: [
            {
                src: props.url,
                type: 'application/x-mpegURL'
            }
        ]
    });
});

onBeforeUnmount(() => {
    if (player) {
        player.dispose();
    }
});
</script>

<template>
    <div>
        <video ref="videoElement" class="video-js vjs-theme-forest"></video>
    </div>
</template>

<style></style>
