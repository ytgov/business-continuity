import { acceptHMRUpdate, defineStore } from "pinia";

import { useApiStore } from "@/store/ApiStore";
import { DocumentationSecurityLevel } from "@/store/DepartmentStore";
import { PROFILE_URL } from "@/urls";
import { User } from "@/modules/administration/modules/users/store";
import auth from "@/plugins/auth";

const crypto = window.crypto;

const SYSTEM_ADMIN_ROLE_NAME = "System Admin";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLoading: true,
    user: null as User | null,
    userSecurityLevel: DocumentationSecurityLevel.PUBLIC,
    lastLogin: null as Date | null,
  }),
  getters: {
    isSystemAdmin(state) {
      if (!state.user) return false;
      if (state.user.roles) {
        const roles = (state.user.roles || "").split(",");

        const admin = roles.find((r) => r == SYSTEM_ADMIN_ROLE_NAME);
        if (admin) return true;
      }
      return false;
    },
  },
  actions: {
    async initialize() {
      this.userSecurityLevel = DocumentationSecurityLevel.PUBLIC;

      if (this.user && this.user.auth_subject) return;

      await this.loadCurrentUser();
      console.log("Initialized user store");

      const iss = localStorage.getItem("ISS");

      if (auth.domain && iss) {
        const domain = auth.domain.replace(/\/$/, "");
        const hashed = await hashData(domain);

        if (iss == hashed && this.userSecurityLevel == DocumentationSecurityLevel.PUBLIC) {
          this.userSecurityLevel = DocumentationSecurityLevel.YG_LIKELY;

          const lastLogin = localStorage.getItem("lastLogin");
          if (lastLogin) this.lastLogin = new Date(lastLogin);
        }
      }

      console.log("userSecurityLevel", this.userSecurityLevel);
    },

    async loadCurrentUser() {
      this.isLoading = true;
      let api = useApiStore();

      await api
        .secureCall("get", PROFILE_URL)
        .then(async (resp) => {
          this.user = resp.data;

          if (this.user && this.user.iss) {
            const domain = this.user.iss.replace(/\/$/, "");
            const enc = await hashData(domain);
            localStorage.setItem("ISS", enc);
            localStorage.setItem("lastLogin", new Date().toISOString());
            this.userSecurityLevel = DocumentationSecurityLevel.YG_LOGIN;

            if (this.hasRole("Restricted")) this.userSecurityLevel = DocumentationSecurityLevel.YG_RESTRICTED;
          }
        })
        .catch((resp) => {
          console.log("ERROR LOADING CURRENT USER", resp);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    hasRole(roleName: string): boolean {
      if (!this.user) return false;
      if (this.user.roles) {
        const roles = (this.user.roles || "").split(",");
        const role = roles.find((r) => r == roleName);
        if (role) return true;
      }
      return false;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

// Function to encrypt data
async function encrypt(text: string) {
  const keyMaterial = await window.crypto.subtle.generateKey({ name: "AES-CBC", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  const encoder = new TextEncoder();
  const encodedData = encoder.encode(text);
  const encryptedData = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv: iv }, keyMaterial, encodedData);
  return encryptedData;
}

async function decrypt(encryptedData: ArrayBuffer): Promise<string> {
  const keyMaterial = await window.crypto.subtle.generateKey({ name: "AES-CBC", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  const decryptedData = await window.crypto.subtle.decrypt({ name: "AES-CBC", iv: iv }, keyMaterial, encryptedData);
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

async function hashData(data: string) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Function to decrypt data
/* function decrypt(encryptedText: string, secretKey: string) {
  const iv = randomBytes(16); // Initialization vector
  const key = Buffer.from("your-known-string-key-here", "utf8");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
 */
