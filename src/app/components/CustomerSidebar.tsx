"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { fetchAPI } from "../utils/api"; // ใช้ฟังก์ชัน fetchAPI จาก utils

const CustomerSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [customerData, setCustomerData] = useState<{
    name: string;
    balance: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ฟังก์ชันเปิด/ปิด Sidebar
  const toggleSidebar = (open: boolean) => {
    setSidebarOpen(open);
  };

  // ดึงข้อมูล Customer
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAPI("balance"); // เรียก API "balance"
      setCustomerData({
        name: data.name,
        balance: data.balance,
      });
    } catch (error) {
      setError("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลเมื่อ Sidebar เปิด
  useEffect(() => {
    if (isSidebarOpen) {
      fetchCustomerData();
    }
  }, [isSidebarOpen]);

  return (
    <>
      

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={() => toggleSidebar(false)}
      >
        <Box
          sx={{
            width: 300,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Customer Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Loading */}
          {loading && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <CircularProgress />
              <Typography>Loading...</Typography>
            </Box>
          )}

          {/* Error */}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {/* Customer Data */}
          {customerData && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {customerData.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Balance:</strong> ฿{customerData.balance.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default CustomerSidebar;
