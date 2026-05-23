<template>
    <div>
        <Button
            @click="openModal"
            :text="!isScrolled"
            :badge="itemInCart.items?.length || undefined"
            rounded
            icon="pi pi-shopping-cart"
        />

        <Drawer v-model:visible="cartModal" position="right" style="width: 26rem" class="cart-drawer">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <i class="pi pi-shopping-cart"></i>
                    </div>
                    <div>
                        <p class="m-0 font-black text-slate-900 dark:text-white">Giỏ hàng</p>
                        <p class="m-0 text-xs text-slate-500 dark:text-zinc-400">{{ itemInCart.items?.length || 0 }} sản phẩm</p>
                    </div>
                </div>
            </template>

            <!-- Empty state -->
            <div v-if="!itemInCart.items?.length" class="flex h-full flex-col items-center justify-center py-20 text-slate-300 dark:text-zinc-600">
                <i class="pi pi-shopping-cart mb-4 text-6xl opacity-30"></i>
                <p class="font-black uppercase tracking-widest text-sm text-slate-400 dark:text-zinc-500">Giỏ hàng trống</p>
                <p class="mt-1 text-xs text-slate-400 dark:text-zinc-600">Thêm sản phẩm để bắt đầu mua sắm</p>
            </div>

            <!-- Items list -->
            <div v-else class="flex flex-col gap-3 overflow-y-auto p-4">
                <div
                    v-for="(item, index) in itemInCart.items"
                    :key="index"
                    class="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <!-- Image -->
                    <div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 dark:bg-zinc-800">
                        <img
                            crossorigin="anonymous"
                            :src="item.images?.[0] || ''"
                            :alt="item.productName"
                            class="h-full w-full object-cover"
                        />
                    </div>

                    <!-- Info -->
                    <div class="min-w-0 flex-1">
                        <p class="m-0 truncate text-sm font-bold text-slate-900 dark:text-white" :title="item.productName">{{ item.productName }}</p>
                        <p class="m-0 mt-0.5 text-xs font-black text-indigo-600 dark:text-indigo-400">{{ formatPrice(item.finalSubTotal) }}đ</p>

                        <!-- Quantity controls -->
                        <div class="mt-2 flex items-center gap-2">
                            <button
                                @click="changeQty(item, -1)"
                                :disabled="item.quantity <= 1 || updatingId === item.productId"
                                class="qty-btn"
                            >
                                <i class="pi pi-minus text-[10px]"></i>
                            </button>
                            <span class="w-7 text-center text-sm font-bold text-slate-900 dark:text-white">
                                {{ updatingId === item.productId ? '…' : item.quantity }}
                            </span>
                            <button
                                @click="changeQty(item, 1)"
                                :disabled="updatingId === item.productId"
                                class="qty-btn"
                            >
                                <i class="pi pi-plus text-[10px]"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Remove -->
                    <button
                        @click="removeItem(item.productId)"
                        class="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                    >
                        <i class="pi pi-trash text-sm"></i>
                    </button>
                </div>
            </div>

            <template #footer>
                <div class="border-t border-slate-100 p-4 dark:border-zinc-800">
                    <div class="mb-4 flex items-center justify-between">
                        <span class="text-sm text-slate-500 dark:text-zinc-400">Tổng cộng</span>
                        <span class="text-xl font-black text-slate-900 dark:text-white">
                            {{ formatPrice(totalCartValue ?? itemInCart.totalPrice ?? 0) }}đ
                        </span>
                    </div>
                    <Button
                        @click="directPayment"
                        label="Thanh toán"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        :disabled="!itemInCart.items?.length"
                        fluid
                        class="!h-12 !rounded-2xl !font-black"
                    />
                </div>
            </template>
        </Drawer>
    </div>
</template>

<script setup>
import API from '@/api/api-main';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../store/carts';

const { proxy } = getCurrentInstance();
const toast = useToast();
const router = useRouter();
const cartStore = useCartStore();

defineProps(['isScrolled']);

const cartModal = ref(false);
const itemInCart = ref({ items: [] });
const totalCartValue = ref(null);
const updatingId = ref(null);

const formatPrice = (price) => new Intl.NumberFormat('en-US').format(Math.round(price ?? 0));

const openModal = async () => {
    await fetchItem();
    cartModal.value = true;
};

const fetchItem = async () => {
    try {
        const res = await API.get('cart');
        itemInCart.value = res.data.metadata;
        totalCartValue.value = null;
    } catch {
        // not logged in or network error — silently skip
    }
};

onMounted(fetchItem);

const removeItem = async (productId) => {
    const res = await cartStore.removeItem({ productId });
    if (res) fetchItem();
};

const changeQty = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    updatingId.value = item.productId;
    try {
        const res = await cartStore.updateCart({ productId: item.productId, quantity: newQty });
        totalCartValue.value = res?.data?.metadata?.finalPrice ?? null;
        await fetchItem();
    } catch {
        proxy.$notify('E', 'Không thể cập nhật số lượng', toast);
    } finally {
        updatingId.value = null;
    }
};

const directPayment = () => {
    if (!itemInCart.value.items?.length) {
        return proxy.$notify('W', 'Không có sản phẩm trong giỏ hàng!', toast);
    }
    cartModal.value = false;
    router.push('/client/payment');
};

watch(
    () => cartStore.cart,
    async () => {
        itemInCart.value = await cartStore.getItem();
    },
    { deep: true }
);
</script>

<style scoped>
.qty-btn {
    @apply flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300;
}

:deep(.cart-drawer .p-drawer-content) {
    @apply flex flex-col overflow-hidden p-0;
}
</style>
