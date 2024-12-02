<template>
  <!-- <h1 class="text-h4">Home</h1> -->
  <p class="mt-5 mb-3 text-h6">
    The material listed below is a curated list of information that may be relevent to you during an emergency.
  </p>
  <p>
    Depending on your access level, (which is {{ userSecurityLevel }}), you will see different information authenticated
    or unauthenticated.
  </p>
  <v-row class="mt-3">
    <v-col cols="12" md="4" v-for="department of documents">
      <department-card :department="department"></department-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDepartmentStore } from "@/store/DepartmentStore";
import { useCurrentUser } from "@/use/use-current-user";

const departmentStore = useDepartmentStore();
const { documents } = storeToRefs(departmentStore);

const { userSecurityLevel, loadSecurityLevel } = useCurrentUser();

onMounted(async () => {
  await loadSecurityLevel();
  await departmentStore.loadDocuments(userSecurityLevel.value);
});

watch(
  () => userSecurityLevel.value,
  async (newLevel) => {
    await departmentStore.loadDocuments(userSecurityLevel.value);
  }
);
</script>
