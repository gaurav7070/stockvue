<template>
  <div>
    <h1>Bulk Stock Entry</h1>

    <table>
      <thead>
        <tr>
          <th>Item Code</th>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Location</th>
          <th>Store</th>
          <th>In-Stock Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(stock, index) in stocks" :key="index">
          <td><input v-model="stock.item_code" type="text" placeholder="Item Code" /></td>
          <td><input v-model="stock.item_name" type="text" placeholder="Item Name" /></td>
          <td><input v-model.number="stock.quantity" type="number" placeholder="Quantity" /></td>
          <td><input v-model="stock.location" type="text" placeholder="Location" /></td>
          <td>
            <select v-model="stock.store_id">
              <option disabled value="">Select Store</option>
              <option v-for="store in stores" :key="store.id" :value="store.id">
                {{ store.name }}
              </option>
            </select>
          </td>
          <td><input v-model="stock.in_stock_date" type="date" /></td>
          <td>
            <button @click="removeRow(index)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="buttons">
      <button @click="addRow">+ Add Row</button>
      <button @click="saveAll">Save All Records</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '../store';

export default {
  data() {
    return {
      stocks: [],
      stores: [],
    };
  },
  mounted() {
    this.fetchStores();
    this.addRow();
  },
  methods: {
    async fetchStores() {
  try {
    const token = store.state.token || localStorage.getItem('auth_token'); // Same as fetchStocks
    const response = await axios.get('/api/stores', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.stores = response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, please login.');
      this.$router.push('/login');
    } else {
      console.error('Failed to fetch stores:', error);
    }
  }
},

    addRow() {
      this.stocks.push({
        item_code: '',
        item_name: '',
        quantity: 0,
        location: '',
        store_id: '',
        in_stock_date: '',
      });
    },
    removeRow(index) {
      this.stocks.splice(index, 1);
    },
    async saveAll() {
  try {
    const token = store.state.token || localStorage.getItem('auth_token'); // Get token (same as before)

    const payload = { stocks: this.stocks };

    const response = await axios.post('/api/stocks', payload, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    if (response.status === 200) {
      alert('All stocks saved successfully!');
      this.stocks = []; 
      this.addRow(); 
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, please login.');
      this.$router.push('/login');
    } else {
      console.error('Error saving stocks:', error);
    }
  }
},

  },
};
</script>

<style scoped>
div {
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
}

input, select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.buttons {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 15px;
  background-color: #1976D2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #1565c0;
}
</style>
