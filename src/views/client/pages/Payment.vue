<template>
    <div class="h-screen container mx-auto py-10">
        <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-3">
                <img width="200" src="https://cdn.shopify.com/s/files/1/0731/6514/4343/files/logo-254x76_1_x320.png?v=1697473116" alt="" />
                <strong class="text-lg">Liên hệ</strong>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Email hoặc số điện thoại di động</label>
                    <InputText v-model="payload.email"></InputText>
                </div>
                <strong class="text-lg">Địa chỉ giao hàng</strong>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Tỉnh/Thành phố</label>
                    <Dropdown v-model="payload.province" option-value="Code" fluid :options="Province" option-label="FullName" @change="onProvinceChange"></Dropdown>
                </div>
                <div class="flex justify-between gap-2">
                    <div class="flex flex-col gap-2 w-full">
                        <label class="font-semibold">Quận/Huyện</label>
                        <Dropdown v-model="payload.district" fluid :options="Districts" @change="onDistrictChange" option-value="Code" option-label="Name"></Dropdown>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label class="font-semibold">Phường/Xã</label>
                        <Dropdown v-model="payload.ward" :options="Wards" option-label="Name" fluid></Dropdown>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Họ tên</label>
                    <InputText></InputText>
                </div>
            </div>
            <div>
                <strong class="text-lg">Sản phẩm</strong>
                <div class="flex flex-col justify-between h-full">
                    <div class="items-center p-3 m-0" v-for="(item, index) in itemCart.items" :key="index">
                        <div class="grid items-center grid-cols-12 m-0">
                            <div class="col-span-2">
                                <Image :src="item.images ? item.images[0] : ``" alt="Image" width="70" preview></Image>
                            </div>
                            <div class="col-span-10 flex flex-col grow">
                                <strong>{{ item.productName }}</strong>
                                <div class="flex items-center justify-between gap-3 mb-2">
                                    <span
                                        >Số lượng: <strong class="text-primary">{{ item.quantity }}</strong></span
                                    >
                                    <span
                                        >Giá sản phẩm: <strong class="text-primary">{{ formatPrice(item.price) }}đ</strong></span
                                    >
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div class="flex justify-between items-center text-lg">
                            <span>Tổng tiền đơn hàng</span>
                            <strong>{{ formatPrice(itemCart.totalPrice) }}đ</strong>
                        </div>
                        <div class="flex justify-between items-center">
                            <Button label="Quay lại" text></Button>
                            <Button label="Thanh toán"></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useCartStore } from '../store/carts';
import { useAuthStore } from '@/store';
import API from '@/api/api-main';

const cartStore = useCartStore();
const auth = useAuthStore();
const user = auth.user.metadata.user;
const Province = ref([]);
const Districts = ref([]);
const Wards = ref([]);
const itemCart = ref([]);
const payload = ref({
    email: user.email
});
onMounted(async () => {
    itemCart.value = await cartStore.getItem();
    fetchProvince();
});
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};
const fetchProvince = async () => {
    try {
        const res = await API.get(`province`);
        Province.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const fetchDistrict = async () => {
    try {
        const res = await API.get(`province/district/${payload.value.province}`);
        Districts.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const fetchWard = async () => {
    try {
        const res = await API.get(`province/ward/${payload.value.district}`);
        Wards.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};

const onProvinceChange = () => {
    fetchDistrict();
};
const onDistrictChange = () => {
    fetchWard();
};
</script>
<style>
</style>