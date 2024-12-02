<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    style="margin: -13px -16px 10px -16px"
    class="pl-4 mb-4"
    color="white"
    active-color="#fff">
    <template v-slot:prepend>
      <v-icon color="white" icon="mdi-home"></v-icon>
    </template>
    <template v-slot:divider>
      <v-icon color="white" icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>

  <h1>Admin Dashboard</h1>

  <v-row class="mb-6" v-if="user">
    <v-col cols="12" md="4">
      <v-card elevation="3" color="#F2760C66" to="/administration/users">
        <v-card-text style="text-align: right">
          <v-icon
            class="float-left"
            style="font-size: 90px; opacity: 25%; position: absolute; left: 10px; margin-top: -12px"
            >mdi-account-group</v-icon
          >
          <div style="font-size: 52px; line-height: 52px">{{ userCount }}</div>
          <div>Users</div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card elevation="3" color="#F2760C66" to="/administration/departments">
        <v-card-text style="text-align: right">
          <v-icon
            class="float-left"
            style="font-size: 90px; opacity: 25%; position: absolute; left: 10px; margin-top: -12px"
            >mdi-domain</v-icon
          >
          <div style="font-size: 52px; line-height: 52px">{{ departmentCount }}</div>
          <div>Departments</div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card elevation="3" color="#F2760C66" to="/administration/documentation">
        <v-card-text style="text-align: right">
          <v-icon
            class="float-left"
            style="font-size: 90px; opacity: 25%; position: absolute; left: 10px; margin-top: -12px"
            >mdi-folder-file-outline</v-icon
          >
          <div style="font-size: 52px; line-height: 52px">{{ documentationCount }}</div>
          <div>Documentation</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <!--{{lastLogin}}-->
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";

import { useUserAdminStore } from "../modules/users/store";
import { useDepartmentAdminStore } from "../modules/departments/store";
import { useDocumentationAdminStore } from "../modules/documentations/store";
import { useUserStore } from "@/store/UserStore";

export default {
  name: "Dashboard",
  data: () => ({
    breadcrumbs: [{ title: "Admin Dashboard", disabled: false }],
  }),
  computed: {
    ...mapState(useUserAdminStore, ["userCount"]),
    ...mapState(useDepartmentAdminStore, ["departmentCount"]),
    ...mapState(useDocumentationAdminStore, ["documentationCount"]),
    ...mapState(useUserStore, ["user", "lastLogin"]),
  },
  async mounted() {
    await this.getAllUsers();
    await this.getAllDepartments();
    await this.getAllDocumentation();
  },
  methods: {
    ...mapActions(useUserAdminStore, ["getAllUsers"]),
    ...mapActions(useDepartmentAdminStore, { getAllDepartments: "getAll" }),
    ...mapActions(useDocumentationAdminStore, { getAllDocumentation: "getAll" }),
  },
};
</script>
