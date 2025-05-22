<template>
  <div class="login-wrapper">
    <q-card class="login-card">
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">Вход в аккаунт</div>
        <q-form @submit.prevent="login">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            filled
            class="q-mb-sm"
            dense
          />
          <q-input
            v-model="password"
            label="Пароль"
            type="password"
            filled
            class="q-mb-md"
            dense
          />
          <q-btn label="Войти" type="submit" color="primary" class="full-width" />
        </q-form>

        <div class="q-mt-md text-center">
          <q-btn
            flat
            label="Нет аккаунта? Зарегистрируйтесь"
            @click="goToRegister"
            color="primary"
            class="q-pa-none"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'src/firebase';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    await router.push('/home');
  } catch (err) {
    alert('Ошибка: ' + (err as Error).message);
  }
};

const goToRegister = () => {
  void router.push('/register');
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f5f5f5, #eaeaea);
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}
</style>
