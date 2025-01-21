import { Container, Grid, Typography } from "@mui/material";
import ProductCard from "../components/productcard";
import { useEffect, useState } from "react";
import { Product } from "../types/product";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5005/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container sx={{ mt: 2 }}>
      {products.length === 0 ? (
        <Typography variant="h6" align="center">
          No products available
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid item md={4} key={p._id}>
              <ProductCard {...p} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;
