<template>
    <div>
        <Button @click="openDetail()" icon="pi pi-eye" text></Button>

        <Dialog v-model:visible="visible" modal header="Chi tiết đơn hàng" :style="{ width: '70%' }">
            <div v-if="detailOrder" class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                    <strong>Mã đơn hàng: {{ detailOrder._id }}</strong>
                </div>
                <span v-if="detailOrder.createdAt" class="font-normal">Ngày tạo đơn: {{ format(detailOrder.createdAt, 'dd/MM/yyyy') }}</span>
                <div class="border border-gray-300 p-3 rounded-lg">
                    <strong class="text-lg">Sản phẩm</strong>
                    <div v-for="(item, index) in detailOrder.items" :key="index" class="flex flex-col gap-3">
                        <div class="flex gap-2">
                            <img crossorigin="anonymous" width="100" height="100" class="object-cover" :src="item.images[0]" alt="" />
                            <div class="flex flex-col gap-2">
                                <strong>{{ item.productName }}</strong>
                                <span
                                    >Giá: <strong>{{ formatPrice(item.price) }}đ</strong></span
                                >
                                <span
                                    >Số lượng: <strong>x{{ item.quantity }}</strong></span
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <div class="col-span-9 flex flex-col gap-2">
                        <div class="border border-gray-300 p-3 rounded-lg">
                            <strong class="text-lg">Chi tiết đơn hàng</strong>
                            <div class="flex flex-col gap-2">
                                <div class="flex flex-wrap items-center justify-between">
                                    <span>Tổng tiền: </span>
                                    <strong>{{ formatPrice(detailOrder.totalPrice) }}đ</strong>
                                </div>
                                <div class="flex flex-wrap items-center justify-between">
                                    <span>Giảm giá: </span>
                                    <strong>{{ detailOrder.coupon ? `- ${formatPrice(detailOrder.coupon?.CouponValue)}` : 0 }}%</strong>
                                </div>
                                <div class="flex flex-wrap items-center justify-between">
                                    <span>Thành tiền: </span>
                                    <strong>{{ formatPrice(detailOrder.finalPrice) }}đ</strong>
                                </div>
                            </div>
                        </div>
                        <div class="border border-gray-300 p-3 rounded-lg">
                            <div v-if="detailOrder.status !== 'confirmed' && !client" class="flex items-center justify-between">
                                <strong class="text-lg">Thao tác</strong>
                                <div class="flex gap-2">
                                    <Button @click="aceptOrder(detailOrder._id)" outlined label="Xác nhận đơn hàng"></Button>
                                    <Button label="Hủy" @click="cancelOrder(detailOrder._id)"></Button>
                                </div>
                            </div>
                            <div v-else>
                                <Tag :severity="detailOrder.status === 'confirmed' ? `success` : `primary`" :value="detailOrder.status === 'confirmed' ? `Đơn đã xác nhận` : `Đơn đã hủy`"></Tag>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-3 flex flex-col gap-2">
                        <div class="border border-gray-300 p-3 rounded-lg whitespace-normal">
                            <strong class="text-lg">Note</strong>
                            <div class="bg-gray-100 rounded-lg p-3">
                                {{ detailOrder.notes ? detailOrder.notes : 'Không có ghi chú' }}
                            </div>
                        </div>
                        <div class="border border-gray-300 p-3 rounded-lg whitespace-normal">
                            <strong class="text-lg">Thông tin khách hàng</strong>
                            <div class="bg-gray-100 rounded-lg p-3 flex flex-col gap-2">
                                <span
                                    >UserID: <strong>{{ detailOrder?.user?._id }}</strong></span
                                >
                                <span
                                    >Họ tên: <strong>{{ detailOrder?.shippingAddress?.fullName }}</strong></span
                                >
                                <span
                                    >Email: <strong>{{ detailOrder?.user?.email }}</strong></span
                                >
                                <span>Số điện thoại: <strong> -- </strong></span>
                                <span
                                    >Địa chỉ giao hàng:
                                    <strong>{{
                                        detailOrder.shippingAddress
                                            ? `${detailOrder?.shippingAddress?.addressLine || ''}, ${detailOrder?.shippingAddress?.ward}, ${detailOrder?.shippingAddress?.district}, ${detailOrder?.shippingAddress?.province}`
                                            : ''
                                    }}</strong></span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Đóng" severity="secondary" @click="visible = false"></Button>
                    <Button type="button" label="Lưu" @click="visible = false"></Button>
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { formatPrice } from '@/helper/formatPrice';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref } from 'vue';
const { proxy } = getCurrentInstance();
const toast = useToast();

import { format } from 'date-fns';
const props = defineProps(['data', 'client']);
const events = ref(['Đã đặt hàng']);
const visible = ref(false);
const detailOrder = ref({});
const OrderStatusOpts = ref([
    {
        label: 'Hủy',
        value: 'cancelled'
    },
    {
        label: 'Đã đặt hàng',
        value: 'pending'
    },
    {
        label: 'Đang giao hàng',
        value: 'shipped'
    },
    {
        label: 'Đã giao',
        value: 'delivered'
    },
    {
        label: 'Đã thanh toán',
        value: 'paid'
    }
]);
const openDetail = () => {
    fetchDetailOrder();
    visible.value = true;
};

const fetchDetailOrder = async () => {
    try {
        const res = await API.get(`order/${props.data._id}`);
        detailOrder.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};
const onStatusChange = async (e) => {
    if (!events.value.includes(e.value.label)) {
        events.value.push(e.value.label);
    }
    let data = {
        status: e.value
    };
    try {
        const res = await API.create(`order/${props.data._id}/status`, data);
        if (res) {
            fetchDetailOrder();
            visible.value = false;
            proxy.$notify('S', 'Cập nhật thành công!', toast);
        }
    } catch (error) {
        console.log(error);
    }
};
const aceptOrder = async (id) => {
    try {
        const res = await API.create(`order/${id}/status`);
        if (res.data) {
            proxy.$notify('S', 'Xác nhận thành công!', toast);
            setTimeout(() => {
                location.reload();
            }, 200);
        }
    } catch (error) {
        console.log(error);
    }
};

const cancelOrder = async (id) => {
    try {
        const res = await API.create(`order/${id}/cancel`);
        if (res.data) {
            proxy.$notify('S', 'Hủy đơn thành công!', toast);
            setTimeout(() => {
                location.reload();
            }, 200);
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
<style>
.p-timeline-event-content {
    width: 10rem;
}
</style>
