<template>
  <div class="main d-flex flex-column justify-content-center" style="min-height: 100vh">
    <h2>Sign Up to OneTrace</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Username</label>
        <input type="text" class="form-control" id="name" v-model="name">
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password" v-model="password" required>
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input :type="showPassword ? 'text' : 'password'" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
      </div>

      <div class="d-flex">
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="showPassword" v-model="showPassword">
          <label class="form-check-label" for="showPassword">Show Password</label>
        </div>
        <router-link to="/login" class="ms-auto">Already have an account? Login</router-link>
      </div>
      
      <div class="d-flex justify-content-center">
        <button type="submit" class="btn btn-success w-75 fw-bold" :disabled="loading">Sign Up</button>
      </div>
      
      <div v-if="error" class="text-danger mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from '@/axios';

  const router = useRouter();
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const loading = ref(false);
  const error = ref(null);
  const showPassword = ref(false);

  const handleSubmit = async () => {
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match.';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      await axios.get('/sanctum/csrf-cookie')
      const response = await axios.post('/api/register', {
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: confirmPassword.value,
      });
      if (response.status === 204) {
        router.push('/user');
      }
    } catch (err) {
      error.value = 'Registration failed. Please check your details and try again.';
      console.error('Registration error:', err);
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
