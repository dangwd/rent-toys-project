import API from '@/api/api-main';

class ChatService {
    async getOrCreateConversation() {
        const res = await API.get('chat/conversation');
        return res?.data?.metadata ?? null;
    }

    async getMessages(conversationId, skip = 0) {
        const res = await API.get(`chat/conversations/${conversationId}/messages?skip=${skip}`);
        const meta = res?.data?.metadata;
        if (Array.isArray(meta)) return meta;
        if (Array.isArray(meta?.result)) return meta.result;
        return [];
    }

    async sendMessage(conversationId, content, senderRole = 'C') {
        const res = await API.create(`chat/conversations/${conversationId}/messages`, { content, senderRole });
        return res?.data?.metadata ?? null;
    }

    async markRead(conversationId) {
        await API.updatev2(`chat/conversations/${conversationId}/read`, {});
    }

    async getConversations(status = '') {
        const query = status ? `?status=${status}` : '';
        const res = await API.get(`chat/conversations${query}`);
        const meta = res?.data?.metadata;
        if (Array.isArray(meta)) return meta;
        if (Array.isArray(meta?.result)) return meta.result;
        return [];
    }

    async updateStatus(conversationId, status) {
        const res = await API.updatev2(`chat/conversations/${conversationId}/status`, { status });
        return res?.data?.metadata ?? null;
    }
}

export default new ChatService();
