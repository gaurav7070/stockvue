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
      rowData: [], // This will hold the rows data in grid
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
    this.fetchStores(); // Load the stores dropdown options
  },
  methods: {
    // Add New Record to the grid
    addNewRecord() {
      const newRow = {
        stock_no: '', // Auto-incremented on the backend
        item_code: '',
        item_name: '',
        quantity: 0,
        location: '',
        store_name: '',
        in_stock_date: '',
      };

      this.gridApi.applyTransaction({ add: [newRow] }); // This will properly update the grid with the new row
    },

    // Fetch Store Names from the backend (assuming you have an endpoint to get stores)
    async fetchStores() {
      try {
        const response = await axios.get('/api/stores'); // Endpoint to fetch store list
        const storeOptions = response.data.map(store => store.name); // Assuming store data has 'name'

        // Update store_name column's dropdown values dynamically
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
        this.rowData = [];  // Clear the data after saving
        this.gridApi.setRowData(this.rowData); // Clear the grid data after saving
      } catch (error) {
        console.error('Error saving records:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles for your grid if needed */
</style>
