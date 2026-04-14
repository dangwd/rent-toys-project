<template>
    <div class="container mx-auto w-full px-4 py-6 sm:px-6 lg:py-10">
        <div class="mb-8">
            <h1 class="text-2xl font-black tracking-tight text-surface-900 dark:text-surface-0 sm:text-3xl">Tài khoản của tôi</h1>
            <p class="mt-1 text-sm text-muted-color">Quản lý thông tin cá nhân và bảo mật tài khoản.</p>
        </div>

        <div class="grid grid-cols-12 gap-6 lg:gap-8">
            <aside class="col-span-12 lg:col-span-4 xl:col-span-3">
                <div class="rounded-3xl border border-surface-200 bg-surface-0 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:border-surface-700 dark:bg-surface-900">
                    <div class="flex flex-col items-center text-center">
                        <img
                            class="h-32 w-32 rounded-full border-4 border-surface-100 object-cover shadow-sm dark:border-surface-800"
                            :src="userDetail.thumbnail || 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'"
                            alt=""
                        />
                        <h2 class="mt-4 text-xl font-bold text-surface-900 dark:text-surface-0">{{ User.name || 'Người dùng' }}</h2>
                        <p class="mt-1 break-all text-sm text-primary">{{ User.email || '—' }}</p>
                        <p class="mt-2 text-sm text-muted-color">{{ User.phone || 'Chưa cập nhật số điện thoại' }}</p>
                        <Button label="Cập nhật ảnh đại diện" icon="pi pi-cloud-upload" class="mt-5 w-full" raised @click="openFile" />
                        <input type="file" class="hidden click-file" @change="uploadFileLocal($event)" />
                    </div>

                    <div class="mt-6 rounded-2xl border border-dashed border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/30">
                        <p class="m-0 text-xs font-semibold uppercase tracking-wide text-muted-color">Địa chỉ hiện tại</p>
                        <p class="mt-2 text-sm leading-6 text-surface-700 dark:text-surface-200">
                            {{ formattedAddress }}
                        </p>
                    </div>
                </div>
            </aside>

            <div class="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-5">
                <section class="rounded-2xl border border-surface-200 bg-surface-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden dark:border-surface-700 dark:bg-surface-900">
                    <div class="flex flex-col gap-1 border-b border-surface-200 bg-surface-50/80 px-5 py-4 md:px-6 dark:border-surface-700 dark:bg-surface-800/40">
                        <div class="flex items-center gap-2 text-lg font-semibold text-surface-900 dark:text-surface-0">
                            <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                                <i class="pi pi-user text-base"></i>
                            </span>
                            Thông tin người dùng
                        </div>
                        <p class="m-0 pl-[2.75rem] text-sm text-muted-color">Thông tin hiển thị trên tài khoản của bạn</p>
                    </div>
                    <div class="p-5 md:p-6">
                        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <div class="info-card">
                                <span class="info-label">Họ tên</span>
                                <p class="info-value">{{ User.name || '—' }}</p>
                            </div>
                            <div class="info-card">
                                <span class="info-label">Tên đăng nhập</span>
                                <p class="info-value text-primary break-all">{{ User.email || '—' }}</p>
                            </div>
                            <div class="info-card">
                                <span class="info-label">Số điện thoại</span>
                                <p class="info-value">{{ User.phone || '—' }}</p>
                            </div>
                            <div class="info-card sm:col-span-2 xl:col-span-3">
                                <span class="info-label">Email</span>
                                <p class="info-value break-all">{{ User.email || '—' }}</p>
                            </div>
                            <div class="info-card sm:col-span-2 xl:col-span-3">
                                <span class="info-label">Địa chỉ</span>
                                <p class="info-value">{{ formattedAddress }}</p>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-end border-t border-surface-200 pt-5 dark:border-surface-700">
                            <Button icon="pi pi-pencil" label="Cập nhật thông tin" @click="openUpdateUser" />
                        </div>
                    </div>
                </section>

                <section class="rounded-2xl border border-surface-200 bg-surface-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden dark:border-surface-700 dark:bg-surface-900">
                    <div class="flex flex-col gap-1 border-b border-surface-200 bg-surface-50/80 px-5 py-4 md:px-6 dark:border-surface-700 dark:bg-surface-800/40">
                        <div class="flex items-center gap-2 text-lg font-semibold text-surface-900 dark:text-surface-0">
                            <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                                <i class="pi pi-key text-base"></i>
                            </span>
                            Đổi mật khẩu
                        </div>
                        <p class="m-0 pl-[2.75rem] text-sm text-muted-color">Bảo vệ tài khoản bằng mật khẩu đủ mạnh</p>
                    </div>
                    <div class="p-5 md:p-6">
                        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
                            <div class="flex flex-col gap-4">
                                <div class="flex flex-col gap-2">
                                    <label for="pwd-current" class="text-sm font-medium text-surface-700 dark:text-surface-200">Mật khẩu hiện tại</label>
                                    <Password v-model.trim="changePassword.password" input-id="pwd-current" :autocomplete="false" fluid toggle-mask />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label for="pwd-new" class="text-sm font-medium text-surface-700 dark:text-surface-200">Mật khẩu mới</label>
                                    <Password v-model.trim="changePassword.newPassword" input-id="pwd-new" fluid toggle-mask />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label for="pwd-confirm" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nhập lại mật khẩu</label>
                                    <Password v-model.trim="changePassword.cfPassword" input-id="pwd-confirm" fluid toggle-mask />
                                </div>
                                <div class="flex justify-end pt-2 xl:hidden">
                                    <Button icon="pi pi-check" label="Đổi mật khẩu" @click="confirmChangePassword" />
                                </div>
                            </div>

                            <div class="flex flex-col gap-4 rounded-xl border border-dashed border-primary-200 bg-primary-50/60 p-5 dark:border-primary-800/60 dark:bg-primary-950/25">
                                <div class="flex gap-3">
                                    <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300">
                                        <i class="pi pi-shield text-sm"></i>
                                    </span>
                                    <p class="m-0 text-sm leading-relaxed text-surface-700 dark:text-surface-200">
                                        Bạn nên dùng mật khẩu mạnh và <strong class="font-semibold text-surface-900 dark:text-surface-0">chưa từng dùng ở dịch vụ khác</strong>.
                                    </p>
                                </div>
                                <div class="flex gap-3">
                                    <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                        <i class="pi pi-info-circle text-sm"></i>
                                    </span>
                                    <div class="min-w-0 flex-1">
                                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Yêu cầu mật khẩu</p>
                                        <ul class="m-0 mt-3 flex list-none flex-col gap-2.5 p-0 text-sm text-surface-700 dark:text-surface-200">
                                            <li class="flex gap-2">
                                                <i class="pi pi-check-circle mt-0.5 shrink-0 text-xs text-primary-500"></i>
                                                <span>Có ít nhất 8 ký tự</span>
                                            </li>
                                            <li class="flex gap-2">
                                                <i class="pi pi-check-circle mt-0.5 shrink-0 text-xs text-primary-500"></i>
                                                <span>Có ít nhất một chữ hoa và một chữ thường</span>
                                            </li>
                                            <li class="flex gap-2">
                                                <i class="pi pi-check-circle mt-0.5 shrink-0 text-xs text-primary-500"></i>
                                                <span>Có ít nhất một chữ số</span>
                                            </li>
                                            <li class="flex gap-2">
                                                <i class="pi pi-check-circle mt-0.5 shrink-0 text-xs text-primary-500"></i>
                                                <span>Có ít nhất một ký tự đặc biệt</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="hidden justify-end pt-2 xl:flex">
                                    <Button icon="pi pi-check" label="Đổi mật khẩu" @click="confirmChangePassword" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <Dialog v-model:visible="updateUserModal" modal header="Cập nhật thông tin" :style="{ width: 'min(92vw, 50rem)' }">
            <div class="grid gap-4 md:grid-cols-2">
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="font-semibold">Tên người dùng</label>
                    <InputText v-model="userDetail.name" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Email</label>
                    <InputText v-model="userDetail.email" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Phone</label>
                    <InputText v-model="userDetail.phone" />
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="font-semibold">Tỉnh/Thành phố</label>
                    <Select v-model="selectedProvince" filter fluid :options="Province" :placeholder="userDetail.province || ''" option-label="FullName" @change="onProvinceChange" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Quận/Huyện</label>
                    <Select v-model="selectedDistrict" filter fluid :options="Districts" :placeholder="userDetail.district || ''" @change="onDistrictChange" option-label="FullName" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Phường/Xã</label>
                    <Select filter v-model="userDetail.ward" :options="Wards" option-value="FullName" :placeholder="userDetail.ward || ''" option-label="FullName" fluid />
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="font-semibold">Địa chỉ</label>
                    <InputText v-model="userDetail.addressLine" />
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Đóng" severity="secondary" @click="updateUserModal = false" />
                    <Button type="button" label="Cập nhật" @click="updateUser()" />
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
const { proxy } = getCurrentInstance();
const toast = useToast();
onMounted(() => {
    fetchProvince();
    getMe();
});
const formData = new FormData();
const selectedDistrict = ref();
const selectedProvince = ref();
const userDetail = ref({});
const Province = ref([]);
const Districts = ref([]);
const Wards = ref([]);
const changePassword = ref({
    password: '',
    newPassword: '',
    cfPassword: ''
});
const updateUserModal = ref(false);
const User = ref({});
const formattedAddress = computed(() => {
    const parts = [User.value.addressLine, User.value.ward, User.value.district, User.value.province].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Chưa cập nhật địa chỉ';
});

const getMe = async () => {
    try {
        const res = await API.get(`get-me`);
        User.value = res.data.metadata;
        userDetail.value = User.value;
        selectedProvince.value = User.value.province;
        selectedDistrict.value = User.value.district;
    } catch (error) {
        console.log(error);
    }
};
const openUpdateUser = () => {
    updateUserModal.value = true;
    getMe();
};
const onProvinceChange = (e) => {
    userDetail.value.province = selectedProvince.value.FullName;
    fetchDistrict(e.value);
};
const onDistrictChange = (e) => {
    userDetail.value.district = selectedDistrict.value.FullName;
    fetchWard(e.value);
};
const fetchProvince = async () => {
    try {
        const res = await API.get(`province`);
        Province.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const fetchDistrict = async (province) => {
    try {
        const res = await API.get(`province/district/${province.Code}`);
        Districts.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const fetchWard = async (district) => {
    try {
        const res = await API.get(`province/ward/${district.Code}`);
        Wards.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const updateUser = async () => {
    formData.append('items', JSON.stringify(userDetail.value));
    try {
        const res = await API.updatev2(`update-me`, formData);
        if (res) {
            getMe();
            proxy.$notify('S', 'Thành công!', toast);

            updateUserModal.value = false;
        }
    } catch (error) {
        console.log(error);
    } finally {
        formData.delete('items');
        formData.delete('images');
    }
};
const openFile = () => {
    document.querySelectorAll('.click-file')[0].click();
};
const uploadFileLocal = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    formData.append('images', file);
    document.querySelectorAll('.click-file')[0].value = '';
    updateUser();
};
const confirmChangePassword = async () => {
    if (changePassword.value.cfPassword !== changePassword.value.newPassword) {
        return proxy.$notify('E', 'Mật khẩu nhập lại không khớp!', toast);
    }
    try {
        const res = await API.updatev2(`update-password`, changePassword.value);
        if (res.status === 400) {
            return proxy.$notify('E', 'Có lỗi xảy ra !', toast);
        }
        proxy.$notify('S', 'Đổi mật khẩu thành công!', toast);
    } catch (error) {
        proxy.$notify('E', error, toast);
        console.log(error);
    }
};
</script>
<style scoped>
.info-card {
    @apply rounded-xl border border-surface-100 bg-surface-50 px-4 py-3 dark:border-surface-800 dark:bg-surface-800/30;
}

.info-label {
    @apply text-xs font-semibold uppercase tracking-wide text-muted-color;
}

.info-value {
    @apply m-0 mt-1 font-medium break-words text-surface-800 dark:text-surface-100;
}
</style>
