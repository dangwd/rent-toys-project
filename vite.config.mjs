import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
    // noDiscovery: true khiến socket.io-client / debug không được pre-bundle → lỗi CJS "no default export"
    optimizeDeps: {
        include: ['socket.io-client', 'engine.io-client', 'debug']
    },
    plugins: [
        vue(),
        vueDevTools(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
