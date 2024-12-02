<template>
  <v-app-bar app color="#fff" flat height="70" style="left: 0; border-bottom: 3px #f3b228 solid">
    <router-link to="/"><img src="/yukon.svg" style="margin: -10px 85px 0 14px" height="44" /></router-link>
    <!-- <v-img class="ml-0m pl-0" src="src/assets/yukon.svg" height="44" /> -->
    <v-app-bar-title class="pt-0 font-weight-bold" style="margin-left: -20px">
      <router-link v-if="!smAndUp" to="/" class="title-link">BCP Portal</router-link>
      <router-link v-else to="/" class="title-link">{{ applicationName }}</router-link>
    </v-app-bar-title>

    <template #append>
      <div v-if="currentUser && currentUser.email">
        <!--  <v-btn color="primary" class="mr-1" to="/administration" icon="mdi-home"></v-btn> -->

        <v-divider class="mr-5" vertical inset></v-divider>

        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" color="primary" v-bind="props"></v-btn>
          </template>

          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-account</v-icon>
              </template>

              <v-list-item-title style="font-size: 0.9rem !important">{{ currentUser.display_name }}</v-list-item-title>
            </v-list-item>

            <v-list-item to="/administration" v-if="isSystemAdmin">
              <template v-slot:prepend>
                <v-icon>mdi-cog</v-icon>
              </template>
              <v-list-item-title style="font-size: 0.9rem !important">Administration</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logoutClick">
              <template v-slot:prepend>
                <v-icon>mdi-exit-run</v-icon>
              </template>
              <v-list-item-title style="font-size: 0.9rem !important">Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else class="mr-4">
        <a @click="loginClick" class="cursor-pointer">Sign in</a>
      </div>
    </template>
  </v-app-bar>

  <v-main>
    <!-- Provides the application the proper gutter -->
    <!-- fill-height causes the main content to fill the entire page -->
    <v-container fluid class="page-wrapper">
      <router-view></router-view>
    </v-container>
  </v-main>
  <!-- <v-overlay v-model="showApplicationOverlay" class="align-center justify-center">
    <div class="text-center">
      <v-progress-circular indeterminate size="64" class="mb-5" color="#f3b228" width="6"></v-progress-circular>
      <h2>Loading {{ applicationName }}</h2>
    </div>
  </v-overlay> -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";

import { applicationName } from "@/config";
import { useInterfaceStore } from "@/store/InterfaceStore";
import { useAuth0 } from "@auth0/auth0-vue";
import useCurrentUser from "@/use/use-current-user";

const { loginWithRedirect, logout } = useAuth0();

const interfaceStore = useInterfaceStore();
const { isOffline } = storeToRefs(interfaceStore);

const { currentUser, isSystemAdmin } = useCurrentUser();

const { smAndUp } = useDisplay();

async function logoutClick() {
  await logout({ returnTo: "https://safety.gov.yk.ca" });
}

async function loginClick() {
  loginWithRedirect({
    appState: { target: window.location.pathname },
  });
}
</script>

<style scoped>
.v-list-item__prepend > .v-icon {
  margin-inline-end: 12px;
}
</style>
