import adminRouter from '@/views/admin/router/adminRouter';
import clientRouter from '@/views/client/router/clientRouter';
import { createRouter, createWebHistory } from 'vue-router';
import auth from '../middleware/auth.middleware';
const user = JSON.parse(localStorage.getItem('user'))
const routes = [...clientRouter, ...adminRouter];
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    },
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        const isAuthenticated = await auth();
        if (!isAuthenticated) {
            next({ name: 'login' });
            return;
        }
        if (to.meta.roles) {
            let roleUser = user.metadata.user.role;
            if (to.meta.roles.includes(roleUser)) {
                next();
            } else {
                next({ name: 'home' });
            }
            return;
        }
    }
    next();
});
export default router;
