<template>
  <v-dialog v-model="visible" persistent max-width="700">
    <v-card v-if="selectedUser">
      <v-toolbar color="primary" variant="dark" title="Edit User">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              label="Name"
              v-model="selectedUser.display_name"
              readonly
              variant="outlined"
              density="comfortable"
              append-inner-icon="mdi-lock" />
            <v-text-field
              label="Email"
              v-model="selectedUser.email"
              readonly
              variant="outlined"
              density="comfortable"
              append-inner-icon="mdi-lock" />

            <v-select
              label="Status"
              v-model="selectedUser.is_active"
              :items="[
                { value: 1, title: 'Active' },
                { value: 0, title: 'Inactive' },
              ]"
              variant="outlined"
              density="comfortable" />
          </v-col>
          <v-col>
            <v-select
              label="Role"
              v-model="selectedUser.roles"
              :items="roles"
              item-title="name"
              item-value="id"
              hide-details />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="saveUser()">Save</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="yg_sun" variant="outlined" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useUserAdminStore } from "../store";
import { useAdminDepartmentStore } from "../../departments/store";

export default {
  name: "UserEditor",
  data: () => ({
    departmentRelevantList: [3, 4],
    roles: ["System Admin", "Departmental"],
  }),
  computed: {
    ...mapState(useUserAdminStore, ["selectedUser"]),
    ...mapState(useAdminDepartmentStore, ["departments"]),

    visible() {
      return this.selectedUser ? true : false;
    },
  },
  methods: {
    ...mapActions(useUserAdminStore, ["unselectUser", "saveUser"]),
    close() {
      this.unselectUser();
    },
  },
};
</script>
