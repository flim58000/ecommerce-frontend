'use client';
import { AppProvider } from '../../contexts/AppContext';

import Navbar from "../../components/Navbar";
import CustomerSidebar from '../../components/CustomerSidebar';
import ViewsOrderDetailsPage from '@/app/components/ViewsOrderDetailsPage';
export default function App() {
    return (

        <AppProvider>
                <Navbar />
                <CustomerSidebar />
          </AppProvider>
    );
}