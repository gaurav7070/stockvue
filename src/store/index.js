import axios from 'axios';

// Set Axios base URL
axios.defaults.baseURL = 'http://127.0.0.1:8000';

import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      token: localStorage.getItem('auth_token') || '',  // Token fetched from localStorage if exists
      user: null,  // Set the user to null initially
    };
  },
  mutations: {
    // Mutations to set token and user in state
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('auth_token', token);  // Store token in localStorage
    },
    setUser(state, user) {
      state.user = user;  // Set user data in state
    },
    logout(state) {
      state.token = '';
      state.user = null;
      localStorage.removeItem('auth_token');  // Remove token from localStorage on logout
    },
  },
  actions: {
    // Action to handle login
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.post('/api/login', { email, password });
        
        // Assuming backend only returns token. If it also returns user, you can extract it
        const token = response.data.token;
        
        commit('setToken', token);  // Commit token to state
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Set token in axios headers
        
        // Optionally fetch user data (if the backend provides it)
        // const userResponse = await axios.get('/api/user');  // This could be a user endpoint
        // commit('setUser', userResponse.data);  // Commit user data to state

        // Redirect to stock page after successful login
        return response.data;  // Return response if needed for further handling in component

      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    },
    
    // Action to handle registration
    async register({ commit }, userData) {
      try {
        const response = await axios.post('/api/register', userData);

        const token = response.data.token;  // Assuming backend returns token
        commit('setToken', token);  // Commit token to state
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Set token in axios headers

        return response.data;  // Return the response if you need to use it in the component

      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    },
  },
});

export default store;
