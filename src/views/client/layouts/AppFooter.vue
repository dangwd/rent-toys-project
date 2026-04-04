<script setup>
import { ref } from 'vue';
const socialMedia = ref([
    { icon: 'pi-facebook', url: '#' },
    { icon: 'pi-instagram', url: '#' },
    { icon: 'pi-youtube', url: '#' },
    { icon: 'pi-twitter', url: '#' }
]);
const year = new Date().getFullYear();
</script>

<template>
    <footer class="bg-gray-900 text-white dark:bg-zinc-900">
        <div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-12">
                <!-- Logo and Slogan -->
                <div class="lg:col-span-4">
                    <router-link to="/client" class="flex-shrink-0">
                        <img width="160" src="/src/assets/img/logo.avif" alt="Rent Toys Logo" />
                    </router-link>
                    <p class="mt-4 text-gray-400">Nơi trí tưởng tượng của bé bay cao.</p>
                    <div class="mt-6 flex gap-4">
                        <a v-for="social in socialMedia" :key="social.icon" :href="social.url" target="_blank" class="text-gray-400 transition hover:text-indigo-400">
                            <span class="sr-only">{{ social.icon }}</span>
                            <i class="pi" :class="social.icon" style="font-size: 1.5rem"></i>
                        </a>
                    </div>
                </div>

                <!-- Links -->
                <div class="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-4 lg:grid-cols-3">
                    <div>
                        <p class="font-bold text-white">Cửa Hàng</p>
                        <ul class="mt-4 space-y-2 text-sm">
                            <li><a href="#" class="text-gray-400 transition hover:text-white">Sản Phẩm Mới</a></li>
                            <li><a href="#" class="text-gray-400 transition hover:text-white">Bán Chạy</a></li>
                            <li><a href="#" class="text-gray-400 transition hover:text-white">Khuyến Mãi</a></li>
                        </ul>
                    </div>
                    <div>
                        <p class="font-bold text-white">Về Chúng Tôi</p>
                        <ul class="mt-4 space-y-2 text-sm">
                            <li><a href="#" class="text-gray-400 transition hover:text-white">Câu Chuyện</a></li>
                            <li><a href="#" class="text-gray-400 transition hover:text-white">Liên Hệ</a></li>
                            <li><a href="#" class="text-gray-400 transition hover:text-white">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <p class="font-bold text-white">Hỗ Trợ</p>
                        <ul class="mt-4 space-y-2 text-sm">
                            <li><a href="#" class="text-gray-400 transition hover:text-white">Chính Sách</a></li>
                            <li><a href="#" class="text-gray-400 transition hover:text-white">Giao Hàng</a></li>
                            <li><a href="#" class="text-gray-400 transition hover:text-white">Đổi Trả</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Newsletter -->
                <div class="md:col-span-4 lg:col-span-4">
                    <p class="font-bold text-white">Đăng ký nhận tin</p>
                    <p class="mt-2 text-sm text-gray-400">Nhận thông tin mới nhất về sản phẩm và khuyến mãi.</p>
                    <form class="mt-4">
                        <div class="flex flex-col gap-2 sm:flex-row">
                            <label for="email-newsletter" class="sr-only">Email</label>
                            <InputText id="email-newsletter" type="email" placeholder="Nhập email của bạn" class="w-full" />
                            <Button label="Đăng Ký" class="whitespace-nowrap" />
                        </div>
                    </form>
                </div>
            </div>

            <div class="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                <p>&copy; {{ year }} Rent-Toys. Đã đăng ký bản quyền.</p>
            </div>
        </div>
    </footer>
</template>