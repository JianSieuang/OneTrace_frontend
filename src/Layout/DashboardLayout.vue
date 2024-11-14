<template>
  <div>
    <!-- header -->
    <nav class="py-2 bg-light border-bottom sticky-top" id="top">
      <div class="container d-flex flex-wrap">
        <ul class="nav me-auto">
          <li class="nav-item"><RouterLink to="/user/home" class="nav-link text-muted px-2 active">Home</RouterLink></li>
          <li class="nav-item"><RouterLink to="/user/product" class="nav-link text-muted px-2">Products</RouterLink></li>
          <li class="nav-item"><RouterLink to="/user/cart" class="nav-link text-muted px-2">Cart</RouterLink></li>
          <li class="nav-item"><RouterLink to="/user/profile" class="nav-link text-muted px-2">User Profile / Order List</RouterLink></li>
          <li class="nav-item"><RouterLink to="/user/about" class="nav-link text-muted px-2">About</RouterLink></li>
        </ul>
      </div>
    </nav>
    <header class="py-3">
      <div class="container d-flex flex-wrap align-items-center">
        <RouterLink to="/user/home" class="d-flex align-items-center text-dark text-decoration-none" style="background: none;">
          <img src="@/assets/png/logo.png" height="40">
        </RouterLink>
        <span class="fs-4">OneTrace</span>
        <div class="flex-shrink-0 dropdown ms-auto">
          <a href="#" class="d-block text-muted text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
            <img :src="placeholderImageUrl" alt="picture" width="32" height="32" class="rounded-circle">
            {{ authStore.user.name }}
          </a>

          <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser">
            <li><RouterLink to="/user/profile" class="dropdown-item">User Profile</RouterLink></li>
            <li><a class="dropdown-item" href="https://wa.me/60187807830" target="_blank">Contact Us</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click="signOut">Sign out</a></li>
          </ul>
        </div>
      </div>
    </header>

    <div class="bg-dark text-white">
      <router-view></router-view>
    </div>
    <!-- footer --> 
    <div class="container">
      <footer class="py-5">
        <div class="d-flex gap-5 flex-wrap">
          <div class="flex-fill mb-3">
            <h5>Section</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2"><RouterLink to="/user/home" class="nav-link p-0 text-muted active">Home</RouterLink></li>
              <li class="nav-item mb-2"><RouterLink to="/user/product" class="nav-link p-0 text-muted">Products</RouterLink></li>
              <li class="nav-item mb-2"><RouterLink to="/user/cart" class="nav-link p-0 text-muted">Cart</RouterLink></li>
              <li class="nav-item mb-2"><RouterLink to="/user/profile" class="nav-link p-0 text-muted">User Profile / Order List</RouterLink></li>
              <li class="nav-item mb-2"><RouterLink to="/user/about" class="nav-link link p-0 text-muted">About</RouterLink></li>
            </ul>
          </div>
          <div class="flex-fill mb-3">
            <h5>Contact Us</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2">
                <a href="https://wa.me/60187807830" target="_blank" class="nav-link p-0 text-success">
                  <font-awesome-icon icon="fa-brands fa-whatsapp" size="lg"/> 018-7807830
                </a>
              </li>
              <li class="nav-item mb-2">
                <a href="mailto:1211208483@student.mmu.edu.my" target="_blank" class="nav-link p-0 text-danger text-nowrap">
                  <font-awesome-icon icon="fa-solid fa-at" size="lg"/> 1211208483@student.mmu.edu.my
                </a>
              </li>
            </ul>
          </div>
          <div class="flex-fill mb-3">
            <form>
              <h5 class="text-nowrap">Subscribe to our newsletter</h5>
              <p class="text-nowrap">Monthly digest of what's new and exciting from us.</p>
              <div class="d-flex flex-column flex-sm-row w-100 gap-2">
                <label for="newsletter1" class="visually-hidden">Email address</label>
                <input id="newsletter1" type="text" class="form-control" placeholder="Email address">
                <button class="btn btn-primary" type="button">Subscribe</button>
              </div>
            </form>
          </div>
        </div>

        <div class="border-top mt-2 ">
          <p>&copy; 2024 Eco-Friendly Emporium. All rights reserved.</p>
        </div>
      </footer>
    </div>
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
