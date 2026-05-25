<script setup>
defineProps({ tier: { type: String, default: 'bronze' } })
// SVG viewBox: 0 0 110 110  —  avatar circle: center(55,55) r=40
// Rings start at r=40 (avatar edge) so the frame "hugs" the avatar like a border.
</script>

<template>
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
            <linearGradient id="b-g" x1="0" y1="0" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stop-color="#cd7f32"/>
                <stop offset="28%"  stop-color="#92400e"/>
                <stop offset="55%"  stop-color="#fbbf24"/>
                <stop offset="80%"  stop-color="#b45309"/>
                <stop offset="100%" stop-color="#cd7f32"/>
            </linearGradient>
            <linearGradient id="s-g" x1="0" y1="0" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stop-color="#94a3b8"/>
                <stop offset="30%"  stop-color="#f1f5f9"/>
                <stop offset="60%"  stop-color="#64748b"/>
                <stop offset="100%" stop-color="#cbd5e1"/>
            </linearGradient>
            <linearGradient id="g-g" x1="0" y1="0" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stop-color="#f59e0b"/>
                <stop offset="25%"  stop-color="#fde68a"/>
                <stop offset="55%"  stop-color="#d97706"/>
                <stop offset="80%"  stop-color="#fbbf24"/>
                <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
            <linearGradient id="p-g" x1="0" y1="0" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stop-color="#7c3aed"/>
                <stop offset="25%"  stop-color="#c4b5fd"/>
                <stop offset="55%"  stop-color="#4c1d95"/>
                <stop offset="80%"  stop-color="#a78bfa"/>
                <stop offset="100%" stop-color="#7c3aed"/>
            </linearGradient>
            <radialGradient id="p-halo" cx="55" cy="55" r="55" gradientUnits="userSpaceOnUse">
                <stop offset="60%"  stop-color="transparent"/>
                <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.25"/>
            </radialGradient>
            <radialGradient id="p-gem-rg" cx="40%" cy="30%" r="65%">
                <stop offset="0%"   stop-color="#ede9fe"/>
                <stop offset="55%"  stop-color="#8b5cf6"/>
                <stop offset="100%" stop-color="#4c1d95"/>
            </radialGradient>
        </defs>

        <!-- ══════════════════════════════════════════
             BRONZE  —  thick ring + cross rivets
             Main ring: r=44 sw=8 → inner edge r=40 = avatar edge
        ══════════════════════════════════════════ -->
        <g v-if="tier === 'bronze'">
            <!-- hair-line inner accent at avatar edge -->
            <circle cx="55" cy="55" r="41" stroke="#fbbf24" stroke-width="1" stroke-dasharray="4 3" opacity="0.45"/>
            <!-- main border ring (inner edge = r=40) -->
            <circle cx="55" cy="55" r="44" stroke="url(#b-g)" stroke-width="8"/>
            <!-- rivet N -->
            <circle cx="55"  cy="11" r="4.5" fill="#cd7f32" stroke="#7c2d12" stroke-width="1.5"/>
            <line x1="55" y1="8.5"  x2="55" y2="13.5"  stroke="#7c2d12" stroke-width="1"/>
            <line x1="52.5" y1="11" x2="57.5" y2="11"  stroke="#7c2d12" stroke-width="1"/>
            <!-- rivet E -->
            <circle cx="99"  cy="55" r="4.5" fill="#cd7f32" stroke="#7c2d12" stroke-width="1.5"/>
            <line x1="99" y1="52.5" x2="99" y2="57.5"  stroke="#7c2d12" stroke-width="1"/>
            <line x1="96.5" y1="55" x2="101.5" y2="55" stroke="#7c2d12" stroke-width="1"/>
            <!-- rivet S -->
            <circle cx="55"  cy="99" r="4.5" fill="#cd7f32" stroke="#7c2d12" stroke-width="1.5"/>
            <line x1="55" y1="96.5" x2="55" y2="101.5" stroke="#7c2d12" stroke-width="1"/>
            <line x1="52.5" y1="99" x2="57.5" y2="99"  stroke="#7c2d12" stroke-width="1"/>
            <!-- rivet W -->
            <circle cx="11"  cy="55" r="4.5" fill="#cd7f32" stroke="#7c2d12" stroke-width="1.5"/>
            <line x1="11" y1="52.5" x2="11" y2="57.5"  stroke="#7c2d12" stroke-width="1"/>
            <line x1="8.5"  y1="55" x2="13.5" y2="55"  stroke="#7c2d12" stroke-width="1"/>
        </g>

        <!-- ══════════════════════════════════════════
             SILVER  —  double ring + sharp notches + diagonal marks
        ══════════════════════════════════════════ -->
        <g v-else-if="tier === 'silver'">
            <!-- inner ring at avatar edge -->
            <circle cx="55" cy="55" r="41.5" stroke="url(#s-g)" stroke-width="2"/>
            <!-- outer ring -->
            <circle cx="55" cy="55" r="47"   stroke="url(#s-g)" stroke-width="4.5"/>
            <!-- N notch -->
            <polygon points="55,4 49,13 61,13" fill="url(#s-g)"/>
            <!-- E notch -->
            <polygon points="106,55 97,49 97,61" fill="url(#s-g)"/>
            <!-- S notch -->
            <polygon points="55,106 49,97 61,97" fill="url(#s-g)"/>
            <!-- W notch -->
            <polygon points="4,55 13,49 13,61" fill="url(#s-g)"/>
            <!-- 45° diagonal accents -->
            <line x1="17" y1="17" x2="23" y2="23" stroke="url(#s-g)" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
            <line x1="93" y1="17" x2="87" y2="23" stroke="url(#s-g)" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
            <line x1="17" y1="93" x2="23" y2="87" stroke="url(#s-g)" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
            <line x1="93" y1="93" x2="87" y2="87" stroke="url(#s-g)" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
        </g>

        <!-- ══════════════════════════════════════════
             GOLD  —  double ring + diamond N/S + wing E/W
        ══════════════════════════════════════════ -->
        <g v-else-if="tier === 'gold'">
            <!-- inner ring at avatar edge -->
            <circle cx="55" cy="55" r="41.5" stroke="url(#g-g)" stroke-width="2"/>
            <!-- outer ring -->
            <circle cx="55" cy="55" r="47"   stroke="url(#g-g)" stroke-width="5.5"/>
            <!-- diamond N -->
            <polygon points="55,2 62,12 55,18 48,12" fill="url(#g-g)"/>
            <!-- diamond S -->
            <polygon points="55,108 62,98 55,92 48,98" fill="url(#g-g)"/>
            <!-- wing W -->
            <path d="M15,55 Q5,44 3,55 Q5,66 15,55Z" fill="url(#g-g)"/>
            <path d="M14,55 Q7,48 5,55 Q7,62 14,55Z" fill="none" stroke="#fde68a" stroke-width="0.8" opacity="0.5"/>
            <!-- wing E -->
            <path d="M95,55 Q105,44 107,55 Q105,66 95,55Z" fill="url(#g-g)"/>
            <path d="M96,55 Q103,48 105,55 Q103,62 96,55Z" fill="none" stroke="#fde68a" stroke-width="0.8" opacity="0.5"/>
            <!-- 45° corner dots -->
            <circle cx="18" cy="18" r="2.8" fill="#fbbf24" opacity="0.85"/>
            <circle cx="92" cy="18" r="2.8" fill="#fbbf24" opacity="0.85"/>
            <circle cx="18" cy="92" r="2.8" fill="#fbbf24" opacity="0.85"/>
            <circle cx="92" cy="92" r="2.8" fill="#fbbf24" opacity="0.85"/>
        </g>

        <!-- ══════════════════════════════════════════
             PLATINUM  —  triple rings + rotating outer + crown + 6 pulsing gems + sparkles
        ══════════════════════════════════════════ -->
        <g v-else-if="tier === 'platinum'">
            <!-- halo glow -->
            <circle cx="55" cy="55" r="55" fill="url(#p-halo)"/>
            <!-- inner static rings -->
            <circle cx="55" cy="55" r="41.5" stroke="url(#p-g)" stroke-width="1"   opacity="0.5"/>
            <circle cx="55" cy="55" r="45"   stroke="url(#p-g)" stroke-width="1.5" opacity="0.75"/>
            <!-- rotating outer ring + ticks -->
            <g class="plat-spin">
                <circle cx="55" cy="55" r="50" stroke="url(#p-g)" stroke-width="3"/>
                <!-- 8 ticks at N/NE/E/SE/S/SW/W/NW on r=50 -->
                <rect x="53.5" y="3"   width="3" height="7" rx="1.5" fill="#c4b5fd"/>
                <rect x="53.5" y="100" width="3" height="7" rx="1.5" fill="#c4b5fd"/>
                <rect x="3"   y="53.5" width="7" height="3" rx="1.5" fill="#c4b5fd"/>
                <rect x="100" y="53.5" width="7" height="3" rx="1.5" fill="#c4b5fd"/>
                <circle cx="90.4" cy="19.6" r="2"  fill="#a78bfa" opacity="0.8"/>
                <circle cx="90.4" cy="90.4" r="2"  fill="#a78bfa" opacity="0.8"/>
                <circle cx="19.6" cy="90.4" r="2"  fill="#a78bfa" opacity="0.8"/>
                <circle cx="19.6" cy="19.6" r="2"  fill="#a78bfa" opacity="0.8"/>
            </g>
            <!-- crown base bar -->
            <rect x="39" y="10" width="32" height="4" rx="2" fill="url(#p-g)" opacity="0.85"/>
            <!-- left spire -->
            <polygon points="43,10 40,2 46,2 46,10" fill="#a78bfa" opacity="0.9"/>
            <!-- right spire -->
            <polygon points="67,10 64,2 70,2 67,10" fill="#a78bfa" opacity="0.9"/>
            <!-- centre spire -->
            <polygon points="55,10 51,0 59,0 55,10" fill="url(#p-g)"/>
            <!-- crown gem -->
            <circle cx="55" cy="4" r="4.5" fill="url(#p-gem-rg)" class="plat-gem" style="transform-origin:55px 4px"/>
            <circle cx="53.5" cy="2.5" r="1.5" fill="white" opacity="0.55"/>
            <!-- 6 pulsing gems at 60° on r=50: (55,5) (98.3,30) (98.3,80) (55,105) (11.7,80) (11.7,30) -->
            <circle cx="55"   cy="5"   r="3.8" fill="#c4b5fd" class="plat-gem" style="transform-origin:55px 5px;animation-delay:0s"/>
            <circle cx="98.3" cy="30"  r="3"   fill="#a78bfa" class="plat-gem" style="transform-origin:98.3px 30px;animation-delay:0.33s"/>
            <circle cx="98.3" cy="80"  r="3"   fill="#a78bfa" class="plat-gem" style="transform-origin:98.3px 80px;animation-delay:0.66s"/>
            <circle cx="55"   cy="105" r="3.8" fill="#c4b5fd" class="plat-gem" style="transform-origin:55px 105px;animation-delay:1s"/>
            <circle cx="11.7" cy="80"  r="3"   fill="#a78bfa" class="plat-gem" style="transform-origin:11.7px 80px;animation-delay:1.33s"/>
            <circle cx="11.7" cy="30"  r="3"   fill="#a78bfa" class="plat-gem" style="transform-origin:11.7px 30px;animation-delay:1.66s"/>
            <!-- sparkle A top-right -->
            <g class="plat-sparkle" style="animation-delay:0s">
                <line x1="84" y1="13" x2="84" y2="21" stroke="#ede9fe" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="80" y1="17" x2="88" y2="17" stroke="#ede9fe" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="81.4" y1="14.4" x2="86.6" y2="19.6" stroke="#ede9fe" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
                <line x1="86.6" y1="14.4" x2="81.4" y2="19.6" stroke="#ede9fe" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
            </g>
            <!-- sparkle B top-left -->
            <g class="plat-sparkle" style="animation-delay:1s">
                <line x1="26" y1="13" x2="26" y2="21" stroke="#ede9fe" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="22" y1="17" x2="30" y2="17" stroke="#ede9fe" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="23.4" y1="14.4" x2="28.6" y2="19.6" stroke="#ede9fe" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
                <line x1="28.6" y1="14.4" x2="23.4" y2="19.6" stroke="#ede9fe" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
            </g>
            <!-- sparkle C bottom-right -->
            <g class="plat-sparkle" style="animation-delay:2s">
                <line x1="88" y1="87" x2="88" y2="95" stroke="#ede9fe" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="84" y1="91" x2="92" y2="91" stroke="#ede9fe" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="85.4" y1="88.4" x2="90.6" y2="93.6" stroke="#ede9fe" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
                <line x1="90.6" y1="88.4" x2="85.4" y2="93.6" stroke="#ede9fe" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
            </g>
        </g>
    </svg>
</template>

<style scoped>
.plat-spin {
    transform-origin: 55px 55px;
    animation: plat-rotate 10s linear infinite;
}
.plat-gem {
    animation: plat-pulse 2s ease-in-out infinite;
}
.plat-sparkle {
    opacity: 0;
    animation: plat-twinkle 3s ease-in-out infinite;
}

@keyframes plat-rotate {
    to { transform: rotate(360deg); }
}
@keyframes plat-pulse {
    0%, 100% { opacity: 0.6;  transform: scale(0.82); }
    50%       { opacity: 1;   transform: scale(1.22); }
}
@keyframes plat-twinkle {
    0%, 100%  { opacity: 0; }
    35%, 65%  { opacity: 1; }
}
</style>
