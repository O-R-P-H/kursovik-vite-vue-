import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from "@/components/HomePage.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    }
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
});

export default router;
