<template>
    <div v-if="detail._id" class="container mx-auto max-w-6xl px-4 py-10">
        <div class="flex flex-col gap-8">
            <!-- Simplified Breadcrumb & Header -->
            <div class="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-zinc-800">
                <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <router-link to="/client" class="transition-colors hover:text-indigo-600">Trang chủ</router-link>
                    <span class="pi pi-chevron-right text-[10px]"></span>
                    <span class="font-medium text-slate-900 dark:text-white">{{ detail.productName }}</span>
                </div>
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div class="flex items-center gap-4">
                        <Button @click="router.back()" outlined rounded icon="pi pi-arrow-left" class="!h-10 !w-10 flex-shrink-0" />
                        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">{{ detail.productName }}</h1>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <span :class="detail.quantity > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'" class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                            {{ detail.quantity > 0 ? 'Còn hàng' : 'Hết hàng' }}
                        </span>
                        <span v-if="detail.discount" class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
                            Giảm {{ detail.discount }}%
                        </span>
                        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:bg-zinc-800 dark:text-slate-300">
                            Thương hiệu: {{ detail.brand?.brandName ?? 'Không rõ' }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
                <div class="space-y-6">
                    <div class="overflow-hidden rounded-3xl bg-white p-2 shadow-base ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 md:p-4">
                        <Galleria :value="detail.images" :responsiveOptions="responsiveOptions" :numVisible="5" class="custom-galleria" containerStyle="max-width: 100%;">
                            <template #item="slotProps">
                                <img :src="slotProps.item" crossorigin="anonymous" :alt="detail.productName" class="h-[460px] w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-105" />
                            </template>
                            <template #thumbnail="slotProps">
                                <img :src="slotProps.item" crossorigin="anonymous" :alt="detail.productName" class="h-20 w-full rounded-xl object-cover ring-2 ring-transparent transition-all hover:ring-indigo-500" />
                            </template>
                        </Galleria>
                    </div>
                </div>

                <aside class="space-y-6">
                    <!-- Action Card -->
                    <div class="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                        <div class="bg-indigo-600 px-6 py-4 text-white">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold uppercase tracking-widest opacity-90">Giá Đặc Biệt</span>
                                <span class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">Hot Deal</span>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex items-baseline gap-3">
                                <span class="text-4xl font-extrabold text-slate-900 dark:text-white">{{ formatPrice(priceAfterDiscount) }}đ</span>
                                <span v-if="hasDiscount" class="text-lg font-medium text-slate-400 line-through">{{ formatPrice(detail.price) }}đ</span>
                            </div>

                            <div class="mt-8 space-y-4">
                                <div class="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-zinc-900">
                                    <div class="flex items-center gap-3">
                                        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            <i class="pi pi-box"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Trong kho</p>
                                            <p class="font-bold text-slate-900 dark:text-white">{{ detail.quantity }} chiếc</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Đánh giá</p>
                                        <p class="font-bold text-indigo-600 dark:text-indigo-400">{{ totalComments }} nhận xét</p>
                                    </div>
                                </div>

                                <div class="space-y-4 pt-2">
                                    <div class="flex flex-col gap-2">
                                        <label class="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Số lượng</label>
                                        <InputNumber v-model="quantity" :min="1" :max="detail.quantity" showButtons buttonLayout="horizontal" fluid class="custom-input-number">
                                            <template #incrementbuttonicon><span class="pi pi-plus" /></template>
                                            <template #decrementbuttonicon><span class="pi pi-minus" /></template>
                                        </InputNumber>
                                    </div>

                                    <div class="grid gap-3 pt-2">
                                        <Button @click="addToCart()" label="Thêm vào giỏ hàng" icon="pi pi-shopping-cart" class="!rounded-2xl !py-3 font-bold" severity="secondary" outlined />
                                        <Button @click="buyNow()" label="Mua ngay" icon="pi pi-bolt" class="!rounded-2xl !py-4 font-bold" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Small Comment Form -->
                    <div class="rounded-3xl bg-white p-6 shadow-base ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                        <h2 class="mb-5 text-lg font-bold text-slate-900 dark:text-white">Viết nhận xét</h2>
                        <div class="space-y-4">
                            <div class="flex items-center gap-3">
                                <Avatar crossorigin="anonymous" :image="User?.thumbnail || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'" class="h-10 w-10 ring-2 ring-indigo-50" shape="circle" />
                                <span class="font-semibold text-slate-900 dark:text-white">{{ User?.name || 'Thành viên' }}</span>
                            </div>
                            <Rating v-model="cmtPayload.rating" :cancel="false" class="custom-rating" />
                            <Textarea v-model="cmtPayload.content" auto-resize placeholder="Chia sẻ cảm nghĩ của bạn về sản phẩm..." class="w-full !rounded-2xl !bg-slate-50 !border-none focus:!ring-2 focus:!ring-indigo-500 dark:!bg-zinc-900" rows="3" />
                            <Button @click="confirmSubmit()" label="Gửi đánh giá" icon="pi pi-send" class="w-full !rounded-xl" />
                        </div>
                    </div>
                </aside>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
                <div class="rounded-3xl bg-white p-8 shadow-base ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                    <h2 class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                        <i class="pi pi-info-circle text-indigo-600"></i>
                        Thông số sản phẩm
                    </h2>
                    <div class="space-y-1">
                        <div class="flex justify-between border-b border-slate-100 py-3 dark:border-zinc-800/50">
                            <span class="text-slate-500">Mã sản phẩm</span>
                            <span class="font-bold text-slate-900 dark:text-white">{{ detail._id }}</span>
                        </div>
                        <div class="flex justify-between border-b border-slate-100 py-3 dark:border-zinc-800/50">
                            <span class="text-slate-500">Xuất xứ</span>
                            <span class="font-bold text-slate-900 dark:text-white">{{ detail.madeIn }}</span>
                        </div>
                        <div class="flex justify-between border-b border-slate-100 py-3 dark:border-zinc-800/50">
                            <span class="text-slate-500">Độ tuổi phù hợp</span>
                            <span class="font-bold text-slate-900 dark:text-white">{{ detail.age }}</span>
                        </div>
                        <div class="flex justify-between border-b border-slate-100 py-3 dark:border-zinc-800/50">
                            <span class="text-slate-500">Giới tính</span>
                            <span class="font-bold text-slate-900 dark:text-white">{{ detail.sex === 'M' ? 'Nam' : detail.sex === 'F' ? 'Nữ' : 'Tất cả' }}</span>
                        </div>
                        <div class="flex justify-between py-3">
                            <span class="text-slate-500">Tình trạng</span>
                            <span class="font-bold text-emerald-600">{{ detail.quantity }} chiếc sẵn có</span>
                        </div>
                    </div>
                </div>

                <div class="rounded-3xl bg-white p-8 shadow-base ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                    <h2 class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                        <i class="pi pi-align-left text-indigo-600"></i>
                        Mô tả chi tiết
                    </h2>
                    <div class="prose prose-slate dark:prose-invert max-w-none">
                        <p class="text-base leading-relaxed text-slate-600 dark:text-slate-400">{{ detail.descriptions }}</p>
                    </div>
                </div>
            </div>

            <div class="rounded-3xl bg-white p-8 shadow-base ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Đánh giá từ khách hàng</h2>
                        <p class="mt-1 text-slate-500">Xem cảm nhận thực tế từ những người đã mua sản phẩm</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <p class="text-2xl font-bold text-indigo-600">{{ totalComments }}</p>
                            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Nhận xét</p>
                        </div>
                    </div>
                </div>

                <div class="grid gap-6">
                    <div v-if="!detail.comments?.length" class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-100 py-12 text-slate-400 dark:border-zinc-800">
                        <i class="pi pi-comments mb-3 text-4xl opacity-20"></i>
                        <p>Hiện chưa có đánh giá nào cho sản phẩm này.</p>
                    </div>
                    <div v-for="(item, index) in detail.comments || []" :key="index" class="group relative rounded-3xl border border-slate-100 bg-white p-6 transition-all hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                        <div class="flex items-center gap-4">
                            <Avatar crossorigin="anonymous" :image="item.user?.thumbnail || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'" size="large" shape="circle" class="ring-2 ring-white ring-offset-2 dark:ring-zinc-800 dark:ring-offset-zinc-950" />
                            <div>
                                <p class="font-bold text-slate-900 dark:text-white">{{ item.user?.name || 'Khách hàng ẩn danh' }}</p>
                                <Rating :value="item.rating" readonly stars="5" class="mt-1" />
                            </div>
                        </div>
                        <div class="mt-4 pl-14">
                            <p class="text-base leading-relaxed text-slate-600 dark:text-slate-400">{{ item.content }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <section class="pt-12">
                <div class="mb-8 flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Có thể bạn quan tâm</h2>
                        <p class="mt-1 text-slate-500">Gợi ý sản phẩm liên quan cho bạn</p>
                    </div>
                    <router-link to="/client/products-list" class="hidden text-sm font-bold text-indigo-600 hover:text-indigo-700 md:block">Xem tất cả <i class="pi pi-arrow-right ml-1 text-[10px]"></i></router-link>
                </div>
                <ProductsGrid :data="Products" />
            </section>
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
:deep(.custom-galleria .p-galleria-thumbnail-container) {
    background: transparent;
    padding: 1rem 0 0 0;
}

:deep(.custom-galleria .p-galleria-indicator-list) {
    display: none;
}

:deep(.custom-input-number .p-inputtext) {
    @apply font-bold text-center;
}

:deep(.custom-input-number .p-button) {
    @apply !bg-slate-100 !border-none !text-slate-600 hover:!bg-indigo-100 hover:!text-indigo-600 transition-colors;
}

:deep(.p-rating-item .p-rating-icon) {
    @apply text-amber-400;
}

.shadow-base {
    box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
}
</style>
