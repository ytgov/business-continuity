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

  <h1>Departments</h1>

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
    </v-data-table>
  </base-card>

  <editor></editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useDepartmentAdminStore } from "../store";
import Editor from "../components/Editor.vue";
import { clone } from "lodash";

export default {
  components: { Editor },
  data: () => ({
    headers: [
      { title: "Name", key: "name" },
      { title: "Status", key: "is_active" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useDepartmentAdminStore, ["departments", "isLoading"]),
    items() {
      return this.departments;
    },
    totalItems() {
      return this.departments.length;
    },
    breadcrumbs() {
      return [
        {
          title: "Admin Dashboard",
          to: "/administration",
        },
        {
          title: "Departments",
        },
      ];
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useDepartmentAdminStore, ["getAll", "select"]),

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
