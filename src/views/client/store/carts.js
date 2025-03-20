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
        cart.value = res.data.metadata;
        return res.data.metadata
    };

    const addToCart = async (product) => {
        try {
            const res = await API.create('cart/addToCart', product)
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    return {
        cart,
        getItem,
        addToCart,
        getCartItems
    };
});
