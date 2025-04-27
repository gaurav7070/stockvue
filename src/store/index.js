import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      token: localStorage.getItem('auth_token') || '',  
      user: null, 
    };
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('auth_token', token);  
    },
    setUser(state, user) {
      state.user = user;  
    },
    logout(state) {
      state.token = '';
      state.user = null;
      localStorage.removeItem('auth_token'); 
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post('/api/login', { email, password });
        
        const token = response.data.token;
        
        commit('setToken', token); 
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  
        
        
        return response.data; 

      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    },
    
    async register({ commit }, userData) {
      try {
        const response = await axios.post('/api/register', userData);

        const token = response.data.token;  
        commit('setToken', token);  
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  

        return response.data;  

      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    },
  },
});

export default store;
