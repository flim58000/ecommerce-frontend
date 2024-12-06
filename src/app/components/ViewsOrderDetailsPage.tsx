"use client";

import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { useSearchParams } from "next/navigation";

const ViewsOrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const searchParams = useSearchParams();
  const orders = JSON.parse(searchParams.get("state") || "[]"); // รับ JSON orders จาก router
  const orderId = params.id;
  const orderDetails = orders.find((order: any) => order.id === parseInt(orderId));

  if (!orderDetails) {
    return <Typography>No order details found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" style={{ margin: "16px" }}>
        Order ID: {orderDetails.id}
      </Typography>
      <Typography variant="subtitle1" style={{ marginLeft: "16px" }}>
        Status: {orderDetails.status}
      </Typography>
      <Typography variant="subtitle1" style={{ marginLeft: "16px" }}>
        Total Amount: ฿{orderDetails.final_amount.toLocaleString()}
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: "16px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderDetails.details.map((detail: any) => (
              <TableRow key={detail.id}>
                <TableCell>
                  {detail.variant?.product?.name || "Unknown Product"}
                </TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>฿{detail.price.toLocaleString()}</TableCell>
                <TableCell>฿{detail.total_price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewsOrderDetailsPage;
