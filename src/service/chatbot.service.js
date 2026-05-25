import axios from 'axios';

const api = import.meta.env.VITE_APP_API;

const getSessionId = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.metadata?.user?._id;
        if (userId) return `user-${userId}`;
    } catch {
        // fall through
    }
    let guestId = localStorage.getItem('chat_session_id');
    if (!guestId) {
        guestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem('chat_session_id', guestId);
    }
    return guestId;
};

class ChatbotService {
    async sendMessage(message) {
        const res = await axios.post(`${api}chat`, {
            message,
            sessionId: getSessionId()
        });
        const { fulfillmentText, products = [] } = res.data.metadata;
        return { text: fulfillmentText, products };
    }
}

export default new ChatbotService();
