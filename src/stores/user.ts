import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from 'firebase/auth';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);

  function setUser(user: User | null) {
    currentUser.value = user;
  }

  return {
    currentUser,
    setUser
  };
});
