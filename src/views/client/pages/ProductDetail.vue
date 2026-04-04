<template>
    <div v-if="detail._id" class="container mx-auto max-w-6xl px-4 py-10">
        <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div class="flex items-center gap-3">
                        <Button @click="router.push('/client')" outlined rounded icon="pi pi-angle-left" raised class="min-w-[44px]" />
                        <div>
                            <p class="text-sm text-slate-500 dark:text-slate-400">Trang chủ / <span class="font-semibold text-slate-900 dark:text-white">{{ detail.productName }}</span></p>
                            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">{{ detail.productName }}</h1>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">{{ detail.quantity > 0 ? 'Còn hàng' : 'Hết hàng' }}</span>
                        <span v-if="detail.discount" class="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-rose-800 dark:bg-rose-900/20 dark:text-rose-200">Giảm {{ detail.discount }}%</span>
                        <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-sky-800 dark:bg-sky-900/20 dark:text-sky-200">Thương hiệu: {{ detail.brand?.brandName ?? 'Không rõ' }}</span>
                    </div>
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
                <div class="space-y-6">
                    <div class="rounded-[32px] bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 md:p-6">
                        <Galleria
                            :value="detail.images"
                            :responsiveOptions="responsiveOptions"
                            :numVisible="5"
                            class="rounded-[24px]"
                            containerStyle="max-width: 100%;"
                        >
                            <template #item="slotProps">
                                <img :src="slotProps.item" crossorigin="anonymous" :alt="detail.productName" class="h-[460px] w-full rounded-[24px] object-cover" />
                            </template>
                            <template #thumbnail="slotProps">
                                <img :src="slotProps.item" crossorigin="anonymous" :alt="detail.productName" class="h-24 w-full rounded-xl object-cover" />
                            </template>
                        </Galleria>
                    </div>

                    
                </div>

                <aside class="space-y-6">
                    <div class="rounded-[32px] bg-gradient-to-br from-sky-600 to-cyan-500 p-6 text-white shadow-lg">
                        <div class="flex items-center justify-between">
                            <span class="text-sm uppercase tracking-[0.2em] opacity-90">Giá tốt nhất</span>
                            <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">Ưu đãi</span>
                        </div>
                        <div class="mt-5 flex items-end gap-3">
                            <span class="text-4xl font-semibold">{{ formatPrice(priceAfterDiscount) }}đ</span>
                            <span v-if="hasDiscount" class="text-sm line-through opacity-80">{{ formatPrice(detail.price) }}đ</span>
                        </div>
                        <div class="mt-5 grid gap-3 text-sm leading-6">
                            <div class="flex justify-between">
                                <span>Giảm giá</span>
                                <strong>{{ detail.discount || 0 }}%</strong>
                            </div>
                            <div class="flex justify-between">
                                <span>Kho hàng</span>
                                <strong>{{ detail.quantity }} chiếc</strong>
                            </div>
                            <div class="flex justify-between">
                                <span>Đánh giá</span>
                                <strong>{{ totalComments }} nhận xét</strong>
                            </div>
                        </div>
                        <div class="mt-6 space-y-3">
                            <InputNumber v-model="quantity" :min="1" :max="detail.quantity" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" fluid>
                                <template #incrementbuttonicon>
                                    <span class="pi pi-plus" />
                                </template>
                                <template #decrementbuttonicon>
                                    <span class="pi pi-minus" />
                                </template>
                            </InputNumber>
                            <Button @click="addToCart()" icon="pi pi-shopping-cart" severity="warning" label="Thêm vào giỏ hàng" class="w-full" />
                            <Button @click="buyNow()" icon="pi pi-verified" severity="success" label="Mua ngay" class="w-full" />
                        </div>
                    </div>

                    <div class="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Đánh giá sản phẩm</h2>
                            <span class="text-sm text-slate-500 dark:text-slate-400">{{ totalComments }} nhận xét</span>
                        </div>
                        <div class="mt-5 flex gap-4">
                            <Avatar
                                crossorigin="anonymous"
                                :image="User?.thumbnail || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'"
                                class="h-14 w-14 rounded-full object-cover"
                                size="large"
                                shape="circle"
                            />
                            <div class="flex-1">
                                <strong class="block text-sm text-slate-900 dark:text-white">{{ User?.name || 'Bạn' }}</strong>
                                <div class="mt-3 space-y-4">
                                    <Rating v-model="cmtPayload.rating" cancel="false" />
                                    <Textarea v-model="cmtPayload.content" auto-resize placeholder="Viết đánh giá của bạn..." class="w-full" />
                                    <div class="flex justify-end">
                                        <Button @click="confirmSubmit()" label="Gửi đánh giá" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
            <div class="flex flex-col gap-5 ">
                        <div class="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                            <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Thông tin sản phẩm</h2>
                            <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                <div class="flex justify-between gap-3 rounded-3xl bg-slate-50 p-3 dark:bg-zinc-900">
                                    <span class="font-medium">Mã sản phẩm</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{{ detail._id }}</span>
                                </div>
                                <div class="flex justify-between gap-3 rounded-3xl bg-slate-50 p-3 dark:bg-zinc-900">
                                    <span class="font-medium">Xuất xứ</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{{ detail.madeIn }}</span>
                                </div>
                                <div class="flex justify-between gap-3 rounded-3xl bg-slate-50 p-3 dark:bg-zinc-900">
                                    <span class="font-medium">Độ tuổi</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{{ detail.age }}</span>
                                </div>
                                <div class="flex justify-between gap-3 rounded-3xl bg-slate-50 p-3 dark:bg-zinc-900">
                                    <span class="font-medium">Giới tính</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{{ detail.sex === 'M' ? 'Nam' : detail.sex === 'F' ? 'Nữ' : 'Khác' }}</span>
                                </div>
                                <div class="flex justify-between gap-3 rounded-3xl bg-slate-50 p-3 dark:bg-zinc-900">
                                    <span class="font-medium">Còn lại</span>
                                    <span class="font-semibold text-slate-900 dark:text-white">{{ detail.quantity }} chiếc</span>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                            <h2 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Mô tả sản phẩm</h2>
                            <p class="text-sm leading-7 text-slate-600 dark:text-slate-300">{{ detail.descriptions }}</p>
                        </div>
                    </div>
            <div class="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div class="mb-6 flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Nhận xét từ khách hàng</h2>
                    <span class="text-sm text-slate-500 dark:text-slate-400">Xem lại những đánh giá mới nhất</span>
                </div>
                <div class="grid gap-4">
                    <div v-if="!detail.comments?.length" class="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-zinc-800 dark:text-slate-400">Chưa có đánh giá nào cho sản phẩm này.</div>
                    <div v-for="(item, index) in detail.comments || []" :key="index" class="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                        <div class="flex items-center gap-4">
                            <Avatar crossorigin="anonymous" :image="item.user?.thumbnail || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'" size="large" shape="circle" class="object-cover" />
                            <div>
                                <p class="font-semibold text-slate-900 dark:text-white">{{ item.user?.name || 'Khách hàng' }}</p>
                                <Rating :value="item.rating" readonly stars="5" />
                            </div>
                        </div>
                        <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ item.content }}</p>
                    </div>
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <strong class="text-xl text-slate-900 dark:text-white">Có thể bạn quan tâm</strong>
                    <span class="text-sm text-slate-500 dark:text-slate-400">Gợi ý sản phẩm liên quan</span>
                </div>
                <ProductsGrid :data="Products" />
            </div>
        </div>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { formatPrice } from '@/helper/formatPrice';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductsGrid from '../components/ProductsGrid.vue';
import { useCartStore } from '../store/carts';
const { proxy } = getCurrentInstance();
const toast = useToast();
const detail = ref({});
const router = useRouter();
const route = useRoute();
const quantity = ref(1);
const cmtPayload = ref({
    content: '',
    rating: 0
});
const clearCmtPayload = JSON.stringify(cmtPayload.value);
const User = ref();
const cartStore = useCartStore();
const Products = ref([]);
const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
const priceAfterDiscount = computed(() => {
    if (!detail.value.price) return 0;
    return detail.value.price - (detail.value.price * (detail.value.discount || 0)) / 100;
});
const hasDiscount = computed(() => detail.value.discount > 0);
const totalComments = computed(() => detail.value.comments?.length || 0);

// Helper function to extract error message from API response
const getErrorMessage = (error) => {
    if (!error) return 'Có lỗi xảy ra!';
    
    // Try to extract message from API response
    const message = 
        error?.response?.data?.metadata?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Có lỗi xảy ra, vui lòng thử lại!';
    
    return typeof message === 'string' ? message : JSON.stringify(message);
};

onMounted(() => {
    fetchAllProducts();
    fetchDetailProduct();
    getMe();
});
const fetchDetailProduct = async () => {
    try {
        const res = await API.get(`product/${route.params.id}`);
        detail.value = res.data.metadata;
    } catch (error) {
        const errorMsg = getErrorMessage(error);
        console.error('Fetch product error:', errorMsg);
        proxy.$notify('E', errorMsg, toast);
    }
};
const addToCart = async () => {
    const data = {
        productId: detail.value._id,
        quantity: quantity.value
    };
    try {
        await cartStore.addToCart(data);
        proxy.$notify('S', 'Đã thêm vào giỏ hàng!', toast);
    } catch (error) {
        console.error(error);
        const errorMsg = getErrorMessage(error);
        console.error('Add to cart error:', errorMsg);
        proxy.$notify('E', errorMsg, toast);
    }
};
const buyNow = () => {
    router.push(`/client/payment?prd=${detail.value._id}&qt=${quantity.value}`);
};
const fetchAllProducts = async () => {
    try {
        const res = await API.get(`products`);
        Products.value = res.data.metadata.result;
    } catch (error) {
        const errorMsg = getErrorMessage(error);
        console.error('Fetch products error:', errorMsg);
    }
};
const confirmSubmit = async () => {
    try {
        const res = await API.create(`product/${detail.value._id}/comment`, cmtPayload.value);
        if (res.data) {
            await fetchDetailProduct();
            proxy.$notify('S', 'Đánh giá được gửi thành công!', toast);
            cmtPayload.value = JSON.parse(clearCmtPayload);
        }
    } catch (error) {
        const errorMsg = getErrorMessage(error);
        console.error('Submit comment error:', errorMsg);
        proxy.$notify('E', errorMsg, toast);
    }
};
const getMe = async () => {
    try {
        const res = await API.get(`get-me`);
        User.value = res.data.metadata;
    } catch (error) {
        const errorMsg = getErrorMessage(error);
        console.error('Get user info error:', errorMsg);
    }
};
watch(
    () => route.params.id,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            fetchDetailProduct();
        }
    }
);
</script>
<style scoped>
</style>
