import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from "../pages/HomePage.vue";
import Enterprises from "../pages/Enterprises.vue";
import Products from "../pages/Products.vue";
import PriceLists from "../pages/PriceLists.vue";


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
