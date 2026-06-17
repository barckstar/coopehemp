import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../../features/cart/CartContext';
import { CartDrawer } from '../../features/cart/CartDrawer';

const MainLayout = () => {
    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
                <CartDrawer />
            </div>
        </CartProvider>
    );
};

export default MainLayout;
