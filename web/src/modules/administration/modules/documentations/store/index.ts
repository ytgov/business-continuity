import { acceptHMRUpdate, defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { DOCUMENTATION_URL } from "@/urls";

let m = useNotificationStore();

interface AdminState {
  documentation: Array<Documentation>;
  selectedDocumentation: Documentation | undefined;
  isLoading: boolean;
}

export const useDocumentationAdminStore = defineStore("documentationAdmin", {
  state: (): AdminState => ({
    documentation: [],
    isLoading: false,
    selectedDocumentation: undefined,
  }),
  getters: {
    documentationCount(state) {
      if (state && state.documentation) return state.documentation.length;
      return 0;
    },
  },
  actions: {
    async getAll() {
      this.isLoading = true;
      let api = useApiStore();
      await api
        .secureCall("get", DOCUMENTATION_URL)
        .then((resp) => {
          this.documentation = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    select(user: any) {
      this.selectedDocumentation = user;
    },
    unselect() {
      this.selectedDocumentation = undefined;
    },
    async save() {
      this.isLoading = true;

      if (!this.selectedDocumentation) return;

      if (this.selectedDocumentation.id) await this.update(this.selectedDocumentation);
      else await this.add(this.selectedDocumentation);

      this.unselect();

      this.getAll();
    },

    async update(item: any) {
      let api = useApiStore();
      await api
        .secureCall("put", `${DOCUMENTATION_URL}/${item.id}`, item)
        .then(async () => {})
        .finally(() => {
          this.isLoading = false;
        });

      m.notify({ text: "Documentation saved", variant: "success" });
    },

    async add(item: any) {
      let api = useApiStore();
      await api.secureCall("post", DOCUMENTATION_URL, item).then(async (resp) => {
        if (resp && resp.data && resp.data.error) {
          m.notify({ text: resp.data.error[0].text, variant: "error" });
        } else {
          m.notify({ text: "Documentation added", variant: "success" });
        }
      });
    },

    async remove(item: any) {
      let api = useApiStore();
      await api.secureCall("delete", `${DOCUMENTATION_URL}/${item.id}`).then(async (resp) => {
        if (resp && resp.data && resp.data.error) {
          m.notify({ text: resp.data.error[0].text, variant: "error" });
        } else {
          m.notify({ text: "Documentation removed", variant: "success" });
        }
      });
    },
  },
});

export interface Documentation {
  id?: number;
  department_id: number;
  name: string;
  description?: string;
  is_active: boolean;
  text_value?: string;
  file_value?: Buffer;
  file_name?: string;
  file_type?: string;
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDocumentationAdminStore, import.meta.hot));
}
