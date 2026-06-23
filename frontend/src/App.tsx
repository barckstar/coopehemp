import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './shared/layouts/MainLayout';
import Home from './features/home';

// Home es eager (LCP); el resto carga lazy por ruta. El Suspense vive en MainLayout.
const About = lazy(() => import('./features/about'));
const Products = lazy(() => import('./features/products'));
const VendingMap = lazy(() => import('./features/map'));
const Directory = lazy(() => import('./features/directory'));
const Transparency = lazy(() => import('./features/transparency'));
const Blog = lazy(() => import('./features/blog'));
const BlogPost = lazy(() => import('./features/blog/Post'));
const Contact = lazy(() => import('./features/contact'));
const Checkout = lazy(() => import('./features/checkout'));
const NotFound = lazy(() => import('./features/not-found'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="productos" element={<Products />} />
          <Route path="products" element={<Products />} />
          <Route path="mapa" element={<VendingMap />} />
          <Route path="directorio" element={<Directory />} />
          <Route path="transparencia" element={<Transparency />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="contact" element={<Contact />} />
          <Route path="checkout" element={<Checkout />} />
          {/* 404 — cualquier ruta no reconocida */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
