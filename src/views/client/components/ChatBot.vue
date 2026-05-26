<script setup>
import chatbotService from '@/service/chatbot.service';
import chatService from '@/service/chat.service';
import { formatPrice } from '@/helper/formatPrice';
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getSocket } from '@/service/socket';

const router = useRouter();
const isOpen = ref(false);
const inputText = ref('');
const isLoading = ref(false);
const messagesEndRef = ref(null);
const adminMessagesEndRef = ref(null);
const activeTab = ref('bot');

// ── Bot chat ──────────────────────────────────────────────────────────────────
const messages = ref([
    {
        id: 1,
        role: 'bot',
        text: 'Xin chào! Mình là trợ lý ảo của KingdomToys. Mình có thể giúp bạn tìm đồ chơi, hỏi về giá hoặc các chính sách của shop. Bạn cần hỗ trợ gì không? 😊',
        products: []
    }
]);

const QUICK_REPLIES = ['Đồ chơi mới nhất', 'Sản phẩm đang giảm giá', 'Có những loại đồ chơi gì?', 'Chính sách đổi trả'];

// ── Admin chat ────────────────────────────────────────────────────────────────
const userLoggedIn = ref(false);
const adminMessages = ref([]);
const adminLoading = ref(false);
const adminInitialized = ref(false);
const adminError = ref(false);
const conversationId = ref(null);
const adminIsTyping = ref(false);
const adminUnread = ref(0);

let typingDebounce = null;
let adminTypingTimer = null;
let chatMessageHandler = null;
let chatTypingHandler = null;
let chatReadHandler = null;
let reconnectHandler = null;

const getUser = () => {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const checkLogin = () => {
    const user = getUser();
    userLoggedIn.value = Boolean(user?.metadata?.accessToken);
    return userLoggedIn.value;
};

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
    await nextTick();
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToAdminBottom = async () => {
    await nextTick();
    adminMessagesEndRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const markAdminRead = () => {
    if (!conversationId.value) return;
    adminUnread.value = 0;
    getSocket()?.emit('chat:read', { conversationId: conversationId.value });
};

const initAdminChat = async () => {
    if (adminInitialized.value || adminLoading.value) return;
    adminLoading.value = true;
    adminError.value = false;
    try {
        const conv = await chatService.getOrCreateConversation();
        if (!conv) throw new Error('no conversation');
        conversationId.value = conv._id;

        const msgs = await chatService.getMessages(conv._id);
        adminMessages.value = msgs;

        const socket = getSocket();
        if (socket) {
            chatMessageHandler = ({ conversationId: cid, message }) => {
                if (cid !== conversationId.value) return;
                if (adminMessages.value.find((m) => m._id === message._id)) return;
                adminMessages.value.push(message);
                scrollToAdminBottom();
                if (activeTab.value === 'admin' && isOpen.value) {
                    markAdminRead();
                } else {
                    adminUnread.value++;
                }
            };

            chatTypingHandler = ({ conversationId: cid }) => {
                if (cid !== conversationId.value) return;
                adminIsTyping.value = true;
                clearTimeout(adminTypingTimer);
                adminTypingTimer = setTimeout(() => {
                    adminIsTyping.value = false;
                }, 2000);
            };

            chatReadHandler = ({ conversationId: cid }) => {
                if (cid !== conversationId.value) return;
            };

            reconnectHandler = () => {
                if (conversationId.value) {
                    socket.emit('chat:join', { conversationId: conversationId.value });
                }
            };

            socket.on('chat:message', chatMessageHandler);
            socket.on('chat:typing', chatTypingHandler);
            socket.on('chat:read', chatReadHandler);
            socket.on('connect', reconnectHandler);

            socket.emit('chat:join', { conversationId: conv._id });
        }

        adminInitialized.value = true;
    } catch {
        adminError.value = true;
    } finally {
        adminLoading.value = false;
    }
};

const retryAdminInit = () => {
    adminError.value = false;
    initAdminChat();
};

// ── Send ──────────────────────────────────────────────────────────────────────
const sendBotMessage = async () => {
    const text = inputText.value.trim();
    if (!text || isLoading.value) return;
    inputText.value = '';
    messages.value.push({ id: Date.now(), role: 'user', text, products: [] });
    await scrollToBottom();
    isLoading.value = true;
    try {
        const reply = await chatbotService.sendMessage(text);
        messages.value.push({ id: Date.now() + 1, role: 'bot', text: reply.text, products: reply.products });
    } catch {
        messages.value.push({
            id: Date.now() + 1,
            role: 'bot',
            text: 'Xin lỗi, mình đang gặp sự cố kỹ thuật. Bạn vui lòng thử lại sau nhé!',
            products: []
        });
    } finally {
        isLoading.value = false;
        await scrollToBottom();
    }
};

const sendAdminMessage = () => {
    const text = inputText.value.trim();
    if (!text || isLoading.value || !conversationId.value) return;
    inputText.value = '';
    isLoading.value = true;

    const socket = getSocket();
    if (socket?.connected) {
        socket.emit('chat:send', { conversationId: conversationId.value, content: text, senderRole: 'C' }, (res) => {
            if (res?.ok && res.message) {
                if (!adminMessages.value.find((m) => m._id === res.message._id)) {
                    adminMessages.value.push(res.message);
                    scrollToAdminBottom();
                }
            }
            isLoading.value = false;
        });
    } else {
        chatService
            .sendMessage(conversationId.value, text)
            .then((msg) => {
                if (msg) {
                    adminMessages.value.push(msg);
                    scrollToAdminBottom();
                }
            })
            .catch(() => {})
            .finally(() => {
                isLoading.value = false;
            });
    }
};

const sendMessage = () => {
    if (activeTab.value === 'admin') sendAdminMessage();
    else sendBotMessage();
};

const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
};

const handleInput = () => {
    if (activeTab.value !== 'admin' || !conversationId.value) return;
    clearTimeout(typingDebounce);
    typingDebounce = setTimeout(() => {
        getSocket()?.emit('chat:typing', { conversationId: conversationId.value });
    }, 400);
};

// ── Tab & Toggle ──────────────────────────────────────────────────────────────
const switchTab = async (tab) => {
    activeTab.value = tab;
    if (tab === 'admin') {
        checkLogin();
        if (userLoggedIn.value) {
            await initAdminChat();
            markAdminRead();
            scrollToAdminBottom();
        }
    } else {
        scrollToBottom();
    }
};

const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        if (activeTab.value === 'bot') scrollToBottom();
        else scrollToAdminBottom();
    }
};

watch([isOpen, activeTab], ([open, tab]) => {
    if (open && tab === 'admin' && adminInitialized.value) markAdminRead();
});

const sendQuick = (text) => {
    inputText.value = text;
    sendMessage();
};

const goToProduct = (id) => {
    router.push(`/client/detail/${id}`);
    isOpen.value = false;
};

const inputDisabled = computed(() => {
    if (activeTab.value === 'bot') return isLoading.value;
    return !userLoggedIn.value || adminError.value || !adminInitialized.value || isLoading.value;
});

onUnmounted(() => {
    const socket = getSocket();
    if (socket) {
        if (chatMessageHandler) socket.off('chat:message', chatMessageHandler);
        if (chatTypingHandler) socket.off('chat:typing', chatTypingHandler);
        if (chatReadHandler) socket.off('chat:read', chatReadHandler);
        if (reconnectHandler) socket.off('connect', reconnectHandler);
    }
    clearTimeout(typingDebounce);
    clearTimeout(adminTypingTimer);
});
</script>

<template>
    <!-- Floating toggle button -->
    <button
        type="button"
        @click="toggleChat"
        aria-label="Mở chatbot"
        class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/40 transition-all duration-300 hover:scale-110 hover:bg-indigo-500 active:scale-95"
        :class="{ 'rotate-90': isOpen }"
    >
        <i class="pi text-xl text-white" :class="isOpen ? 'pi-times' : 'pi-comments'"></i>
        <span
            v-if="!isOpen"
            class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
        >
            {{ adminUnread > 0 ? adminUnread : '1' }}
        </span>
    </button>

    <!-- Chat window -->
    <transition name="chat-pop">
        <div
            v-if="isOpen"
            class="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
            style="height: 540px"
        >
            <!-- Header -->
            <div class="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 p-4">
                <div class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <i class="pi text-lg text-white" :class="activeTab === 'bot' ? 'pi-android' : 'pi-headphones'"></i>
                    <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-indigo-600 bg-green-400"></span>
                </div>
                <div class="min-w-0">
                    <p class="text-sm font-semibold text-white">{{ activeTab === 'bot' ? 'Trợ lý KingdomToys' : 'Hỗ trợ khách hàng' }}</p>
                    <p class="text-xs text-indigo-200">{{ activeTab === 'bot' ? 'Luôn sẵn sàng hỗ trợ bạn' : 'Nhắn tin trực tiếp với admin' }}</p>
                </div>
                <button type="button" @click="toggleChat" class="ml-auto rounded-lg p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white">
                    <i class="pi pi-minus text-sm"></i>
                </button>
            </div>

            <!-- Tab bar -->
            <div class="flex shrink-0 border-b border-gray-200 dark:border-zinc-700">
                <button
                    type="button"
                    @click="switchTab('bot')"
                    class="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition"
                    :class="activeTab === 'bot' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                >
                    <i class="pi pi-android text-sm"></i>
                    Bot AI
                </button>
                <button
                    type="button"
                    @click="switchTab('admin')"
                    class="relative flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition"
                    :class="activeTab === 'admin' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                >
                    <i class="pi pi-comments text-sm"></i>
                    Tư vấn viên
                    <span v-if="adminUnread > 0" class="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{{ adminUnread }}</span>
                </button>
            </div>

            <!-- ── Bot panel ─────────────────────────────────────────────── -->
            <div v-show="activeTab === 'bot'" class="flex-1 space-y-3 overflow-y-auto p-4 scroll-smooth">
                <div v-for="msg in messages" :key="msg.id" class="flex flex-col" :class="msg.role === 'user' ? 'items-end' : 'items-start'">
                    <div class="flex w-full" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                        <div v-if="msg.role === 'bot'" class="mr-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                            <i class="pi pi-android text-xs text-indigo-600 dark:text-indigo-400"></i>
                        </div>
                        <div
                            class="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                            :class="msg.role === 'user' ? 'rounded-br-sm bg-indigo-600 text-white' : 'rounded-bl-sm bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-100'"
                        >
                            {{ msg.text }}
                        </div>
                    </div>

                    <!-- Product cards -->
                    <div v-if="msg.role === 'bot' && msg.products && msg.products.length" class="mt-2 w-full space-y-2 pl-9">
                        <button
                            v-for="product in msg.products"
                            :key="product._id"
                            type="button"
                            @click="goToProduct(product._id)"
                            class="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-indigo-600"
                        >
                            <div class="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-700">
                                <img
                                    v-if="product.images && product.images.length"
                                    :src="product.images[0]"
                                    :alt="product.productName"
                                    class="h-full w-full object-cover"
                                    crossorigin="anonymous"
                                />
                                <div v-else class="flex h-full w-full items-center justify-center">
                                    <i class="pi pi-image text-gray-400"></i>
                                </div>
                                <span v-if="product.discount" class="absolute right-0.5 top-0.5 rounded bg-yellow-400 px-1 text-[10px] font-bold text-slate-900">-{{ product.discount }}%</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="line-clamp-2 text-xs font-semibold text-gray-900 dark:text-gray-100">{{ product.productName }}</p>
                                <div class="mt-1 flex items-baseline gap-1.5">
                                    <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ formatPrice(product.finalPrice) }}đ</span>
                                    <span v-if="product.discount" class="text-[11px] text-gray-400 line-through dark:text-gray-500">{{ formatPrice(product.price) }}đ</span>
                                </div>
                                <span
                                    class="text-[10px] font-medium"
                                    :class="product.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'"
                                >
                                    {{ product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : 'Hết hàng' }}
                                </span>
                            </div>
                            <i class="pi pi-chevron-right shrink-0 text-xs text-gray-400 dark:text-gray-500"></i>
                        </button>
                    </div>
                </div>

                <!-- Bot typing indicator -->
                <div v-if="isLoading && activeTab === 'bot'" class="flex items-start gap-2">
                    <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                        <i class="pi pi-android text-xs text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                    <div class="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 dark:bg-zinc-800">
                        <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style="animation-delay: 0ms"></span>
                        <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style="animation-delay: 150ms"></span>
                        <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style="animation-delay: 300ms"></span>
                    </div>
                </div>

                <div ref="messagesEndRef"></div>
            </div>

            <!-- ── Admin panel ────────────────────────────────────────────── -->
            <div v-show="activeTab === 'admin'" class="flex flex-1 flex-col overflow-hidden">
                <!-- Not logged in -->
                <div v-if="!userLoggedIn" class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                        <i class="pi pi-lock text-xl text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Bạn cần đăng nhập để chat với tư vấn viên</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Đăng nhập để được hỗ trợ trực tiếp từ đội ngũ KingdomToys</p>
                </div>

                <!-- Error -->
                <div v-else-if="adminError" class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <i class="pi pi-exclamation-triangle text-xl text-red-500"></i>
                    </div>
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Không thể kết nối</p>
                    <button
                        type="button"
                        @click="retryAdminInit"
                        class="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
                    >
                        Thử lại
                    </button>
                </div>

                <!-- Loading -->
                <div v-else-if="adminLoading" class="flex flex-1 items-center justify-center">
                    <div class="flex flex-col items-center gap-2">
                        <i class="pi pi-spin pi-spinner text-2xl text-indigo-500"></i>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Đang kết nối...</p>
                    </div>
                </div>

                <!-- Messages -->
                <div v-else class="flex-1 overflow-y-auto p-4 scroll-smooth">
                    <div v-if="!adminMessages.length" class="flex flex-col items-center gap-2 py-10 text-center">
                        <i class="pi pi-comments text-3xl text-gray-300 dark:text-gray-600"></i>
                        <p class="text-xs text-gray-400 dark:text-gray-500">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                    </div>

                    <div v-for="msg in adminMessages" :key="msg._id" class="mb-3 flex flex-col" :class="msg.senderRole === 'C' ? 'items-end' : 'items-start'">
                        <div class="flex w-full items-end gap-2" :class="msg.senderRole === 'C' ? 'justify-end' : 'justify-start'">
                            <div v-if="msg.senderRole === 'A'" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
                                <i class="pi pi-headphones text-xs text-violet-600 dark:text-violet-400"></i>
                            </div>
                            <div
                                class="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                                :class="msg.senderRole === 'C' ? 'rounded-br-sm bg-indigo-600 text-white' : 'rounded-bl-sm bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-100'"
                            >
                                {{ msg.content }}
                            </div>
                        </div>
                        <span
                            class="mt-1 px-1 text-[10px] text-gray-400 dark:text-gray-500"
                            :class="msg.senderRole === 'C' ? '' : 'pl-9'"
                        >
                            {{ formatTime(msg.createdAt) }}
                        </span>
                    </div>

                    <!-- Admin typing indicator -->
                    <div v-if="adminIsTyping" class="mb-3 flex items-end gap-2">
                        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
                            <i class="pi pi-headphones text-xs text-violet-600 dark:text-violet-400"></i>
                        </div>
                        <div class="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 dark:bg-zinc-800">
                            <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style="animation-delay: 0ms"></span>
                            <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style="animation-delay: 150ms"></span>
                            <span class="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style="animation-delay: 300ms"></span>
                        </div>
                    </div>

                    <div ref="adminMessagesEndRef"></div>
                </div>
            </div>

            <!-- Quick replies (bot tab only) -->
            <div v-if="activeTab === 'bot' && messages.length <= 1" class="flex shrink-0 flex-wrap gap-1.5 border-t border-gray-100 px-3 py-2 dark:border-zinc-800">
                <button
                    v-for="q in QUICK_REPLIES"
                    :key="q"
                    type="button"
                    @click="sendQuick(q)"
                    class="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
                >
                    {{ q }}
                </button>
            </div>

            <!-- Input -->
            <div class="flex shrink-0 items-end gap-2 border-t border-gray-100 p-3 dark:border-zinc-800">
                <textarea
                    v-model="inputText"
                    @keydown="handleKeydown"
                    @input="handleInput"
                    :placeholder="activeTab === 'admin' ? 'Nhắn tin cho tư vấn viên...' : 'Nhập tin nhắn...'"
                    rows="1"
                    class="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 dark:focus:border-indigo-500 dark:focus:bg-zinc-700"
                    style="max-height: 96px; overflow-y: auto"
                    :disabled="inputDisabled"
                ></textarea>
                <button
                    type="button"
                    @click="sendMessage"
                    :disabled="!inputText.trim() || inputDisabled"
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <i class="pi pi-send text-sm"></i>
                </button>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.chat-pop-enter-active,
.chat-pop-leave-active {
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chat-pop-enter-from,
.chat-pop-leave-to {
    opacity: 0;
    transform: scale(0.85) translateY(20px);
    transform-origin: bottom right;
}
</style>
