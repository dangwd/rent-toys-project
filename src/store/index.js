import authService from '@/service/auth.service';
import { defineStore } from 'pinia';

const user = JSON.parse(localStorage.getItem('user'));

export const useAuthStore = defineStore('auth', {
    state: () => ({
        status: user ? { loggedIn: true } : { loggedIn: false },
        user: user || null
    }),
    actions: {
        async login(userCre) {
            try {
                const user = await authService.funcLogin(userCre);
                this.loginSuccess(user);
                const message = `Chào mừng ${user.metadata.user} quay trở lại!`;
                return {
                    status: 1,
                    type: 'Login',
                    user,
                    message
                };
            } catch (error) {
                this.loginFail();
                return {
                    status: 0,
                    type: 'Login',
                    message: error
                };
            }
        },
        async register(userCre) {
            try {
                const res = await authService.funcRegister(userCre);
                this.loginSuccess(user);
                const message = `Đăng ký thành công!`;
                return {
                    status: 1,
                    type: 'Register',
                    user,
                    message
                };
            } catch (error) {
                this.loginFail();
                return {
                    status: 0,
                    type: 'Register',
                    message: error
                };
            }
        },
        async logout() {
            try {
                const res = await authService.funcSignout();
            } catch (error) {
                console.log(error);
            }
        },

        loginSuccess(user) {
            this.status.loggedIn = true;
            this.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        loginFail() {
            this.status.loggedIn = false;
            this.user = null;
            localStorage.removeItem('user');
        }
    }
});
