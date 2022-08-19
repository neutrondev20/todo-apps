import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path : "/",
        name : "home.index",
        component : () => import("../views/home/Home.vue")
    },

]

const router = createRouter({
    history : createWebHistory(),
    routes
})

export default router;