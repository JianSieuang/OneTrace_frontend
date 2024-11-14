<template>
  <ProductDetail v-if="show" :data="selectedProduct" @hide="hide" />
  <div class="p-5">
    <h3>Products</h3>
    <div class="row row-cols-3">
      <div v-for="product in products" :key="product.id" class="col p-4" style="min-width: 300px">
        <div class="d-flex justify-content-center align-items-center" style="max-height: 50vh; overflow: auto; height: auto;">
          <img :src="product.img" :alt="product.name" class="rounded-3" style="width: 100%; height:max-content; cursor: pointer;" @click="openModal(product)"/>
        </div>
        <div>
          <h5>{{ product.name }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import ProductDetail from './ProductDetail.vue';

  const products = ref([]);
  const selectedProduct = ref(null);
  const show = ref(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      products.value = response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const openModal = (product) => {
    selectedProduct.value = product;
    show.value = true;
  };

  const hide = () => {
    show.value = false;
  }

  onMounted(() => {
    fetchProducts();
  });
</script>