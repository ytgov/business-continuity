<template>
  <v-card v-if="props.department" elevation="3" :color="isAllDepartments ? '#F2760C66' : '#7a9a0144'">
    <v-card-title> {{ props.department.name }}</v-card-title>
    <v-divider />
    <v-card-text style="margin-bottom: -16px">
      <p class="text-subtitle-1 mb-2">Available Material ({{ props.department.documents.length }} items)</p>

      <div v-for="(document, idx) of props.department.documents">
        <document-card :document="document" :index="idx + 1" class="mb-4" />
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps(["department"]);

const isAllDepartments = computed(() => {
  return props.department.name == "All Departments";
});
</script>
