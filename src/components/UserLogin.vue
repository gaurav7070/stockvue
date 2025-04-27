<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <input v-model="email" placeholder="Email" type="email" required class="input-field" />
      <input v-model="password" placeholder="Password" type="password" required class="input-field" />
      <button type="submit" class="login-button">Login</button>
    </form>
    <router-link to="/register" class="register-link">Don't have an account? Register</router-link>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await this.$store.dispatch('login', { 
          email: this.email, 
          password: this.password 
        });

        if (response.token) {
          localStorage.setItem('authToken', response.token);
          this.$router.push('/'); // Redirect to the stock list page
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.input-field {
  margin-bottom: 15px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border 0.3s ease;
}

.input-field:focus {
  border: 1px solid #007bff;
}

.login-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

.register-link {
  text-align: center;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
