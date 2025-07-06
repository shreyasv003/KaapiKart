import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const ProductManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Mock data
  const products = [
    {
      id: 1,
      name: 'Espresso',
      category: 'Hot Coffee',
      price: 2.99,
      stock: 100,
      status: 'active',
      description: 'Strong and concentrated coffee',
    },
    {
      id: 2,
      name: 'Cappuccino',
      category: 'Hot Coffee',
      price: 3.99,
      stock: 75,
      status: 'active',
      description: 'Espresso with steamed milk and foam',
    },
    // Add more mock products as needed
  ];

  const categories = [
    'Hot Coffee',
    'Cold Coffee',
    'Tea',
    'Snacks',
    'Desserts',
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteProduct = (productId) => {
    // Implement delete functionality
    console.log('Delete product:', productId);
  };

  const handleSaveProduct = () => {
    // Implement save functionality
    console.log('Save product:', selectedProduct);
    setOpenDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Product Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedProduct(null);
              setEditMode(false);
              setOpenDialog(true);
            }}
          >
            Add New Product
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.status}
                        color={getStatusColor(product.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Product">
                        <IconButton onClick={() => handleEditProduct(product)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Product">
                        <IconButton onClick={() => handleDeleteProduct(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Edit/Add Product Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={selectedProduct?.name || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedProduct?.category || ''}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  type="number"
                  fullWidth
                  value={selectedProduct?.price || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stock"
                  type="number"
                  fullWidth
                  value={selectedProduct?.stock || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={selectedProduct?.description || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedProduct?.status || 'active'}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, status: e.target.value })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement; 