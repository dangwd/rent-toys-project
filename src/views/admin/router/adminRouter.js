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
                component: () => import('@/views/admin/pages/ProductsMan.vue')
            },
            {
                path: '/man/brands',
                name: 'brands',
                component: () => import('@/views/admin/pages/BrandsMan.vue')
            },
            {
                path: '/man/genres',
                name: 'genres',
                component: () => import('@/views/admin/pages/GenreMan.vue')
            },
            {
                path: '/man/invoice',
                name: 'invoice',
                component: () => import('@/views/admin/pages/InvoiceMan.vue')
            },
            {
                path: '/man/coupon',
                name: 'coupon',
                component: () => import('@/views/admin/pages/CouponMan.vue')
            },
            {
                path: '/man/banners',
                name: 'banners',
                component: () => import('@/views/admin/pages/BannerMan.vue')
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
