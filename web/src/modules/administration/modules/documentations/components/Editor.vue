<template>
  <v-dialog v-model="visible" persistent max-width="700">
    <v-card v-if="selectedDocumentation">
      <v-toolbar
        color="primary"
        variant="dark"
        :title="selectedDocumentation.id ? 'Edit Documentation' : 'Add Documentation'">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field label="Name" v-model="selectedDocumentation.name" variant="outlined" density="comfortable" />
            <v-select
              label="Status"
              v-model="selectedDocumentation.is_active"
              :items="[
                { value: true, title: 'Active' },
                { value: false, title: 'Inactive' },
              ]"
              variant="outlined"
              density="comfortable" />

            <v-autocomplete
              label="Department"
              :items="[{ id: null, name: 'All Departments' }, ...departments]"
              v-model="selectedDocumentation.department_id"
              item-value="id"
              item-title="name" />

            <v-textarea label="Description" v-model="selectedDocumentation.description" />

            <v-textarea label="Text value" v-model="selectedDocumentation.text_value" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="save()" :disabled="!selectedDocumentation.name">Save</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="yg_sun" variant="outlined" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useDocumentationAdminStore } from "../store";
import { useDepartmentAdminStore } from "../../departments/store";

export default {
  name: "UserEditor",
  data: () => ({}),
  computed: {
    ...mapState(useDocumentationAdminStore, ["selectedDocumentation"]),
    ...mapState(useDepartmentAdminStore, ["departments"]),

    visible() {
      return this.selectedDocumentation ? true : false;
    },
  },
  async mounted() {
    await this.loadDepartments();
  },
  methods: {
    ...mapActions(useDocumentationAdminStore, ["unselect", "save"]),
    ...mapActions(useDepartmentAdminStore, { loadDepartments: "getAll" }),

    close() {
      this.unselect();
    },
  },
};
</script>
