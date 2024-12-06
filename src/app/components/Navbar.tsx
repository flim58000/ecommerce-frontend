"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppContext } from "../contexts/AppContext";
import { fetchAPI } from "../utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ใช้ next/navigation

const Navbar = () => {
  const { customerId, setCustomerId } = useAppContext();
  const { cart, addToCart, removeFromCart, decreaseQuantity } = useAppContext();
  const [isCartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [isCustomerSidebarOpen, setCustomerSidebarOpen] = useState(false);
  const [customerData, setCustomerData] = useState<{
    id: number;
    name: string;
    balance: number;
  } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isCheckingStock, setIsCheckingStock] = useState<number | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const router = useRouter();

  // ดึงข้อมูลลูกค้าเมื่อเปิด Customer Sidebar
  useEffect(() => {
    if (isCustomerSidebarOpen) {
      const fetchCustomerData = async () => {
        try {
          setLoadingCustomer(true);
          const data = await fetchAPI("balance");
          setCustomerData({ id:data.customer_id, name: data.name, balance: data.balance });
 
        } catch (error) {
          console.error("Error fetching customer data:", error);
        } finally {
          setLoadingCustomer(false);
        }
      };
      fetchCustomerData();
    }
  }, [isCustomerSidebarOpen]);

  // ฟังก์ชันเปิด/ปิด Sidebar
  const toggleCartSidebar = (open: boolean) => setCartSidebarOpen(open);
  const toggleCustomerSidebar = (open: boolean) => setCustomerSidebarOpen(open);

  const handleCheckout = async () => {
    try {
      const response = await fetchAPI("checkcartstock", "POST", { cart });
      const outOfStockItems = response.filter(
        (item: any) => item.status === "out_of_stock"
      );

      if (outOfStockItems.length > 0) {
        setNotification("Some items are out of stock.");
        return;
      }

      router.push("/orders"); // ใช้ next/navigation
    } catch (error) {
      console.error("Error during checkout:", error);
      setNotification("Checkout failed. Please try again.");
    }
  };

  const handleIncreaseQuantity = async (item: any) => {
    setIsCheckingStock(item.id);
    try {
      const updatedItem = { ...item, quantity: item.quantity + 1 };
      const isAvailable = await addToCart(updatedItem);

      if (!isAvailable) {
        setNotification(
          `${item.name} (${item.color}, ${item.capacity}) is out of stock`
        );
      }
    } catch (error) {
      console.error("Error checking stock:", error);
      setNotification("Failed to check stock");
    } finally {
      setIsCheckingStock(null);
    }
  };

  const handleDecreaseQuantity = (id: number) => decreaseQuantity(id);
  const handleRemoveItem = (id: number) => removeFromCart(id);

  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton color="inherit" onClick={() => toggleCustomerSidebar(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Shop
          </Typography>
          <IconButton color="inherit" onClick={() => toggleCartSidebar(true)}>
            <ShoppingCartIcon />
            <Typography sx={{ ml: 1 }}>{cart.length}</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Customer Sidebar */}
      <Drawer
        anchor="left"
        open={isCustomerSidebarOpen}
        onClose={() => toggleCustomerSidebar(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6">Customer Details</Typography>
          <Divider sx={{ my: 2 }} />
          {loadingCustomer ? (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <CircularProgress />
              <Typography>Loading...</Typography>
            </Box>
          ) : customerData ? (
            <Box>
              <Typography variant="body1">
                <strong>Name:</strong> {customerData.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Balance:</strong> ฿{customerData.balance.toLocaleString()}
              </Typography>
              <Link href="/viewsorder" passHref>
                <Button variant="contained" color="primary" fullWidth>
                  View Orders
                </Button>
              </Link>
            </Box>
          ) : (
            <Typography color="error">Failed to load customer data.</Typography>
          )}
        </Box>
      </Drawer>

      {/* Cart Sidebar */}
      <Drawer
        anchor="right"
        open={isCartSidebarOpen}
        onClose={() => toggleCartSidebar(false)}
      >
        <Box sx={{ width: 350, p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
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
                      disabled={isCheckingStock === item.id}
                      onClick={() => handleIncreaseQuantity(item)}
                    >
                      {isCheckingStock === item.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <AddIcon />
                      )}
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
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              Checkout
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Notification */}
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
