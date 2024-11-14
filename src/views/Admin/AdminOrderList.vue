<template>
  <div class="container p-5">
    <div class="d-flex gap-5 align-items-center mb-4">
      <RouterLink to="/admin/dashboard" class="btn btn-outline-secondary d-flex align-items-center gap-2">
        <font-awesome-icon icon="fa-solid fa-circle-chevron-left" />
        <span>Back</span>
      </RouterLink>
      <h3>Order List</h3>
    </div>
    <table class="table table-dark text-center">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Total</th>
          <th>Status</th>
          <th>Payment Proof</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user.name }}</td>
          <td>RM {{ order.total }}</td>
          <td>
            <p :class="{ 'text-danger': order.status == 'rejected', 'text-warning': order.status== 'pending', 'text-success': order.status == 'approved' }" >{{ order.status }}</p> 
          </td>
          <td>
            <a v-if="order.payment_proof_url" :href="order.payment_proof_url" target="_blank">View</a>
          </td>
          <td>
            <div class="d-flex gap-2 justify-content-center">
              <button @click="updateOrderStatus(order.id, 'approved')" class="btn btn-success btn-sm">Approve</button>
              <button @click="updateOrderStatus(order.id, 'rejected')" class="btn btn-danger btn-sm">Reject</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const orders = ref([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      orders.value = response.data.orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders(); // Refresh the list after updating the status
      alert(`Order ${status} successfully`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  onMounted(fetchOrders);
</script>
