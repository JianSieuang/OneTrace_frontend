<template>
  <div class="container p-5">
    <div class="d-flex flex-column align-items-center mb-4">
      <h3>Welcome to OneTrace</h3>
      <span>Explore our collection of sustainable products to make a positive impact on the planet!</span>
    </div>

    <h4>Recommended</h4>
    <div id="carouselRecommended" class="carousel slide mb-4" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(item, index) in recommendedItems" :key="item.id" :class="['carousel-item', { active: index === 0 }]">
          <div class="d-flex justify-content-center">
            <img :src="item.img" :alt="item.name" class="img-thumbnail" style="height: 60vh;">
          </div>
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ item.name }}</h5>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselRecommended" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselRecommended" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>


<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const recommendedItems = ref([]);

  const fetchRecommendedItems = async () => {
    try {
      const response = await axios.get('/api/products');
      recommendedItems.value = response.data;
    } catch (error) {
      console.error('Error fetching recommended items:', error);
    }
  };

  onMounted(() => {
    fetchRecommendedItems();
  });
</script>
