"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppContext } from "../contexts/AppContext";

const Navbar = () => {
  const { cart, addToCart, removeFromCart, decreaseQuantity } = useAppContext();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // ฟังก์ชันเปิด/ปิด Sidebar
  const toggleSidebar = (open: boolean) => {
    setSidebarOpen(open);
  };

  const handleIncreaseQuantity = async (item: any) => {
    const success = await addToCart({
      ...item,
      quantity: item.quantity + 1,
    });

    if (!success) {
      setNotification("Not enough stock");
    }
  };

  const handleDecreaseQuantity = (id: number) => {
    decreaseQuantity(id);
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Shop
          </Typography>
          <IconButton color="inherit" onClick={() => toggleSidebar(true)}>
            <ShoppingCartIcon />
            <Typography sx={{ ml: 1 }}>{cart.length}</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={() => toggleSidebar(false)}
      >
        <Box
          sx={{
            width: 350,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shopping Cart
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {cart.length > 0 ? (
              cart.map((item) => (
                <ListItem key={item.id} sx={{ alignItems: "center" }}>
                  <ListItemText
                    primary={`${item.name} (${item.capacity}, ${item.color})`}
                    secondary={`Price: ฿${item.price.toFixed(2)}`}
                  />
                  <Box display="flex" alignItems="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleDecreaseQuantity(item.id)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton
                      color="primary"
                      onClick={() => handleIncreaseQuantity(item)}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography>No items in the cart.</Typography>
            )}
          </List>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Total: ฿{calculateTotal().toFixed(2)}
            </Typography>
            <Button variant="contained" color="primary">
              Checkout
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
      >
        <Alert onClose={() => setNotification(null)} severity="error">
          {notification}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
