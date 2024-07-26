<template>
  <v-dialog v-model="props.show" transition="dialog-bottom-transition" fullscreen>
    <v-card>
      <v-toolbar color="primary">
        <v-btn icon="mdi-close" @click="hideClick"></v-btn>
        {{ props.document.name }}
      </v-toolbar>
      <v-card-text>
        <div class="text-h6">Summary: {{ props.document.description }}</div>
        <v-divider class="my-3" />

        <div v-html="renderMarkdown(props.document.text_value ?? 'No content')" class="markdown my-5"></div>

        <v-btn color="primary" variant="tonal" @click="emit('close')">Close</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { renderMarkdown } from "@/utils/markdown";

const emit = defineEmits(["close"]);
const props = defineProps(["document", "index", "show"]);

function hideClick() {
  emit("close");
}
</script>
