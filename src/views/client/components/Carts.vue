<template>
    <div>
        <Button class="w-32" @click="openModal" label="Giỏ hàng" rounded icon="pi pi-shopping-cart"></Button>

        <Drawer v-model:visible="cartModal" position="right" style="width: 30%">
            <template #header>
                <div class="flex items-center gap-2">
                    <Button icon="pi pi-shopping-cart" text></Button>
                    <span class="font-bold">Giỏ hàng</span>
                </div>
            </template>
            <ScrollPanel v-for="(item, index) in ItemsStore" :key="index" style="width: 100%" class="flex flex-col">
                <div class="card border rounded-2xl grid items-center grid-cols-12 p-3 m-0 shadow-md">
                    <div class="col-span-2">
                        <Image :src="item.thumb" alt="Image" width="70" preview></Image>
                    </div>
                    <div class="col-span-8 flex flex-col">
                        <strong>{{ item.title }}</strong>
                        <div class="flex items-center justify-between gap-3">
                            <div>
                                <InputNumber :pt:pcInput:root:style="'width: 40px; text-align:center'" v-model="item.quantity" showButtons buttonLayout="horizontal">
                                    <template #incrementbuttonicon>
                                        <span class="pi pi-plus" />
                                    </template>
                                    <template #decrementbuttonicon> <span class="pi pi-minus" /> </template
                                ></InputNumber>
                            </div>
                            <span
                                >Giá sản phẩm: <strong class="text-primary">{{ formatPrice(item.price) }}đ</strong></span
                            >
                        </div>
                    </div>
                    <div class="col-span-2 flex justify-end">
                        <Button icon="pi pi-trash" text></Button>
                    </div>
                </div>
            </ScrollPanel>
            <template #footer>
                <div class="flex items-center justify-between w-full">
                    <span
                        >Tổng cộng
                        <strong
                            >{{
                                formatPrice(
                                    ItemsStore.reduce((total, el) => {
                                        return total + el.quantity * el.price;
                                    }, 0)
                                )
                            }}đ</strong
                        ></span
                    >
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
        title: 'Đồ chơi mô hình tỷ lệ 1:16 xe tải cần cẩu SCANIA BRUDER BRU03570',
        thumb: 'https://www.mykingdom.com.vn/cdn/shop/files/BRU03570.jpg?v=1736388709&width=990',
        quantity: 1,
        price: 31500
    }
]);
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};
</script>
<style></style>
