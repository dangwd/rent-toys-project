<template>
    <div v-if="detail" class="container mx-auto h-auto py-10">
        <div class="font-montserrat text-sm bg-white dark:bg-zinc-900 flex flex-col gap-5">
            <div class="flex flex-col gap-5 my-5">
                <div class="flex items-center justify-between">
                    <!-- <Breadcrumb :home="home" :model="items" /> -->
                    <Button @click="router.push('/client')" outlined rounded icon="pi pi-angle-left" raised></Button>
                </div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-5">
                        <!-- <img :src="detail.images ? detail.images[0] : ``" alt="" /> -->
                        <Galleria :value="detail.images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 640px">
                            <template #item="slotProps">
                                <img :src="slotProps.item" crossorigin="anonymous" :alt="slotProps.item.alt" style="width: 100%" />
                            </template>
                            <template #thumbnail="slotProps">
                                <img :src="slotProps.item" crossorigin="anonymous" style="width: 100px" class="object-cover" />
                            </template>
                        </Galleria>
                    </div>
                    <div class="col-span-7 flex flex-col gap-3">
                        <strong class="text-xl uppercase">{{ detail.productName }}</strong>
                        <hr />
                        <div class="flex gap-4">
                            <strong class="text-2xl text-primary">{{ formatPrice(detail.price - (detail.price * detail.discount) / 100) }}đ</strong>
                            <strong v-if="detail.discount" class="text-2xl text-secondary line-through">{{ formatPrice(detail.price) }}đ</strong>
                        </div>
                        <hr />
                        <div class="grid grid-cols-12 text-base">
                            <div class="col-span-6">
                                <div class="flex flex-col gap-2">
                                    <div class="flex gap-2">
                                        <span>Mã sản phẩm: </span>
                                        <strong>{{ detail._id }}</strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Xuất xứ: </span>
                                        <strong> {{ detail.madeIn }} </strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Tuổi: </span>
                                        <strong>{{ detail.age }}</strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Thương hiệu: </span>
                                        <strong>{{ detail.brand?.brandName }}</strong>
                                    </div>
                                    <div class="flex gap-2">
                                        <span>Giới tính: </span>
                                        <strong>{{ detail.sex === 'M' ? 'Nam' : detail.sex === 'F' ? 'Nữ' : 'Khác' }}</strong>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-6">
                                <div class="flex flex-col gap-2">
                                    <InputNumber v-model="quantity" :min="1" :max="detail.quantity" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" fluid>
                                        <template #incrementbuttonicon>
                                            <span class="pi pi-plus" />
                                        </template>
                                        <template #decrementbuttonicon>
                                            <span class="pi pi-minus" />
                                        </template>
                                    </InputNumber>
                                    <Button @click="addToCart()" icon="pi pi-shopping-cart" severity="info" label="Thêm vào giỏ hàng"></Button>
                                    <Button @click="buyNow()" icon="pi pi-verified" label="Mua ngay"></Button>
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
        <div class="border border-gray-300 p-4 rounded-lg flex flex-col gap-3">
            <strong class="text-xl">Đánh giá sản phẩm</strong>
            <div class="flex flex-col gap-2">
                <div class="flex gap-2">
                    <Avatar crossorigin="anonymous" :image="User?.thumbnail ? User?.thumbnail : `https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png`" class="mr-2 object-cover" size="large" shape="circle" />
                    <div class="flex flex-col gap-2 w-full">
                        <strong>{{ User?.name }}</strong>
                        <Rating v-model="cmtPayload.rating" />
                        <Textarea v-model="cmtPayload.content" auto-resize class="w-full"></Textarea>
                        <div class="flex justify-end">
                            <Button @click="confirmSubmit()" label="Gửi"></Button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="(item, index) in detail.comments" :key="index" class="flex flex-col gap-3">
                <div class="flex gap-2 p-2">
                    <Avatar crossorigin="anonymous" :image="item.user?.thumbnail" class="mr-2 object-cover" size="large" shape="circle" />
                    <div class="flex flex-col gap-2">
                        <strong>{{ item.user?.name }}</strong>
                        <Rating v-model="item.rating" />
                        <span>{{ item.content }}</span>
                    </div>
                </div>
                <hr />
            </div>
        </div>
        <strong class="text-xl">Có thể bạn quan tâm</strong>

        <ProductsGrid :data="Products"></ProductsGrid>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import ProductsGrid from '../components/ProductsGrid.vue';
import { formatPrice } from '@/helper/formatPrice';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../store/carts';
const { proxy } = getCurrentInstance();
const toast = useToast();
const home = ref({
    icon: 'pi pi-home'
});
// const items = ref([{ label: 'Trang chủ' }, { label: 'Manga -Comic' }, { label: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 2' }]);
const detail = ref({});
const router = useRouter();
const route = useRoute();
const quantity = ref(1);
const value = ref(4);
const cmtPayload = ref({
    content: '',
    rating: 0
});
const clearCmtPayload = JSON.stringify(cmtPayload.value);
const User = ref();
const cartStore = useCartStore();
const Products = ref([]);
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
        console.log(error);
    }
};
const addToCart = async () => {
    let data = {
        productId: detail.value._id,
        quantity: quantity.value
    };
    try {
        const res = await cartStore.addToCart(data);
    } catch (error) {
        proxy.$notify('S', error, toast);
    }
};
const buyNow = () => {
    router.push(`/client/payment?prd=${detail.value._id}&qt=${quantity.value}`);
};
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
const fetchAllProducts = async () => {
    try {
        const res = await API.get(`products`);
        Products.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};
const confirmSubmit = async () => {
    try {
        const res = await API.create(`product/${detail.value._id}/comment`, cmtPayload.value);
        if (res.data) {
            fetchDetailProduct();
            proxy.$notify('S', 'Thành công!', toast);
            cmtPayload.value = JSON.parse(clearCmtPayload);
        }
    } catch (error) {
        console.log(error);
    }
};
const getMe = async () => {
    try {
        const res = await API.get(`get-me`);
        User.value = res.data.metadata;
    } catch (error) {
        console.log(error);
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
<style></style>
