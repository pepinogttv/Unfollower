import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/groups/:group?",
    name: "Unfollower",
    component: () =>
      import(/* webpackChunkName: "unfollower" */ "../views/Unfollower.vue"),
  },
  {
    path: "*",
    beforeEnter: (to, from, next) => {
      next("/404");
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue"),
  },
  // {
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
