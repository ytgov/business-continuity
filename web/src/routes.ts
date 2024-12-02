import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import adminRoutes from "@/modules/administration/router";
import { authGuard } from "@auth0/auth0-vue";
import useCurrentUser from "@/use/use-current-user";

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

  const {isSystemAdmin} = useCurrentUser()

  if (isAuthenticated) {
    if (to.meta.requireSystemAdmin) {
      //const u = await waitForUserToLoad();

      console.log("HERE",isSystemAdmin.value)
      return isSystemAdmin.value;
      //return u.isSystemAdmin;
    }
    return true;
  }

  return false;
});
