<template>
  <router-view />
</template>

<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useUserStore } from './stores/user';

const userStore = useUserStore();

onAuthStateChanged(auth, (user) => {
  userStore.setUser(user);
});
</script>
