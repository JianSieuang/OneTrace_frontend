<template>
  <div class="d-flex flex-wrap">
      <div class="flex-fill d-flex justify-content-center bg-dark text-white">
        <router-view></router-view>
      </div>
      <div class="flex-fill bg-success" style="min-width: 300px;">
        <Transport />
        <div class="ps-4 text-white">
          <p>&copy; 2024 Eco-Friendly Emporium. All rights reserved.</p>
        </div>
      </div>
  </div>

</template>

<script setup>
  import Transport from '@/assets/svg/Transport.svg'
</script>
