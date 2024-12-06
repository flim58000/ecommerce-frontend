'use client';
import { AppProvider } from './contexts/AppContext';

import ProductsPage from './pages/ProductPage';
import Navbar from "./components/Navbar";
import CustomerSidebar from './components/CustomerSidebar';

export default function App() {
    return (

        <AppProvider>
                <Navbar />
                <CustomerSidebar />

             <ProductsPage />
        </AppProvider>
    );
}