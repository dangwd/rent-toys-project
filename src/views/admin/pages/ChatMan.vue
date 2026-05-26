<script setup>
import API from '@/api/api-main';
import chatService from '@/service/chat.service';
import { getSocket } from '@/service/socket';
import { formatPrice } from '@/helper/formatPrice';
import { format, isToday } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from 'vue';

const { proxy } = getCurrentInstance();
const toast = useToast();

const PAGE_SIZE = 30;

// ── User info panel ───────────────────────────────────────────────────────────
const showUserPanel = ref(false);
const userDetail = ref(null);
const userDetailLoading = ref(false);

const tierConfig = {
    bronze: {
        label: 'Bronze', emoji: '🥉', benefit: 'Thành viên cơ bản',
        cardStyle: 'background: linear-gradient(135deg, #78350f 0%, #b45309 100%); box-shadow: 0 8px 32px rgba(180,83,9,0.35)',
        ringColor: '#b45309'
    },
    silver: {
        label: 'Silver', emoji: '🥈', benefit: 'Giảm giá 3% mỗi đơn hàng',
        cardStyle: 'background: linear-gradient(135deg, #1f2937 0%, #6b7280 100%); box-shadow: 0 8px 32px rgba(107,114,128,0.35)',
        ringColor: '#6b7280'
    },
    gold: {
        label: 'Gold', emoji: '🥇', benefit: 'Giảm giá 5% mỗi đơn hàng',
        cardStyle: 'background: linear-gradient(135deg, #92400e 0%, #d97706 100%); box-shadow: 0 8px 32px rgba(217,119,6,0.4)',
        ringColor: '#f59e0b'
    },
    platinum: {
        label: 'Platinum', emoji: '💎', benefit: 'Freeship + Voucher đặc biệt',
        cardStyle: 'background: linear-gradient(135deg, #3b0764 0%, #7c3aed 100%); box-shadow: 0 8px 32px rgba(124,58,237,0.4)',
        ringColor: '#7c3aed'
    }
};

const tierSeverityMap = { bronze: 'secondary', silver: 'info', gold: 'warn', platinum: 'success' };
const statusSeverityMap = { active: 'success', inactive: 'warn', deleted: 'danger' };
const statusLabelMap = { active: 'Hoạt động', inactive: 'Tạm ngưng', deleted: 'Đã xóa' };

const fetchUserDetail = async (userId) => {
    if (!userId) return;
    userDetailLoading.value = true;
    userDetail.value = null;
    try {
        const res = await API.get(`users/${userId}`);
        userDetail.value = res?.data?.metadata ?? null;
    } catch {
        // panel is supplementary — fail silently
    } finally {
        userDetailLoading.value = false;
    }
};

// ── Conversation list ─────────────────────────────────────────────────────────
const conversations = ref([]);
const listLoading = ref(false);
const searchKey = ref('');
const statusFilter = ref('all');

const filteredConvs = computed(() => {
    const q = searchKey.value.toLowerCase().trim();
    if (!q) return conversations.value;
    return conversations.value.filter((c) => {
        const u = c.userId;
        return u?.name?.toLowerCase().includes(q) || u?.email?.toLowerCase().includes(q);
    });
});

const totalUnread = computed(() => conversations.value.reduce((s, c) => s + (c.unreadByAdmin || 0), 0));

// ── Chat area ─────────────────────────────────────────────────────────────────
const selectedConv = ref(null);
const messages = ref([]);
const messagesLoading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(false);
const inputText = ref('');
const sending = ref(false);
const changingStatus = ref(false);
const userIsTyping = ref(false);
const messagesEndRef = ref(null);
const messagesContainerRef = ref(null);

// ── Socket handlers (stored for cleanup) ─────────────────────────────────────
let chatMessageHandler = null;
let chatTypingHandler = null;
let chatReadHandler = null;
let chatStatusChangedHandler = null;
let connectHandler = null;
let typingDebounce = null;
let userTypingTimer = null;

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatListTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isToday(d) ? format(d, 'HH:mm') : format(d, 'dd/MM');
};

const formatMsgTime = (dateStr) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'HH:mm');
};

const scrollToBottom = async () => {
    await nextTick();
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' });
};

// ── Data fetching ─────────────────────────────────────────────────────────────
const fetchConversations = async () => {
    listLoading.value = true;
    try {
        const filter = statusFilter.value === 'all' ? '' : statusFilter.value;
        const data = await chatService.getConversations(filter);
        conversations.value = sortConvs(data);
    } catch {
        proxy.$notify('E', 'Không thể tải danh sách hội thoại', toast);
    } finally {
        listLoading.value = false;
    }
};

const sortConvs = (list) => [...list].sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));

const selectConversation = async (conv) => {
    if (selectedConv.value?._id === conv._id) return;
    selectedConv.value = conv;
    messages.value = [];
    userIsTyping.value = false;
    hasMore.value = false;
    messagesLoading.value = true;
    fetchUserDetail(conv.userId?._id);
    try {
        const msgs = await chatService.getMessages(conv._id, 0);
        messages.value = msgs;
        hasMore.value = msgs.length >= PAGE_SIZE;
        getSocket()?.emit('chat:join', { conversationId: conv._id });
        markAdminRead(conv._id);
        await scrollToBottom();
    } catch {
        proxy.$notify('E', 'Không thể tải tin nhắn', toast);
    } finally {
        messagesLoading.value = false;
    }
};

const loadMoreMessages = async () => {
    if (loadingMore.value || !selectedConv.value) return;
    const container = messagesContainerRef.value;
    const prevScrollHeight = container?.scrollHeight ?? 0;
    loadingMore.value = true;
    try {
        const older = await chatService.getMessages(selectedConv.value._id, messages.value.length);
        if (older.length) {
            messages.value = [...older, ...messages.value];
            await nextTick();
            if (container) container.scrollTop = container.scrollHeight - prevScrollHeight;
        }
        hasMore.value = older.length >= PAGE_SIZE;
    } catch {
        proxy.$notify('E', 'Không thể tải thêm tin nhắn', toast);
    } finally {
        loadingMore.value = false;
    }
};

const changeConversationStatus = async () => {
    if (!selectedConv.value || changingStatus.value) return;
    const newStatus = selectedConv.value.status === 'open' ? 'closed' : 'open';
    changingStatus.value = true;
    try {
        await chatService.updateStatus(selectedConv.value._id, newStatus);
        selectedConv.value.status = newStatus;
        const conv = conversations.value.find((c) => c._id === selectedConv.value._id);
        if (conv) conv.status = newStatus;
    } catch {
        proxy.$notify('E', 'Không thể cập nhật trạng thái hội thoại', toast);
    } finally {
        changingStatus.value = false;
    }
};

const markAdminRead = (convId) => {
    const conv = conversations.value.find((c) => c._id === convId);
    if (conv) conv.unreadByAdmin = 0;
    getSocket()?.emit('chat:read', { conversationId: convId });
};

// ── Send ──────────────────────────────────────────────────────────────────────
const sendMessage = () => {
    const text = inputText.value.trim();
    if (!text || sending.value || !selectedConv.value) return;
    inputText.value = '';
    sending.value = true;

    const socket = getSocket();
    if (socket?.connected) {
        socket.emit('chat:send', { conversationId: selectedConv.value._id, content: text, senderRole: 'A' }, (res) => {
            if (res?.ok && res.message) {
                if (!messages.value.find((m) => m._id === res.message._id)) {
                    messages.value.push(res.message);
                    scrollToBottom();
                    bumpConversation(selectedConv.value._id, text);
                }
            }
            sending.value = false;
        });
    } else {
        chatService
            .sendMessage(selectedConv.value._id, text, 'A')
            .then((msg) => {
                if (msg) {
                    messages.value.push(msg);
                    scrollToBottom();
                }
                bumpConversation(selectedConv.value._id, text);
            })
            .catch(() => {})
            .finally(() => {
                sending.value = false;
            });
    }
};

const bumpConversation = (convId, text) => {
    const conv = conversations.value.find((c) => c._id === convId);
    if (!conv) return;
    conv.lastMessage = text;
    conv.lastMessageAt = new Date().toISOString();
    conversations.value = sortConvs(conversations.value);
};

const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
};

const handleInput = () => {
    if (!selectedConv.value) return;
    clearTimeout(typingDebounce);
    typingDebounce = setTimeout(() => {
        getSocket()?.emit('chat:typing', { conversationId: selectedConv.value._id });
    }, 400);
};

// ── Socket setup ──────────────────────────────────────────────────────────────
const setupSocket = () => {
    const socket = getSocket();
    if (!socket) return;

    chatMessageHandler = ({ conversationId: cid, message }) => {
        // Update conversation list
        const conv = conversations.value.find((c) => c._id === cid);
        if (conv) {
            conv.lastMessage = message.content;
            conv.lastMessageAt = message.createdAt;
            if (selectedConv.value?._id !== cid) {
                conv.unreadByAdmin = (conv.unreadByAdmin || 0) + 1;
            } else {
                markAdminRead(cid);
            }
            conversations.value = sortConvs(conversations.value);
        } else {
            // New conversation from an unknown user — refetch list
            fetchConversations();
        }

        // Append to open chat
        if (selectedConv.value?._id === cid) {
            if (!messages.value.find((m) => m._id === message._id)) {
                messages.value.push(message);
                scrollToBottom();
            }
        }
    };

    chatTypingHandler = ({ conversationId: cid }) => {
        if (cid !== selectedConv.value?._id) return;
        userIsTyping.value = true;
        clearTimeout(userTypingTimer);
        userTypingTimer = setTimeout(() => {
            userIsTyping.value = false;
        }, 2000);
    };

    chatReadHandler = ({ conversationId: cid }) => {
        // User đã đọc tin nhắn — xoá unread counter nếu đang xem conv đó
        if (cid === selectedConv.value?._id) {
            const conv = conversations.value.find((c) => c._id === cid);
            if (conv) conv.unreadByUser = 0;
        }
    };

    chatStatusChangedHandler = ({ conversationId: cid, status }) => {
        const conv = conversations.value.find((c) => c._id === cid);
        if (conv) conv.status = status;
        if (selectedConv.value?._id === cid) selectedConv.value.status = status;
    };

    connectHandler = () => {
        if (selectedConv.value) {
            socket.emit('chat:join', { conversationId: selectedConv.value._id });
        }
    };

    socket.on('chat:message', chatMessageHandler);
    socket.on('chat:typing', chatTypingHandler);
    socket.on('chat:read', chatReadHandler);
    socket.on('chat:status_changed', chatStatusChangedHandler);
    socket.on('connect', connectHandler);
};

onMounted(async () => {
    await fetchConversations();
    setupSocket();
});

onUnmounted(() => {
    const socket = getSocket();
    if (socket) {
        if (chatMessageHandler) socket.off('chat:message', chatMessageHandler);
        if (chatTypingHandler) socket.off('chat:typing', chatTypingHandler);
        if (chatReadHandler) socket.off('chat:read', chatReadHandler);
        if (chatStatusChangedHandler) socket.off('chat:status_changed', chatStatusChangedHandler);
        if (connectHandler) socket.off('connect', connectHandler);
    }
    clearTimeout(typingDebounce);
    clearTimeout(userTypingTimer);
});
</script>

<template>
    <div class="flex h-[calc(100vh-6rem)] overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm dark:border-surface-700 dark:bg-surface-900">
        <!-- ── Left: Conversation list ─────────────────────────────────── -->
        <div class="flex w-80 shrink-0 flex-col border-r border-surface-200 dark:border-surface-700 xl:w-96">
            <!-- Header -->
            <div class="flex items-center justify-between gap-2 border-b border-surface-200 px-4 py-3 dark:border-surface-700">
                <div>
                    <p class="text-sm font-bold">Hội thoại</p>
                    <p v-if="totalUnread > 0" class="text-xs text-red-500">{{ totalUnread }} tin chưa đọc</p>
                    <p v-else class="text-xs text-surface-400">{{ conversations.length }} cuộc trò chuyện</p>
                </div>
                <Button icon="pi pi-refresh" text rounded size="small" @click="fetchConversations" :loading="listLoading" v-tooltip.left="'Làm mới'" />
            </div>

            <!-- Status filter tabs -->
            <div class="flex border-b border-surface-100 dark:border-surface-800">
                <button
                    v-for="tab in [{ value: 'all', label: 'Tất cả' }, { value: 'open', label: 'Đang mở' }, { value: 'closed', label: 'Đã đóng' }]"
                    :key="tab.value"
                    type="button"
                    @click="statusFilter = tab.value; fetchConversations()"
                    class="flex-1 py-2 text-xs transition"
                    :class="statusFilter === tab.value ? 'font-semibold text-primary-500 border-b-2 border-primary-500' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'"
                >
                    {{ tab.label }}
                </button>
            </div>

            <!-- Search -->
            <div class="border-b border-surface-100 px-3 py-2.5 dark:border-surface-800">
                <IconField>
                    <InputIcon><i class="pi pi-search text-xs" /></InputIcon>
                    <InputText v-model="searchKey" placeholder="Tìm người dùng..." class="w-full text-sm" size="small" />
                </IconField>
            </div>

            <!-- List -->
            <div class="flex-1 overflow-y-auto">
                <!-- Loading skeleton -->
                <div v-if="listLoading" class="space-y-px p-2">
                    <div v-for="i in 5" :key="i" class="flex items-center gap-3 rounded-xl px-3 py-2.5">
                        <Skeleton shape="circle" size="2.5rem" />
                        <div class="flex-1 space-y-1.5">
                            <Skeleton height="0.75rem" width="60%" />
                            <Skeleton height="0.6rem" width="80%" />
                        </div>
                    </div>
                </div>

                <!-- Empty -->
                <div v-else-if="!filteredConvs.length" class="flex flex-col items-center gap-2 py-14 text-center">
                    <i class="pi pi-comments text-3xl text-surface-300 dark:text-surface-600" />
                    <p class="text-sm text-surface-400">{{ searchKey ? 'Không tìm thấy kết quả' : 'Chưa có hội thoại nào' }}</p>
                </div>

                <!-- Conversation items -->
                <button
                    v-for="conv in filteredConvs"
                    :key="conv._id"
                    type="button"
                    @click="selectConversation(conv)"
                    class="group flex w-full items-center gap-3 border-b border-surface-100 px-4 py-3 text-left transition hover:bg-surface-50 dark:border-surface-800 dark:hover:bg-surface-800"
                    :class="selectedConv?._id === conv._id ? 'border-l-[3px] border-l-primary-500 bg-primary-50 pl-3.5 dark:bg-primary-900/20' : ''"
                >
                    <!-- Avatar with unread badge -->
                    <div class="relative shrink-0">
                        <img v-if="conv.userId?.thumbnail" :src="conv.userId.thumbnail" alt="" class="h-10 w-10 rounded-full object-cover" />
                        <div v-else class="flex h-10 w-10 items-center justify-center rounded-full bg-surface-200 dark:bg-surface-700">
                            <i class="pi pi-user text-sm text-surface-500" />
                        </div>
                        <span v-if="conv.unreadByAdmin > 0" class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {{ conv.unreadByAdmin > 9 ? '9+' : conv.unreadByAdmin }}
                        </span>
                    </div>

                    <!-- Info -->
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-1">
                            <span class="truncate text-sm" :class="conv.unreadByAdmin > 0 ? 'font-bold text-surface-900 dark:text-surface-0' : 'font-medium text-surface-700 dark:text-surface-200'">
                                {{ conv.userId?.name || 'Người dùng' }}
                            </span>
                            <span class="shrink-0 text-[11px] text-surface-400">{{ formatListTime(conv.lastMessageAt) }}</span>
                        </div>
                        <p class="mt-0.5 truncate text-xs" :class="conv.unreadByAdmin > 0 ? 'font-medium text-surface-600 dark:text-surface-300' : 'text-surface-400 dark:text-surface-500'">
                            {{ conv.lastMessage || 'Chưa có tin nhắn' }}
                        </p>
                    </div>
                </button>
            </div>
        </div>

        <!-- ── Right: Chat area + User info panel ───────────────────── -->
        <div class="flex flex-1 overflow-hidden">
        <div class="flex flex-1 flex-col overflow-hidden min-w-0">
            <!-- Empty state -->
            <div v-if="!selectedConv" class="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <div class="flex h-20 w-20 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
                    <i class="pi pi-comments text-4xl text-surface-300 dark:text-surface-600" />
                </div>
                <div>
                    <p class="font-semibold text-surface-600 dark:text-surface-300">Chọn một hội thoại</p>
                    <p class="mt-1 text-sm text-surface-400">Danh sách bên trái để bắt đầu trò chuyện với khách hàng</p>
                </div>
            </div>

            <template v-else>
                <!-- Chat header -->
                <div class="flex shrink-0 items-center gap-3 border-b border-surface-200 bg-surface-0 px-5 py-3 dark:border-surface-700 dark:bg-surface-900">
                    <img v-if="selectedConv.userId?.thumbnail" :src="selectedConv.userId.thumbnail" alt="" class="h-9 w-9 rounded-full object-cover" />
                    <div v-else class="flex h-9 w-9 items-center justify-center rounded-full bg-surface-200 dark:bg-surface-700">
                        <i class="pi pi-user text-sm text-surface-500" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-semibold">{{ selectedConv.userId?.name || 'Người dùng' }}</p>
                        <p class="truncate text-xs text-surface-400">{{ selectedConv.userId?.email || '' }}</p>
                    </div>
                    <Tag :value="selectedConv.status === 'open' ? 'Đang mở' : 'Đã đóng'" :severity="selectedConv.status === 'open' ? 'success' : 'secondary'" class="shrink-0 text-xs" />
                    <Button
                        :icon="selectedConv.status === 'open' ? 'pi pi-lock' : 'pi pi-lock-open'"
                        :loading="changingStatus"
                        text
                        rounded
                        size="small"
                        class="shrink-0"
                        @click="changeConversationStatus"
                        v-tooltip.left="selectedConv.status === 'open' ? 'Đóng hội thoại' : 'Mở lại hội thoại'"
                    />
                    <Button
                        icon="pi pi-info-circle"
                        text
                        rounded
                        size="small"
                        class="shrink-0"
                        :severity="showUserPanel ? 'primary' : 'secondary'"
                        @click="showUserPanel = !showUserPanel"
                        v-tooltip.left="'Thông tin khách hàng'"
                    />
                </div>

                <!-- Messages -->
                <div ref="messagesContainerRef" class="flex-1 overflow-y-auto p-5 scroll-smooth">
                    <!-- Loading -->
                    <div v-if="messagesLoading" class="flex items-center justify-center py-12">
                        <ProgressSpinner style="width: 40px; height: 40px" />
                    </div>

                    <template v-else>
                        <!-- Load more -->
                        <div v-if="hasMore" class="flex justify-center pb-3">
                            <Button label="Tải thêm" text size="small" :loading="loadingMore" @click="loadMoreMessages" />
                        </div>

                        <!-- Empty -->
                        <div v-if="!messages.length" class="flex flex-col items-center gap-2 py-14 text-center">
                            <i class="pi pi-comment text-3xl text-surface-300 dark:text-surface-600" />
                            <p class="text-sm text-surface-400">Chưa có tin nhắn. Hãy gửi tin nhắn đầu tiên!</p>
                        </div>

                        <!-- Message list -->
                        <div v-for="msg in messages" :key="msg._id" class="mb-3 flex flex-col" :class="msg.senderRole === 'A' ? 'items-end' : 'items-start'">
                            <div class="flex items-end gap-2" :class="msg.senderRole === 'A' ? 'flex-row-reverse' : ''">
                                <!-- User avatar (client side) -->
                                <div v-if="msg.senderRole === 'C'" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-200 dark:bg-surface-700">
                                    <img v-if="selectedConv.userId?.thumbnail" :src="selectedConv.userId.thumbnail" alt="" class="h-7 w-7 rounded-full object-cover" />
                                    <i v-else class="pi pi-user text-xs text-surface-500" />
                                </div>

                                <div
                                    class="max-w-auto rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                                    :class="msg.senderRole === 'A' ? 'rounded-br-sm bg-primary-500 text-white' : 'rounded-bl-sm bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-100'"
                                >
                                    {{ msg.content }}
                                </div>
                            </div>
                            <span class="mt-1 text-[11px] text-surface-400" :class="msg.senderRole === 'A' ? 'pr-1' : 'pl-9'">
                                {{ formatMsgTime(msg.createdAt) }}
                            </span>
                        </div>

                        <!-- User typing indicator -->
                        <div v-if="userIsTyping" class="mb-3 flex items-end gap-2">
                            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-200 dark:bg-surface-700">
                                <img v-if="selectedConv.userId?.thumbnail" :src="selectedConv.userId.thumbnail" alt="" class="h-7 w-7 rounded-full object-cover" />
                                <i v-else class="pi pi-user text-xs text-surface-500" />
                            </div>
                            <div class="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-100 px-4 py-3 dark:bg-surface-800">
                                <span class="h-2 w-2 animate-bounce rounded-full bg-surface-400" style="animation-delay: 0ms"></span>
                                <span class="h-2 w-2 animate-bounce rounded-full bg-surface-400" style="animation-delay: 150ms"></span>
                                <span class="h-2 w-2 animate-bounce rounded-full bg-surface-400" style="animation-delay: 300ms"></span>
                            </div>
                        </div>

                        <div ref="messagesEndRef"></div>
                    </template>
                </div>

                <!-- Input area -->
                <div class="flex shrink-0 items-end gap-3 border-t border-surface-200 bg-surface-0 p-4 dark:border-surface-700 dark:bg-surface-900">
                    <textarea
                        v-model="inputText"
                        @keydown="handleKeydown"
                        @input="handleInput"
                        placeholder="Nhập tin nhắn trả lời... (Enter để gửi)"
                        rows="1"
                        :disabled="sending"
                        class="flex-1 resize-none rounded-xl border border-surface-300 bg-surface-50 px-4 py-2.5 text-sm text-surface-900 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100 disabled:opacity-50 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:focus:ring-primary-900/30"
                        style="max-height: 120px; overflow-y: auto"
                    ></textarea>
                    <Button icon="pi pi-send" :loading="sending" :disabled="!inputText.trim() || sending" @click="sendMessage" class="shrink-0" v-tooltip.top="'Gửi (Enter)'" />
                </div>
            </template>
        </div>

        <!-- User info panel -->
        <Transition name="info-panel">
            <div v-if="showUserPanel && selectedConv" class="flex w-80 shrink-0 flex-col border-l border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900 overflow-y-auto">
                <!-- Panel header -->
                <div class="flex shrink-0 items-center justify-between border-b border-surface-200 px-4 py-3 dark:border-surface-700">
                    <p class="text-sm font-bold">Thông tin khách hàng</p>
                    <Button icon="pi pi-times" text rounded size="small" @click="showUserPanel = false" />
                </div>

                <!-- Loading -->
                <div v-if="userDetailLoading" class="flex flex-1 items-center justify-center py-12">
                    <ProgressSpinner style="width: 32px; height: 32px" />
                </div>

                <!-- No data -->
                <div v-else-if="!userDetail" class="flex flex-1 flex-col items-center gap-2 px-4 py-14 text-center">
                    <i class="pi pi-user text-3xl text-surface-300 dark:text-surface-600" />
                    <p class="text-sm text-surface-400">Không thể tải thông tin</p>
                </div>

                <!-- Content -->
                <div v-else class="flex flex-col gap-4 p-4">
                    <!-- Avatar + name + badges -->
                    <div class="flex flex-col items-center gap-2 text-center">
                        <img
                            v-if="userDetail.thumbnail"
                            :src="userDetail.thumbnail"
                            alt=""
                            class="h-16 w-16 rounded-full object-cover"
                            :style="{ outline: `3px solid ${tierConfig[userDetail.membershipTier]?.ringColor || '#e5e7eb'}`, outlineOffset: '3px' }"
                        />
                        <div
                            v-else
                            class="flex h-16 w-16 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-700"
                            :style="{ outline: `3px solid ${tierConfig[userDetail.membershipTier]?.ringColor || '#e5e7eb'}`, outlineOffset: '3px' }"
                        >
                            <i class="pi pi-user text-2xl text-surface-400" />
                        </div>
                        <div>
                            <p class="text-sm font-bold">{{ userDetail.name }}</p>
                            <p class="mt-0.5 text-xs text-surface-400">{{ userDetail.email }}</p>
                        </div>
                        <div class="flex flex-wrap justify-center gap-1">
                            <Tag :severity="statusSeverityMap[userDetail.status]" :value="statusLabelMap[userDetail.status] || userDetail.status" class="text-xs" />
                            <Tag :severity="tierSeverityMap[userDetail.membershipTier]" :value="tierConfig[userDetail.membershipTier]?.label || userDetail.membershipTier" class="text-xs" />
                        </div>
                    </div>

                    <!-- Membership card -->
                    <div class="relative overflow-hidden rounded-xl p-3 text-white" :style="tierConfig[userDetail.membershipTier]?.cardStyle">
                        <div class="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white opacity-10" />
                        <div class="relative z-10 flex items-center justify-between">
                            <div>
                                <div class="mb-0.5 text-[10px] font-semibold uppercase tracking-widest opacity-70">Hạng thành viên</div>
                                <div class="text-xl font-extrabold">{{ tierConfig[userDetail.membershipTier]?.label }}</div>
                                <div class="mt-0.5 text-xs opacity-75">{{ tierConfig[userDetail.membershipTier]?.benefit }}</div>
                            </div>
                            <div class="shrink-0 text-right">
                                <div class="text-3xl leading-none">{{ tierConfig[userDetail.membershipTier]?.emoji }}</div>
                                <div class="mt-1 text-[10px] opacity-70">Tổng chi tiêu</div>
                                <div class="text-sm font-bold">{{ formatPrice(userDetail.totalSpent || 0) }}đ</div>
                            </div>
                        </div>
                    </div>

                    <!-- Info items -->
                    <div class="flex flex-col gap-2">
                        <div class="rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
                            <div class="mb-1 flex items-center gap-1.5 text-surface-400">
                                <i class="pi pi-phone text-xs" />
                                <span class="text-[10px] font-medium uppercase tracking-wide">Điện thoại</span>
                            </div>
                            <div class="text-sm font-semibold">{{ userDetail.phone || '—' }}</div>
                        </div>
                        <div class="rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
                            <div class="mb-1 flex items-center gap-1.5 text-surface-400">
                                <i class="pi pi-calendar text-xs" />
                                <span class="text-[10px] font-medium uppercase tracking-wide">Ngày tham gia</span>
                            </div>
                            <div class="text-sm font-semibold">{{ format(new Date(userDetail.createdAt), 'dd/MM/yyyy') }}</div>
                        </div>
                        <div class="rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
                            <div class="mb-1 flex items-center gap-1.5 text-surface-400">
                                <i class="pi pi-map-marker text-xs" />
                                <span class="text-[10px] font-medium uppercase tracking-wide">Địa chỉ</span>
                            </div>
                            <div class="text-sm font-medium leading-relaxed">
                                {{ [userDetail.addressLine, userDetail.ward, userDetail.district, userDetail.province].filter(Boolean).join(', ') || '—' }}
                            </div>
                        </div>
                    </div>

                    <p class="text-right text-[11px] text-surface-400">Cập nhật: {{ format(new Date(userDetail.updatedAt), 'dd/MM/yyyy') }}</p>
                </div>
            </div>
        </Transition>
        </div>
    </div>
</template>

<style scoped>
.info-panel-enter-active,
.info-panel-leave-active {
    transition: width 0.2s ease, opacity 0.2s ease;
    overflow: hidden;
}
.info-panel-enter-from,
.info-panel-leave-to {
    width: 0 !important;
    opacity: 0;
}
</style>
