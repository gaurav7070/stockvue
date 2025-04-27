<template>
  <div class="register-container">
    <h1>Register</h1>
    <form @submit.prevent="register" class="register-form">
      <input v-model="name" placeholder="Name" type="text" required class="input-field" />
      <input v-model="email" placeholder="Email" type="email" required class="input-field" />
      <input v-model="password" placeholder="Password" type="password" required class="input-field" />
      <button type="submit" class="register-button">Register</button>
    </form>
    <router-link to="/login" class="login-link">Already have an account? Login</router-link>
  </div>
</template>

<script>
export default {
  name: 'UserRegister',
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async register() {
      try {
        await this.$store.dispatch('register', { 
          name: this.name, 
          email: this.email, 
          password: this.password 
        });
        // Redirect to login page after successful registration
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
  },
};
</script>

<style scoped>
.register-container {
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

.register-form {
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

.register-button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #218838;
}

.login-link {
  text-align: center;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
