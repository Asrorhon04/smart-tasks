<template>
  <q-page class="q-pa-md">
    <div class="column items-center justify-center q-gutter-md" style="max-width: 400px; margin: 0 auto;">
      <!-- Аватар -->
      <q-avatar size="96px">
        <img v-if="avatarUrl" :src="avatarUrl" alt="Аватар" />
        <q-icon v-else name="account_circle" size="64px" color="grey-7" />
      </q-avatar>

      <!-- Email -->
      <div class="text-subtitle1 text-grey-9">Ваш Email:</div>
      <div class="text-h6">{{ userEmail }}</div>

      <!-- Выход -->
      <q-btn
        label="Выйти"
        color="negative"
        flat
        no-caps
        class="q-mt-md"
        @click="logout"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, storage } from 'src/firebase';
import { signOut } from 'firebase/auth';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';

const router = useRouter();
const userEmail = computed(() => auth.currentUser?.email || '');
const avatarUrl = ref('');

// 📥 Загрузка текущего аватара
const loadAvatar = async () => {
  const user = auth.currentUser;
  if (!user?.uid) return;

  try {
    const fileRef = storageRef(storage, `avatars/${user.uid}`);
    avatarUrl.value = await getDownloadURL(fileRef);
  } catch {
    avatarUrl.value = '';
  }
};

// 🚪 Выход
const logout = async () => {
  await signOut(auth);
  await router.push('/login');
};

onMounted(async () => {
  await loadAvatar();
});
</script>
