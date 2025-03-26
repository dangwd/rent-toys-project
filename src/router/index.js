import adminRouter from '@/views/admin/router/adminRouter';
import clientRouter from '@/views/client/router/clientRouter';
import { createRouter, createWebHistory } from 'vue-router';
import auth from '../middleware/auth.middleware';
const routes = [...clientRouter, ...adminRouter];
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 }
    },
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        const isAuthenticated = await auth();
        if (!isAuthenticated) {
            next({ name: 'home' });
            return;
        }
        if (to.meta.role && to.meta.role !== isAuthenticated.role) {
            if (isAuthenticated.roles === 'A') {
                next({ name: 'dashboard' });
            } else {
                next({ name: 'home' });
            }
            return;
        }
    }
    next();
});
export default router;
