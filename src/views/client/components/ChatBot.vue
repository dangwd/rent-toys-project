<script setup>
import chatbotService from '@/service/chatbot.service';
import { formatPrice } from '@/helper/formatPrice';
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isOpen = ref(false);
const inputText = ref('');
const isLoading = ref(false);
const messagesEndRef = ref(null);

const messages = ref([
    {
        id: 1,
        role: 'bot',
        text: 'Xin chào! Mình là trợ lý ảo của KingdomToys. Mình có thể giúp bạn tìm đồ chơi, hỏi về giá hoặc các chính sách của shop. Bạn cần hỗ trợ gì không? 😊',
        products: []
    }
]);

const scrollToBottom = async () => {
    await nextTick();
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const sendMessage = async () => {
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

const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
};

const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) scrollToBottom();
};

const QUICK_REPLIES = ['Đồ chơi mới nhất', 'Sản phẩm đang giảm giá', 'Có những loại đồ chơi gì?', 'Chính sách đổi trả'];

const sendQuick = (text) => {
    inputText.value = text;
    sendMessage();
};

const goToProduct = (id) => {
    router.push(`/client/detail/${id}`);
    isOpen.value = false;
};
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
        <span v-if="!isOpen" class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">1</span>
    </button>

    <!-- Chat window -->
    <transition name="chat-pop">
        <div
            v-if="isOpen"
            class="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
            style="height: 520px"
        >
            <!-- Header -->
            <div class="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 p-4">
                <div class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <i class="pi pi-android text-lg text-white"></i>
                    <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-indigo-600 bg-green-400"></span>
                </div>
                <div class="min-w-0">
                    <p class="text-sm font-semibold text-white">Trợ lý KingdomToys</p>
                    <p class="text-xs text-indigo-200">Luôn sẵn sàng hỗ trợ bạn</p>
                </div>
                <button type="button" @click="toggleChat" class="ml-auto rounded-lg p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white">
                    <i class="pi pi-minus text-sm"></i>
                </button>
            </div>

            <!-- Messages -->
            <div class="flex-1 space-y-3 overflow-y-auto p-4 scroll-smooth">
                <div v-for="msg in messages" :key="msg.id" class="flex flex-col" :class="msg.role === 'user' ? 'items-end' : 'items-start'">
                    <!-- Message bubble row -->
                    <div class="flex w-full" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                        <!-- Bot avatar -->
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

                    <!-- Product cards (bot only) -->
                    <div v-if="msg.role === 'bot' && msg.products && msg.products.length" class="mt-2 w-full space-y-2 pl-9">
                        <button
                            v-for="product in msg.products"
                            :key="product._id"
                            type="button"
                            @click="goToProduct(product._id)"
                            class="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-indigo-600"
                        >
                            <!-- Thumbnail -->
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

                            <!-- Info -->
                            <div class="min-w-0 flex-1">
                                <p class="line-clamp-2 text-xs font-semibold text-gray-900 dark:text-gray-100">{{ product.productName }}</p>
                                <div class="mt-1 flex items-baseline gap-1.5">
                                    <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ formatPrice(product.finalPrice) }}đ</span>
                                    <span v-if="product.discount" class="text-[11px] text-gray-400 line-through dark:text-gray-500">{{ formatPrice(product.price) }}đ</span>
                                </div>
                                <div class="mt-0.5 flex items-center gap-1">
                                    <span
                                        class="text-[10px] font-medium"
                                        :class="product.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'"
                                    >
                                        {{ product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : 'Hết hàng' }}
                                    </span>
                                </div>
                            </div>

                            <i class="pi pi-chevron-right shrink-0 text-xs text-gray-400 dark:text-gray-500"></i>
                        </button>
                    </div>
                </div>

                <!-- Typing indicator -->
                <div v-if="isLoading" class="flex items-start gap-2">
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

            <!-- Quick replies -->
            <div v-if="messages.length <= 1" class="flex flex-wrap gap-1.5 border-t border-gray-100 px-3 py-2 dark:border-zinc-800">
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
            <div class="flex items-end gap-2 border-t border-gray-100 p-3 dark:border-zinc-800">
                <textarea
                    v-model="inputText"
                    @keydown="handleKeydown"
                    placeholder="Nhập tin nhắn..."
                    rows="1"
                    class="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100 dark:focus:border-indigo-500 dark:focus:bg-zinc-700"
                    style="max-height: 96px; overflow-y: auto"
                    :disabled="isLoading"
                ></textarea>
                <button
                    type="button"
                    @click="sendMessage"
                    :disabled="!inputText.trim() || isLoading"
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
