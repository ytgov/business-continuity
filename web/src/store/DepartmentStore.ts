import { defineStore } from "pinia";

import { useApiStore } from "@/store/ApiStore";
import { DEPARTMENT_URL, DOCUMENTS_URL } from "@/urls";

// ensure this matches api
export enum DocumentationSecurityLevel {
  PUBLIC = "Public",
  YG_LIKELY = "Not authenticated YG Staff",
  YG_LOGIN = "Authenticated YG Staff",
  YG_RESTRICTED = "Authenticated YG Restricted",
}

export const useDepartmentStore = defineStore("department", {
  state: () => ({
    isLoading: false,
    departments: [],
    documents: [],
  }),
  actions: {
    async initialize() {
      await this.loadDepartments();
    },

    async loadDepartments() {
      this.isLoading = true;
      let api = useApiStore();
      return api
        .secureCall("get", `${DEPARTMENT_URL}`)
        .then((resp) => {
          this.departments = resp.data;
          return resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async loadDocuments() {
      this.isLoading = true;
      let api = useApiStore();
      return api
        .call("get", `${DOCUMENTS_URL}`)
        .then((resp) => {
          this.documents = resp.data;
          return resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
