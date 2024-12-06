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
  const { addToCart } = useAppContext();

  const handleAddToCart = () => {
    const matchingVariant = product.variants.find(
      (variant) =>
        variant.color.id === selectedColor.id &&
        variant.capacity.id === selectedCapacity.id
    );

    const getMainImage = (matchingVariant: any, product: any): string | null => {
      // ใช้ images แทน mainImage
      if (matchingVariant.images && matchingVariant.images.length > 0) {
        const mainImage = matchingVariant.images.find(
          (image: any) => image.is_main === 1
        );
        if (mainImage) {
          return mainImage.url; // คืนภาพหลักถ้าพบ
        }
      }
    
      // หากไม่มีภาพใน matchingVariant ให้ค้นหาจาก variant อื่นที่มีสีเดียวกัน
      const similarVariant = product.variants.find(
        (variant: any) =>
          variant.color.id === matchingVariant.color.id &&
          variant.images &&
          variant.images.length > 0 // ต้องมีภาพใน images
      );
    
      if (similarVariant) {
        const similarMainImage = similarVariant.images.find(
          (image: any) => image.is_main === 1
        );
        if (similarMainImage) {
          return similarMainImage.url; // คืนภาพจาก variant ที่มีสีเดียวกัน
        }
      }
    
      // หากยังไม่มีภาพ ให้แสดง console.warn
      console.warn("No main image found for variant:", matchingVariant);
    
      return null; // คืน null หากไม่มีภาพเลย
    };

    if (!matchingVariant) {
      console.error("No matching variant found!");
      return;
    }
    const mainImageUrl = getMainImage(matchingVariant, product);
    console.log(getMainImage)

    const newItem = {
      id: matchingVariant.id,
      name: product.name,
      color: matchingVariant.color.name,
      capacity: matchingVariant.capacity.name,
      price: matchingVariant.price,
      quantity: 1,
      mainImage:mainImageUrl
    };
  
    addToCart(newItem);
  };
  

// // เพิ่มฟังก์ชัน handleAddToCart
// const handleAddToCart  = () => {
//   // ค้นหา Variant ปัจจุบันที่เลือก
//   const matchingVariant = product.variants.find(
//     (variant) =>
//       variant.color.id === selectedColor.id 
//   );

//   if (!matchingVariant) {
//     console.error("No matching variant found!");
//     return;
//   }

//   // ดึงข้อมูลตะกร้าปัจจุบันจาก localStorage
//   const cart = JSON.parse(localStorage.getItem("cart") || "[]");

//   // ค้นหาว่าสินค้านี้มีอยู่ในตะกร้าแล้วหรือไม่
//   const existingItemIndex = cart.findIndex(
//     (item: any) => item.id === matchingVariant.id
//   );

//   if (existingItemIndex !== -1) {
//     // ถ้ามีสินค้าอยู่ในตะกร้าแล้ว ให้เพิ่มจำนวน
//     cart[existingItemIndex].quantity += 1;
//   } else {
//     // ถ้ายังไม่มีสินค้าในตะกร้า ให้เพิ่มใหม่
//     cart.push({
//       id: matchingVariant.id,
//       name: product.name,
//       color: matchingVariant.color.name,
//       capacity: matchingVariant.capacity.name,
//       price: matchingVariant.price,
//       quantity: 1,
//     });
//   }

//   // บันทึกข้อมูลกลับไปที่ localStorage
//   localStorage.setItem("cart", JSON.stringify(cart));

//   // Debug
//   console.log("Cart Updated:", cart);
// };

  

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
  
    if (!firstVariantInColor) {
      console.error("No variant found for the selected color!");
       return;
    }
  
    // อัปเดตสีและภาพที่ใช้
    setSelectedColor(color);
  
    // ตรวจสอบและเลือก capacity แรกที่มีในสีนี้
    const firstCapacityInColor = product.variants.find(
      (variant) => variant.color.id === color.id
    )?.capacity;
  
    if (!firstCapacityInColor) {
      console.error("No capacities found for the selected color!");
       return;
    }
  
    setSelectedCapacity(firstCapacityInColor);
  
    // อัปเดต Variant ที่เลือก
    const matchingVariant = product.variants.find(
      (variant) =>
        variant.color.id === color.id &&
        variant.capacity.id === firstCapacityInColor.id
    );
  
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    } else {
      console.error("No matching variant found for the selected capacity!");
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
        <Button variant="contained" color="primary" fullWidth onClick={handleAddToCart }>
          เพิ่มลงตะกร้า
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
