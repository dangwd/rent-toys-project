export default [
    {
        path: '/client',
        component: () => import('@/views/client/layouts/AppLayout.vue'),
        children: [
            {
                path: '/client',
                name: 'home',
                component: () => import('@/views/client/pages/HomePage.vue')
            },
            {
                path: '/client/detail/:id',
                name: 'item-detail',
                component: () => import('@/views/client/pages/ProductDetail.vue')
            }
        ]
    }
];
