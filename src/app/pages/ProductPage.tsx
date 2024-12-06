import React, { useEffect, useState } from "react";
import { Grid, Container, Typography } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { fetchAPI } from "../utils/api";


const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchAPI("products");  
        setProducts(data); // เก็บข้อมูลสินค้าใน State
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Product
        </Typography>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ProductsPage;
