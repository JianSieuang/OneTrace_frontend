import axios from '@/axios'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        await axios.get('/sanctum/csrf-cookie')
        const response = await axios.post('/api/login', credentials)
        this.isAuthenticated = true;
        await this.fetchUser();
      } catch (error) {
        this.error = 'Login failed. Please check your credentials.'
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try { 
        await axios.get('/sanctum/csrf-cookie')
        await axios.post('/api/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.isAuthenticated = false
        this.user = null
      }
    },

    async fetchUser() {
      try {
        const response = await axios.get('/api/user');
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        this.isAuthenticated = false;
        this.user = null;
      }
    },

    async checkAuth() {
      try {
        await axios.get('/sanctum/csrf-cookie')
        const response = await axios.get('/api/user')
        const userData = response.data
        if (userData) {
          this.isAuthenticated = true
          this.user = userData
        } else {
          this.isAuthenticated = false
          this.user = null
        }
      } catch (error) {
        console.error('Error checking authentication status:', error)
        this.isAuthenticated = false
        this.user = null
      }
    },

    async updateUserProfile(updatedUser) {
      try {
        const response = await axios.put('/api/user', updatedUser);
        this.user = response.data;
      } catch (error) {
        console.error('Error updating profile:', error);
        this.error = 'Failed to update profile. Please try again.'
      }
    },
  },
})
