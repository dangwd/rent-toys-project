<template>
    <div class="h-auto container mx-auto py-10">
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
                    <Select v-model="selectedProvince" filter :placeholder="payload.province || ''" fluid :options="Province" option-label="FullName" @change="onProvinceChange"></Select>
                </div>
                <div class="flex justify-between gap-2">
                    <div class="flex flex-col gap-2 w-full">
                        <label class="font-semibold">Quận/Huyện</label>
                        <Select v-model="selectedDistrict" :invalid="submited && !payload.district" :placeholder="payload.district || ''" filter fluid :options="Districts" @change="onDistrictChange" option-label="FullName"></Select>
                    </div>
                    <div class="flex flex-col gap-2 w-full">
                        <label class="font-semibold">Phường/Xã</label>
                        <Select filter v-model="payload.ward" :invalid="submited && !payload.ward" :placeholder="payload.ward || ''" :options="Wards" option-value="FullName" option-label="FullName" fluid></Select>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Địa chỉ</label>
                    <InputText v-model="payload.addressLine" :invalid="submited && !payload.addressLine" :placeholder="payload.addressLine || ''"></InputText>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Số điện thoại</label>
                    <InputText v-model="payload.phone" :invalid="submited && !payload.phone"></InputText>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Họ tên</label>
                    <InputText v-model="payload.fullName" :invalid="submited && !payload.fullName"></InputText>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Ghi chú</label>
                    <Textarea v-model="payload.notes"></Textarea>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Phương thức thanh toán</label>
                    <Select v-model="payload.paymentMethod" :options="PaymentOpts" option-value="value" option-label="label"></Select>
                </div>
            </div>
            <div>
                <strong class="text-lg">Sản phẩm</strong>
                <div class="flex flex-col justify-between h-full">
                    <div class="flex flex-col gap-2">
                        <div class="items-center p-3 m-0" v-for="(item, index) in itemCart.items" :key="index">
                            <div class="grid items-center grid-cols-12 m-0">
                                <div class="col-span-2">
                                    <Image crossorigin="anonymous" :src="item.images ? item.images[0] : ``" alt="Image" width="70" preview></Image>
                                </div>
                                <div class="col-span-10 flex flex-col grow">
                                    <strong>{{ item.productName }}</strong>
                                    <div class="flex items-center justify-between gap-3 mb-2">
                                        <span
                                            >Số lượng: <strong class="text-primary">{{ item.quantity }}</strong></span
                                        >
                                        <span
                                            >Giá sản phẩm: <strong class="text-primary">{{ formatPrice(route.query.prd ? item.price - (item.price * item.discount) / 100 : item.finalSubTotal) }}đ</strong></span
                                        >
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div class="flex justify-between items-center text-lg">
                            <span>Tổng tiền đơn hàng</span>
                            <strong v-if="route.query.prd">{{ couponData?.discountValue ? formatPrice(couponData.finalPrice) : formatPrice(totalComputed) }}đ (-{{ couponData?.couponValue }}%)</strong>
                            <strong v-else>{{ formatPrice(couponData?.discountValue ? couponData.finalPrice : itemCart.totalPrice) }}đ (-{{ couponData?.couponValue }}%)</strong>
                        </div>
                        <div class="flex justify-between items-center">
                            <Button @click="router.push(`/`)" label="Quay lại" text></Button>
                            <div class="flex gap-2">
                                <Button @click="openCouponDlg" label="Coupon giảm giá" icon="pi pi-ticket" text></Button>

                                <Button @click="confirmOrder()" label="Thanh toán"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <Drawer v-model:visible="couponModal" position="right" style="width: 30%">
            <template #header>
                <div class="flex items-center gap-2">
                    <Button icon="pi pi-ticket" text></Button>
                    <span class="font-bold">Coupon giảm giá</span>
                </div>
            </template>

            <ScrollPanel
                v-if="Coupons.filter((el) => new Date(el.expiryDate) >= new Date())?.length > 0"
                v-for="(item, index) in Coupons.filter((el) => new Date(el.expiryDate) >= new Date())"
                :key="index"
                style="width: 100%"
                class="flex flex-col my-5"
            >
                <div @click="useCoupon(item)" class="coupon hover:scale-105 transition-all ease-in-out duration-150">
                    <div class="left"></div>
                    <div class="center text-white">
                        <div class="flex flex-col gap-2">
                            <div class="">{{ item.CouponName }}</div>
                            <div class="">Giá trị: {{ formatPrice(item.CouponValue) }}%</div>
                            <div class="">Giá trị đơn hàng:{{ formatPrice(item.minOrderValue) }}đ</div>
                            <div class="">Hạn sử dụng: {{ format(item.expiryDate, 'dd/MM/yyyy') }}</div>
                            <div class="">Số lượng còn lại: {{ item.usageLimit }}</div>
                        </div>
                    </div>
                    <div class="right"></div>
                </div>
            </ScrollPanel>
            <div class="text-center" v-else>Danh sách trống</div>
        </Drawer>
        <Loading v-if="isLoading"></Loading>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { useAuthStore } from '@/store';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../store/carts';
const { proxy } = getCurrentInstance();
const toast = useToast();
const router = useRouter();
const isLoading = ref(false);
const couponData = ref({});
const Coupons = ref([]);
const cartStore = useCartStore();
const auth = useAuthStore();
const user = auth.user.metadata.user;
const selectedProvince = ref();
const selectedDistrict = ref();
const Province = ref([]);
const submited = ref(false);
const Districts = ref([]);
const Wards = ref([]);
const itemCart = ref([]);

const payload = ref({
    email: user.email,
    paymentMethod: 'cod'
});
const PaymentOpts = ref([
    {
        label: 'COD',
        value: 'cod'
    },
    {
        label: 'Zalo',
        value: 'zalo'
    }
]);
const route = useRoute();
const couponModal = ref(false);
onMounted(async () => {
    itemCart.value = await cartStore.getItem();
    fetchProvince();
    if (route.query.prd) {
        fetchProductById(route.query.prd);
    }
    getMe();
});
const totalComputed = computed(() => {
    return itemCart.value?.items?.reduce((total, el) => {
        return total + el.price - ((el.price * el.discount) / 100) * el.quantity;
    }, 0);
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

const onProvinceChange = (e) => {
    payload.value.province = selectedProvince.value.FullName;
    fetchDistrict(e.value);
};
const onDistrictChange = (e) => {
    payload.value.district = selectedDistrict.value.FullName;
    fetchWard(e.value);
};
const openCouponDlg = () => {
    fetchAllCoupon();
    couponModal.value = true;
};
const fetchAllCoupon = async () => {
    try {
        const res = await API.get(`coupon`);
        Coupons.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};
const useCoupon = async (cp) => {
    isLoading.value = true;
    let items = [];

    if (route.query.prd && route.query.qt) {
        items.push({
            productId: route.query.prd || null,
            quantity: route.query.qt || null
        });
    } else {
        items = itemCart.value.items.map((el) => ({
            productId: el.productId,
            quantity: el.quantity
        }));
    }

    let data = {
        coupon: cp._id,
        items
    };
    try {
        const res = await API.create(`coupon/apply`, data);
        proxy.$notify(res.status === 200 ? 'S' : 'E', res.status === 200 ? `Sử dụng thành công coupon!` : res?.response?.data?.message, toast);
        if (res.status === 200) {
            couponData.value = res.data?.metadata;
        }
    } catch (error) {
        console.log(error);
    } finally {
        couponModal.value = false;
        isLoading.value = false;
    }
};
const confirmOrder = async () => {
    let items = [];

    if (route.query.prd && route.query.qt) {
        items.push({
            productId: route.query.prd || null,
            quantity: route.query.qt || null
        });
    } else {
        items = itemCart.value.items.map((el) => ({
            productId: el.productId,
            quantity: el.quantity
        }));
    }

    let data = {
        ...payload.value,
        orderType: route.query.prd ? '' : 'Cart',
        coupon: couponData.value.couponId,
        items
    };
    submited.value = true;
    if (!validateData(data)) return;
    submited.value = true;
    try {
        const res = await API.create(`order/CheckoutWithPayload`, data);

        proxy.$notify(res.status === 200 ? 'S' : 'E', res.status === 200 ? `Đặt hàng thành công!` : res, toast);
        if (res.data?.metadata.return_code === 1) {
            router.push('/client/payment-ing');
            window.open(res.data?.metadata?.order_url, '_blank');
        } else {
            router.push('/client/payment-check');
        }
    } catch (error) {
        proxy.$notify('E', error, toast);
    }
};
const fetchProductById = async (id) => {
    try {
        const res = await API.get(`product/${id}`);
        itemCart.value.items = [];
        itemCart.value.items.push({ ...res.data.metadata, quantity: route.query.qt });
    } catch (error) {
        console.log(error);
    }
};
const getMe = async () => {
    try {
        const res = await API.get('get-me');
        Object.assign(payload.value, res.data.metadata);
        payload.value.fullName = res.data.metadata.name;
    } catch (error) {}
};
const validateData = (data) => {
    if (!data.province && !data.district && !data.ward && !data.addressLine && !data.phone) {
        proxy.$notify('E', 'Vui lòng nhập đủ thông tin!', toast);
        return false;
    }
    return true;
};
watch(route, (newVal, oldVal) => {
    location.reload();
});
</script>
<style>
.coupon {
    width: 95%;
    height: 150px;
    border-radius: 10px;
    overflow: hidden;
    margin: auto;
    filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.5));
    display: flex;
    align-items: stretch;
    position: relative;
}
.coupon::before,
.coupon::after {
    content: '';
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    z-index: -1;
}

.coupon::before {
    left: 0;
    background-image: radial-gradient(circle at 0 50%, transparent 25px, var(--primary-color) 26px);
}

.coupon::after {
    right: 0;
    background-image: radial-gradient(circle at 100% 50%, transparent 25px, var(--primary-color) 26px);
}

.coupon > div {
    display: flex;
    align-items: center;
    justify-content: center;
}

.left {
    width: 20%;
    border-right: 2px dashed rgba(0, 0, 0, 0.13);
}

.center {
    flex-grow: 1;
}

.right {
    width: 120px;
    background-image: radial-gradient(circle at 100% 50%, transparent 25px, #fff 26px);
}

.center h2 {
    background: #000;
    color: var(--primary-color);
    padding: 0 10px;
    font-size: 2.15rem;
    white-space: nowrap;
}

.center small {
    font-size: 0.625rem;
    font-weight: 600;
    letter-spacing: 2px;
}
</style>
