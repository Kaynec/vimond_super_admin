import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('');
    const refreshToken = ref('');
    const userData = ref<Record<string, unknown>>({});

    const isLoggedIn = computed(() => Boolean(token.value));

    function setToken (newToken: string) {
      token.value = newToken;
    }

    function setUserData (newUserData: Record<string, any>) {
      userData.value = newUserData;
    }

    function setRefreshToken (newRefreshToken: string) {
      refreshToken.value = newRefreshToken;
    }

    return {
      token,
      isLoggedIn,
      refreshToken,
      userData,
      setToken,
      setUserData,
      setRefreshToken
    };
  },
  { persist: true }
);
