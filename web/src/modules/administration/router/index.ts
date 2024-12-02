import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "administration",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      requireSystemAdmin: true,
    },
  },
  {
    path: "administration/users",
    component: () => import("../modules/users/views/UserList.vue"),
    meta: {
      requireSystemAdmin: true,
    },
  },
  {
    path: "administration/departments",
    component: () => import("../modules/departments/views/DepartmentList.vue"),
    meta: {
      requireSystemAdmin: true,
    },
  },
  {
    path: "administration/documentation",
    component: () => import("../modules/documentations/views/DocumentationList.vue"),
    meta: {
      requireSystemAdmin: true,
    },
  },
];

export default routes;
