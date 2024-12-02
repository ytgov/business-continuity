import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import adminRoutes from "@/modules/administration/router";
import { authGuard } from "@auth0/auth0-vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/DefaultNoAuth.vue"),
    children: [
      {
        path: "",
        component: () => import("@/views/Home.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "sign-in",
        component: () => import("@/modules/authentication/views/SignIn.vue"),
      },

      ...adminRoutes,

      {
        path: "/:pathMatch(.*)*",
        name: "Not Found",
        component: () => import("@/views/NotFound.vue"),
      },
    ],
  },
];

import { useUserStore } from "@/store/UserStore";

export async function waitForUserToLoad(): Promise<any> {
  let u = useUserStore();
  await u.initialize();
  return u;
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  //document.title = `${APPLICATION_NAME} ${to.meta.title ? " - " + to.meta.title : ""}`

  if (to.meta.requiresAuth === false) {
    return true;
  }

  const isAuthenticated = await authGuard(to);

  if (isAuthenticated) {
    if (to.meta.requireSystemAdmin) {
      const u = await waitForUserToLoad();

      return u.isSystemAdmin;
    }
    return true;
  }

  return false;
});
