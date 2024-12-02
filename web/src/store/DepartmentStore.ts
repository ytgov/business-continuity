import { defineStore } from "pinia";

import { useApiStore } from "@/store/ApiStore";
import { DEPARTMENT_URL, DOCUMENTS_AUTH_URL, DOCUMENTS_URL } from "@/urls";
import useCurrentUser from "@/use/use-current-user";

// ensure this matches api
export enum DocumentationSecurityLevel {
  PUBLIC = "Public",
  YG_LIKELY = "Non-authenticated YG Staff",
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

    async loadDocuments(securityLevel: DocumentationSecurityLevel) {
      this.isLoading = true;
      let api = useApiStore();
      const { userSecurityLevel, currentUser } = useCurrentUser();

      api
        .call("get", `${DOCUMENTS_URL}`)
        .then((resp) => {
          let departmentList = resp.data;

          if (securityLevel == DocumentationSecurityLevel.PUBLIC) {
            departmentList.forEach((dept: any) => {
              dept.documents = dept.documents.filter((d: any) => d.security_level == DocumentationSecurityLevel.PUBLIC);
            });

            departmentList = departmentList.filter((d: any) => d.documents.length > 0);
          }

          this.documents = departmentList;

          if ([DocumentationSecurityLevel.YG_LOGIN, DocumentationSecurityLevel.YG_RESTRICTED].includes(securityLevel)) {
            api
              .secureCall("get", `${DOCUMENTS_AUTH_URL}`)
              .then((resp) => {
                this.documents = resp.data;
              })
              .finally(() => {
                this.isLoading = false;
              });
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
