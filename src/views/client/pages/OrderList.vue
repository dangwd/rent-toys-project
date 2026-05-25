<template>
    <div class="min-h-screen bg-gray-50 dark:bg-zinc-900">
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div class="grid grid-cols-12 gap-5">
                <!-- ─── Left: Profile card ─── -->
                <aside class="col-span-12 lg:col-span-4">
                    <div class="sticky top-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <!-- Avatar + info -->
                        <div class="flex flex-col items-center px-6 pt-8 pb-5 text-center">
                            <!-- Container = frame size (110px); avatar (80px) sits centered inside -->
                            <div class="relative mb-4" style="width: 110px; height: 110px">
                                <img
                                    class="absolute rounded-full object-cover"
                                    style="width: 80px; height: 80px; top: 15px; left: 15px"
                                    :src="userDetail.thumbnail || 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'"
                                    alt="avatar"
                                />
                                <TierFrame :tier="User.membershipTier || 'bronze'" class="pointer-events-none absolute inset-0 h-full w-full z-10" :style="{ filter: `drop-shadow(0 0 7px ${currentTier.gemColor})` }" />
                                <button
                                    class="absolute z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white dark:border-zinc-950"
                                    style="bottom: 12px; right: 12px"
                                    @click="openFile"
                                >
                                    <i class="pi pi-camera" style="font-size: 8px"></i>
                                </button>
                                <input type="file" class="hidden click-file" @change="uploadFileLocal($event)" />
                            </div>
                            <h3 class="text-base font-bold text-slate-900 dark:text-white">{{ User.name || 'Bạn' }}</h3>
                            <p class="mt-0.5 break-all text-xs text-slate-400">{{ User.email || '' }}</p>
                            <span class="mt-3 rounded-full px-3 py-1 text-xs font-bold" :style="{ backgroundColor: currentTier.badgeBg, color: currentTier.badgeColor }"> {{ currentTier.label }} Member </span>
                        </div>

                        <!-- Progress -->
                        <div class="border-t border-slate-100 px-5 py-4 dark:border-zinc-800">
                            <template v-if="currentTier.nextThreshold">
                                <div class="mb-1.5 flex items-center justify-between text-xs font-semibold">
                                    <span class="text-slate-500">{{ currentTier.label }}</span>
                                    <span class="font-bold" :style="{ color: currentTier.badgeColor }">{{ tierProgress }}%</span>
                                    <span class="text-slate-500">{{ currentTier.nextLabel }}</span>
                                </div>
                                <div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                                    <div class="h-full rounded-full transition-all duration-700" :style="{ width: tierProgress + '%', background: currentTier.progressColor }" />
                                </div>
                                <p class="mt-2.5 text-xs text-slate-400">
                                    Còn <strong class="text-slate-600 dark:text-slate-300">{{ formatPrice(currentTier.nextThreshold - (User.totalSpent || 0)) }}đ</strong> để lên
                                    <strong class="text-slate-600 dark:text-slate-300">{{ currentTier.nextLabel }}</strong>
                                </p>
                            </template>
                            <div v-else class="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
                                <i class="pi pi-verified text-sm"></i>
                                <span>Bạn đang ở hạng cao nhất!</span>
                            </div>
                        </div>

                        <!-- Nav -->
                        <div class="border-t border-slate-100 p-2 dark:border-zinc-800">
                            <button class="flex w-full items-center gap-2.5 rounded-xl bg-indigo-50 px-4 py-2.5 text-left text-sm font-semibold text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                                <i class="pi pi-user w-4 text-sm"></i>Thông tin tài khoản
                            </button>
                            <RouterLink to="/client/orders" class="mt-0.5 flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-800">
                                <i class="pi pi-list w-4 text-sm"></i>Lịch sử đơn hàng
                            </RouterLink>
                            <button class="mt-0.5 flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-800">
                                <i class="pi pi-heart w-4 text-sm"></i>Yêu thích
                            </button>
                            <button class="mt-0.5 flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-800">
                                <i class="pi pi-crown w-4 text-sm"></i>Hạng thành viên
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- ─── Right: Stacked content ─── -->
                <div class="col-span-12 flex flex-col gap-5 lg:col-span-8">
                    <!-- Card 1: Tier hero (full width, spending inside) -->
                    <div class="relative overflow-hidden rounded-2xl" :style="{ background: currentTier.heroGradient }">
                        <!-- blobs -->
                        <div class="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10" />
                        <div class="pointer-events-none absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-white/[.06]" />

                        <div class="relative z-10 flex items-stretch">
                            <!-- Tier info -->
                            <div class="flex flex-1 flex-col justify-between p-6">
                                <span class="w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white"> Active Tier </span>
                                <div class="mt-4">
                                    <h2 class="text-3xl font-black leading-tight text-white">{{ currentTier.label }}<br />Member</h2>
                                    <p class="mt-2 max-w-[220px] text-xs leading-relaxed text-white/70">
                                        {{ currentTier.description }}
                                    </p>
                                </div>
                            </div>

                            <!-- Emoji center -->
                            <div class="flex items-center justify-center px-2 text-6xl leading-none" style="filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))">
                                {{ currentTier.emoji }}
                            </div>

                            <!-- Spending panel -->
                            <div class="flex w-36 shrink-0 flex-col items-center justify-center gap-1 border-l border-white/10 bg-white/10 px-5 py-6 text-center backdrop-blur-sm">
                                <i class="pi pi-star-fill text-white/80" style="font-size: 1.1rem"></i>
                                <p class="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">Chi tiêu</p>
                                <p class="text-xl font-black leading-tight text-white">{{ formatPrice(User.totalSpent || 0) }}<span class="text-sm font-semibold">đ</span></p>
                                <button class="mt-2 text-[11px] font-semibold text-white/70 hover:text-white">Quyền lợi →</button>
                            </div>
                        </div>
                    </div>

                    <!-- Card 2: Benefits (4 cards in a row) -->
                    <div class="grid grid-cols-4 gap-3">
                        <div v-for="b in currentTier.benefits" :key="b.title" class="flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                            <div class="flex h-9 w-9 items-center justify-center rounded-xl" :style="{ backgroundColor: currentTier.badgeBg }">
                                <i :class="b.icon" style="font-size: 0.9rem" :style="{ color: currentTier.badgeColor }"></i>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ b.title }}</p>
                                <p class="mt-0.5 text-xs text-slate-400">{{ b.desc }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Card 3: Personal info -->
                    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
                            <div>
                                <h4 class="font-bold text-slate-900 dark:text-white">Thông tin cá nhân</h4>
                                <p class="mt-0.5 text-xs text-slate-400">Thông tin hiển thị trên tài khoản của bạn</p>
                            </div>
                            <button class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 transition hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50" @click="openUpdateUser">
                                <i class="pi pi-pencil text-indigo-600 dark:text-indigo-400" style="font-size: 0.8rem"></i>
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-5 p-5">
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Họ tên</p>
                                <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ User.name || '—' }}</p>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</p>
                                <p class="mt-1 break-all text-sm font-semibold text-slate-800 dark:text-slate-100">{{ User.email || '—' }}</p>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Số điện thoại</p>
                                <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ User.phone || '—' }}</p>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Địa chỉ giao hàng</p>
                                <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ formattedAddress }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Card 4: Change password -->
                    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <!-- Header -->
                        <div class="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
                            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30">
                                <i class="pi pi-lock text-indigo-600 dark:text-indigo-400" style="font-size: 0.9rem"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900 dark:text-white">Đổi mật khẩu</h4>
                                <p class="text-xs text-slate-400">Bảo vệ tài khoản bằng mật khẩu đủ mạnh</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2">
                            <!-- Left: inputs -->
                            <div class="flex flex-col gap-4 p-5 md:border-r md:border-slate-100 md:dark:border-zinc-800">
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-semibold text-slate-500">Mật khẩu hiện tại</label>
                                    <Password v-model.trim="changePassword.password" :autocomplete="false" fluid toggle-mask />
                                </div>
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-semibold text-slate-500">Mật khẩu mới</label>
                                    <Password v-model.trim="changePassword.newPassword" fluid toggle-mask />
                                </div>
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-semibold text-slate-500">Nhập lại mật khẩu</label>
                                    <Password v-model.trim="changePassword.cfPassword" fluid toggle-mask />
                                </div>
                                <div class="flex justify-end pt-1">
                                    <Button icon="pi pi-check" label="Đổi mật khẩu" @click="confirmChangePassword" />
                                </div>
                            </div>

                            <!-- Right: requirements -->
                            <div class="flex flex-col gap-4 bg-slate-50/60 p-5 dark:bg-zinc-900/40">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-shield text-indigo-500 dark:text-indigo-400" style="font-size: 0.9rem"></i>
                                    <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Yêu cầu mật khẩu</p>
                                </div>
                                <ul class="flex flex-col gap-2.5">
                                    <li v-for="req in passwordRequirements" :key="req" class="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                                        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/50">
                                            <i class="pi pi-check text-indigo-600 dark:text-indigo-400" style="font-size: 7px"></i>
                                        </span>
                                        {{ req }}
                                    </li>
                                </ul>
                                <div class="mt-auto rounded-xl border border-amber-100 bg-amber-50 p-3 dark:border-amber-900/30 dark:bg-amber-950/20">
                                    <div class="flex gap-2">
                                        <i class="pi pi-info-circle mt-0.5 shrink-0 text-amber-500 dark:text-amber-400" style="font-size: 0.85rem"></i>
                                        <p class="text-xs leading-relaxed text-amber-700 dark:text-amber-300">Không dùng lại mật khẩu đã sử dụng ở dịch vụ khác để bảo vệ tài khoản tốt nhất.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ─── Dialog: Update user ─── -->
        <Dialog v-model:visible="updateUserModal" modal header="Cập nhật thông tin" :style="{ width: 'min(92vw, 50rem)' }">
            <div class="grid gap-4 md:grid-cols-2">
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="font-semibold">Tên người dùng</label>
                    <InputText v-model="userDetail.name" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Email</label>
                    <InputText v-model="userDetail.email" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Phone</label>
                    <InputText v-model="userDetail.phone" />
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="font-semibold">Tỉnh/Thành phố</label>
                    <Select v-model="selectedProvince" filter fluid :options="Province" :placeholder="userDetail.province || ''" option-label="FullName" @change="onProvinceChange" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Quận/Huyện</label>
                    <Select v-model="selectedDistrict" filter fluid :options="Districts" :placeholder="userDetail.district || ''" @change="onDistrictChange" option-label="FullName" />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-semibold">Phường/Xã</label>
                    <Select filter v-model="userDetail.ward" :options="Wards" option-value="FullName" :placeholder="userDetail.ward || ''" option-label="FullName" fluid />
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="font-semibold">Địa chỉ</label>
                    <InputText v-model="userDetail.addressLine" />
                </div>
            </div>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Đóng" severity="secondary" @click="updateUserModal = false" />
                    <Button type="button" label="Cập nhật" @click="updateUser()" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import API from '@/api/api-main';
import { formatPrice } from '@/helper/formatPrice';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import TierFrame from '../components/TierFrame.vue';

const { proxy } = getCurrentInstance();
const toast = useToast();

onMounted(() => {
    fetchProvince();
    getMe();
});

const formData = new FormData();
const selectedDistrict = ref();
const selectedProvince = ref();
const userDetail = ref({});
const Province = ref([]);
const Districts = ref([]);
const Wards = ref([]);
const changePassword = ref({ password: '', newPassword: '', cfPassword: '' });
const passwordRequirements = ['Ít nhất 8 ký tự', 'Có chữ hoa và chữ thường', 'Có ít nhất 1 chữ số', 'Có ít nhất 1 ký tự đặc biệt'];
const updateUserModal = ref(false);
const User = ref({});

const tierConfig = {
    bronze: {
        label: 'Bronze',
        emoji: '🥉',
        description: 'Bắt đầu hành trình khám phá đồ chơi cùng chúng tôi.',
        heroGradient: 'linear-gradient(135deg, #7c2d12 0%, #b45309 55%, #d97706 100%)',
        progressColor: 'linear-gradient(90deg, #b45309, #fbbf24)',
        badgeBg: '#fff7ed',
        badgeColor: '#c2410c',
        frameRing: 'linear-gradient(135deg, #cd7f32 0%, #8B4513 30%, #fbbf24 60%, #b45309 80%, #cd7f32 100%)',
        frameGlow: '0 0 0 1px rgba(180,83,9,0.2), 0 0 12px 3px rgba(180,83,9,0.4)',
        gemColor: '#f59e0b',
        gemGlow: '0 0 6px 1px rgba(245,158,11,0.8)',
        benefits: [
            { icon: 'pi pi-tag', title: 'Khám phá', desc: 'Toàn bộ danh mục' },
            { icon: 'pi pi-truck', title: 'Giao hàng', desc: 'Phí tiêu chuẩn' },
            { icon: 'pi pi-headphones', title: 'Hỗ trợ', desc: 'Cơ bản 24/7' },
            { icon: 'pi pi-gift', title: 'Sinh nhật', desc: 'Voucher quà tặng' }
        ],
        from: 0,
        nextThreshold: 2000000,
        nextLabel: 'Silver'
    },
    silver: {
        label: 'Silver',
        emoji: '🥈',
        description: 'Bạn là thành viên Silver được yêu mến. Hành trình đến Gold đang chờ!',
        heroGradient: 'linear-gradient(135deg, #0f2044 0%, #1d4ed8 55%, #3b82f6 100%)',
        progressColor: 'linear-gradient(90deg, #1d4ed8, #60a5fa)',
        badgeBg: '#eff6ff',
        badgeColor: '#1d4ed8',
        frameRing: 'linear-gradient(135deg, #94a3b8 0%, #e2e8f0 30%, #94a3b8 60%, #cbd5e1 80%, #e2e8f0 100%)',
        frameGlow: '0 0 0 1px rgba(148,163,184,0.3), 0 0 12px 3px rgba(148,163,184,0.45)',
        gemColor: '#e2e8f0',
        gemGlow: '0 0 6px 1px rgba(226,232,240,0.9)',
        benefits: [
            { icon: 'pi pi-percentage', title: 'Giảm 3%', desc: 'Toàn bộ đơn hàng' },
            { icon: 'pi pi-truck', title: 'Freeship', desc: 'Giao hàng tiêu chuẩn' },
            { icon: 'pi pi-bell', title: 'Pre-order', desc: 'Đặt trước độc quyền' },
            { icon: 'pi pi-gift', title: 'Sinh nhật', desc: 'Quà bất ngờ' }
        ],
        from: 2000000,
        nextThreshold: 5000000,
        nextLabel: 'Gold'
    },
    gold: {
        label: 'Gold',
        emoji: '🥇',
        description: 'Thành viên Gold ưu tú! Chỉ một bước nữa là Platinum.',
        heroGradient: 'linear-gradient(135deg, #78350f 0%, #d97706 55%, #fbbf24 100%)',
        progressColor: 'linear-gradient(90deg, #d97706, #fde68a)',
        badgeBg: '#fefce8',
        badgeColor: '#a16207',
        frameRing: 'linear-gradient(135deg, #f59e0b 0%, #fde68a 25%, #d97706 50%, #fbbf24 75%, #f59e0b 100%)',
        frameGlow: '0 0 0 1px rgba(245,158,11,0.25), 0 0 16px 5px rgba(245,158,11,0.5)',
        gemColor: '#fde047',
        gemGlow: '0 0 8px 2px rgba(253,224,71,0.9)',
        benefits: [
            { icon: 'pi pi-percentage', title: 'Giảm 5%', desc: 'Toàn bộ đơn hàng' },
            { icon: 'pi pi-truck', title: 'Freeship', desc: 'Giao hàng nhanh' },
            { icon: 'pi pi-star', title: 'Pre-order', desc: 'Truy cập độc quyền' },
            { icon: 'pi pi-gift', title: 'Sinh nhật', desc: 'Quà đặc biệt' }
        ],
        from: 5000000,
        nextThreshold: 10000000,
        nextLabel: 'Platinum'
    },
    platinum: {
        label: 'Platinum',
        emoji: '💎',
        description: 'Bạn đã đạt hạng cao nhất! Cảm ơn sự tin tưởng tuyệt vời của bạn.',
        heroGradient: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 55%, #7c3aed 100%)',
        progressColor: 'linear-gradient(90deg, #6d28d9, #a78bfa)',
        badgeBg: '#f5f3ff',
        badgeColor: '#6d28d9',
        frameRing: 'linear-gradient(135deg, #7c3aed 0%, #c4b5fd 25%, #4c1d95 50%, #a78bfa 75%, #7c3aed 100%)',
        frameGlow: '0 0 0 1px rgba(124,58,237,0.3), 0 0 20px 6px rgba(124,58,237,0.55)',
        gemColor: '#c4b5fd',
        gemGlow: '0 0 10px 3px rgba(196,181,253,0.9)',
        benefits: [
            { icon: 'pi pi-percentage', title: 'Giảm 7%', desc: 'Toàn bộ đơn hàng' },
            { icon: 'pi pi-truck', title: 'Express Ship', desc: 'Giao hàng hỏa tốc' },
            { icon: 'pi pi-users', title: 'VIP Support', desc: 'Hỗ trợ ưu tiên' },
            { icon: 'pi pi-ticket', title: 'Voucher VIP', desc: 'Ưu đãi đặc biệt' }
        ],
        from: 10000000,
        nextThreshold: null,
        nextLabel: null
    }
};

const currentTier = computed(() => tierConfig[User.value.membershipTier] || tierConfig.bronze);

const tierProgress = computed(() => {
    const cfg = currentTier.value;
    if (!cfg.nextThreshold) return 100;
    const spent = Math.min(User.value.totalSpent || 0, cfg.nextThreshold);
    return Math.max(0, Math.round(((spent - cfg.from) / (cfg.nextThreshold - cfg.from)) * 100));
});

const formattedAddress = computed(() => {
    const parts = [User.value.addressLine, User.value.ward, User.value.district, User.value.province].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Chưa cập nhật địa chỉ';
});

const getMe = async () => {
    try {
        const res = await API.get(`get-me`);
        User.value = res.data.metadata;
        userDetail.value = { ...User.value };
        selectedProvince.value = User.value.province;
        selectedDistrict.value = User.value.district;
    } catch (error) {
        console.log(error);
    }
};

const openUpdateUser = () => {
    updateUserModal.value = true;
    getMe();
};

const onProvinceChange = (e) => {
    userDetail.value.province = selectedProvince.value.FullName;
    fetchDistrict(e.value);
};

const onDistrictChange = (e) => {
    userDetail.value.district = selectedDistrict.value.FullName;
    fetchWard(e.value);
};

const fetchProvince = async () => {
    try {
        const res = await API.get(`province`);
        Province.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};

const fetchDistrict = async (province) => {
    try {
        const res = await API.get(`province/district/${province.Code}`);
        Districts.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};

const fetchWard = async (district) => {
    try {
        const res = await API.get(`province/ward/${district.Code}`);
        Wards.value = res.data.metadata;
    } catch (error) {
        console.log(error);
    }
};

const updateUser = async () => {
    formData.append('items', JSON.stringify(userDetail.value));
    try {
        const res = await API.updatev2(`update-me`, formData);
        if (res) {
            getMe();
            proxy.$notify('S', 'Thành công!', toast);
            updateUserModal.value = false;
        }
    } catch (error) {
        console.log(error);
    } finally {
        formData.delete('items');
        formData.delete('images');
    }
};

const openFile = () => {
    document.querySelectorAll('.click-file')[0].click();
};

const uploadFileLocal = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    formData.append('images', file);
    document.querySelectorAll('.click-file')[0].value = '';
    updateUser();
};

const confirmChangePassword = async () => {
    if (changePassword.value.cfPassword !== changePassword.value.newPassword) {
        return proxy.$notify('E', 'Mật khẩu nhập lại không khớp!', toast);
    }
    try {
        const res = await API.updatev2(`update-password`, changePassword.value);
        if (res.status === 400) {
            return proxy.$notify('E', 'Có lỗi xảy ra !', toast);
        }
        proxy.$notify('S', 'Đổi mật khẩu thành công!', toast);
    } catch (error) {
        proxy.$notify('E', error, toast);
        console.log(error);
    }
};
</script>
