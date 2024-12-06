'use client';
import { AppProvider } from '../contexts/AppContext';

import Navbar from "../components/Navbar";
import CustomerSidebar from '../components/CustomerSidebar';
import OrderPage from '../components/OrderPage';

export default function App() {
    return (

        <AppProvider>
                <Navbar />
                <CustomerSidebar />
<OrderPage />
         </AppProvider>
    );
}