<template>
  <div>
    <h1>List Stock Entries</h1>

    <div class="button-group">
    <button @click="openStoreModal">Add Store</button>
      <button @click="goToBulkStockEntry">Bulk Stock Entry</button>
      <button @click="logout">Logout</button>
    </div>

    <div class="search-bar">
      <input v-model="searchTerm" placeholder="Search Stock" @input="fetchStocks" />
    </div>

    <table>
      <thead>
        <tr>
          <th>Stock No</th>
          <th>Item Code</th>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Location</th>
          <th>Store Name</th>
          <th>In-Stock Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in stocks" :key="stock.id">
          <td>{{ stock.id }}</td>
          <td>{{ stock.item_code }}</td>
          <td>{{ stock.item_name }}</td>
          <td>{{ stock.quantity }}</td>
          <td>{{ stock.location }}</td>
          <td>{{ stock.store ? stock.store.name : '-' }}</td>
          <td>{{ stock.in_stock_date }}</td>
          <td>
            <button @click="deleteRecord(stock.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Store Modal -->
    <div v-if="showStoreModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add New Store</h2>
        <input type="text" v-model="newStoreName" placeholder="Enter store name" />
        <div class="modal-buttons">
          <button @click="submitStore">Submit</button>
          <button @click="closeStoreModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import store from '../store';

export default {
  data() {
    return {
      pageSize: 10,
      sortField: 'created_at',
      sortDirection: 'desc',
      searchTerm: '',
      stocks: [],
      showStoreModal: false,
      newStoreName: '',
    };
  },
  computed: {
    user() {
      return store.state.user || {};
    },
  },
  mounted() {
    this.fetchStocks();
  },
  methods: {
    async fetchStocks() {
      try {
        const token = store.state.token || localStorage.getItem('auth_token');
        const response = await axios.get('/api/stocks', {
          params: {
            size: this.pageSize,
            sortField: this.sortField,
            sortDirection: this.sortDirection,
            search: this.searchTerm,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.stocks = response.data.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized, please login.');
          this.$router.push('/login');
        } else {
          console.error('Failed to fetch stocks:', error);
        }
      }
    },
    async deleteRecord(id) {
      try {
        const token = store.state.token || localStorage.getItem('auth_token');
        await axios.delete(`/api/stocks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.fetchStocks();
      } catch (error) {
        console.error('Error deleting stock record:', error);
      }
    },
    logout() {
      this.$store.commit('logout');
      localStorage.removeItem('auth_token');
      this.$router.push('/login');
    },
    goToBulkStockEntry() {
      this.$router.push('/bulk-entry');
    },
    openStoreModal() {
      this.showStoreModal = true;
    },
    closeStoreModal() {
      this.showStoreModal = false;
      this.newStoreName = '';
    },
    async submitStore() {
      if (!this.newStoreName.trim()) {
        alert('Please enter a store name.');
        return;
      }
      try {
        const token = store.state.token || localStorage.getItem('auth_token');
        const response = await axios.post('/api/stores', {
          name: this.newStoreName,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert(response.data.message);
        this.closeStoreModal();
        this.fetchStocks(); // reload stocks if needed
      } catch (error) {
        console.error('Error creating store:', error);
        alert('Failed to create store.');
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
  margin-bottom: 30px;
  color: #333;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

input[type="text"] {
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  text-align: center;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.modal-content input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
}
</style>
