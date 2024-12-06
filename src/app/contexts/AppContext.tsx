import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchAPI } from "../utils/api";

interface CartItem {
  id: number;
  name: string;
  color: string;
  capacity: string;
  price: number;
  quantity: number;
  mainImage: any;
}




interface AppContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<boolean>;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearOrderedItems: (orderedItemIds: number[]) => void;
  setCustomerId: (id: number | null) => void;  
  customerId: number | null;  
  orders: any[];
  setOrders: (orders: any[]) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);  
  const [orders, setOrders] = useState<any[]>([]);

  // โหลดข้อมูลจาก localStorage เมื่อคอมโพเนนต์เริ่มทำงาน
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
      
    }
  }, []);



  useEffect(() => {
    let isMounted = true; // ติดตามสถานะของ component
    const fetchCustomerData = async () => {
      try {
        const data = await fetchAPI("balance");
        if (isMounted) {
          setCustomerId(data.customer_id);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomerData();

    return () => {
      isMounted = false; // ป้องกันการอัปเดต state หลังจาก component ถูก unmount
    };
  }, []);
 
  
 


  const clearOrderedItems = (orderedItemIds: number[]) => {
    const updatedCart = cart.filter((item) => !orderedItemIds.includes(item.id));
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  const addToCart = async (item: CartItem): Promise<boolean> => {
    try {
      const data = await fetchAPI("checkstock", "POST", {
        id: item.id,
        requestedQuantity: item.quantity,
      });

      if (data.success) {
        const updatedCart = [...cart];
        const index = updatedCart.findIndex((cartItem) => cartItem.id === item.id);

        if (index !== -1) {
          updatedCart[index].quantity += 1;
        } else {
          updatedCart.push({ ...item, quantity: 1 });
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const decreaseQuantity = (id: number) => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex((item) => item.id === id);

    if (index !== -1) {
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
      } else {
        updatedCart.splice(index, 1); // ลบสินค้าออกหากจำนวนเป็น 0
      }
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity,clearOrderedItems ,customerId,
      setCustomerId, orders, setOrders,   }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
