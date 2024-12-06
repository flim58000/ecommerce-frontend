'use client';
import { AppProvider } from '../contexts/AppContext';

import Navbar from "../components/Navbar";
import CustomerSidebar from '../components/CustomerSidebar';
import OrderPage from '../components/OrderPage';
import ViewsOrder from '../components/ViewsOrder';

export default function App() {
    return (

        <AppProvider>
                <Navbar />
                <CustomerSidebar />
<ViewsOrder />
         </AppProvider>
    );
}