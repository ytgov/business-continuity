<template>
  <div style="padding: 15px; background-color: white; border-radius: 4px; border: 1px #00000044 solid">
    <strong style="font-size: 1rem">{{ index }}: {{ props.document.name }}</strong>
    <v-divider class="mt-1 mb-2" />
    <div class="text-caption">Summary: {{ props.document.description }} --- {{ props.document.security_level }}</div>
    <v-divider class="mt-1 mb-2" />

    <v-chip color="primary" variant="flat" @click="viewClick" class="cursor-pointer">
      <v-icon class="mr-2">mdi-eye-outline</v-icon> View Material
    </v-chip>
    <document-viewer :show="showViewer" :document="props.document" @close="showViewer = false"></document-viewer>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["document", "index"]);

const showViewer = ref(false);

function viewClick() {
  showViewer.value = true;
}
</script>
