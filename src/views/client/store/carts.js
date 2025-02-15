import API from '@/api/api-main';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const cart = ref([]);

    const getCartItems = () => {
        return cart.value;
    };
    const getItem = async () => {
        const res = await API.get(`cart`);
        cart.value = res.data;
        console.log(cart.value);
    };

    const addToCart = (product) => {
        const existingItem = cart.value.find((item) => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.value.push({ ...product, quantity: 1 });
        }
    };

    return {
        cart,
        getItem,
        addToCart,
        getCartItems
    };
});
