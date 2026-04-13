<template>
    <div v-if="itemCart" class="mx-auto w-full max-w-7xl px-4 py-8 lg:py-12">
        <header class="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                    <i class="pi pi-credit-card text-lg"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Thanh toán</h1>
                    <p class="text-sm text-slate-500 dark:text-zinc-400">Nhập thông tin và xác nhận đơn hàng</p>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400">
                <button type="button" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-900/60" @click="router.push('/')">
                    <i class="pi pi-home text-[12px]"></i>
                    Trang chủ
                </button>
                <button type="button" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-900/60" @click="openCouponDlg()">
                    <i class="pi pi-ticket text-[12px]"></i>
                    Voucher
                </button>
            </div>
        </header>

        <div class="grid gap-8 lg:grid-cols-12 lg:items-start">
            <main class="space-y-6 lg:col-span-8">
                <section class="card-surface">
                    <div class="card-header">
                        <div class="flex items-center gap-2">
                            <span class="step-pill">1</span>
                            <h2 class="card-title">Thông tin khách hàng</h2>
                        </div>
                        <span class="card-hint">Bắt buộc</span>
                    </div>

                    <div class="grid gap-4 md:grid-cols-2">
                        <div class="field">
                            <label class="field-label">Họ và tên người nhận</label>
                            <div class="relative">
                                <i class="pi pi-user field-icon"></i>
                                <InputText v-model="payload.fullName" :invalid="submited && !payload.fullName" placeholder="Nguyễn Văn A" class="premium-input" />
                            </div>
                        </div>
                        <div class="field">
                            <label class="field-label">Số điện thoại</label>
                            <div class="relative">
                                <i class="pi pi-phone field-icon"></i>
                                <InputText v-model="payload.phone" :invalid="submited && !payload.phone" placeholder="0987xxxxxx" class="premium-input" />
                            </div>
                        </div>
                        <div class="field md:col-span-2">
                            <label class="field-label">Email</label>
                            <div class="relative">
                                <i class="pi pi-envelope field-icon"></i>
                                <InputText v-model="payload.email" placeholder="example@gmail.com" class="premium-input" />
                            </div>
                        </div>
                    </div>
                </section>

                <section class="card-surface">
                    <div class="card-header">
                        <div class="flex items-center gap-2">
                            <span class="step-pill">2</span>
                            <h2 class="card-title">Địa chỉ giao hàng</h2>
                        </div>
                        <span class="card-hint">Bắt buộc</span>
                    </div>

                    <div class="grid gap-4">
                        <div class="grid gap-4 md:grid-cols-3">
                            <div class="field">
                                <label class="field-label">Tỉnh / Thành</label>
                                <Select v-model="selectedProvince" filter :placeholder="payload.province || 'Chọn...'" :options="Province" option-label="FullName" @change="onProvinceChange" class="premium-select" fluid />
                            </div>
                            <div class="field">
                                <label class="field-label">Quận / Huyện</label>
                                <Select
                                    v-model="selectedDistrict"
                                    :invalid="submited && !payload.district"
                                    :placeholder="payload.district || 'Chọn...'"
                                    filter
                                    :options="Districts"
                                    @change="onDistrictChange"
                                    option-label="FullName"
                                    class="premium-select"
                                    fluid
                                />
                            </div>
                            <div class="field">
                                <label class="field-label">Phường / Xã</label>
                                <Select filter v-model="payload.ward" :invalid="submited && !payload.ward" :placeholder="payload.ward || 'Chọn...'" :options="Wards" option-value="FullName" option-label="FullName" class="premium-select" fluid />
                            </div>
                        </div>

                        <div class="field">
                            <label class="field-label">Số nhà, tên đường</label>
                            <div class="relative">
                                <i class="pi pi-map-marker field-icon"></i>
                                <InputText v-model="payload.addressLine" :invalid="submited && !payload.addressLine" placeholder="Số 123, Đường Láng..." class="premium-input" />
                            </div>
                        </div>
                    </div>
                </section>

                <section class="card-surface">
                    <div class="card-header">
                        <div class="flex items-center gap-2">
                            <span class="step-pill">3</span>
                            <h2 class="card-title">Thanh toán</h2>
                        </div>
                        <span class="card-hint">Chọn 1</span>
                    </div>

                    <div class="grid gap-4">
                        <div class="field">
                            <label class="field-label">Phương thức</label>
                            <div class="grid gap-3 md:grid-cols-2">
                                <button v-for="opt in PaymentOpts" :key="opt.value" type="button" @click="payload.paymentMethod = opt.value" :class="['pay-tile', payload.paymentMethod === opt.value ? 'pay-tile--active' : 'pay-tile--idle']">
                                    <div class="flex min-w-0 items-center gap-3 pr-10">
                                        <div :class="['pay-icon', payload.paymentMethod === opt.value ? 'pay-icon--active' : 'pay-icon--idle']">
                                            <i :class="opt.value === 'cod' ? 'pi pi-wallet' : 'pi pi-credit-card'"></i>
                                        </div>
                                        <div class="min-w-0 text-left">
                                            <p class="m-0 truncate font-bold text-slate-900 dark:text-white">{{ opt.label }}</p>
                                            <p class="m-0 mt-1 text-xs text-slate-500 dark:text-zinc-400">{{ opt.value === 'cod' ? 'Trả tiền khi nhận hàng' : 'Thanh toán qua ZaloPay' }}</p>
                                        </div>
                                    </div>
                                    <div :class="['pay-check', payload.paymentMethod === opt.value ? 'pay-check--active' : 'pay-check--idle']">
                                        <i v-if="payload.paymentMethod === opt.value" class="pi pi-check text-[10px] text-white"></i>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div class="field">
                            <label class="field-label">Ghi chú (tuỳ chọn)</label>
                            <Textarea v-model="payload.notes" auto-resize rows="3" placeholder="Ví dụ: Giao giờ hành chính..." class="premium-textarea" />
                        </div>
                    </div>
                </section>
            </main>

            <aside class="lg:sticky lg:top-8 lg:col-span-4">
                <div class="card-surface">
                    <div class="card-header">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-shopping-bag text-slate-700 dark:text-zinc-200"></i>
                            <h2 class="card-title">Tóm tắt đơn hàng</h2>
                        </div>
                        <span class="card-hint">{{ itemCart?.items?.length || 0 }} sản phẩm</span>
                    </div>

                    <div class="max-h-[340px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        <div v-for="(item, index) in itemCart.items" :key="index" class="flex items-start gap-3">
                            <div class="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-50 p-2 dark:bg-zinc-900">
                                <img crossorigin="anonymous" :src="item.images ? item.images[0] : ``" :alt="item.productName" class="h-full w-full object-contain" />
                                <span class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-indigo-600">
                                    {{ item.quantity }}
                                </span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="m-0 truncate text-sm font-bold text-slate-900 dark:text-white" :title="item.productName">{{ item.productName }}</p>
                                <p class="m-0 mt-1 text-xs font-black text-indigo-600 dark:text-indigo-400">{{ formatPrice(route.query.prd ? item.price - (item.price * item.discount) / 100 : item.finalSubTotal / item.quantity) }}đ</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 space-y-3 border-t border-slate-100 pt-6 dark:border-zinc-800">
                        <div class="flex items-center justify-between text-sm text-slate-600 dark:text-zinc-300">
                            <span>Tạm tính</span>
                            <span class="font-bold text-slate-900 dark:text-white">{{ formatPrice(totalComputed || itemCart.totalPrice) }}đ</span>
                        </div>

                        <div v-if="couponData?.couponValue" class="flex items-center justify-between text-sm text-emerald-600">
                            <span class="inline-flex items-center gap-2">
                                <i class="pi pi-ticket"></i>
                                Giảm giá ({{ couponData.couponValue }}%)
                            </span>
                            <span class="font-bold">-{{ formatPrice((totalComputed || itemCart.totalPrice) - couponData.finalPrice) }}đ</span>
                        </div>

                        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-zinc-900">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">Tổng cộng</span>
                                <span class="text-xl font-black text-slate-900 dark:text-white"> {{ formatPrice(couponData?.finalPrice || totalComputed || itemCart.totalPrice) }}đ </span>
                            </div>
                            <p class="m-0 mt-2 text-[11px] text-slate-400">VAT đã bao gồm</p>
                        </div>

                        <div class="grid gap-3">
                            <Button @click="confirmOrder()" label="Đặt hàng" icon="pi pi-shield" class="checkout-button !h-14 !rounded-2xl !text-base !font-black !uppercase !tracking-widest" />
                            <div class="flex items-center justify-center gap-2 text-[11px] font-bold text-emerald-600">
                                <i class="pi pi-lock"></i>
                                Thanh toán an toàn
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <Drawer v-model:visible="couponModal" position="right" style="width: 28rem" class="premium-drawer">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <i class="pi pi-ticket"></i>
                    </div>
                    <span class="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Kho Voucher</span>
                </div>
            </template>

            <div class="space-y-5 p-4">
                <div
                    v-if="filteredCoupons && filteredCoupons.length > 0"
                    v-for="(item, index) in filteredCoupons"
                    :key="index"
                    @click="useCoupon(item)"
                    class="group relative flex cursor-pointer transform items-stretch overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm ring-indigo-500 transition-all hover:-translate-y-1 hover:border-indigo-600 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div class="flex flex-col items-center justify-center bg-indigo-600 px-6 py-4 text-white">
                        <span class="text-2xl font-black">{{ item.CouponValue }}%</span>
                        <span class="text-[8px] font-black uppercase tracking-widest opacity-80">Off</span>
                    </div>
                    <div class="flex grow flex-col justify-center px-6 py-4">
                        <h4 class="font-black uppercase tracking-tight text-slate-900 dark:text-white">{{ item.CouponName }}</h4>
                        <div class="mt-2 text-[10px] font-bold text-slate-500">
                            <p>
                                Đơn tối thiểu: <span class="text-indigo-600">{{ formatPrice(item.minOrderValue) }}đ</span>
                            </p>
                            <p>HSD: {{ format(item.expiryDate, 'dd/MM/yyyy') }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-20 text-slate-300">
                    <i class="pi pi-ticket mb-4 text-6xl opacity-20"></i>
                    <p class="font-black uppercase tracking-widest">Không có Voucher</p>
                </div>
            </div>
        </Drawer>

        <Loading v-if="isLoading" />
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
const route = useRoute();
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
const itemCart = ref({ items: [] });
const couponModal = ref(false);

const payload = ref({
    email: user.email,
    fullName: user.name,
    paymentMethod: 'cod'
});

const PaymentOpts = ref([
    { label: 'Tiền mặt (COD)', value: 'cod' },
    { label: 'Ví điện tử ZaloPay', value: 'zalo' }
]);

const filteredCoupons = computed(() => {
    return Coupons.value.filter((el) => new Date(el.expiryDate) >= new Date());
});

const totalComputed = computed(() => {
    return itemCart.value?.items?.reduce((total, el) => {
        return total + (el.price - (el.price * el.discount) / 100) * el.quantity;
    }, 0);
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(Math.round(price));
};

onMounted(async () => {
    itemCart.value = await cartStore.getItem();
    fetchProvince();
    if (route.query.prd) {
        fetchProductById(route.query.prd);
    }
    getMe();
});

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
    let items = route.query.prd && route.query.qt ? [{ productId: route.query.prd, quantity: route.query.qt }] : itemCart.value.items.map((el) => ({ productId: el.productId, quantity: el.quantity }));

    try {
        const res = await API.create(`coupon/apply`, { coupon: cp._id, items });
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
    let items = route.query.prd && route.query.qt ? [{ productId: route.query.prd, quantity: route.query.qt }] : itemCart.value.items.map((el) => ({ productId: el.productId, quantity: el.quantity }));

    let data = { ...payload.value, orderType: route.query.prd ? '' : 'Cart', coupon: couponData.value.couponId, items };
    submited.value = true;
    if (!validateData(data)) return;

    try {
        const res = await API.create(`order/CheckoutWithPayload`, data);
        proxy.$notify(res.status === 200 ? 'S' : 'E', res.status === 200 ? `Đặt hàng thành công!` : res, toast);
        if (res.data?.metadata?.return_code === 1) {
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
        itemCart.value.items = [{ ...res.data.metadata, quantity: route.query.qt }];
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
    if (!data.province || !data.district || !data.ward || !data.addressLine || !data.phone || !data.fullName) {
        proxy.$notify('E', 'Vui lòng nhập đủ thông tin!', toast);
        return false;
    }
    return true;
};

watch(route, () => {
    location.reload();
});
</script>

<style scoped>
.card-surface {
    @apply rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950;
}

.card-header {
    @apply mb-5 flex items-center justify-between gap-4;
}

.card-title {
    @apply m-0 text-base font-black text-slate-900 dark:text-white;
}

.card-hint {
    @apply text-[11px] font-bold text-slate-400 dark:text-zinc-500;
}

.step-pill {
    @apply inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-black text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300;
}

.field {
    @apply flex flex-col gap-2;
}

.field-label {
    @apply text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400;
}

.field-icon {
    @apply absolute left-4 top-1/2 -translate-y-1/2 text-slate-400;
}

.pay-tile {
    @apply relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition;
}

.pay-tile--idle {
    @apply border-slate-100 hover:border-indigo-200 dark:border-zinc-800 dark:hover:border-indigo-800/60;
}

.pay-tile--active {
    @apply border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20;
}

.pay-icon {
    @apply flex h-10 w-10 items-center justify-center rounded-xl transition-colors;
}

.pay-icon--idle {
    @apply bg-slate-100 text-slate-500 dark:bg-zinc-800;
}

.pay-icon--active {
    @apply bg-indigo-600 text-white;
}

.pay-check {
    @apply absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all;
}

.pay-check--idle {
    @apply border-slate-200 dark:border-zinc-700;
}

.pay-check--active {
    @apply border-indigo-600 bg-indigo-600;
}

.premium-input {
    @apply !h-14 !w-full !rounded-2xl !border-2 !border-slate-100 !bg-white !pl-12 !font-bold transition-all focus:!border-indigo-600 focus:!ring-0 dark:!border-zinc-800 dark:!bg-zinc-900;
}

:deep(.premium-select) {
    @apply !h-14 !rounded-2xl !border-2 !border-slate-100 !bg-white !font-bold transition-all focus:!border-indigo-600 focus:!ring-0 dark:!border-zinc-800 dark:!bg-zinc-900;
}

:deep(.premium-select .p-select-label) {
    @apply !py-4;
}

.premium-textarea {
    @apply !min-h-[120px] !w-full !rounded-2xl !border-2 !border-slate-100 !bg-white p-4 !font-bold transition-all focus:!border-indigo-600 focus:!ring-0 dark:!border-zinc-800 dark:!bg-zinc-900;
}

.checkout-button {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    @apply border-none text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.01] hover:shadow-indigo-300 active:scale-[0.99] dark:shadow-none;
}

.premium-drawer :deep(.p-drawer-content) {
    @apply !bg-slate-50 dark:!bg-zinc-950;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply rounded-full bg-slate-200 dark:bg-zinc-800;
}
</style>
