<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useAuthStore } from '@/store';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
const { proxy } = getCurrentInstance();

const toast = useToast();
const store = useAuthStore();
const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const checked = ref(false);
const loginForm = ref(true);
const handleLogin = async () => {
    const data = {
        username: username.value,
        password: password.value
    };
    const res = await store.login(data);
    if (res.status === 1) {
        router.push({ name: 'home' });
    } else {
        proxy.$notify('E', res, toast);
    }
};

const handleRegister = async () => {
    const data = {
        name: username.value,
        email: email.value,
        password: password.value
    };
    const res = await store.register(data);
    if (res.status === 1) {
        proxy.$notify('S', 'Tạo tài khoản thành công!', toast);
    } else {
        console.log(res);
        proxy.$notify('E', 'Có lỗi xảy ra!', toast);
    }
};
</script>

<template>
    <FloatingConfigurator />
    <Toast />
    <div class="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <!-- Background decorative elements -->
        <div class="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div class="absolute bottom-20 right-20 w-40 h-40 bg-pink-300 rounded-full opacity-20 animate-pulse" style="animation-delay: 1s"></div>
        <div class="absolute top-1/2 right-10 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-pulse" style="animation-delay: 2s"></div>

        <div class="flex flex-col items-center justify-center relative z-10">
            <div style="border-radius: 30px; padding: 0.3rem; background: linear-gradient(135deg, #ff6b9d 0%, #ffa502 50%, #5eb3fa 100%)">
                <div class="w-full bg-white dark:bg-slate-800 py-12 px-8 sm:px-16" style="border-radius: 28px">
                    <!-- Logo and Header -->
                    <div class="text-center mb-10">
                        <div class="flex items-center justify-center gap-3 mb-4">
                            <span class="text-4xl">🎮</span>
                            <div>
                                <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">ToySmart</h1>
                                <p class="text-sm text-purple-600 dark:text-purple-300 font-medium">Kho đồ chơi bố mẹ tin tưởng</p>
                            </div>
                        </div>
                        <span class="text-slate-600 dark:text-slate-300 font-medium block mt-4">{{ loginForm ? `Đăng nhập để mua sắm!` : `Tạo tài khoản mới` }}</span>
                    </div>

                    <!-- Login Form -->
                    <div v-if="loginForm">
                        <div class="mb-6">
                            <label for="email1" class="block text-slate-700 dark:text-slate-200 text-sm font-semibold mb-2">📧 Email của bạn</label>
                            <InputText
                                id="email1"
                                type="text"
                                placeholder="example@email.com"
                                class="w-full md:w-[28rem] bg-purple-50 dark:bg-slate-700 border-2 border-purple-200 dark:border-purple-600 rounded-lg focus:border-pink-500 text-slate-800 dark:text-slate-100"
                                v-model="username"
                            />
                        </div>

                        <div class="mb-6">
                            <label for="password1" class="block text-slate-700 dark:text-slate-200 font-semibold text-sm mb-2">🔐 Mật khẩu</label>
                            <Password
                                id="password1"
                                v-model="password"
                                placeholder="Nhập mật khẩu"
                                :toggleMask="true"
                                class="w-full"
                                fluid
                                :feedback="false"
                                inputClass="bg-purple-50 dark:bg-slate-700 border-2 border-purple-200 dark:border-purple-600 rounded-lg focus:border-pink-500"
                            ></Password>
                        </div>

                        <div class="flex items-center justify-between mt-4 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1" class="text-slate-600 dark:text-slate-300 text-sm">Nhớ tôi lần sau</label>
                            </div>
                            <span class="font-medium text-sm cursor-pointer text-pink-600 hover:text-pink-700 dark:text-pink-400 transition">Quên mật khẩu?</span>
                        </div>
                        <div class="flex flex-col gap-y-3">
                            <Button
                                label="🎉 Đăng nhập"
                                class="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                                @click="handleLogin()"
                            ></Button>
                            <Button label="Chưa có tài khoản? Đăng ký ngay" text class="w-full text-purple-600 dark:text-purple-300 hover:text-purple-700 font-medium text-sm hover:underline" @click="loginForm = !loginForm"></Button>
                        </div>
                    </div>

                    <!-- Register Form -->
                    <div v-else>
                        <div class="mb-6">
                            <label for="username" class="block text-slate-700 dark:text-slate-200 text-sm font-semibold mb-2">👤 Tên người dùng</label>
                            <InputText
                                id="username"
                                type="text"
                                placeholder="Chọn tên hiển thị"
                                class="w-full md:w-[28rem] bg-purple-50 dark:bg-slate-700 border-2 border-purple-200 dark:border-purple-600 rounded-lg focus:border-pink-500 text-slate-800 dark:text-slate-100"
                                v-model="username"
                            />
                        </div>

                        <div class="mb-6">
                            <label for="email2" class="block text-slate-700 dark:text-slate-200 text-sm font-semibold mb-2">📧 Email của bạn</label>
                            <InputText
                                id="email2"
                                type="email"
                                placeholder="example@email.com"
                                class="w-full md:w-[28rem] bg-purple-50 dark:bg-slate-700 border-2 border-purple-200 dark:border-purple-600 rounded-lg focus:border-pink-500 text-slate-800 dark:text-slate-100"
                                v-model="email"
                            />
                        </div>

                        <div class="mb-6">
                            <label for="password2" class="block text-slate-700 dark:text-slate-200 font-semibold text-sm mb-2">🔐 Mật khẩu</label>
                            <Password
                                id="password2"
                                v-model="password"
                                placeholder="Nhập mật khẩu"
                                :toggleMask="true"
                                class="w-full"
                                fluid
                                :feedback="false"
                                inputClass="bg-purple-50 dark:bg-slate-700 border-2 border-purple-200 dark:border-purple-600 rounded-lg focus:border-pink-500"
                            ></Password>
                        </div>

                        <div class="flex items-center justify-between mt-4 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme2" binary class="mr-2"></Checkbox>
                                <label for="rememberme2" class="text-slate-600 dark:text-slate-300 text-sm">Tôi đồng ý với điều khoản</label>
                            </div>
                        </div>
                        <div class="flex flex-col gap-y-3">
                            <Button
                                label="✨ Tạo tài khoản"
                                class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                                @click="handleRegister()"
                            ></Button>
                            <Button label="Quay lại đăng nhập" text class="w-full text-purple-600 dark:text-purple-300 hover:text-purple-700 font-medium text-sm hover:underline" @click="loginForm = !loginForm"></Button>
                        </div>
                    </div>

                    <!-- Info section -->
                    <div class="mt-10 pt-6 border-t border-purple-200 dark:border-purple-700">
                        <p class="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">🎁 Đăng nhập để nhận <span class="font-bold text-pink-600 dark:text-pink-400">voucher 10%</span> cho lần mua hàng đầu tiên</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
