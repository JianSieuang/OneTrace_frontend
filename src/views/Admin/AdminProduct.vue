<template>
  <div class="container p-5">
    <div class="d-flex gap-5 align-items-center mb-4">
      <RouterLink to="/admin/dashboard" class="btn btn-outline-secondary d-flex align-items-center gap-2">
        <font-awesome-icon icon="fa-solid fa-circle-chevron-left"/>
        <span>Back</span>
      </RouterLink>
      <h3>Products</h3>
    </div>
    <button @click="showAddProductForm = true" class="btn btn-primary mb-3">Add Product</button>

    <div class="d-flex gap-5 flex-wrap">
      <div class="flex-fill overflow-auto" style="height: 70vh;">
        <table class="table table-dark">
          <thead class="sticky-top" style="z-index: auto;">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>RM {{ product.price }}</td>
              <td class="text-break" style="max-width: 25vw;">{{ product.description }}</td>
              <td><img :src="product.img" alt="Product Image" width="50"></td>
              <td>
                <div class="d-flex gap-2">
                  <button @click="editProduct(product)" class="btn btn-warning">Edit</button>
                  <button @click="deleteProduct(product.id)" class="btn btn-danger">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex-fill border p-3 rounded-3" style="height: 100%" v-if="showAddProductForm || showEditProductForm">
        <div v-if="showAddProductForm">
          <h5>Add Product</h5>
          <form @submit.prevent="addProduct">
            <div class="mb-3 form-floating text-black">
              <input type="text" v-model="newProduct.name" class="form-control" placeholder="" required>
              <label class="form-label">Name</label>
            </div>
            <div class="mb-3 form-floating text-black">
              <input type="number" v-model="newProduct.price" class="form-control" placeholder="" min="0" required>
              <label class="form-label">Price (RM)</label>
            </div>
            <div class="mb-3 form-floating text-black">
              <textarea v-model="newProduct.description" class="form-control" placeholder=""></textarea>
              <label class="form-label">Description</label>
            </div>
            <div class="mb-3">
              <label class="form-label btn btn-secondary" for="newProductImage">Add Image</label>
              <input type="file" accept="image/png, image/jpeg" class="form-control d-none" id="newProductImage" @change="handleFileChange">
            </div>
            <button type="submit" class="btn btn-success">Add</button>
          </form>
        </div>
        <div v-if="showEditProductForm">
          <h4>Edit Product</h4>
          <form @submit.prevent="updateProduct">
            <div class="mb-3 form-floating text-black">
              <input type="text" v-model="editProductForm.name" class="form-control" placeholder="" required>
              <label class="form-label">Name</label>
            </div>
            <div class="mb-3 form-floating text-black">
              <input type="number" v-model="editProductForm.price" class="form-control" placeholder="" min="0" required>
              <label class="form-label">Price (RM)</label>
            </div>
            <div class="mb-3 form-floating text-black">
              <textarea v-model="editProductForm.description" class="form-control" placeholder=""></textarea>
              <label class="form-label">Description</label>
            </div>
            <div class="mb-3">
              <label class="form-label btn btn-secondary" for="editProductImage">Update Image</label>
              <input type="file" accept="image/png, image/jpeg" class="form-control d-none" id="editProductImage" @change="handleEditFileChange">
            </div>
            <button type="submit" class="btn btn-success">Update</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import axios from '@/axios'

  const products = ref([])
  const showAddProductForm = ref(false)
  const showEditProductForm = ref(false)
  const newProduct = ref({
    name: '',
    price: '',
    description: '',
    img: ''
  })
  const editProductForm = ref({
    id: '',
    name: '',
    price: '',
    description: '',
    img: ''
  })
  const selectedImage = ref(null)
  const selectedEditImage = ref(null)

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      products.value = response.data
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const addProduct = async () => {
    try {
      const formData = new FormData()
      formData.append('name', newProduct.value.name)
      formData.append('price', newProduct.value.price)
      formData.append('description', newProduct.value.description)
      if (selectedImage.value) {
        formData.append('img', selectedImage.value)
      }
      const response = await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      products.value.push(response.data)
      showAddProductForm.value = false
      newProduct.value = { name: '', price: '', description: '', img: '' }
      selectedImage.value = null
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const editProduct = (product) => {
    showEditProductForm.value = true
    editProductForm.value = { ...product }
    selectedEditImage.value = null  // Clear previously selected image for editing
  }

  const updateProduct = async () => {
    try {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('name', editProductForm.value.name)
      formData.append('price', editProductForm.value.price)
      formData.append('description', editProductForm.value.description)
      if(selectedEditImage.value)
      formData.append('img', selectedEditImage.value)
      const response = await axios.post(`/api/products/${editProductForm.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const index = products.value.findIndex(p => p.id === editProductForm.value.id)
      products.value[index] = response.data
      showEditProductForm.value = false
      editProductForm.value = { id: '', name: '', price: '', description: '', img: '' }
      selectedEditImage.value = null
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`)
      products.value = products.value.filter(p => p.id !== id)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleFileChange = (event) => {
    selectedImage.value = event.target.files[0]
  }

  const handleEditFileChange = (event) => {
    selectedEditImage.value = event.target.files[0]
  }

  onMounted(fetchProducts)
</script>
