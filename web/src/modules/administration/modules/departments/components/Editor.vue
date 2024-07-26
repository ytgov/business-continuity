<template>
  <v-dialog v-model="visible" persistent max-width="700">
    <v-card v-if="selectedDepartment">
      <v-toolbar color="primary" variant="dark" :title="selectedDepartment.id ? 'Edit Department' : 'Add Department'">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field label="Name" v-model="selectedDepartment.name" variant="outlined" density="comfortable" />
            <v-select
              label="Status"
              v-model="selectedDepartment.is_active"
              :items="[
                { value: true, title: 'Active' },
                { value: false, title: 'Inactive' },
              ]"
              variant="outlined"
              density="comfortable" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="save()" :disabled="!selectedDepartment.name">Save</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="yg_sun" variant="outlined" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useDepartmentAdminStore } from "../store";

export default {
  name: "UserEditor",
  data: () => ({}),
  computed: {
    ...mapState(useDepartmentAdminStore, ["selectedDepartment"]),

    visible() {
      return this.selectedDepartment ? true : false;
    },
  },
  methods: {
    ...mapActions(useDepartmentAdminStore, ["unselect", "save"]),
    close() {
      this.unselect();
    },
  },
};
</script>
