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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const UserManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Mock data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-02-20 10:30',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-02-20 09:15',
    },
    // Add more mock users as needed
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId) => {
    // Implement delete functionality
    console.log('Delete user:', userId);
  };

  const handleToggleStatus = (userId, currentStatus) => {
    // Implement status toggle functionality
    console.log('Toggle status for user:', userId, 'Current status:', currentStatus);
  };

  const handleSaveUser = () => {
    // Implement save functionality
    console.log('Save user:', selectedUser);
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'user':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            User Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSelectedUser(null);
              setEditMode(false);
              setOpenDialog(true);
            }}
          >
            Add New User
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit User">
                        <IconButton onClick={() => handleEditUser(user)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}>
                        <IconButton onClick={() => handleToggleStatus(user.id, user.status)}>
                          {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton onClick={() => handleDeleteUser(user.id)}>
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
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Edit/Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={selectedUser?.name || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={selectedUser?.email || ''}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedUser?.role || 'user'}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedUser?.status || 'active'}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 