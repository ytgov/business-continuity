import { createApp } from "vue";
import { createPinia } from "pinia";

import auth0Plugin from "@/plugins/auth";

// Plugins
import { registerPlugins } from "./plugins";
import { router } from "./routes";

const pinia = createPinia();

import App from "./App.vue";
const app = createApp(App);
app.use(pinia).use(router).use(auth0Plugin);

import Notifications from "@/components/Notifications.vue";

app.component("notifications", Notifications);

export {}; // Important! See note.

registerPlugins(app);

app.mount("#app");
