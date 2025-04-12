<template>
    <div :class="{ '!bg-primary': isScrolled }" class="h-32 w-full drop-shadow-md bg-white flex flex-col gap-1 z-50 sticky top-0">
        <div class="mx-auto h-full container w-full items-center flex justify-between gap-3">
            <router-link to="/client">
                <img width="200" src="../../../assets/img/logo.avif" alt="" />
            </router-link>
            <div class="w-[500px]">
                <AutoComplete
                    input-id="cc"
                    :autocomplete="false"
                    v-model="value"
                    optionLabel="name"
                    :suggestions="itemSearch"
                    scrollHeight="500px"
                    @complete="search"
                    placeholder="Tìm kiếm tên sản phẩm"
                    size="large"
                    fluid
                    @item-select="
                        (e) => {
                            router.push(`/client/detail/${e.value._id}`), (value = '');
                        }
                    "
                >
                    <template #option="slotProps">
                        <div class="flex items-center gap-4 p-2 cursor-pointer max-w-[500px] overflow-hidden hover:bg-gray-50" @click="router.push(`/client/detail/${slotProps.option._id}`)">
                            <img crossorigin="anonymous" :src="slotProps.option.images ? slotProps.option.images[0] : ''" class="w-14 h-14 object-cover rounded-lg" alt="Project Image" />

                            <!-- Thông tin chính -->
                            <div class="flex flex-col min-w-0">
                                <p class="font-semibold text-gray-800 w-full break-words truncate">{{ slotProps.option.productName }}</p>
                                <div class="flex flex-col gap-2 text-sm text-gray-500 mt-1">
                                    <div class="flex items-center gap-1">
                                        <span>SKU: {{ slotProps.option._id }} đ</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <span> {{ formatPrice(slotProps.option.price) }} đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </AutoComplete>
            </div>

            <div class="flex items-center gap-2">
                <LoginModal :isScrolled="isScrolled"></LoginModal>
                <Carts :isScrolled="isScrolled"></Carts>
            </div>
        </div>
        <div class="mx-auto h-full container justify-center flex gap-3">
            <div class="flex items-center gap-20 font-semibold uppercase">
                <router-link to="/client" style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Trang chủ </router-link>
                <router-link to="/client/new-products?t=new" style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Hàng mới </router-link>
                <router-link to="/client/products-list" style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Sản phẩm </router-link>
                <router-link to="/client/brands-page" style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Thương hiệu </router-link>
                <router-link to="/client/monopoly" style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Hàng độc quyền </router-link>
                <!-- <router-link to="/" style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Chương trình khuyến mãi </router-link> -->
            </div>
        </div>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { formatPrice } from '@/helper/formatPrice';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Carts from '../components/Carts.vue';
import LoginModal from '../components/LoginModal.vue';
const router = useRouter();
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});
const isScrolled = ref(false);
const itemSearch = ref([]);
const value = ref('');
const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};
const search = async () => {
    try {
        const res = await API.get(`products?search=${value.value}`);
        itemSearch.value = res.data.metadata.result;
    } catch (error) {
        console.log(error);
    }
};
</script>
<style>
.hover-underline-animation {
    display: inline-block;
    position: relative;
}

.hover-underline-animation::after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 3px;
    bottom: 0;
    left: 0;
    background-color: var(--primary-color);
    transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover::after {
    transform: scaleX(1);
}

.hover-underline-animation.left::after {
    transform-origin: bottom right;
}

.hover-underline-animation.left:hover::after {
    transform-origin: bottom left;
}
.p-autocomplete > .p-autocomplete-input {
    border-radius: 25px;
}
</style>
