"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  TextField,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAppContext } from "../contexts/AppContext";
import { fetchAPI } from "../utils/api";
import Swal from "sweetalert2";
  
const OrderPage = () => {
  const { cart, addToCart, decreaseQuantity, removeFromCart ,clearOrderedItems ,customerId} = useAppContext();
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("fixed"); // ประเภทส่วนลด
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
   // ตรวจสอบเมื่อ cart ว่างเปล่า
  useEffect(() => {
   
  }, [cart]);

  // ฟังก์ชันคำนวณราคาสุทธิ

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (discountType === "percent") {
      return total > 0 ? total * ((100 - discountAmount) / 100) : 0;
    }
    return total > discountAmount ? total - discountAmount : 0;
  };

  // ฟังก์ชัน Apply Discount Code
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {

      Swal.fire({
        icon: "error",
        title: "Message",
        text: "Please enter a discount code.",
        confirmButtonText: "OK",
      });

       return;
    }
    setIsApplyingDiscount(true);
    try {
      const response = await fetchAPI("applydiscount", "POST", { code: discountCode });
      if (response.success) {
        setDiscountAmount(response.discount_value);
        setDiscountType(response.discount_type);
        setNotification(`Discount applied: ${response.discount_type === "percent" ? `${response.discount_value}%` : `฿${response.discount_value}`}`);
      } else {

        Swal.fire({
          icon: "error",
          title: "Message",
          text: "Invalid discount code.",
          confirmButtonText: "OK",
        });

       }
    } catch (error) {
      console.error("Failed to apply discount:", error);
  
      Swal.fire({
        icon: "error",
        title: "Message",
        text: "Failed to apply discount:",
        confirmButtonText: "OK",
      });


     } finally {
      setIsApplyingDiscount(false);
    }
  };

  // ฟังก์ชัน Submit Order
  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Message",
        text: "Your cart is empty. Please add some items.",
        confirmButtonText: "OK",
      });


       return;
    }

    setIsSubmitting(true);
    try {
      
      const payload = {
        customer_id: customerId, // แทนด้วย customer ID จริงจากระบบ
        order_details: cart.map(item => ({
          product_id: item.id,  
          quantity: item.quantity,  
        })),
        redemption_code: discountCode || null, // ใส่โค้ดส่วนลด (ถ้ามี)
      };
     console.log(payload)

       var resp= await fetchAPI("orders", "POST", payload);

       console.log(resp);
       console.log(resp.status)
       
        if (resp.transaction_id >0) {

           Swal.fire({
      icon: "success",
      title: "Order submitted successfully!",
      text: "Thank you for your order.",
      confirmButtonText: "OK",
    }).then(() => {
      const orderedItemIds = cart.map((item) => item.id);  
      clearOrderedItems(orderedItemIds);
        window.location.href = "/";  
    });
  }else {
    Swal.fire({
      icon: "error",
      title: "Order submitted fail",
      text: resp.error,
      confirmButtonText: "OK",
    }).then(() => {
     //  window.location.href = "/";  
    });
  }


    } catch (error) {
      console.error("Failed to submit order:", error);
      Swal.fire({
        icon: "error",
        title: "Order submitted fail",
        text: resp.error,
        confirmButtonText: "OK",
      }) ;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Order
      </Typography>
      <Grid container spacing={2}>
        {/* แสดงสินค้าในตะกร้า */}
        {cart.map((item) => (
            
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={item.mainImage}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">{`Color: ${item.color}, Capacity: ${item.capacity}`}</Typography>
                <Typography variant="body2">{`Price: ฿${item.price.toFixed(2)}`}</Typography>
                <Typography variant="body2">{`Quantity: ${item.quantity}`}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => addToCart({ ...item, quantity: item.quantity + 1 })}
                >
                  +
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 2 }} />
      {/* ช่องกรอก Discount Code */}
      <TextField
        label="Discount Code"
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyDiscount}
        sx={{ mb: 2 }}
        disabled={isApplyingDiscount}
      >
        {isApplyingDiscount ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Applying...
          </>
        ) : (
          "Apply Discount"
        )}
      </Button>
      <Divider sx={{ my: 2 }} />
      {/* สรุปราคา */}
      <Typography variant="h6">Total: ฿{calculateTotal().toFixed(2)}</Typography>
      <Button
        variant="contained"
        color="success"
        onClick={handleSubmitOrder}
        disabled={isSubmitting}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Submitting...
          </>
        ) : (
          "Submit Order"
        )}
      </Button>
      {/* Snackbar แจ้งเตือน */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
      >
        <Alert  severity="info"  onClose={() => setNotification(null)}>
          {notification}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderPage;
