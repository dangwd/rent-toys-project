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
                path: '/man/books',
                name: 'books',
                component: () => import('@/views/admin/pages/BooksMan.vue')
            },
            {
                path: '/man/authors',
                name: 'authors',
                component: () => import('@/views/admin/pages/AuthorsMan.vue')
            },
            {
                path: '/man/genre',
                name: 'genre',
                component: () => import('@/views/admin/pages/GenreMan.vue')
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
