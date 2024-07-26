import { acceptHMRUpdate, defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { DEPARTMENT_URL } from "@/urls";
import { clone } from "lodash";

let m = useNotificationStore();

interface AdminState {
  departments: Array<Department>;
  selectedDepartment: Department | undefined;
  isLoading: boolean;
}

export const useDepartmentAdminStore = defineStore("departmentAdmin", {
  state: (): AdminState => ({
    departments: [],
    isLoading: false,
    selectedDepartment: undefined,
  }),
  getters: {
    departmentCount(state) {
      if (state && state.departments) return state.departments.length;
      return 0;
    },
  },
  actions: {
    async getAll() {
      this.isLoading = true;
      let api = useApiStore();
      await api
        .secureCall("get", DEPARTMENT_URL)
        .then((resp) => {
          this.departments = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    select(user: any) {
      this.selectedDepartment = user;
    },
    unselect() {
      this.selectedDepartment = undefined;
    },
    async save() {
      this.isLoading = true;

      if (!this.selectedDepartment) return;

      if (this.selectedDepartment.id) await this.update(this.selectedDepartment);
      else await this.add(this.selectedDepartment);

      this.unselect();

      this.getAll();
    },

    async update(item: any) {
      let api = useApiStore();
      await api
        .secureCall("put", `${DEPARTMENT_URL}/${item.id}`, item)
        .then(async () => {})
        .finally(() => {
          this.isLoading = false;
        });

      m.notify({ text: "Department saved", variant: "success" });
    },

    async add(item: any) {
      let api = useApiStore();
      await api.secureCall("post", DEPARTMENT_URL, item).then(async (resp) => {
        if (resp && resp.data && resp.data.error) {
          m.notify({ text: resp.data.error[0].text, variant: "error" });
        } else {
          m.notify({ text: "Department added", variant: "success" });
        }
      });
    },
  },
});

export interface Department {
  id?: number;
  name: string;
  is_active: boolean;
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDepartmentAdminStore, import.meta.hot));
}
