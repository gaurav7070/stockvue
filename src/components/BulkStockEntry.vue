<template>
  <div>
    <h1>Bulk Stock Entry</h1>
    <ag-grid-vue
      :gridOptions="gridOptions"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :pagination="true"
      :paginationPageSize="10"
      :domLayout="'autoHeight'"
    ></ag-grid-vue>
    <button @click="addNewRecord">Add New Record</button>
    <button @click="saveRecords">Save All Records</button>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  components: {
    AgGridVue,
  },
  data() {
    return {
      rowData: [], 
      columnDefs: [
        { headerName: 'Stock No', field: 'stock_no', editable: false },
        { headerName: 'Item Code', field: 'item_code', editable: true },
        { headerName: 'Item Name', field: 'item_name', editable: true },
        { headerName: 'Quantity', field: 'quantity', editable: true },
        { headerName: 'Location', field: 'location', editable: true },
        { headerName: 'Store Name', field: 'store_name', editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: [] } }, // Dropdown for Store Name
        { headerName: 'In-Stock Date', field: 'in_stock_date', editable: true },
      ],
      gridOptions: {
        defaultColDef: {
          flex: 1,
          minWidth: 100,
          editable: true,
        },
        onGridReady: (params) => {
          this.gridApi = params.api;
          this.gridColumnApi = params.columnApi;
        },
      },
    };
  },
  mounted() {
    this.fetchStores(); 
  },
  methods: {
    addNewRecord() {
      const newRow = {
        stock_no: '', 
        item_code: '',
        item_name: '',
        quantity: 0,
        location: '',
        store_name: '',
        in_stock_date: '',
      };

      this.gridApi.applyTransaction({ add: [newRow] }); 
    },

    async fetchStores() {
      try {
        const response = await axios.get('/api/stores'); 
        const storeOptions = response.data.map(store => store.name); 
        this.columnDefs[5].cellEditorParams.values = storeOptions;
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    },

    // Save all records from the grid
    async saveRecords() {
      try {
        await axios.post('/api/stocks', { stocks: this.rowData });
        alert('Records saved!');
        this.rowData = [];  
        this.gridApi.setRowData(this.rowData); 
      } catch (error) {
        console.error('Error saving records:', error);
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

button {
  padding: 10px 20px;
  margin: 10px 10px 0 0;
  background-color: #1976D2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #1565c0;
}

.ag-theme-alpine {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

div > button {
  display: inline-block;
}

.ag-grid-vue {
  width: 100%;
  margin-top: 20px;
}
</style>

