<template>
    <div class="h-auto container mx-auto">
        <Tabs value="0">
            <TabList>
                <Tab value="0">Thông tin tài khoản</Tab>
                <Tab value="1">Danh sách đơn hàng</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="grid grid-cols-12">
                        <div class="col-span-3 flex flex-col gap-3 items-center">
                            <img class="rounded-full w-32 object-cover" :src="'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'" alt="" />

                            <strong>-- </strong>
                            <strong class="text-primary">--</strong>
                        </div>
                        <div class="col-span-9 flex flex-col gap-3">
                            <div class="border border-gray-300 p-4 rounded-md">
                                <h4 class="font-bold mb-4 text-xl">Thông tin người dùng</h4>
                                <div class="grid mt-1 m-0">
                                    <div class="m-0">
                                        <div class="flex flex-col gap-3">
                                            <div class="flex gap-2">
                                                <label class="w-10">Họ tên: </label>
                                                <strong class="w-30"> -- </strong>
                                            </div>

                                            <div class="flex gap-2">
                                                <label class="w-7rem" for="">Chi nhánh: </label>
                                                <strong class="w-30rem">{{
                                                    ProfileUser?.userBranchCounters
                                                        ?.map((el) => el.branch?.branchName)
                                                        .filter((el) => el)
                                                        .join(', ')
                                                }}</strong>
                                            </div>
                                            <div class="flex gap-2">
                                                <label class="w-7rem">Quầy: </label>
                                                <strong class="w-30rem"> -- </strong>
                                            </div>
                                            <div class="flex gap-2">
                                                <label class="w-7rem">Trạng thái: </label>
                                                <strong class="w-30rem"> -- </strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="m-0">
                                        <div class="flex flex-col gap-3">
                                            <div class="flex gap-2">
                                                <label class="w-10rem">Tên đăng nhập: </label>
                                                <strong class="w-30rem"></strong>
                                            </div>
                                            <div class="flex gap-2">
                                                <label class="w-10rem">Email: </label>
                                                <strong class="w-30rem"></strong>
                                            </div>
                                            <div class="flex gap-2">
                                                <label class="w-10rem">Số điện thoại: </label>
                                                <strong class="w-30rem"></strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="border border-gray-300 p-4 rounded-md">
                                <h4 class="font-bold mb-4 text-xl">Đổi mật khẩu</h4>
                                <div class="grid grid-cols-2 gap-3 mt-1 m-0">
                                    <div class="col flex flex-col gap-3">
                                        <div class="flex flex-col gap-2">
                                            <label for="">Mật khẩu hiện tại</label>
                                            <Password fluid toggleMask />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label for="">Mật khẩu mới</label>
                                            <Password fluid toggleMask />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label for="">Nhập lại mật khẩu</label>
                                            <Password fluid toggleMask />
                                        </div>
                                    </div>
                                    <div class="col flex flex-col gap-3">
                                        <div class="flex gap-2 items-center">
                                            <i class="pi pi-lock"></i>
                                            <p>Bạn nên sử dụng mật khẩu mạnh mà mình chưa sử dụng ở đâu khác</p>
                                        </div>
                                        <div class="flex gap-2 items-center">
                                            <i class="pi pi-exclamation-triangle"></i>
                                            <p>Mật khẩu tài khoản của bạn phải đáp ứng các yêu cầu sau:</p>
                                        </div>
                                        <ul class="flex flex-col list-disc list-inside gap-3 m-0">
                                            <li>Có ít nhất 8 ký tự</li>
                                            <li>Có ít nhất một chữ hoa và một chữ thường</li>
                                            <li>Có ít nhất một chữ số</li>
                                            <li>Có ít nhất một ký tự đặc biệt</li>
                                        </ul>
                                        <div class="flex justify-end">
                                            <Button @click="confirmChangePassword" label="Cập nhật"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="1">
                    <DataTable :value="Orders" show-gridlines paginator :rows="paginator.rows" :page="paginator.page" :total-records="paginator.total" lazy>
                        <Column header="#">
                            <template #body="{ index }">
                                {{ index + 1 }}
                            </template>
                        </Column>
                        <Column header="Sản phẩm" style="max-width: 200px">
                            <template #body="{ data }">
                                {{ data.items.map((el) => el.productName).join(', ') }}
                            </template>
                        </Column>
                        <Column header="Số lượng">
                            <template #body="{ data }">
                                {{ data.items.map((el) => el.quantity).join(', ') }}
                            </template>
                        </Column>
                        <Column header="KM">
                            <template #body="{ data }">
                                {{ data.coupon ? `${data?.coupon?.CouponName} (${formatPrice(data?.coupon?.CouponValue)})` : `Không KM` }}
                            </template>
                        </Column>
                        <Column header="Giá trị đơn hàng">
                            <template #body="{ data }">
                                {{ formatPrice(data.totalPrice) }}
                            </template>
                        </Column>
                        <Column header="Đơn giá sau KM">
                            <template #body="{ data }">
                                {{ formatPrice(data.finalPrice) }}
                            </template>
                        </Column>
                        <Column header="Ngày đặt hàng">
                            <template #body="{ data }">
                                {{ format(data.createdAt, 'dd/MM/yyyy') }}
                            </template>
                        </Column>
                        <Column header="Trạng thái">
                            <template #body="{ data }">
                                {{ data.status }}
                            </template>
                        </Column>
                        <Column header="Thao tác">
                            <template #body="{ data }">
                                <div class="flex gap-2">
                                    <Button @click="openOrder(data)" icon="pi pi-eye" text></Button>
                                    <Button icon="pi pi-trash" text></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { format } from 'date-fns';
import { onMounted, reactive, ref } from 'vue';

const Orders = ref([]);
const paginator = reactive({
    rows: 5,
    page: 0,
    total: 0
});
onMounted(() => {
    fetchAllOrder();
});
const fetchAllOrder = async () => {
    try {
        const res = await API.get(`order?skip=${paginator.page}&limit=${paginator.rows}`);
        Orders.value = res.data.metadata.result;
        paginator.total = res.data.metadata.total;
    } catch (error) {
        console.log(error);
    }
};
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};
</script>
<style>
</style>