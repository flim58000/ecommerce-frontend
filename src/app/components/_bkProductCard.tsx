"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAppContext } from "../contexts/AppContext";

// Interfaces
interface Image {
  id: number;
  url: string;
  is_main: boolean;
}

interface Color {
  id: number;
  name: string;
  code: string;
}

interface Capacity {
  id: number;
  name: string;
}

interface Variant {
  id: number;
  price: number;
  color: Color;
  capacity: Capacity;
  images: Image[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  variants: Variant[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<Color>(
    product.variants[0].color
  );
  const [selectedCapacity, setSelectedCapacity] = useState<Capacity>(
    product.variants[0].capacity
  );
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0]
  );

  // ดึงเฉพาะสีที่ไม่ซ้ำ
  const uniqueColors = Array.from(
    new Map(
      product.variants.map((variant) => [variant.color.id, variant.color])
    ).values()
  );

  const handleColorChange = (color: Color) => {
    // ค้นหา Variant ที่มีสีใหม่
    const firstVariantInColor = product.variants.find(
      (variant) => variant.color.id === color.id
    );

    const matchingVariant = product.variants.find(
      (variant) =>
        variant.color.id === color.id && variant.color.id  
    );
    console.log(matchingVariant)
    if (matchingVariant) {
       setSelectedVariant((prev) => ({
        ...prev,
        price: matchingVariant.price,
      }));
    }
  
    if (firstVariantInColor) {
      // อัปเดตสีและภาพที่ใช้
      setSelectedColor(color);
      setSelectedVariant((prev) => ({
        ...prev,
        color,
        images: firstVariantInColor.images, // ใช้ภาพของสีที่เลือก
      }));
    }
  };
  // ฟังก์ชันเลือกความจุ (ไม่เปลี่ยนภาพ)
  const handleCapacityChange = (capacity?: Capacity) => {
    if (!capacity) return; // ตรวจสอบว่าค่า capacity ไม่ใช่ undefined
  
    setSelectedCapacity(capacity);
  
    // ค้นหา Variant ที่ตรงกับความจุและสีที่เลือก
    const matchingVariant = product.variants.find(
      (variant) =>
        variant.capacity.id === capacity.id && variant.color.id === selectedColor.id
    );
    console.log(matchingVariant)
    if (matchingVariant) {
       setSelectedVariant((prev) => ({
        ...prev,
        price: matchingVariant.price,
      }));
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 500,
        mx: "auto",
        borderRadius: 4,
        boxShadow: 3,
        p: 2,
        mb: 4,
      }}
    >
      {/* ภาพสินค้า */}
      <CardMedia>
  <Carousel showThumbs={false}   showStatus={false} infiniteLoop>
    {selectedVariant.images.map((image) => (
      <div key={image.id}>
        <img
          src={image.url}
          alt={`Product Image ${image.id}`}
          style={{ height: 400, objectFit: "contain" }}
        />
      </div>
    ))}
  </Carousel>
</CardMedia>

      <CardContent>
        {/* ชื่อสินค้า */}
        <Typography gutterBottom variant="h5">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>

        {/* ราคา */}
        <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
          Price: ฿{selectedVariant.price.toFixed(2)}
        </Typography>

        {/* ตัวเลือกสี */}
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          Color:
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {uniqueColors.map((color) => (
            <Grid item key={color.id}>
              <Button
                sx={{
                  bgcolor: color.code,
                  minWidth: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: `2px solid ${
                    selectedColor.id === color.id ? "#000" : "transparent"
                  }`,
                }}
                onClick={() => handleColorChange(color)}
              />
            </Grid>
          ))}
        </Grid>

        {/* ตัวเลือกความจุ */}
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          Capicity:
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={selectedCapacity.id}
          onChange={(_, capacityId) => {
            const capacity = product.variants.find((v) => v.capacity.id === capacityId)?.capacity;
            if (capacity) {
              handleCapacityChange(capacity);
            }
          }}
          sx={{ mb: 2 }}
        >
          {Array.from(
            new Set(
              product.variants
                .filter((variant) => variant.color.id === selectedColor.id)
                .map((variant) => variant.capacity)
            )
          ).map((capacity) => (
            <ToggleButton
              key={capacity.id}
              value={capacity.id}
              sx={{
                textTransform: "none",
                border: "1px solid #ccc",
                "&.Mui-selected": {
                  bgcolor: "#000",
                  color: "#fff",
                },
              }}
            >
              {capacity.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* ปุ่มเพิ่มลงตะกร้า */}
        <Button variant="contained" color="primary" fullWidth>
          เพิ่มลงตะกร้า
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
