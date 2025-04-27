<template>
  <div>
    <h1>List Stock Entries</h1>
    <div>
      <input v-model="searchTerm" placeholder="Search" @input="fetchStocks" />
      <button @click="goToBulkStockEntry">Bulk Stock Entry</button>
      <button @click="logout">Logout</button>
    </div>
    <div id="stock-table"></div>
  </div>
</template>

<script>
import axios from 'axios';
import Tabulator from 'tabulator-tables';
import store from '../store';

export default {
  data() {
    return {
      pageSize: 10,
      sortField: 'created_at',
      sortDirection: 'desc',
      searchTerm: '',
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
            sort: JSON.stringify([{ field: this.sortField, dir: this.sortDirection }]),
            search: this.searchTerm, // Adding search term
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.initTable(response.data.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized, please login.');
          this.$router.push('/login');
        } else {
          console.error('Failed to fetch stocks:', error);
        }
      }
    },
    initTable(data) {
      new Tabulator('#stock-table', {
        data: data,
        layout: 'fitColumns',
        pagination: 'local',
        paginationSize: this.pageSize,
        columns: [
          { title: 'Stock No', field: 'stock_no' },
          { title: 'Item Code', field: 'item_code' },
          { title: 'Item Name', field: 'item_name' },
          { title: 'Quantity', field: 'quantity' },
          { title: 'Location', field: 'location' },
          { title: 'Store Name', field: 'store_name' },
          { title: 'In-Stock Date', field: 'in_stock_date' },
          { title: 'Actions', field: 'actions', formatter: this.deleteRecordButton },
        ],
        rowFormatter: function (row) {
          row.getElement().style.cursor = 'pointer';
        },
      });
    },
    deleteRecordButton(cell) {
      const stockId = cell.getRow().getData().id;
      return `<button onclick="deleteRecord(${stockId})">Delete</button>`;
    },
    async deleteRecord(id) {
      try {
        const token = store.state.token || localStorage.getItem('auth_token');
        await axios.delete(`/api/stocks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.fetchStocks(); // Refresh the stock list after deletion
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

input[type="text"] {
  padding: 10px;
  width: 250px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 15px;
  margin-right: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

#stock-table {
  margin-top: 30px;
}

#stock-table .tabulator {
  border: 1px solid #ccc;
  border-radius: 8px;
}

.tabulator-cell button {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.tabulator-cell button:hover {
  background-color: #d32f2f;
}

div > div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 10px;
}
</style>
