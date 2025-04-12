<template>
    <div class="h-auto container mx-auto">
        <Tabs value="0">
            <TabList>
                <Tab value="0">Thông tin tài khoản</Tab>
                <Tab value="1">Danh sách đơn hàng</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="grid grid-cols-12">
                        <div class="col-span-3 flex flex-col gap-3 items-center">
                            <img class="rounded-full w-32 h-32 object-cover" :src="userDetail.thumbnail ? userDetail.thumbnail : 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'" alt="" />

                            <strong> {{ User.name }}</strong>
                            <strong class="text-primary"> {{ User.email }}</strong>
                            <Button label="Chọn ảnh" icon="pi pi-cloud-upload" class="text-white btn-up-file" raised @click="Openfile(index)" />
                            <input type="file" class="hidden click-file" @change="UploadFileLocal($event, 0)" />
                        </div>
                        <div class="col-span-9 flex flex-col gap-3">
                            <div class="border border-gray-300 p-4 rounded-md">
                                <h4 class="font-bold mb-4 text-xl">Thông tin người dùng</h4>
                                <div class="grid mt-1 m-0">
                                    <div class="m-0">
                                        <div class="flex flex-col gap-3">
                                            <div class="flex gap-2">
                                                <label class="w-30">Họ tên: </label>
                                                <strong class="w-30"> {{ User.name }} </strong>
                                            </div>
                                            <div class="flex gap-2">
                                                <label class="w-30">Tên đăng nhập: </label>
                                                <strong class="w-30">{{ User.email }}</strong>
                                            </div>
                                            <div class="flex gap-2">
                                                <label class="w-10rem">Email: </label>
                                                <strong class="w-30rem"> {{ User.email }}</strong>
                                            </div>
                                            <div class="flex gap-2">
                                                <label class="w-10rem">Số điện thoại: </label>
                                                <strong class="w-30rem">{{ User.phone }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-end justify-end w-full">
                                    <Button @click="openUpdateUser" label="Cập nhật thông tin"></Button>
                                </div>
                            </div>
                            <div class="border border-gray-300 p-4 rounded-md">
                                <h4 class="font-bold mb-4 text-xl">Đổi mật khẩu</h4>
                                <div class="grid grid-cols-2 gap-3 mt-1 m-0">
                                    <div class="col flex flex-col gap-3">
                                        <div class="flex flex-col gap-2">
                                            <label for="">Mật khẩu hiện tại</label>
                                            <Password v-model.trim="changePassword.password" :autocomplete="false" fluid toggleMask />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label for="">Mật khẩu mới</label>
                                            <Password v-model.trim="changePassword.newPassword" fluid toggleMask />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label for="">Nhập lại mật khẩu</label>
                                            <Password v-model.trim="changePassword.cfPassword" fluid toggleMask />
                                        </div>
                                    </div>
                                    <div class="col flex flex-col gap-3">
                                        <div class="flex gap-2 items-center">
                                            <i class="pi pi-lock"></i>
                                            <p>Bạn nên sử dụng mật khẩu mạnh mà mình chưa sử dụng ở đâu khác</p>
                                        </div>
                                        <div class="flex gap-2 items-center">
                                            <i class="pi pi-exclamation-triangle"></i>
                                            <p>Mật khẩu tài khoản của bạn phải đáp ứng các yêu cầu sau:</p>
                                        </div>
                                        <ul class="flex flex-col list-disc list-inside gap-3 m-0">
                                            <li>Có ít nhất 8 ký tự</li>
                                            <li>Có ít nhất một chữ hoa và một chữ thường</li>
                                            <li>Có ít nhất một chữ số</li>
                                            <li>Có ít nhất một ký tự đặc biệt</li>
                                        </ul>
                                        <div class="flex justify-end">
                                            <Button @click="confirmChangePassword" label="Đổi mật khẩu"></Button>
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
                                    <Button icon="pi pi-trash" text></Button>
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
