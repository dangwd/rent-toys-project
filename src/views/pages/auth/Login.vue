<script setup>
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
const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;
    const data = { username: username.value, password: password.value };
    const res = await store.login(data);
    loading.value = false;
    if (res.status === 1) {
        router.push({ name: 'home' });
    } else {
        proxy.$notify('E', res.message?.response.data?.message || 'Lỗi hệ thống', toast);
    }
};

const handleRegister = async () => {
    loading.value = true;
    const data = { name: username.value, email: email.value, password: password.value };
    const res = await store.register(data);
    loading.value = false;
    if (res.status === 1) {
        proxy.$notify('S', 'Tạo tài khoản thành công!', toast);
        loginForm.value = true;
    } else {
        proxy.$notify('E', res.message?.response.data?.message || 'Lỗi hệ thống', toast);
    }
};

const switchForm = () => {
    loginForm.value = !loginForm.value;
    username.value = '';
    email.value = '';
    password.value = '';
};
</script>

<template>
    <Toast />
    <div class="min-h-screen flex bg-gray-50 dark:bg-zinc-950">
        <!-- Left Panel -->
        <div class="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-indigo-600 relative overflow-hidden">
            <!-- Background pattern -->
            <div class="absolute inset-0 opacity-10">
                <div
                    class="absolute top-0 left-0 w-full h-full"
                    style="background-image: radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px); background-size: 60px 60px"
                ></div>
            </div>
            <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full opacity-30"></div>
            <div class="absolute -top-16 -right-16 w-72 h-72 bg-indigo-400 rounded-full opacity-20"></div>

            <!-- Logo -->
            <div class="relative z-10">
                <div class="inline-flex items-center justify-center bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2">
                    <img src="@/assets/img/logo.avif" alt="KingdomToys Logo" class="h-12 object-contain" />
                </div>
            </div>

            <!-- Tagline -->
            <div class="relative z-10">
                <h2 class="text-4xl font-bold text-white leading-tight mb-4">Nơi trí tưởng tượng<br />của bé bay cao</h2>
                <p class="text-indigo-200 text-lg">Thuê đồ chơi chất lượng cao, đa dạng lứa tuổi. Giao hàng tận nơi, đổi trả linh hoạt.</p>

                <div class="mt-10 flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-verified text-white"></i>
                        </div>
                        <span class="text-indigo-100 text-sm">Đồ chơi an toàn, được kiểm định chất lượng</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-truck text-white"></i>
                        </div>
                        <span class="text-indigo-100 text-sm">Giao hàng nhanh chóng trong ngày</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <i class="pi pi-refresh text-white"></i>
                        </div>
                        <span class="text-indigo-100 text-sm">Đổi trả dễ dàng, hoàn tiền 100%</span>
                    </div>
                </div>
            </div>

            <!-- Footer note -->
            <div class="relative z-10 text-indigo-300 text-sm">&copy; {{ new Date().getFullYear() }} Rent-Toys. Đã đăng ký bản quyền.</div>
        </div>

        <!-- Right Panel -->
        <div class="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
            <!-- Mobile logo -->
            <div class="lg:hidden mb-8">
                <img src="@/assets/img/logo.avif" alt="KingdomToys Logo" class="h-12 object-contain" />
            </div>

            <div class="w-full max-w-md">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                        {{ loginForm ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới' }}
                    </h1>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {{ loginForm ? 'Chào mừng bạn quay trở lại!' : 'Điền thông tin để bắt đầu mua sắm' }}
                    </p>
                </div>

                <!-- Login Form -->
                <div v-if="loginForm" class="space-y-5">
                    <div>
                        <label for="login-username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email hoặc tên đăng nhập</label>
                        <InputText id="login-username" v-model="username" type="text" placeholder="Nhập email hoặc tên đăng nhập" class="w-full" @keyup.enter="handleLogin" />
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-1.5">
                            <label for="login-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu</label>
                            <span class="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer transition-colors">Quên mật khẩu?</span>
                        </div>
                        <Password id="login-password" v-model="password" placeholder="Nhập mật khẩu" :toggleMask="true" class="w-full" fluid :feedback="false" @keyup.enter="handleLogin" />
                    </div>

                    <div class="flex items-center gap-2">
                        <Checkbox v-model="checked" id="remember" binary />
                        <label for="remember" class="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">Nhớ đăng nhập</label>
                    </div>

                    <Button label="Đăng nhập" class="w-full" :loading="loading" @click="handleLogin" />

                    <div class="text-center">
                        <span class="text-sm text-gray-500 dark:text-gray-400">Chưa có tài khoản? </span>
                        <button type="button" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors" @click="switchForm">Đăng ký ngay</button>
                    </div>
                </div>

                <!-- Register Form -->
                <div v-else class="space-y-5">
                    <div>
                        <label for="reg-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tên hiển thị</label>
                        <InputText id="reg-name" v-model="username" type="text" placeholder="Nhập tên của bạn" class="w-full" />
                    </div>

                    <div>
                        <label for="reg-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                        <InputText id="reg-email" v-model="email" type="email" placeholder="example@email.com" class="w-full" />
                    </div>

                    <div>
                        <label for="reg-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mật khẩu</label>
                        <Password id="reg-password" v-model="password" placeholder="Tạo mật khẩu (ít nhất 6 ký tự)" :toggleMask="true" class="w-full" fluid :feedback="false" />
                    </div>

                    <div class="flex items-start gap-2">
                        <Checkbox v-model="checked" id="terms" binary class="mt-0.5" />
                        <label for="terms" class="text-sm text-gray-600 dark:text-gray-300 cursor-pointer leading-relaxed">
                            Tôi đồng ý với <span class="text-indigo-600 dark:text-indigo-400 font-medium">Điều khoản dịch vụ</span> và <span class="text-indigo-600 dark:text-indigo-400 font-medium">Chính sách bảo mật</span>
                        </label>
                    </div>

                    <Button label="Tạo tài khoản" class="w-full" :loading="loading" @click="handleRegister" />

                    <div class="text-center">
                        <span class="text-sm text-gray-500 dark:text-gray-400">Đã có tài khoản? </span>
                        <button type="button" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors" @click="switchForm">Đăng nhập</button>
                    </div>
                </div>

                <!-- Divider & quick access -->
                <div class="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
                    <p class="text-center text-xs text-gray-400 dark:text-gray-500">Đăng nhập để nhận <span class="font-semibold text-indigo-600 dark:text-indigo-400">voucher 10%</span> cho lần mua hàng đầu tiên</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-password) {
    width: 100%;
}
:deep(.p-password-input) {
    width: 100%;
}
</style>
