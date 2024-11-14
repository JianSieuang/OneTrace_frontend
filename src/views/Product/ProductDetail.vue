<template>
  <div class="modal fade text-dark" id="productDetail" tabindex="-1" aria-labelledby="productDetailLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div class="d-flex mb-3">
            <h3>{{ data.name }}</h3>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
          </div>
          <!-- Modal body content -->
            <div class="d-flex justify-content-center align-items-center" style="height: 50vh; overflow: auto;">
              <img :src="data.img" :alt="data.name" class="rounded-3" style="width: 100%; height:max-content"/>
            </div>
              <h5 class="mt-3">Price</h5>
              <div class="d-flex">
                <p>{{ currency.symbol }}{{ convertedPrice }}</p>
                <div class="ms-auto">
                  <select class="form-select" aria-label="Default select example" @change="updateCurrency($event)">
                    <option selected value="MYR">Ringgit Malaysia - MYR</option>
                    <option value="AUD">Australian Dollar - AUD</option>
                    <option value="RMB">Chinese Yuan Renminbi - RMB</option>
                    <option value="SGD">Singapore Dollar - SGD</option>
                    <option value="USD">United States Dollar - USD</option>
                  </select>
                </div>
              </div>
              
              <h5>Description</h5>
              <span>{{ data.description }}</span>
              <div class="mt-4">
                <label for="quantityProduct">Quantity: </label>
                <input type="number" class="form-control text-center" v-model="quantity" id="quantityProduct" min="1" max="50">
              </div>

              <div class="d-flex mt-2">
                <button class="btn btn-success w-100" type="button" @click="addToCart">Add to cart</button>
              </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
  import { Modal } from 'bootstrap';
  import axios from '@/axios';

  const props = defineProps(['data']);
  const emit = defineEmits(['hide']);

  const modalInstance = ref(null);
  const modalElement = ref(null);

  const handleHide = () => {
    emit('hide');
  };

  onMounted(() => {
    modalElement.value = document.getElementById('productDetail');
    if (modalElement.value) {
      modalInstance.value = new Modal(modalElement.value, {
        backdrop: 'static'
      });
      modalInstance.value.show();

      modalElement.value.addEventListener('hidden.bs.modal', handleHide);
    }
  });

  onUnmounted(() => {
    if (modalElement.value) {
      modalElement.value.removeEventListener('hidden.bs.modal', handleHide);
      modalInstance.value.hide();
    }
  });

  const closeModal = () => {
    if (modalInstance.value) {
      modalInstance.value.hide();
    }
  };

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

  const convertedPrice = computed(() => (props.data.price * currency.rate).toFixed(2));

  const updateCurrency = (event) => {
    const selectedCurrency = event.target.value;
    const rateInfo = exchangeRates[selectedCurrency];
    currency.symbol = rateInfo.symbol;
    currency.rate = rateInfo.rate;
  };

  const quantity = ref(1);

  const addToCart = async () => {
    const productId = props.data.id;
    const selectedQuantity = quantity.value;

    try {
      await axios.get('/sanctum/csrf-cookie')
      const response = await axios.post('/api/cart/add', {
        product_id: productId,
        quantity: selectedQuantity,
      });

      closeModal();
    } catch (err) {
      console.error('Registration error:', err);
    }
  };
</script>
