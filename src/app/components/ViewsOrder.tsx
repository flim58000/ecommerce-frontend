"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Box,
  Modal,
} from "@mui/material";
import { useAppContext } from "../contexts/AppContext";

const ViewsOrder = () => {
  const { customerId } = useAppContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // เก็บ Order ที่เลือก
  const [openModal, setOpenModal] = useState(false); // ควบคุม Modal

  // ดึงข้อมูล Orders
  useEffect(() => {
    if (!customerId) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchAPI("orders", "GET", null, {
          "X-Customer-ID": customerId.toString(),
        });
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  // เปิด Modal พร้อมส่งข้อมูล Order
  const handleOpenModal = (order: any) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  // ดึงรูปภาพหลักจาก Variant
  const getMainImage = (variant: any) => {
    const mainImage = variant?.images?.find((image: any) => image.is_main === 1);
    return mainImage ? mainImage.url : "/placeholder.png";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <Typography>Loading orders...</Typography>
      </div>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Typography variant="h6" style={{ margin: "16px" }}>
          Order History
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>฿{order.final_amount.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(order)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal แสดงรายละเอียด Order */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedOrder ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Order ID: {selectedOrder.id}
              </Typography>
              <Typography>Status: {selectedOrder.status}</Typography>
              <Typography>
                Total Amount: ฿{selectedOrder.final_amount.toLocaleString()}
              </Typography>
              {selectedOrder.redemption_code && (
                <Typography>
                  Discount Code: {selectedOrder.redemption_code}
                </Typography>
              )}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Order Details:
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Color</TableCell>
                      <TableCell>Capacity</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>ProductPrice</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.details.map((detail: any) => (
                      <TableRow key={detail.id}>
                        <TableCell>
                          <img
                            src={getMainImage(detail.variant)}
                            alt="Product"
                            width={50}
                          />
                        </TableCell>
                        <TableCell>
                          {detail.variant?.product?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {detail.variant?.color_id || "N/A"}
                        </TableCell>
                        <TableCell>
                          {detail.variant?.capacity_id || "N/A"}
                        </TableCell>
                        <TableCell>{detail.quantity}</TableCell>
                        <TableCell>฿{detail.price.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </Box>
          ) : (
            <Typography>No order details available.</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewsOrder;
