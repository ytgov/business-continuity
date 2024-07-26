<template>
  <!-- <h1 class="text-h4">Home</h1> -->
  <p class="mt-5 mb-3 text-h6">
    This is a paragraph of important information related to what happens in an emergency and why you might visit this
    site.
  </p>
  <p>This is more info in a smaller font because it it less important.</p>

  <v-row class="mt-3">
    <v-col cols="12" md="4" v-for="department of documents">
      <department-card :department="department"></department-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useDepartmentStore } from "@/store/DepartmentStore";

const departmentStore = useDepartmentStore();
const { documents } = storeToRefs(departmentStore);

await departmentStore.loadDocuments();
</script>
