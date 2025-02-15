<template>
    <div>
        <Button @click="openModal" rounded icon="pi pi-shopping-cart" text></Button>

        <Drawer v-model:visible="cartModal" position="right" style="width: 30%">
            <template #header>
                <div class="flex items-center gap-2">
                    <Button icon="pi pi-shopping-cart" text></Button>
                    <span class="font-bold">Giỏ hàng</span>
                </div>
            </template>
            <ScrollPanel v-for="(item, index) in ItemsStore" :key="index" style="width: 100%" class="flex flex-col">
                <div class="card border grid grid-cols-12 p-3 m-0" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px">
                    <div class="col-span-2">
                        <Image :src="item.thumb" alt="Image" width="70" preview></Image>
                    </div>
                    <div class="col-span-10 flex flex-col">
                        <strong>{{ item.title }}</strong>
                        <span>Số lượng: {{ item.quantity }}</span>
                        <span>Giá sản phẩm: {{ formatPrice(item.price) }}đ</span>
                    </div>
                </div>
            </ScrollPanel>
            <template #footer>
                <div class="flex items-center justify-end w-full">
                    <Button label="Thanh toán"></Button>
                </div>
            </template>
        </Drawer>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useCartStore } from '../store/carts';
const cartModal = ref(false);

const cartStore = useCartStore();
onMounted(() => {
    console.log(cartStore.getCartItems());
});

const openModal = () => {
    cartModal.value = true;
};
const ItemsStore = ref([
    {
        title: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 2',
        thumb: 'https://product.hstatic.net/200000343865/product/2_69e21e81483a4b4096ab04302f0c0632_large.jpg',
        quantity: 1,
        price: 31500
    },
    {
        title: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 2',
        thumb: 'https://product.hstatic.net/200000343865/product/2_69e21e81483a4b4096ab04302f0c0632_large.jpg',
        quantity: 1,
        price: 31500
    },
    {
        title: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 2',
        thumb: 'https://product.hstatic.net/200000343865/product/2_69e21e81483a4b4096ab04302f0c0632_large.jpg',
        quantity: 1,
        price: 31500
    },
    {
        title: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 2',
        thumb: 'https://product.hstatic.net/200000343865/product/2_69e21e81483a4b4096ab04302f0c0632_large.jpg',
        quantity: 1,
        price: 31500
    },
    {
        title: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 2',
        thumb: 'https://product.hstatic.net/200000343865/product/2_69e21e81483a4b4096ab04302f0c0632_large.jpg',
        quantity: 1,
        price: 31500
    }
]);
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};
</script>
<style></style>
