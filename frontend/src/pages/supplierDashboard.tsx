import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";

const SupplierDashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch products from the database
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5005/products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle product creation
  const handleSubmit = async () => {
    if (!title || !image || !price || !stock) {
      setError("Please fill in all fields");
      return;
    }

    const response = await fetch("http://localhost:5005/products/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, image, price, stock }),
    });

    if (!response.ok) {
      setError("Failed to create product");
      return;
    }

    setSuccess("Product created successfully!");
    setError("");
    setTitle("");
    setImage("");
    setPrice("");
    setStock("");
    fetchProducts(); // Refresh product list
  };

  // Handle product update
  const handleUpdate = async (id: string, updatedPrice: number, updatedStock: number) => {
    const response = await fetch(`http://localhost:5005/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: updatedPrice, stock: updatedStock }),
    });

    if (!response.ok) {
      console.error("Failed to update product");
      return;
    }

    fetchProducts(); // Refresh product list
  };

  // Handle product deletion
  const handleDelete = async (id: string) => {
    const response = await fetch(`http://localhost:5005/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Failed to delete product");
      return;
    }

    fetchProducts(); // Refresh product list
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Supplier Dashboard
        </Typography>

        {/* Product Creation Form */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 4,
            mb: 4,
          }}
        >
          <Typography variant="h6">Add New Product</Typography>
          <TextField
            label="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <TextField
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
          <Button onClick={handleSubmit} variant="contained">
            Create Product
          </Button>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success">{success}</Typography>}
        </Box>

        {/* Product List */}
        <Typography variant="h6" gutterBottom>
          Manage Existing Products
        </Typography>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.image}
                  alt={product.title}
                />
                <CardContent>
                  <Typography variant="h6">{product.title}</Typography>
                  <TextField
                    label="Price"
                    type="number"
                    defaultValue={product.price}
                    onChange={(e) => (product.price = Number(e.target.value))}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    label="Stock"
                    type="number"
                    defaultValue={product.stock}
                    onChange={(e) => (product.stock = Number(e.target.value))}
                    fullWidth
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    onClick={() => handleUpdate(product._id, product.price, product.stock)}
                  >
                    Update
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default SupplierDashboard;
