<template>
    <div>
        <Button @click="openDetail()" icon="pi pi-eye" text rounded severity="secondary" />

        <Dialog v-model:visible="visible" modal header="Chi tiết đơn hàng" :style="{ width: '90%', maxWidth: '900px' }" class="p-dialog-top">
            <div v-if="detailOrder._id" class="space-y-6">
                <!-- Header Section -->
                <div class="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <div class="grid gap-4 md:grid-cols-3">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mã đơn hàng</p>
                            <p class="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white">{{ detailOrder._id }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ngày tạo đơn</p>
                            <p class="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                                {{ detailOrder.createdAt ? format(new Date(detailOrder.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A' }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Trạng thái</p>
                            <div class="mt-1">
                                <Tag 
                                    :severity="getStatusSeverity(detailOrder.status)" 
                                    :value="getStatusLabel(detailOrder.status)"
                                    class="inline-block"
                                ></Tag>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Products Section -->
                <div class="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Sản phẩm</h3>
                    <div class="space-y-3">
                        <div v-for="(item, index) in detailOrder.items || []" :key="index" class="flex gap-4 rounded-[16px] border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                            <div class="flex-shrink-0">
                                <img 
                                    crossorigin="anonymous" 
                                    :src="item.images?.[0]" 
                                    :alt="item.productName"
                                    class="h-20 w-20 rounded-[12px] object-cover"
                                />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-semibold text-slate-900 dark:text-white">{{ item.productName }}</p>
                                <div class="mt-2 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                                    <span>Giá: <strong class="text-slate-900 dark:text-white">{{ formatPrice(item.price) }}đ</strong></span>
                                    <span>Số lượng: <strong class="text-slate-900 dark:text-white">x{{ item.quantity }}</strong></span>
                                    <span class="font-semibold text-indigo-600 dark:text-indigo-400">Tổng: {{ formatPrice(item.price * item.quantity) }}đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="grid gap-6 lg:grid-cols-3">
                    <!-- Left: Order Details & Actions -->
                    <div class="space-y-5 lg:col-span-2">
                        <!-- Order Summary -->
                        <div class="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                            <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Tóm tắt đơn hàng</h3>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between rounded-[12px] bg-slate-50 p-3 dark:bg-zinc-900">
                                    <span class="text-sm text-slate-600 dark:text-slate-400">Tổng tiền</span>
                                    <strong class="text-slate-900 dark:text-white">{{ formatPrice(detailOrder.totalPrice) }}đ</strong>
                                </div>
                                <div v-if="detailOrder.coupon" class="flex items-center justify-between rounded-[12px] bg-rose-50 p-3 dark:bg-rose-900/10">
                                    <span class="text-sm text-rose-700 dark:text-rose-400">Giảm giá</span>
                                    <strong class="text-rose-700 dark:text-rose-400">- {{ formatPrice(detailOrder.coupon?.CouponValue) }}đ</strong>
                                </div>
                                <div class="flex items-center justify-between rounded-[12px] border-t-2 border-slate-200 bg-slate-50 p-3 pt-4 dark:border-zinc-700 dark:bg-zinc-900">
                                    <span class="font-semibold text-slate-900 dark:text-white">Thành tiền</span>
                                    <strong class="text-xl text-indigo-600 dark:text-indigo-400">{{ formatPrice(detailOrder.finalPrice) }}đ</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div v-if="detailOrder.status !== 'confirmed' && !client" class="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                            <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Thao tác</h3>
                            <div class="flex flex-wrap gap-3">
                                <Button 
                                    @click="aceptOrder(detailOrder._id)" 
                                    icon="pi pi-check"
                                    label="Xác nhận đơn hàng" 
                                    severity="success"
                                    class="flex-1 min-w-[150px]"
                                />
                                <Button 
                                    @click="cancelOrder(detailOrder._id)" 
                                    icon="pi pi-times"
                                    label="Hủy đơn" 
                                    severity="danger"
                                    class="flex-1 min-w-[150px]"
                                />
                            </div>
                        </div>

                        <!-- Notes Section -->
                        <div class="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                            <h3 class="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Ghi chú</h3>
                            <div class="rounded-[12px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-400">
                                {{ detailOrder.notes || 'Không có ghi chú' }}
                            </div>
                        </div>
                    </div>

                    <!-- Right: Customer Info -->
                    <div class="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Thông tin giao hàng</h3>
                        <div class="space-y-4">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Họ tên</p>
                                <p class="mt-1 font-semibold text-slate-900 dark:text-white">{{ detailOrder.shippingAddress?.fullName || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email</p>
                                <p class="mt-1 break-all text-sm text-slate-600 dark:text-slate-400">{{ detailOrder.user?.email || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Địa chỉ giao hàng</p>
                                <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    {{ detailOrder.shippingAddress ? 
                                        `${detailOrder.shippingAddress.addressLine || ''}, ${detailOrder.shippingAddress.ward}, ${detailOrder.shippingAddress.district}, ${detailOrder.shippingAddress.province}`.trim() 
                                        : 'N/A' 
                                    }}
                                </p>
                            </div>
                            <div v-if="detailOrder.user">
                                <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">User ID</p>
                                <p class="mt-1 font-mono text-xs text-slate-600 dark:text-slate-400">{{ detailOrder.user._id }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Đóng" severity="secondary" @click="visible = false" />
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script setup>
import API from '@/api/api-main';
import { formatPrice } from '@/helper/formatPrice';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();
const toast = useToast();

const props = defineProps(['data', 'client']);
const visible = ref(false);
const detailOrder = ref({});

// Helper function to extract error message from API response
const getErrorMessage = (error) => {
    if (!error) return 'Có lỗi xảy ra!';
    
    const message = 
        error?.response?.data?.metadata?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Có lỗi xảy ra, vui lòng thử lại!';
    
    return typeof message === 'string' ? message : JSON.stringify(message);
};

// Get status label
const getStatusLabel = (status) => {
    const statusMap = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'shipped': 'Đang giao hàng',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy',
        'paid': 'Đã thanh toán'
    };
    return statusMap[status] || status;
};

// Get status severity color
const getStatusSeverity = (status) => {
    const severityMap = {
        'pending': 'warning',
        'confirmed': 'info',
        'shipped': 'primary',
        'delivered': 'success',
        'cancelled': 'danger',
        'paid': 'success'
    };
    return severityMap[status] || 'secondary';
};

const openDetail = () => {
    fetchDetailOrder();
    visible.value = true;
};

const fetchDetailOrder = async () => {
    try {
        const res = await API.get(`order/${props.data._id}`);
        detailOrder.value = res.data.metadata;
    } catch (error) {
        const errorMsg = getErrorMessage(error);
        console.error('Fetch order detail error:', errorMsg);
        proxy.$notify('E', errorMsg, toast);
    }
};

const aceptOrder = async (id) => {
    try {
        const res = await API.create(`order/${id}/status`);
        if (res.data) {
            proxy.$notify('S', 'Xác nhận đơn hàng thành công!', toast);
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    } catch (error) {
        const errorMsg = getErrorMessage(error);
        console.error('Accept order error:', errorMsg);
        proxy.$notify('E', errorMsg, toast);
    }
};

const cancelOrder = async (id) => {
    try {
        const res = await API.create(`order/${id}/cancel`);
        if (res.data) {
            proxy.$notify('S', 'Hủy đơn hàng thành công!', toast);
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    } catch (error) {
        const errorMsg = getErrorMessage(error);
        console.error('Cancel order error:', errorMsg);
        proxy.$notify('E', errorMsg, toast);
    }
};
</script>
<style scoped>
</style>

