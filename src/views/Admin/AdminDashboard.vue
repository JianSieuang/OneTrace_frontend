<template>
  <div class="container p-5">
    <h3 class="mb-5">Admin DashBoard</h3>
    <div class="d-flex justify-content-around">
      <RouterLink to="/admin/product" class="btn btn-outline-secondary btn-lg d-flex align-items-center gap-2">
        <font-awesome-icon icon="fa-solid fa-dolly" size="lg"/>
        <h3>Products</h3>
      </RouterLink>
      <RouterLink to="/admin/order-list" class="btn btn-outline-secondary btn-lg d-flex align-items-center gap-2">
        <font-awesome-icon icon="fa-solid fa-receipt" size="lg"/>
        <h3>Order List</h3>
      </RouterLink>
    </div>
  </div>
</template>