import { createRouter, createWebHistory } from 'vue-router'

import AuthLayout from '@/Layout/AuthLayout.vue'
import Login from '@/views/Auth/Login.vue'
import Signup from '@/views/Auth/Signup.vue'

import DashboardLayout from '@/Layout/DashboardLayout.vue'
import Home from '@/views/Home.vue'
import Product from '@/views/Product/Product.vue'
import Cart from '@/views/Cart.vue'
import UserProfile from '@/views/UserProfile.vue'
import About from '@/views/About.vue'

import AdminLayout from '@/Layout/AdminLayout.vue'
import AdminDashboard from '@/views/Admin/AdminDashboard.vue'
import AdminProduct from '@/views/Admin/AdminProduct.vue'
import OrderList from '@/views/Admin/AdminOrderList.vue'


import { useAuthStore } from '@/stores/auth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AuthLayout,
      redirect: '/user',
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'signup',
          name: 'Signup',
          component: Signup
        },
      ]
    },
    {
      path: '/user',
      component: DashboardLayout,
      redirect: '/user/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: Home
        },
        {
          path: 'product',
          name: 'Product',
          component: Product
        },
        {
          path: 'cart',
          name: 'Cart',
          component: Cart
        },
        {
          path: 'profile',
          name: 'UserProfile',
          component: UserProfile
        },
        {
          path: 'about',
          name: 'About',
          component: About
        },
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      component: AdminLayout,
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: AdminDashboard
        },
        {
          path:'product',
          component: AdminProduct
        },
        {
          path:'order-list',
          component: OrderList
        }
      ],
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    try {
      await authStore.checkAuth()
      if (authStore.isAuthenticated) {
        if (authStore.user.is_admin) {
          next({ path: '/admin'})
        } else {
          next()
        }
      } else {
        next({ name: 'Login' })
      }
    } catch (error) {
      console.error('Error checking authentication status', error)
      next({ name: 'Login' })
    }
  } else if (to.matched.some(record => record.meta.requiresAdmin) && !authStore.user?.is_admin) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
