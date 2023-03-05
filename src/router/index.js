import { createRouter, createWebHashHistory } from "vue-router";
import SignupView from "@/views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";

import { auth } from "../plugins/firebase";
import { onAuthStateChanged } from "firebase/auth";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const isLogin = await new Promise((resoleve) => {
    onAuthStateChanged(auth, (user) => {
      resoleve(!!user);
    });
  });

  const isRequiresAuth = to.name === "home";
  if (isRequiresAuth && !isLogin) {
    // ログインしていない場合、/loginページに遷移させる
    return { name: "login" };
  }
});

export default router;
