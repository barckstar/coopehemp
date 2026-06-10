import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './shared/layouts/MainLayout';
import Home from './features/home';

const About = lazy(() => import('./features/about'));
const Contact = lazy(() => import('./features/contact'));
const Blog = lazy(() => import('./features/blog'));
const Products = lazy(() => import('./features/products'));
const VendingMap = lazy(() => import('./features/map'));
const Directory = lazy(() => import('./features/directory'));
const Transparency = lazy(() => import('./features/transparency'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-coope-green-200 border-t-coope-green-600 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="productos" element={<Products />} />
            <Route path="mapa" element={<VendingMap />} />
            <Route path="directorio" element={<Directory />} />
            <Route path="transparencia" element={<Transparency />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contacto" element={<Contact />} />
            {/* Legacy aliases */}
            <Route path="products" element={<Products />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
