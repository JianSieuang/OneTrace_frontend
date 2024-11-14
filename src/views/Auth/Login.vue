<template>
  <div class="main d-flex flex-column justify-content-center" style="min-height: 100vh;">
    <div class="p-3">
      <h2>Welcome to OneTrace</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password"  :type="showPassword? 'text': 'password'" class="form-control" id="password">
        </div>
        <div class="d-flex">
          <div class="mb-3 form-check">
            <input v-model="showPassword" type="checkbox" class="form-check-input" id="showPassword">
            <label class="form-check-label" for="showPassword">Show Password</label>
          </div>
          <router-link to="/signup" class="ms-auto">Sign Up?</router-link>
        </div>
        
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-success w-75 fw-bold" :disabled="loading">Log in</button>
        </div>
        <div v-if="error" class="text-danger mt-2">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth.js';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const error = ref(null);
  const showPassword = ref(false)

  const handleLogin = async () => {
    loading.value = true;
    error.value = null;
    try {
      await authStore.login({ email: email.value, password: password.value });
      if (authStore.isAuthenticated) {
        router.push('/admin');
      } else {
        error.value = 'Login failed. Please check your credentials.';
      }
    } catch (err) {
      error.value = 'Login failed. Please check your credentials.';
      console.error('Login error:', err);
    } finally {
      loading.value = false;
    }
  };
</script>

<style>
  .main {
    min-width: 300px;
  }
  
  @media only screen and (min-width: 600px) {
    .main {
      min-width: 600px;
    }
  }
</style>