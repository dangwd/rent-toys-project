<template>
    <div class="container mx-auto h-screen">
        <div class="font-montserrat text-sm bg-white dark:bg-zinc-900 flex flex-col gap-5">
            <div class="flex flex-col gap-5 my-5">
                <div class="flex items-center justify-between">
                    <Breadcrumb :home="home" :model="items" />
                    <Button @click="router.push('/client')" outlined rounded icon="pi pi-angle-left" raised></Button>
                </div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-5">
                        <img src="https://product.hstatic.net/200000343865/product/2_69e21e81483a4b4096ab04302f0c0632_master.jpg" alt="" />
                    </div>
                    <div class="col-span-7 flex flex-col gap-3">
                        <strong class="text-xl uppercase">Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 2</strong>
                        <hr />
                        <div class="flex gap-4">
                            <span class="text-2xl font-semibold text-primary">40.500đ</span>
                            <span class="text-2xl font-semibold line-through">10.000đ</span>
                        </div>
                        <hr />
                        <div class="grid grid-cols-12 text-base">
                            <div class="col-span-6">
                                <div class="flex flex-col gap-2">
                                    <div class="flex gap-2">
                                        <span>Mã sách: </span>
                                        <strong>5242218710002</strong>
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
                                    <InputNumber inputId="horizontal-buttons" showButtons buttonLayout="horizontal" fluid>
                                        <template #incrementbuttonicon>
                                            <span class="pi pi-plus" />
                                        </template>
                                        <template #decrementbuttonicon>
                                            <span class="pi pi-minus" />
                                        </template>
                                    </InputNumber>
                                    <Button icon="pi pi-shopping-cart" severity="info" label="Thêm vào giỏ hàng"></Button>
                                    <Button icon="pi pi-verified" label="Mua ngay"></Button>
                                </div>
                            </div>
                        </div>
                        <Fieldset legend="Mô tả">
                            <p class="m-0 text-base">
                                Tuyển tập thứ hai những trận đấu nổi bật với các cú ném ma thuật và đòn đánh “sát thủ”! Nối tiếp tiếng vang của tuyển tập thứ nhất, tuyển tập thứ hai tiếp tục điểm lại các trận đấu nổi bật xoay quanh vô số kĩ thuật
                                “sát thủ” do tác giả tự tay chọn lọc! Ngoài ra còn bao gồm 2 truyện ngắn “Doragolf”! Đây sẽ là tuyển tập mà cả các Fan của Doraemon Bóng chày lẫn Fan của chú mèo ú Doraemon rất mong chờ!
                            </p>
                        </Fieldset>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const home = ref({
    icon: 'pi pi-home'
});
const items = ref([{ label: 'Trang chủ' }, { label: 'Manga -Comic' }, { label: 'Tuyển tập Doraemon bóng chày - Truyền kì về bóng chày siêu cấp - Tập 2' }]);

const router = useRouter();
</script>
<style></style>
