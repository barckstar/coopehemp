import { Routes, Route } from 'react-router-dom';
import MainLayout from '../../shared/layouts/MainLayout';
import Home from '../../features/home';
import About from '../../features/about';
import Blog from '../../features/blog';
import Contact from '../../features/contact';
import Products from '../../features/products';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
