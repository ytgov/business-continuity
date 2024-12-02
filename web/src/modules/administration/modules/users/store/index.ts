import { acceptHMRUpdate, defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { DIRECTORY_URL, USERS_URL } from "@/urls";
import { clone } from "lodash";

let m = useNotificationStore();

interface AdminState {
  users: Array<User>;
  selectedUser: User | undefined;
  isLoading: boolean;
}

export const useUserAdminStore = defineStore("userAdmin", {
  state: (): AdminState => ({
    users: [],
    isLoading: false,
    selectedUser: undefined,
  }),
  getters: {
    userCount(state) {
      if (state && state.users) return state.users.length;
      return 0;
    },
  },
  actions: {
    async getAllUsers() {
      this.isLoading = true;
      let api = useApiStore();
      await api
        .secureCall("get", USERS_URL)
        .then((resp) => {
          this.users = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    selectUser(user: any) {
      user.is_active = user.is_active === true || user.is_active == 1 || user.is_active == "1" ? 1 : 0;
      this.selectedUser = user;
    },
    unselectUser() {
      this.selectedUser = undefined;
    },
    async saveUser() {
      this.isLoading = true;
      let api = useApiStore();

      if (!this.selectedUser) return;
      await api
        .secureCall("put", `${USERS_URL}/${this.selectedUser.id}`, this.selectedUser)
        .then(async (resp) => {
          //this.users = resp.data;
          this.unselectUser();
          m.notify({ text: "User saved", variant: "success" });
          this.getAllUsers();
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async addUser(user: any) {
      let api = useApiStore();

      return api.secureCall("post", USERS_URL, { user }).then(async (resp) => {
        if (resp && resp.data && resp.data.error) {
          m.notify({ text: resp.data.error[0].text, variant: "error" });
        }

        await this.getAllUsers();
        return resp.data;
      });
    },
    async searchDirectory(terms: any) {
      let api = useApiStore();

      return api.secureCall("post", `${DIRECTORY_URL}/search-directory`, terms).then((resp) => {
        return resp.data;
      });
    },
  },
});

export interface User {
  id: number;
  email: string;
  auth_subject: string;
  first_name: string;
  last_name: string;
  display_name: string;
  title: string;
  department: string;
  division: string;
  branch: string;
  unit: string;
  is_active: boolean | string;
  iss: string;

  roles: string | string[];
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserAdminStore, import.meta.hot));
}
