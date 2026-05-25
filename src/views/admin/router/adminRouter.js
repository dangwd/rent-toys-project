import AppLayout from '@/layout/AppLayout.vue';

export default [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'dashboard',
                component: () => import('@/views/Dashboard.vue'),
                meta: {
                    requiresAuth: true,
                    roles: 'A'
                }
            },
            {
                path: '/man/products',
                name: 'products',
                component: () => import('@/views/admin/pages/ProductsMan.vue'),
                meta: { requiresAuth: true, roles: 'A' }
            },
            {
                path: '/man/brands',
                name: 'brands',
                component: () => import('@/views/admin/pages/BrandsMan.vue'),
                meta: { requiresAuth: true, roles: 'A' }
            },
            {
                path: '/man/users',
                name: 'users',
                component: () => import('@/views/admin/pages/UsersMan.vue'),
                meta: { requiresAuth: true, roles: 'A' }
            },
            {
                path: '/man/genres',
                name: 'genres',
                component: () => import('@/views/admin/pages/GenreMan.vue'),
                meta: { requiresAuth: true, roles: 'A' }
            },
            {
                path: '/man/invoice',
                name: 'invoice',
                component: () => import('@/views/admin/pages/InvoiceMan.vue'),
                meta: { requiresAuth: true, roles: 'A' }
            },
            {
                path: '/man/coupon',
                name: 'coupon',
                component: () => import('@/views/admin/pages/CouponMan.vue'),
                meta: { requiresAuth: true, roles: 'A' }
            },
            {
                path: '/man/banners',
                name: 'banners',
                component: () => import('@/views/admin/pages/BannerMan.vue'),
                meta: { requiresAuth: true, roles: 'A' }
            },
            {
                path: '/man/revenue-report',
                name: 'revenueReport',
                component: () => import('@/views/admin/pages/RevenueReport.vue'),
                meta: { requiresAuth: true, roles: 'A' }
            }
        ]
    },
    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    },

    {
        path: '/auth/login',
        name: 'login',
        component: () => import('@/views/pages/auth/Login.vue')
    },
    {
        path: '/auth/access',
        name: 'accessDenied',
        component: () => import('@/views/pages/auth/Access.vue')
    },
    {
        path: '/auth/error',
        name: 'error',
        component: () => import('@/views/pages/auth/Error.vue')
    }
];
