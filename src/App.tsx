import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './shared/layouts/MainLayout';
import Home from './features/home';
import About from './features/about';
import Contact from './features/contact';
import Blog from './features/blog';
import Products from './features/products';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="products" element={<Products />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="contact" element={<Contact />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
