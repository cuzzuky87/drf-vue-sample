import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import store from "@/store";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  // ログインが必要な画面には'requiresAuth'フラグをつけておく
  routes: [
    { path: "/", component: HomePage, meta: { requiresAuth: true } },
    { path: "/lobin", component: LoginPage },
    { path: "*", redirect: "/" }
  ]
});

/**
 * Routerによって画面遷移する際に毎回実行される
 */
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters["auth/isLoggedIn"];
  const token = localStorage.getItem("access");
  console.log("to.path=", to.path);
  console.log("isLoggedIn=", isLoggedIn);

  // ログインが必要な画面に遷移しようとした場合
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // ログインしている状態の場合
    if (isLoggedIn) {
      console.log("User is already logged in. So, free to next.");
      next();
      //ログインしていない場合
    } else {
      //認証用トークンが残っていればユーザー情報再取得
      if (token != null) {
        console.log("User is not logged in. Trying to reload again.");

        store
          .dispatch("auth/reload")
          .then(() => {
            //再取得できればそのまま次へ
            console.log("Successed to reload. So, free to next.");
            next();
          })
          .catch(() => {
            //再取得できなければログイン画面へ
            forceToLoginPage(to, from, next);
          });
      } else {
        //認証用トークンがない場合はログイン画面へ
        forceToLoginPage(to, from, next);
      }
    }
  } else {
    // ログイン画面へ強制送還
    console.log("Go to public page.");
    next();
  }
});

/**
 * ログイン画面へ強制送還
 */
function forceToLoginPage(to, from, next) {
  console.log("Force user to login page.");
  next({
    path: "/login",
    //遷移先のURLはクエリ文字列として付加
    query: { next: to.fullPath }
  });
}

export default router;
