<template>
  <div class="p-5">
    <div class="d-flex mb-4 gap-5">
      <h3>Cart</h3>
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

    <div v-if="cartItems.length === 0">
      <p>Your cart is empty.</p>
    </div>
    <div v-else>
      <div class="d-flex gap-5 flex-wrap">
        <div class="flex-fill overflow-auto" style="height: 70vh;">
          <table class="table table-dark text-center">
            <thead class="sticky-top" style="z-index: auto;">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in cartItems" :key="index">
                <td>
                  <div class="d-flex gap-2 align-items-center">
                    <div class="d-flex justify-content-center align-items-center overflow-hidden" style="height: 100px; width: 100px;">
                      <img :src="item.product.img" :alt="item.product.name" class="rounded-3 img-thumbnail" style="width: max-content; height: 100%;"/>
                    </div>
                    {{ item.product.name }}
                  </div>
                </td>
                <td>{{ currency.symbol }}{{ (item.product.price * currency.rate).toFixed(2) }}</td>
                <td>
                  <div class="d-flex justify-content-evenly">
                    <font-awesome-icon icon="fa-solid fa-square-plus" size="lg" @click="updateQuantity(item.id, item.quantity + 1)" style="cursor: pointer;" />
                    {{ item.quantity }}
                    <font-awesome-icon icon="fa-solid fa-square-minus" size="lg" @click="updateQuantity(item.id, item.quantity - 1)" :disabled="item.quantity === 1" style="cursor: pointer;" />
                  </div>
                </td>
                <td>
                  <div class="d-flex justify-content-center gap-3">
                    {{ formatCurrency(item.product.price * item.quantity * currency.rate) }}
                    <font-awesome-icon icon="fa-solid fa-circle-xmark" size="lg" @click="removeFromCart(item.id)" style="cursor: pointer;" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex-fill border p-3 rounded-3" style="height: 100%">
          <h5 class="text-nowrap">Order Summary</h5>
          <hr>
          <div class="d-flex">
            <p>Subtotal</p>
            <p class="ms-auto">{{ formatCurrency(subtotal) }}</p>
          </div>
          <div class="d-flex">
            <p>Shipping</p>
            <p class="ms-auto">Free</p>
          </div>
          <hr>
          <div class="d-flex">
            <h5>Total</h5>
            <p class="ms-auto">{{ formatCurrency(total) }}</p>
          </div>

          <h5>Payment method</h5>
          <div class="row gap-2 p-2">
            <div class="col">
              <div class="d-flex align-items-center gap-2">
                <font-awesome-icon icon="fa-solid fa-credit-card" size="lg"/>
                Bank Transfer
              </div>
              CIMB: 7640975308
            </div>
            <div class="col">
              <button class="btn btn-dark d-flex align-items-center gap-2" @click="()=> show = !show" title="Click me to show QR code">
                <font-awesome-icon icon="fa-solid fa-qrcode" size="lg"/>
                QR code payment

              </button>
              <div v-if="show" class="overflow-hidden rounded-3" style="width: 100%; max-width: 200px;">
                <img src="@/assets/png/TNG.png" alt="TNG" style="width: 100%; margin-top: -44.44%;">
              </div>
            </div>
          </div>

          <div class="my-3 w-50">
            <label for="paymentProof" class="form-label">Upload Payment Proof</label>
            <input class="form-control" type="file" accept="image/png image/jpeg" id="paymentProof" @change="handleFileChange">
          </div>

          <button class="btn btn-primary w-100 mt-3" @click="submitOrder">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, reactive, computed } from 'vue';
  import axios from '@/axios';

  const cartItems = ref([]);
  const show = ref(false)

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('/api/cart');
      cartItems.value = response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const formatCurrency = (amount) => {
    return `${currency.symbol}${amount.toFixed(2)}`;
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.put(`/api/cart/${itemId}`, { quantity: newQuantity });
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`/api/cart/${itemId}`);
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  onMounted(() => {
    fetchCartItems();
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

  const subtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * currency.rate;
  });

  const total = computed(() => {
    return subtotal.value;
  });

  const paymentProof = ref(null);

  const handleFileChange = (event) => {
    paymentProof.value = event.target.files[0];
  };

  const submitOrder = async () => {
    const formData = new FormData();
    formData.append('amount', total.value);
    formData.append('payment_proof', paymentProof.value);
    try {
      await axios.post('/api/checkout', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Order placed successfully');
      await fetchCartItems();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };
</script>
