import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:5005/user/users");
    const data = await response.json();
    setUsers(data);
  };

  const handleApprove = async (id: string) => {
    await fetch(`http://localhost:5005/user/users/approve/${id}`, { method: "PUT" });
    fetchUsers();
  };

  const handleReject = async (id: string) => {
    await fetch(`http://localhost:5005/user/users/reject/${id}`, { method: "PUT" });
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5005/user/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Account Type</TableCell> {/* عمود جديد لنوع الحساب */}
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.accountType}</TableCell> {/* عرض نوع الحساب */}
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleApprove(user._id)} variant="contained" sx={{ mr: 1 }}>
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(user._id)} variant="outlined" sx={{ mr: 1 }}>
                      Reject
                    </Button>
                    <Button onClick={() => handleDelete(user._id)} color="error" variant="contained">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
