<template>
  <q-layout :class="isDarkMode ? 'bg-grey-9 text-grey-2' : 'bg-grey-2 text-black'" view="lHh Lpr lFf">
    <!-- ШАПКА -->
    <q-header elevated :class="isDarkMode ? 'bg-grey-10 text-grey-3' : 'bg-white text-black'">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Smart Tasks</q-toolbar-title>

        <q-space />

        <!-- Email -->
        <div v-if="userEmail" class="row items-center q-mr-md">
          <q-icon name="account_circle" class="q-mr-xs" :color="isDarkMode ? 'grey-5' : 'grey-7'" size="20px" />
          <span :class="isDarkMode ? 'text-caption text-grey-5' : 'text-caption text-grey-8'">
            {{ userEmail }}
          </span>
        </div>

        <!-- Переключатель темы -->
        <q-btn
          flat
          round
          dense
          :icon="isDarkMode ? 'light_mode' : 'dark_mode'"
          @click="toggleDark"
          aria-label="Toggle Theme"
          class="q-mr-sm"
        />

        <!-- Выйти -->
        <q-btn
          flat
          icon="logout"
          label="Выйти"
          v-if="isLoggedIn"
          @click="logout"
          color="negative"
          class="q-ml-sm"
          no-caps
        />
      </q-toolbar>
    </q-header>

    <!-- МЕНЮ -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :class="isDarkMode ? 'bg-grey-10 text-grey-3' : 'bg-white text-grey-9'"
    >
      <q-list padding>
        <q-item-label header class="text-grey-6 text-caption q-pb-sm">
          Навигация
        </q-item-label>

        <q-item clickable to="/home" exact active-class="bg-grey-10 text-white">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Главная</q-item-section>
        </q-item>

        <q-item clickable to="/tasks" exact active-class="bg-grey-10 text-white">
          <q-item-section avatar>
            <q-icon name="task" />
          </q-item-section>
          <q-item-section>Мои задачи</q-item-section>
        </q-item>

        <q-item clickable to="/profile" exact active-class="bg-grey-10 text-white">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Профиль</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- КОНТЕНТ -->
    <q-page-container :class="isDarkMode ? 'bg-grey-9 text-grey-3' : 'bg-grey-2 text-black'">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from 'src/firebase';
import { signOut } from 'firebase/auth';

const router = useRouter();
const leftDrawerOpen = ref(false);
const userEmail = computed(() => auth.currentUser?.email || '');
const isLoggedIn = computed(() => !!auth.currentUser);
const isDarkMode = ref(localStorage.getItem('smart-theme') === 'dark');

const toggleDark = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('smart-theme', isDarkMode.value ? 'dark' : 'light');
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const logout = async () => {
  await signOut(auth);
  await router.push('/login');
};
</script>

<style scoped>
.q-header {
  border-bottom: 1px solid #e0e0e0;
}
.rounded-borders {
  border-radius: 8px;
}
</style>
