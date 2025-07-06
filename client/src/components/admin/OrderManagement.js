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
  Typography,
  Tooltip,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const OrderManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data
  const orders = [
    {
      id: 1,
      customerName: 'John Doe',
      date: '2024-02-20 10:30',
      total: 15.97,
      status: 'pending',
      items: [
        { name: 'Espresso', quantity: 2, price: 2.99 },
        { name: 'Cappuccino', quantity: 1, price: 3.99 },
      ],
      address: '123 Main St, City, Country',
      paymentMethod: 'Credit Card',
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      date: '2024-02-20 09:15',
      total: 8.98,
      status: 'completed',
      items: [
        { name: 'Latte', quantity: 2, price: 4.49 },
      ],
      address: '456 Oak St, City, Country',
      paymentMethod: 'PayPal',
    },
    // Add more mock orders as needed
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    // Implement status update functionality
    console.log('Update order status:', orderId, 'New status:', newStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ShippingIcon />;
      case 'processing':
        return <ShippingIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div">
            Order Management
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Order Details">
                        <IconButton onClick={() => handleViewOrder(order)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {order.status === 'pending' && (
                        <>
                          <Tooltip title="Mark as Processing">
                            <IconButton
                              onClick={() => handleUpdateStatus(order.id, 'processing')}
                              color="info"
                            >
                              <ShippingIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel Order">
                            <IconButton
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                              color="error"
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {order.status === 'processing' && (
                        <Tooltip title="Mark as Completed">
                          <IconButton
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                            color="success"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Details #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Customer Information
                  </Typography>
                  <Typography variant="body2">
                    Name: {selectedOrder.customerName}
                  </Typography>
                  <Typography variant="body2">
                    Address: {selectedOrder.address}
                  </Typography>
                  <Typography variant="body2">
                    Payment Method: {selectedOrder.paymentMethod}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Order Information
                  </Typography>
                  <Typography variant="body2">
                    Date: {selectedOrder.date}
                  </Typography>
                  <Typography variant="body2">
                    Status: {selectedOrder.status}
                  </Typography>
                  <Typography variant="body2">
                    Total: ${selectedOrder.total.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Order Items
                  </Typography>
                  <List>
                    {selectedOrder.items.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={item.name}
                            secondary={`Quantity: ${item.quantity} × $${item.price.toFixed(2)}`}
                          />
                          <Typography variant="body2">
                            ${(item.quantity * item.price).toFixed(2)}
                          </Typography>
                        </ListItem>
                        {index < selectedOrder.items.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedOrder?.status === 'pending' && (
            <>
              <Button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                color="info"
                startIcon={<ShippingIcon />}
              >
                Mark as Processing
              </Button>
              <Button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                color="error"
                startIcon={<CancelIcon />}
              >
                Cancel Order
              </Button>
            </>
          )}
          {selectedOrder?.status === 'processing' && (
            <Button
              onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
              color="success"
              startIcon={<CheckCircleIcon />}
            >
              Mark as Completed
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement; 