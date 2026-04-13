<template>
    <div class="h-auto container w-full px-4 py-6 sm:px-6 lg:py-8">
        <Tabs value="0">
            <TabList>
                <Tab value="0">Thông tin tài khoản</Tab>
                <Tab value="1">Danh sách đơn hàng</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="grid grid-cols-12 gap-6 lg:gap-8">
                        <div class="col-span-12 lg:col-span-3 flex flex-col gap-3 items-center text-center lg:text-left">
                            <img class="rounded-full w-32 h-32 object-cover" :src="userDetail.thumbnail ? userDetail.thumbnail : 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'" alt="" />

                            <strong> {{ User.name }}</strong>
                            <strong class="text-primary"> {{ User.email }}</strong>
                            <Button label="Chọn ảnh" icon="pi pi-cloud-upload" class="text-white btn-up-file" raised @click="Openfile(index)" />
                            <input type="file" class="hidden click-file" @change="UploadFileLocal($event, 0)" />
                        </div>
                        <div class="col-span-12 lg:col-span-9 flex flex-col gap-5">
                            <div class="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
                                <div class="flex flex-col gap-1 border-b border-surface-200 dark:border-surface-700 px-5 py-4 md:px-6 bg-surface-50/80 dark:bg-surface-800/40">
                                    <div class="flex items-center gap-2 text-lg font-semibold text-surface-900 dark:text-surface-0">
                                        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300">
                                            <i class="pi pi-user text-base"></i>
                                        </span>
                                        Thông tin người dùng
                                    </div>
                                    <p class="text-sm text-muted-color m-0 pl-[2.75rem]">Thông tin hiển thị trên tài khoản của bạn</p>
                                </div>
                                <div class="p-5 md:p-6">
                                    <div class="grid gap-3 sm:grid-cols-2">
                                        <div class="rounded-xl border border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/30 px-4 py-3">
                                            <span class="text-xs font-semibold uppercase tracking-wide text-muted-color">Họ tên</span>
                                            <p class="m-0 mt-1 font-semibold text-surface-900 dark:text-surface-0 break-words">{{ User.name || '—' }}</p>
                                        </div>
                                        <div class="rounded-xl border border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/30 px-4 py-3">
                                            <span class="text-xs font-semibold uppercase tracking-wide text-muted-color">Tên đăng nhập</span>
                                            <p class="m-0 mt-1 font-semibold text-primary break-all">{{ User.email || '—' }}</p>
                                        </div>
                                        <div class="rounded-xl border border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/30 px-4 py-3 sm:col-span-2">
                                            <span class="text-xs font-semibold uppercase tracking-wide text-muted-color">Email</span>
                                            <p class="m-0 mt-1 font-medium text-surface-800 dark:text-surface-100 break-all">{{ User.email || '—' }}</p>
                                        </div>
                                        <div class="rounded-xl border border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/30 px-4 py-3 sm:col-span-2">
                                            <span class="text-xs font-semibold uppercase tracking-wide text-muted-color">Số điện thoại</span>
                                            <p class="m-0 mt-1 font-medium text-surface-800 dark:text-surface-100">{{ User.phone || '—' }}</p>
                                        </div>
                                    </div>
                                    <div class="mt-6 flex justify-end border-t border-surface-200 dark:border-surface-700 pt-5">
                                        <Button icon="pi pi-pencil" label="Cập nhật thông tin" @click="openUpdateUser" />
                                    </div>
                                </div>
                            </div>

                            <div class="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
                                <div class="flex flex-col gap-1 border-b border-surface-200 dark:border-surface-700 px-5 py-4 md:px-6 bg-surface-50/80 dark:bg-surface-800/40">
                                    <div class="flex items-center gap-2 text-lg font-semibold text-surface-900 dark:text-surface-0">
                                        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300">
                                            <i class="pi pi-key text-base"></i>
                                        </span>
                                        Đổi mật khẩu
                                    </div>
                                    <p class="text-sm text-muted-color m-0 pl-[2.75rem]">Bảo vệ tài khoản bằng mật khẩu đủ mạnh</p>
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

                                        <div class="flex flex-col gap-4 rounded-xl border border-dashed border-primary-200 dark:border-primary-800/60 bg-primary-50/60 dark:bg-primary-950/25 p-5">
                                            <div class="flex gap-3">
                                                <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300">
                                                    <i class="pi pi-shield text-sm"></i>
                                                </span>
                                                <p class="m-0 text-sm leading-relaxed text-surface-700 dark:text-surface-200">
                                                    Bạn nên dùng mật khẩu mạnh và <strong class="font-semibold text-surface-900 dark:text-surface-0">chưa từng dùng ở dịch vụ khác</strong>.
                                                </p>
                                            </div>
                                            <div class="flex gap-3">
                                                <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                                                    <i class="pi pi-info-circle text-sm"></i>
                                                </span>
                                                <div class="min-w-0 flex-1">
                                                    <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Yêu cầu mật khẩu</p>
                                                    <ul class="mt-3 flex flex-col gap-2.5 m-0 list-none p-0 text-sm text-surface-700 dark:text-surface-200">
                                                        <li class="flex gap-2">
                                                            <i class="pi pi-check-circle mt-0.5 text-primary-500 text-xs shrink-0"></i>
                                                            <span>Có ít nhất 8 ký tự</span>
                                                        </li>
                                                        <li class="flex gap-2">
                                                            <i class="pi pi-check-circle mt-0.5 text-primary-500 text-xs shrink-0"></i>
                                                            <span>Có ít nhất một chữ hoa và một chữ thường</span>
                                                        </li>
                                                        <li class="flex gap-2">
                                                            <i class="pi pi-check-circle mt-0.5 text-primary-500 text-xs shrink-0"></i>
                                                            <span>Có ít nhất một chữ số</span>
                                                        </li>
                                                        <li class="flex gap-2">
                                                            <i class="pi pi-check-circle mt-0.5 text-primary-500 text-xs shrink-0"></i>
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
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="1">
                    <DataTable :value="Orders" show-gridlines paginator @page="onPageChange($event)" :rows="paginator.rows" :page="paginator.page" :total-records="paginator.total" lazy>
                        <Column header="#">
                            <template #body="{ index }">
                                {{ index + 1 }}
                            </template>
                        </Column>
                        <Column header="Sản phẩm" style="max-width: 200px">
                            <template #body="{ data }">
                                {{ data.items.map((el) => el.productName).join(', ') }}
                            </template>
                        </Column>
                        <Column header="Số lượng">
                            <template #body="{ data }">
                                {{ data.items.map((el) => el.quantity).join(', ') }}
                            </template>
                        </Column>
                        <Column header="KM">
                            <template #body="{ data }">
                                {{ data.coupon ? `${data?.coupon?.CouponName} (${formatPrice(data?.coupon?.CouponValue)})` : `Không KM` }}
                            </template>
                        </Column>
                        <Column header="Giá trị đơn hàng">
                            <template #body="{ data }">
                                {{ formatPrice(data.totalPrice) }}
                            </template>
                        </Column>
                        <Column header="Đơn giá sau KM">
                            <template #body="{ data }">
                                {{ formatPrice(data.finalPrice) }}
                            </template>
                        </Column>
                        <Column header="Ngày đặt hàng">
                            <template #body="{ data }">
                                {{ format(data.createdAt, 'dd/MM/yyyy') }}
                            </template>
                        </Column>
                        <Column header="Trạng thái">
                            <template #body="{ data }">
                                {{ formatStatusOrder(data.status) }}
                            </template>
                        </Column>
                        <Column header="Thao tác">
                            <template #body="{ data }">
                                <div class="flex gap-2">
                                    <DetailOrder :client="true" :data="data"></DetailOrder>
                                    <!-- <Button icon="pi pi-trash" text></Button> -->
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>

        <Dialog v-model:visible="updateUserModal" modal header="Cập nhật thông tin" :style="{ width: '50rem' }">
            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Tên người dùng</label>
                    <InputText v-model="userDetail.name"></InputText>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Email</label>
                    <InputText v-model="userDetail.email"></InputText>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Phone</label>
                    <InputText v-model="userDetail.phone"></InputText>
                </div>

                <!-- <div class="flex flex-col gap-2">
                    <label for="">Thành phố</label>
                    <InputText v-model="userDetail.province"></InputText>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="">Quận/Huyện</label>
                    <InputText v-model="userDetail.district"></InputText>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="">Phường/Xã</label>
                    <InputText v-model="userDetail.ward"></InputText>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="">Địa chỉ</label>
                    <InputText v-model="userDetail.addressLine"></InputText>
                </div> -->

                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Tỉnh/Thành phố</label>
                    <Select v-model="selectedProvince" filter fluid :options="Province" :placeholder="userDetail.province ? userDetail.province : ''" option-label="FullName" @change="onProvinceChange"></Select>
                </div>
                <div class="flex justify-between gap-2">
                    <div class="flex flex-col gap-2 w-full">
                        <label class="font-semibold">Quận/Huyện</label>
                        <Select v-model="selectedDistrict" filter fluid :options="Districts" :placeholder="userDetail.district ? userDetail.district : ''" @change="onDistrictChange" option-label="FullName"></Select>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label class="font-semibold">Phường/Xã</label>
                        <Select filter v-model="userDetail.ward" :options="Wards" option-value="FullName" :placeholder="userDetail.ward ? userDetail.ward : ''" option-label="FullName" fluid></Select>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Địa chỉ</label>
                    <InputText v-model="userDetail.addressLine"></InputText>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Đóng" severity="secondary" @click="updateUserModal = false"></Button>
                    <Button type="button" label="Cập nhật" @click="updateUser()"></Button>
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import DetailOrder from '@/components/DetailOrder.vue';
import { formatPrice } from '@/helper/formatPrice';
import { formatStatusOrder } from '@/helper/formatStatusOrder';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
const { proxy } = getCurrentInstance();
const toast = useToast();
const Orders = ref([]);
const paginator = reactive({
    rows: 5,
    page: 0,
    total: 0
});
onMounted(() => {
    fetchProvince();
    fetchAllOrder();
    getMe();
});
const formData = new FormData();
const selectedDistrict = ref();
const selectedProvince = ref();
const userDetail = ref({});
const Province = ref([]);
const Districts = ref([]);
const Wards = ref([]);
const StatusOpts = ref([
    {
        label: 'Đã thanh toán',
        value: 'paid'
    }
]);
const changePassword = ref({
    password: '',
    newPassword: '',
    cfPassword: ''
});
const updateUserModal = ref(false);
const User = ref({});
const fetchAllOrder = async () => {
    try {
        const res = await API.get(`order/me?skip=${paginator.page}&limit=${paginator.rows}`);
        Orders.value = res.data.metadata.result;
        paginator.total = res.data.metadata.total;
    } catch (error) {
        console.log(error);
    }
};
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
const onPageChange = (e) => {
    paginator.rows = e.rows;
    paginator.page = e.page;
    fetchAllOrder();
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
    console.log(district);
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
const Openfile = () => {
    document.querySelectorAll('.click-file')[0].click();
};
const UploadFileLocal = async (event, index) => {
    const file = event.target.files[0];
    formData.append('images', file);
    document.querySelectorAll('.click-file')[index].value = '';
    updateUser();
    //   ProfileUser.value.files = URL.createObjectURL(file);
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
<style></style>
