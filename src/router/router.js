import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from "@/components/HomePage.vue";
import Enterprises from "@/components/Enterprises.vue";
import Products from "@/components/Products.vue";
import PriceLists from "@/components/PriceLists.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/Enterprises',
        name: 'Predpriyatia',
        component: Enterprises,
    },
    {
        path: '/Products',
        name: 'Products',
        component: Products,
    },
    {
        path: '/Pricelists',
        name: 'PriceLists',
        component: PriceLists,
    }

];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
