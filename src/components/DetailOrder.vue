<script setup>
import API from '@/api/api-main';
import { formatPrice } from '@/helper/formatPrice';
import { canTransitionTo, formatStatusOrder, getOrderStatusSeverity, getPaymentStatusSeverity, isTerminalStatus } from '@/helper/formatStatusOrder';
import { format } from 'date-fns';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();
const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
    data: { type: Object, required: true },
    client: { type: Boolean, default: false }
});
const emit = defineEmits(['updated']);

const visible = ref(false);
const detailOrder = ref({});
const updating = ref(false);

const canConfirm = computed(() => canTransitionTo(detailOrder.value.status, 'confirmed'));
const canShip = computed(() => canTransitionTo(detailOrder.value.status, 'shipped'));
const canDeliver = computed(() => canTransitionTo(detailOrder.value.status, 'delivered'));
const canCancel = computed(() => {
    if (!canTransitionTo(detailOrder.value.status, 'cancelled')) return false;
    if (!props.client) return true; // admin luôn có thể huỷ
    // client: chỉ huỷ khi đang chờ xác nhận HOẶC chưa thanh toán
    return detailOrder.value.status === 'pending' || detailOrder.value.paymentStatus !== 'paid';
});
// Admin: all non-terminal transitions. Client: only cancel when allowed
const showActions = computed(() => {
    if (props.client) return canCancel.value;
    return !isTerminalStatus(detailOrder.value.status);
});

const getErrorMessage = (error) => {
    const msg = error?.response?.data?.message || error?.response?.data?.metadata?.message || error?.message;
    return typeof msg === 'string' ? msg : 'Có lỗi xảy ra, vui lòng thử lại!';
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
        proxy.$notify('E', getErrorMessage(error), toast);
    }
};

const updateStatus = async (newStatus) => {
    updating.value = true;
    try {
        const res = await API.updatev2(`order/${detailOrder.value._id}/status`, { status: newStatus });
        if (res?.data) {
            proxy.$notify('S', 'Cập nhật trạng thái thành công!', toast);
            await fetchDetailOrder();
            emit('updated');
        } else {
            proxy.$notify('E', getErrorMessage(res), toast);
        }
    } catch (error) {
        proxy.$notify('E', getErrorMessage(error), toast);
    } finally {
        updating.value = false;
    }
};

const confirmCancel = () => {
    confirm.require({
        message: 'Bạn có chắc muốn huỷ đơn hàng này không?',
        header: 'Xác nhận huỷ đơn',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Không',
        acceptLabel: 'Huỷ đơn',
        acceptSeverity: 'danger',
        accept: () => updateStatus('cancelled')
    });
};

const paymentMethodLabel = (method) => (method === 'cod' ? 'COD' : method === 'zalo' ? 'ZaloPay' : method);
</script>

<template>
    <div>
        <Button @click="openDetail" icon="pi pi-eye" text rounded severity="secondary" />

        <Dialog v-model:visible="visible" modal header="Chi tiết đơn hàng" :style="{ width: '95%', maxWidth: '960px' }">
            <div v-if="detailOrder._id" class="space-y-5">
                <!-- Header -->
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mã đơn hàng</p>
                            <p class="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white truncate">{{ detailOrder._id }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ngày tạo</p>
                            <p class="mt-1 font-semibold text-slate-900 dark:text-white">
                                {{ detailOrder.createdAt ? format(new Date(detailOrder.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A' }}
                            </p>
                        </div>
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Trạng thái đơn</p>
                            <div class="mt-1">
                                <Tag :severity="getOrderStatusSeverity(detailOrder.status)" :value="formatStatusOrder(detailOrder.status)" />
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Thanh toán</p>
                            <div class="mt-1 flex items-center gap-2 flex-wrap">
                                <Tag :severity="getPaymentStatusSeverity(detailOrder.paymentStatus)" :value="formatStatusOrder(detailOrder.paymentStatus)" />
                                <span class="text-xs text-slate-500">{{ paymentMethodLabel(detailOrder.paymentMethod) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Products -->
                <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <h3 class="mb-4 text-base font-semibold text-slate-900 dark:text-white">Sản phẩm</h3>
                    <div class="space-y-3">
                        <div v-for="(item, i) in detailOrder.items || []" :key="i" class="flex gap-4 rounded-xl border border-slate-200 p-4 dark:border-zinc-800">
                            <img v-if="item.images?.[0]" crossorigin="anonymous" :src="item.images[0]" :alt="item.productName" class="h-16 w-16 shrink-0 rounded-xl object-cover bg-slate-100" />
                            <div v-else class="h-16 w-16 shrink-0 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                                <i class="pi pi-image text-slate-400"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-semibold text-slate-900 dark:text-white">{{ item.productName }}</p>
                                <div class="mt-1 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                                    <span>{{ formatPrice(item.price) }}đ / đơn vị</span>
                                    <span>× {{ item.quantity }}</span>
                                    <span v-if="item.discount" class="text-rose-600">-{{ item.discount }}%</span>
                                </div>
                            </div>
                            <div class="text-right shrink-0">
                                <p class="font-bold text-indigo-600 dark:text-indigo-400">{{ formatPrice(item.price * item.quantity) }}đ</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main grid -->
                <div class="grid gap-5 lg:grid-cols-3">
                    <div class="space-y-5 lg:col-span-2">
                        <!-- Order summary -->
                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                            <h3 class="mb-4 text-base font-semibold text-slate-900 dark:text-white">Tóm tắt đơn hàng</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-zinc-900">
                                    <span class="text-sm text-slate-600 dark:text-slate-400">Tổng tiền hàng</span>
                                    <span class="font-medium text-slate-900 dark:text-white">{{ formatPrice(detailOrder.totalPrice) }}đ</span>
                                </div>
                                <div v-if="detailOrder.coupon" class="flex justify-between rounded-lg bg-rose-50 px-3 py-2.5 dark:bg-rose-900/10">
                                    <span class="text-sm text-rose-700 dark:text-rose-400">
                                        Giảm giá
                                        <span class="font-mono text-xs">({{ detailOrder.coupon.code }})</span>
                                    </span>
                                    <span class="font-medium text-rose-700 dark:text-rose-400">
                                        {{ detailOrder.coupon.discountType === 'percent' ? `-${detailOrder.coupon.discountValue}%` : `-${formatPrice(detailOrder.coupon.discountValue)}đ` }}
                                    </span>
                                </div>
                                <div class="flex justify-between rounded-lg border-t-2 border-slate-200 bg-slate-50 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                                    <span class="font-semibold text-slate-900 dark:text-white">Thành tiền</span>
                                    <span class="text-lg font-bold text-indigo-600 dark:text-indigo-400">{{ formatPrice(detailOrder.finalPrice) }}đ</span>
                                </div>
                            </div>
                        </div>

                        <!-- Status flow diagram -->
                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                            <h3 class="mb-4 text-base font-semibold text-slate-900 dark:text-white">Tiến trình đơn hàng</h3>
                            <div class="flex items-center gap-1 flex-wrap">
                                <template v-for="(step, i) in ['pending', 'confirmed', 'shipped', 'delivered']" :key="step">
                                    <div class="flex items-center gap-1">
                                        <div
                                            class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                                            :class="{
                                                'bg-primary-600 text-white dark:bg-primary-600': detailOrder.status === step,
                                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                                                    ['delivered'].includes(detailOrder.status) && step !== 'delivered' ? false : detailOrder.status === 'delivered' && step === 'delivered',
                                                'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400': detailOrder.status !== step && !(detailOrder.status === 'delivered' && step !== 'delivered'),
                                                'bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300': ['confirmed', 'shipped', 'delivered'].includes(detailOrder.status) && ['pending'].includes(step) && detailOrder.status !== step
                                            }"
                                        >
                                            <i
                                                class="text-[10px]"
                                                :class="{
                                                    'pi pi-clock': step === 'pending',
                                                    'pi pi-check': step === 'confirmed',
                                                    'pi pi-truck': step === 'shipped',
                                                    'pi pi-check-circle': step === 'delivered'
                                                }"
                                            ></i>
                                            {{ formatStatusOrder(step) }}
                                        </div>
                                        <i v-if="i < 3" class="pi pi-chevron-right text-slate-300 dark:text-zinc-600 text-xs"></i>
                                    </div>
                                </template>
                                <div v-if="detailOrder.status === 'cancelled'" class="ml-2 flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    <i class="pi pi-times text-[10px]"></i>
                                    Đã hủy
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div v-if="showActions" class="rounded-2xl border p-5 shadow-sm" :class="client ? 'border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/30' : 'border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'">
                            <h3 class="mb-1 text-base font-semibold" :class="client ? 'text-rose-800 dark:text-rose-300' : 'text-slate-900 dark:text-white'">{{ client ? 'Huỷ đơn hàng' : 'Thao tác' }}</h3>
                            <p v-if="client" class="mb-4 text-sm text-rose-600 dark:text-rose-400">Bạn chỉ có thể huỷ khi đơn chưa được giao đi. Sau khi huỷ không thể khôi phục.</p>
                            <div :class="{ 'mt-4': !client }" class="flex flex-wrap gap-3">
                                <template v-if="!client">
                                    <Button v-if="canConfirm" icon="pi pi-check" label="Xác nhận đơn" severity="success" :loading="updating" @click="updateStatus('confirmed')" />
                                    <Button v-if="canShip" icon="pi pi-truck" label="Bắt đầu giao" severity="info" :loading="updating" @click="updateStatus('shipped')" />
                                    <Button v-if="canDeliver" icon="pi pi-check-circle" label="Đã giao hàng" severity="success" :loading="updating" @click="updateStatus('delivered')" />
                                </template>
                                <Button v-if="canCancel" icon="pi pi-times" :label="client ? 'Xác nhận huỷ đơn' : 'Huỷ đơn'" severity="danger" :outlined="!client" :loading="updating" @click="confirmCancel" />
                            </div>
                        </div>

                        <!-- Notes -->
                        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                            <h3 class="mb-3 text-base font-semibold text-slate-900 dark:text-white">Ghi chú</h3>
                            <p class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-400">
                                {{ detailOrder.notes || 'Không có ghi chú' }}
                            </p>
                        </div>
                    </div>

                    <!-- Customer info -->
                    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 h-fit">
                        <h3 class="mb-4 text-base font-semibold text-slate-900 dark:text-white">Thông tin giao hàng</h3>
                        <div class="space-y-4">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Người nhận</p>
                                <p class="mt-1 font-semibold text-slate-900 dark:text-white">{{ detailOrder.shippingAddress?.fullName || detailOrder.user?.name || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Số điện thoại</p>
                                <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ detailOrder.shippingAddress?.phone || detailOrder.user?.phone || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email</p>
                                <p class="mt-1 break-all text-sm text-slate-600 dark:text-slate-400">{{ detailOrder.user?.email || 'N/A' }}</p>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Địa chỉ giao hàng</p>
                                <p v-if="detailOrder.shippingAddress" class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    {{ detailOrder.shippingAddress.addressLine }}, {{ detailOrder.shippingAddress.ward }}, {{ detailOrder.shippingAddress.district }},
                                    {{ detailOrder.shippingAddress.province }}
                                </p>
                                <p v-else class="mt-1 text-sm text-slate-400">N/A</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Đóng" severity="secondary" @click="visible = false" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped></style>
