<template>
    <div class="snow-container" aria-hidden="true">
        <div v-for="i in 50" :key="i" class="snowflake"></div>
    </div>
</template>

<script setup>
// This component is purely presentational.
// The styling handles the entire animation effect.
</script>

<style lang="scss">
/* 
  This uses Sass to generate randomized properties for each snowflake,
  creating a more natural and non-repetitive snowfall effect.
*/

.snowflake {
    position: fixed;
    top: -10vh;
    z-index: 9999;
    background: white;
    border-radius: 50%;
    opacity: 0.8;
    animation: fall linear infinite;
    pointer-events: none; /* Make sure snowflakes don't interfere with clicks */
}

@keyframes fall {
    to {
        transform: translateY(110vh) translateX(var(--fall-x, 0));
        opacity: var(--opacity-end, 0.1);
    }
}

// Generate 50 snowflakes with random properties
@for $i from 1 through 50 {
    .snowflake:nth-child(#{$i}) {
        --size: #{random(4) + 2}px; // Snowflakes between 2px and 6px
        width: var(--size);
        height: var(--size);
        left: #{random(100)}vw;
        animation-duration: #{random(10) + 10}s; // Duration between 10s and 20s
        animation-delay: -#{random(20)}s; // Start at random points in the animation
        --opacity-end: #{random(2) / 10}; // End opacity between 0.0 and 0.2
        --fall-x: #{(random(40) - 20)}vw; // Horizontal drift
    }
}
</style>
