import { computed, reactive, toRefs } from "vue";
import { DateTime } from "luxon";
import { PROFILE_URL } from "@/urls";
import { DocumentationSecurityLevel } from "@/store/DepartmentStore";
import { User } from "@/modules/administration/modules/users/store";
import { useApiStore } from "@/store/ApiStore";
import { authConfig } from "@/config";
import { isArray } from "lodash";

const SYSTEM_ADMIN_ROLE_NAME = "System Admin";

// TODO: consider sending this with every api request?
export const CURRENT_USERS_TIMEZONE = DateTime.local().zoneName;

// Global state
const state = reactive<{
  currentUser: User | null;
  isLoading: boolean;
  isErrored: boolean;
  isCached: boolean;
  userSecurityLevel: DocumentationSecurityLevel;
  lastLogin: Date | null;
}>({
  currentUser: null,
  isLoading: false,
  isErrored: false,
  isCached: false,
  userSecurityLevel: DocumentationSecurityLevel.PUBLIC,
  lastLogin: null,
});

type State = typeof state;
type LoadedState = Omit<State, "currentUser"> & {
  currentUser: Exclude<State["currentUser"], null>;
};

export function useCurrentUser<IsLoaded extends boolean = false>() {
  type StateOrLoadedState = IsLoaded extends true ? LoadedState : State;

  const isReady = computed(() => state.isCached && !state.isLoading && !state.isErrored);
  const isSystemAdmin = computed(() => {
    return state.currentUser?.roles.includes(SYSTEM_ADMIN_ROLE_NAME);
  });

  async function loadSecurityLevel() {
    const lastLogin = localStorage.getItem("lastLogin");
    if (lastLogin) state.lastLogin = new Date(lastLogin);

    const iss = localStorage.getItem("ISS");

    if (authConfig.domain && iss) {
      const domain = authConfig.domain.replace(/\/$/, "");
      const hashed = await hashData(domain);

      if (iss == hashed && state.userSecurityLevel == DocumentationSecurityLevel.PUBLIC) {
        state.userSecurityLevel = DocumentationSecurityLevel.YG_LIKELY;
      }
    }
  }

  async function fetch() {
    state.isLoading = true;

    try {
      let api = useApiStore();

      await api
        .secureCall("get", PROFILE_URL)
        .then(async (resp) => {
          const user = resp.data;

          if (user && user.iss) {
            const domain = user.iss.replace(/\/$/, "");
            const enc = await hashData(domain);
            localStorage.setItem("ISS", enc);
            localStorage.setItem("lastLogin", new Date().toISOString());
            state.userSecurityLevel = DocumentationSecurityLevel.YG_LOGIN;

            if (hasRole("Restricted")) {
              state.userSecurityLevel = DocumentationSecurityLevel.YG_RESTRICTED;
            }
          }

          state.isErrored = false;
          state.currentUser = user;
          state.isCached = true;
        })
        .catch((resp) => {
          console.log("ERROR LOADING CURRENT USER", resp);
        })
        .finally(() => {
          state.isLoading = false;
        });
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      state.isErrored = true;
      throw error;
    } finally {
      state.isLoading = false;
    }
  }

  function hasRole(roleName: string): boolean {
    if (!state.currentUser) return false;
    if (state.currentUser.roles) {
      const roles = state.currentUser.roles;
      return roles.includes(roleName);
    }
    return false;
  }

  /* async function save(): Promise<User> {
    if (isNil(state.currentUser)) {
      throw new Error("No user to save")
    }

    const staticId = unref(state.currentUser.id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { user } = await usersApi.update(staticId, state.currentUser)
      state.isErrored = false
      state.currentUser = user
      return user
    } catch (error) {
      console.error("Failed to save current user:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  } */

  // Needs to be called during logout or current user will persist.
  function reset() {
    state.currentUser = null;
    state.isLoading = false;
    state.isErrored = false;
    state.isCached = false;
  }

  return {
    ...toRefs(state as StateOrLoadedState),
    isReady,
    fetch,
    loadSecurityLevel,
    refresh: fetch,
    reset,
    //save,
    // Computed properties
    isSystemAdmin,
  };

  async function hashData(data: string) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }
}

export default useCurrentUser;
