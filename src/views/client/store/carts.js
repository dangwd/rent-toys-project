import API from '@/api/api-main';
import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref } from 'vue';
export const useCartStore = defineStore('cart', () => {
    const { proxy } = getCurrentInstance();
    const toast = useToast()
    const cart = ref([]);

    const getCartItems = () => {
        return cart.value;
    };
    const getItem = async () => {
        const res = await API.get(`cart`);
        return res.data.metadata

    };

    const addToCart = async (product) => {
        try {
            const res = await API.create('cart/addToCart', product)
            if (!res) {
                return proxy.$notify("E", "Có lỗi xảy ra!", toast)
            }
            proxy.$notify("S", res.data.message, toast)
            return res
        } catch (error) {
            throw new Error({ error })
        }
    };
    const updateCart = async (product) => {
        try {
            const res = await API.create(`cart/UpdateItem`, product)
            return res
        } catch (error) {
            console.log(error);
        }
    }
    const removeItem = async (productId) => {
        try {
            const res = await API.delete('cart/RemoveItem', productId)
            return res
        } catch (error) {
            console.log(error);
        }
    }
    return {
        cart,
        getItem,
        addToCart,
        getCartItems,
        removeItem,
        updateCart
    };
});
