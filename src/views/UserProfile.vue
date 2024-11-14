<template>
  <div class="container p-5">
    <h5>User Profile</h5>
    <div class="d-flex gap-5">
      <div class="bg-white p-5 rounded-5 d-flex flex-column align-items-center" style="height: 100%">
        <img :src="placeholderImageUrl" alt="picture" width="100" height="100" class="rounded-circle">
        
        <form @submit.prevent="updateProfile" class="w-100 mt-4">
          <div class="form-floating mb-3">
            <input type="text" id="name" v-model="editedUser.name" class="form-control" :disabled="!isEditing">
            <label for="name" class="form-label text-dark">Name</label>
          </div>

          <div class="form-floating mb-3">
            <input type="text" id="address" v-model="editedUser.address" class="form-control" :disabled="!isEditing">
            <label for="address" class="form-label text-dark">Address</label>
          </div>

          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-primary" @click="isEditing = !isEditing">
              {{ isEditing ? 'Cancel' : 'Edit' }}
            </button>
            <button type="submit" class="btn btn-success" :disabled="!isEditing">Save</button>
          </div>
        </form>
      </div>

      <div class="flex-fill border rounded-3 p-5">
        <div class="d-flex mb-4">
          <h5>Order List</h5>
          <div class="ms-auto">
            <select id="currency" class="form-select" aria-label="Default select example" @change="updateCurrency($event)">
              <option selected value="MYR">Ringgit Malaysia - MYR</option>
              <option value="AUD">Australian Dollar - AUD</option>
              <option value="RMB">Chinese Yuan Renminbi - RMB</option>
              <option value="SGD">Singapore Dollar - SGD</option>
              <option value="USD">United States Dollar - USD</option>
            </select>
          </div>
        </div>
        <div v-if="loading">Loading...</div>
        <div v-else>
          <div class="d-flex flex-column overflow-auto" style="max-height: 60vh;">
            <table class="table table-dark text-center">
              <thead class="sticky-top" style="z-index: auto;">
                <tr>
                  <th>Order ID</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in orders" :key="index">
                  <td>{{ order.id }}</td>
                  <td>{{ formatCurrency( order.total * currency.rate) }}</td>
                  <td>
                    <p :class="{ 'text-danger': order.status == 'rejected', 'text-warning': order.status== 'pending', 'text-success': order.status == 'approved' }" >{{ order.status }}</p>
                  </td>
                  <td class="text-start">
                    <ul>
                      <li v-for="item in order.items" :key="item.id">
                        {{ item.product.name }} - {{ item.quantity }} x {{ currency.symbol }}{{ (item.product.price * currency.rate).toFixed(2) }}
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="orders.length === 0">No orders found</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth.js';
  import { useRouter } from 'vue-router';
  import axios from '@/axios';

  const authStore = useAuthStore();
  const router = useRouter();
  const user = authStore.user;

  const isEditing = ref(false);
  const loading = ref(true);

  const editedUser = reactive({
    name: user.name,
    address: user.address || ''
  });

  const getInitials = (fullName) => {
    const words = fullName.split(' ').slice(0, 3);
    return words.map(name => name.charAt(0).toUpperCase()).join('');
  };

  const placeholderImageUrl = computed(() => {
    const initials = editedUser.name ? getInitials(editedUser.name) : '';
    return `https://via.placeholder.com/100x100.png/212529?text=${initials}`;
  });

  const signOut = async () => {
    await authStore.logout();
    router.push('/login');
  };

  const updateProfile = async () => {
    try {
      await authStore.updateUserProfile(editedUser);
      isEditing.value = false;
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      orders.value = response.data.orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      loading.value = false;
    }
  };

  const orders = ref([]);

  onMounted(() => {
    fetchOrders();
  });

  const currency = reactive({
    symbol: 'RM',
    rate: 1,
  });

  const exchangeRates = {
    MYR: { symbol: 'RM', rate: 1 },
    AUD: { symbol: 'A$', rate: 0.35 },
    RMB: { symbol: '¥', rate: 1.55 },
    SGD: { symbol: 'S$', rate: 0.32 },
    USD: { symbol: '$', rate: 0.22 },
  };

  const updateCurrency = (event) => {
    const selectedCurrency = event.target.value;
    const rateInfo = exchangeRates[selectedCurrency];
    currency.symbol = rateInfo.symbol;
    currency.rate = rateInfo.rate;
  };

  const formatCurrency = (amount) => {
    return `${currency.symbol}${amount.toFixed(2)}`;
  };

</script>