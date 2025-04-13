<template>
    <div>
        <Button class="w-32 whitespace-nowrap" @click="openModal" :text="!isScrolled" :badge="itemInCart.items?.length" :label="`Giỏ hàng `" rounded icon="pi pi-shopping-cart"></Button>

        <Drawer v-model:visible="cartModal" position="right" style="width: 30%">
            <template #header>
                <div class="flex items-center gap-2">
                    <Button icon="pi pi-shopping-cart" text></Button>
                    <span class="font-bold">Giỏ hàng</span>
                </div>
            </template>

            <ScrollPanel v-for="(item, index) in itemInCart.items" :key="index" style="width: 100%" class="flex flex-col">
                <div class="card border rounded-2xl grid items-center grid-cols-12 p-3 m-0 shadow-md">
                    <div class="col-span-2">
                        <Image crossorigin="anonymous" :src="item.images ? item.images[0] : ``" alt="Image" width="70" preview></Image>
                    </div>
                    <div class="col-span-8 flex flex-col">
                        <strong>{{ item.productName }}</strong>
                        <div class="flex items-center justify-between gap-3">
                            <div>
                                <InputNumber :pt:pcInput:root:style="'width: 40px; text-align:center'" :min="1" v-model="item.quantity" @input="onQuantityChange($event, item)" showButtons buttonLayout="horizontal"> </InputNumber>
                            </div>
                            <span
                                >Giá sản phẩm: <strong class="text-primary">{{ formatPrice(item.finalSubTotal) }}đ</strong></span
                            >
                        </div>
                    </div>
                    <div class="col-span-2 flex justify-end">
                        <Button @click="removeItem(item.productId)" icon="pi pi-trash" text></Button>
                    </div>
                </div>
            </ScrollPanel>
            <template #footer>
                <div class="flex items-center justify-between w-full">
                    <span
                        >Tổng cộng <strong>{{ formatPrice(totalCartValue ? totalCartValue : itemInCart.totalPrice) }}đ</strong></span
                    >
                    <Button @click="directPayment" label="Thanh toán"></Button>
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
const cartModal = ref(false);
const cartStore = useCartStore();
const props = defineProps(['isScrolled']);

const router = useRouter();
onMounted(async () => {
    fetchItem();
});

const itemInCart = ref([]);
const openModal = async () => {
    await fetchItem();
    cartModal.value = true;
};
const totalCartValue = ref();
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};
const removeItem = async (id) => {
    let data = {
        productId: id
    };
    const res = await cartStore.removeItem(data);
    if (res) {
        fetchItem();
    }
};
const fetchItem = async () => {
    try {
        const res = await API.get(`cart`);
        if (res.status === 401) {
            return router.push(`/auth/login`);
        }
        itemInCart.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const onQuantityChange = async (e, data) => {
    let payload = {
        productId: data.productId,
        quantity: e.value
    };
    const res = await cartStore.updateCart(payload);
    totalCartValue.value = res.data.metadata.finalPrice;
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
    async (newCart) => {
        itemInCart.value = await cartStore.getItem();
    },
    { deep: true }
);
</script>
<style></style>
