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

  <h1>Documentation</h1>

  <base-card showHeader="t" heading="" elevation="0">
    <template v-slot:left>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        density="compact"
        class="ml-2"></v-text-field>
    </template>
    <template v-slot:right>
      <v-btn color="info" @click="addClick">Add</v-btn>
    </template>

    <v-data-table :search="search" :headers="headers" :items="items" :loading="isLoading" @click:row="rowClick">
      <template v-slot:item.is_active="{ item }">
        <span style="color: #7a9a01" v-if="item.is_active">Active</span>
        <span style="color: orangered" v-else>Inactive</span>
      </template>
      <template v-slot:item.department_id="{ item }">
        <span style="" v-if="item.department_id">{{ departments?.find((d) => d.id == item.department_id).name }}</span>
        <span style="color: orangered" v-else>All Departments</span>
      </template>
    </v-data-table>
  </base-card>

  <editor></editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useDocumentationAdminStore } from "../store";
import { useDepartmentAdminStore } from "../../departments/store";
import Editor from "../components/Editor.vue";
import { clone } from "lodash";

export default {
  components: { Editor },
  data: () => ({
    headers: [
      { title: "Name", key: "name" },
      { title: "Department", key: "department_id" },
      { title: "Status", key: "is_active" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useDocumentationAdminStore, ["documentation", "isLoading"]),
    ...mapState(useDepartmentAdminStore, ["departments"]),
    items() {
      return this.documentation;
    },
    totalItems() {
      return this.documentation.length;
    },
    breadcrumbs() {
      return [
        {
          title: "Admin Dashboard",
          to: "/administration",
        },
        {
          title: "Documentation",
        },
      ];
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useDocumentationAdminStore, ["getAll", "select"]),

    async loadItems() {
      await this.getAll();
    },
    rowClick(event: Event, thing: any) {
      this.select(clone(thing.item));
    },
    addClick() {
      this.select({ is_active: true });
    },
  },
};
</script>
