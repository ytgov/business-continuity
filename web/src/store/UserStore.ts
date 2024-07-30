import { acceptHMRUpdate, defineStore } from "pinia";

import { useApiStore } from "@/store/ApiStore";
import { PROFILE_URL } from "@/urls";
import { User } from "@/modules/administration/modules/users/store";
import { isArray } from "lodash";

const SYSTEM_ADMIN_ROLE_NAME = "System Admin";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoading: true,
    user: null as User | null,
  }),
  getters: {
    isSystemAdmin(state) {
      if (!state.user) return false;
      if (state.user.roles) {
        const roles = (state.user.roles || "").split(",");

        const admin = roles.find((r) => r == SYSTEM_ADMIN_ROLE_NAME);
        if (admin) return true;
      }
      return false;
    },
  },
  actions: {
    async initialize() {
      if (this.user && this.user.auth_subject) return;

      await this.loadCurrentUser();
      console.log("Initialized user store");
    },

    async loadCurrentUser() {
      this.isLoading = true;
      let api = useApiStore();

      await api
        .secureCall("get", PROFILE_URL)
        .then((resp) => {
          this.user = resp.data;
        })
        .catch((resp) => {
          console.log("ERROR LOADING CURRENT USER", resp);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    hasRole(roleName: string): boolean {
      if (!this.user) return false;
      if (this.user.roles) {
        const roles = (this.user.roles || "").split(",");
        const role = roles.find((r) => r == roleName);
        if (role) return true;
      }
      return false;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
