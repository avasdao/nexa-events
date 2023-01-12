import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView2.vue'

import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminDbDump from '../views/admin/DbDump.vue'

import AboutView from '../views/AboutView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeView
        },
        {
            path: '/about',
            component: AboutView
        },
        {
            path: '/admin',
            component: AdminDashboard
        },
        {
            path: '/admin/db-dump',
            component: AdminDbDump
        },
    ]
})

export default router
