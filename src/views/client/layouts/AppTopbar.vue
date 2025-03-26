<template>
    <div :class="{ 'bg-primary ': isScrolled }" class="h-32 w-full drop-shadow-md flex flex-col gap-1 z-50 sticky top-0">
        <div class="mx-auto h-full container w-full items-center flex justify-between gap-3">
            <img class="w-auto h-10" src="../../../assets/img/logo.avif" alt="" />
            <div class="w-[500px]">
                <AutoComplete
                    v-model="value"
                    optionLabel="name"
                    :suggestions="itemSearch"
                    @complete="search"
                    placeholder="Tìm kiếm tên sản phẩm"
                    size="large"
                    fluid
                    @item-select="
                        (e) => {
                            router.push(`/detail/${e.value._id}`), (value = '');
                        }
                    "
                >
                    <template #option="slotProps">
                        <div class="flex items-center gap-4 cursor-pointer max-w-[500px] overflow-hidden hover:bg-gray-50" @click="router.push(`/detail/${slotProps.option._id}`)">
                            <!-- Ảnh dự án -->
                            <img :src="''" class="w-14 h-14 object-cover rounded-lg" alt="Project Image" />

                            <!-- Thông tin chính -->
                            <div class="flex flex-col min-w-0">
                                <!-- Tên dự án -->
                                <p class="font-semibold text-gray-800 w-full break-words truncate">--</p>
                                <div class="flex items-center gap-2 text-sm text-gray-600 mt-1" v-if="slotProps.option.type == 'TC'">
                                    <img :src="''" class="w-5 h-5 rounded-full" alt="Org Avatar" />
                                    <span> -- </span>
                                </div>
                                <div class="flex items-center gap-2 text-sm text-gray-600 mt-1" v-else>
                                    <img :src="''" class="w-5 h-5 rounded-full" alt="Org Avatar" />
                                    <span> -- </span>
                                </div>
                                <!-- Địa chỉ và tiến độ -->
                                <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <!-- Thông tin tổ chức -->
                                    <div class="flex items-center gap-1">
                                        <i class="pi pi-map-marker"></i>
                                        <span> -- </span>
                                    </div>
                                    <!-- Tiến độ quyên góp -->
                                    <div class="flex items-center gap-1">
                                        <i class="pi pi-heart-fill text-red-500"></i>
                                        <span> -- </span>
                                        <span>/</span>
                                        <span> --</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </AutoComplete>
            </div>

            <div class="flex items-center gap-2">
                <LoginModal></LoginModal>
                <Carts></Carts>
            </div>
        </div>
        <div class="mx-auto h-full container items-center flex gap-3">
            <div class="flex gap-20 font-semibold">
                <router-link to="/client" style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Trang chủ </router-link>
                <router-link style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Hàng mới </router-link>
                <router-link style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Sản phẩm </router-link>
                <router-link style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Thương hiệu </router-link>
                <router-link style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Hàng độc quyền </router-link>
                <router-link style="transition: 0.3s ease" :class="{ 'text-white': isScrolled }" class="hover:text-gray-700 text-primary"> Chương trình khuyến mãi </router-link>
            </div>
            <div></div>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import Carts from '../components/Carts.vue';
import LoginModal from '../components/LoginModal.vue';
import { ref, onMounted } from 'vue';
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
</script>
<style >
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
