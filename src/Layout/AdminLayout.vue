<template>
  <div class="bg-dark text-white" style="min-height: 100vh;">
    <!-- header -->
    <header class="py-3 bg-light text-dark">
      <div class="container d-flex flex-wrap align-items-center">
        <RouterLink to="/admin/dashboard" class="d-flex align-items-center text-dark text-decoration-none" style="background: none;">
          <img src="@/assets/png/logo.png" height="40">
        </RouterLink>
        <span class="fs-4">OneTrace</span>
        <div class="flex-shrink-0 dropdown ms-auto">
          <a href="#" class="d-block text-muted text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
            <img :src="placeholderImageUrl" alt="picture" width="32" height="32" class="rounded-circle">
            {{ authStore.user.name }}
          </a>

          <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser">
            <li><a class="dropdown-item" href="#" @click="signOut">Sign out</a></li>
          </ul>
        </div>
      </div>
    </header>

    <router-view></router-view>
  </div>

</template>

<script setup>
  import { useAuthStore } from '@/stores/auth.js';
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';

  const authStore = useAuthStore();
  const router = useRouter();

  const getInitials = (fullName) => {
    const words = fullName.split(' ').slice(0, 3);
    return words.map(name => name.charAt(0).toUpperCase()).join('');
  };

  const placeholderImageUrl = computed(() => {
    const initials = authStore.user.name ? getInitials(authStore.user.name) : '';
    return `https://via.placeholder.com/32x32.png/212529?text=${initials}`;
  });

  const signOut = async () => {
    await authStore.logout();
    router.push('/login');
  };
</script>

<style scoped>
  .router-link-exact-active {
    background: rgba(0, 189, 126, 0.809);
    color: white !important;
  }
</style>
