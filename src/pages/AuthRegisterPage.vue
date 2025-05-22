<template>
  <div class="register-wrapper">
    <q-card class="register-card">
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">Регистрация</div>
        <q-form @submit.prevent="register">
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
          <q-btn label="Зарегистрироваться" type="submit" color="primary" class="full-width" />
        </q-form>
      </q-card-section>
    </q-card>
    
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'src/firebase';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const register = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    await router.push('/login'); // или /login — как тебе удобнее
  } catch (err) {
    alert('Ошибка регистрации: ' + (err as Error).message);
  }
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f5f5f5, #eaeaea);
}

.register-card {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}
</style>
