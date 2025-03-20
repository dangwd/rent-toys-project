<template>
    <div v-if="detail" class="container mx-auto h-screen">
        <div class="font-montserrat text-sm bg-white dark:bg-zinc-900 flex flex-col gap-5">
            <div class="flex flex-col gap-5 my-5">
                <div class="flex items-center justify-between">
                    <Breadcrumb :home="home" :model="items" />
                    <Button @click="router.push('/client')" outlined rounded icon="pi pi-angle-left" raised></Button>
                </div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-5">
                        <img :src="detail.images ? detail.images[0] : ``" alt="" />
                    </div>
                    <div class="col-span-7 flex flex-col gap-3">
                        <strong class="text-xl uppercase">{{ detail.productName }}</strong>
                        <hr />
                        <div class="flex gap-4">
                            <span class="text-2xl font-semibold text-primary">{{ formatPrice(detail.price) }}đ</span>
                            <span class="text-2xl font-semibold line-through">10.000đ</span>
                        </div>
                        <hr />
                        <div class="grid grid-cols-12 text-base">
                            <div class="col-span-6">
                                <div class="flex flex-col gap-2">
                                    <div class="flex gap-2">
                                        <span>Mã sách: </span>
                                        <strong>{{ detail._id }}</strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>ISBN: </span>
                                        <strong>123123</strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Tác giả: </span>
                                        <strong>Fujiko F Fujio, Mugiwara Shintaro</strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Đối tượng: </span>
                                        <strong>Nhi đồng (6 – 11)</strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Khuôn Khổ: </span>
                                        <strong>13x18 cm</strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Số trang: </span>
                                        <strong>384</strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Định dạng: </span>
                                        <strong>bìa mềm </strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Trọng lượng: </span>
                                        <strong>345 gram </strong>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-6">
                                <div class="flex flex-col gap-2">
                                    <InputNumber v-model="quantity" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" fluid>
                                        <template #incrementbuttonicon>
                                            <span class="pi pi-plus" />
                                        </template>
                                        <template #decrementbuttonicon>
                                            <span class="pi pi-minus" />
                                        </template>
                                    </InputNumber>
                                    <Button @click="addToCart()" icon="pi pi-shopping-cart" severity="info" label="Thêm vào giỏ hàng"></Button>
                                    <Button icon="pi pi-verified" label="Mua ngay"></Button>
                                </div>
                            </div>
                        </div>
                        <Fieldset legend="Mô tả">
                            <p class="m-0 text-base">
                                {{ detail.descriptions }}
                            </p>
                        </Fieldset>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../store/carts';
const home = ref({
    icon: 'pi pi-home'
});
const items = ref([{ label: 'Trang chủ' }, { label: 'Manga -Comic' }, { label: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 2' }]);
const detail = ref({});
const router = useRouter();
const route = useRoute();
const quantity = ref(1);
const cartStore = useCartStore();
onMounted(() => {
    fetchDetailProduct();
});
const fetchDetailProduct = async () => {
    try {
        const res = await API.get(`product/${route.params.id}`);
        detail.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const addToCart = async () => {
    let data = {
        productId: detail.value._id,
        quantity: quantity.value
    };
    cartStore.addToCart(data);
};
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};
</script>
<style></style>
