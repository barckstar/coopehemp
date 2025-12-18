import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight, Leaf } from 'lucide-react';
import useScrollToTop from '../../shared/hooks/useScrollToTop';

const Products = () => {
    useScrollToTop();

    const products = [
        {
            id: 1,
            name: "CBD Pre-rolls (5 pack)",
            description: "Flores de cáñamo premium seleccionadas a mano, roladas en papel orgánico. Experiencia suave y natural.",
            price: "$15.00",
            image: "/src/assets/product-prerolls.jpg",
            category: "Fumables"
        },
        {
            id: 2,
            name: "Bálsamo Calmante CBD",
            description: "Alivio tópico profundo para músculos y articulaciones. Formulado con cera de abeja y aceites esenciales.",
            price: "$25.00",
            image: "/src/assets/product-cbd-balm.jpg",
            category: "Bienestar"
        },
        {
            id: 3,
            name: "Té de Cáñamo Premium",
            description: "Infusión relajante rica en cannabinoides no psicoactivos. Ideal para reducir el estrés y mejorar el sueño.",
            price: "$45.00",
            image: "/src/assets/product-hump-oil-tea.jpg",
            category: "Bebidas"
        },
        {
            id: 4,
            name: "Crema Facial Anti-edad",
            description: "Hidratación profunda con poder antioxidante. Revitaliza tu piel con lo mejor de la naturaleza.",
            price: "$30.00",
            image: "/src/assets/product-beauty-cream.jpg",
            category: "Belleza"
        },
        {
            id: 5,
            name: "Cookies Artesanales CBD",
            description: "Deliciosas galletas horneadas con harina de cáñamo y chispas de chocolate. El snack saludable perfecto.",
            price: "$12.00",
            image: "/src/assets/product-cookies.jpg",
            category: "Comestibles"
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-green-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/src/assets/hemp-field.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/90"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 md:py-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-green-300 text-sm font-medium mb-6">
                            <Leaf className="w-4 h-4" />
                            100% Orgánico & Sostenible
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Catalogo Coopehemp</h1>
                        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto font-light leading-relaxed">
                            Descubre el poder del cáñamo en productos diseñados para tu bienestar.
                            Calidad premium, cultivada con respeto por la tierra.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={item}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group ring-1 ring-neutral-100 flex flex-col"
                        >
                            <div className="relative h-64 overflow-hidden bg-neutral-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-neutral-900 shadow-sm">
                                    {product.category}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-green-800 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-bold text-green-700">{product.price}</span>
                                    </div>
                                </div>

                                <p className="text-neutral-600 mb-6 leading-relaxed flex-grow">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-neutral-100 mt-auto">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <button className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-all active:scale-95">
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Detalles</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Call to Action Card for Wholesale/Distributors */}
                    <motion.div
                        variants={item}
                        className="bg-green-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center text-white relative overflow-hidden min-h-[400px]"
                    >
                        <div className="absolute inset-0 bg-[url('/src/assets/hemp-leaves-vertical.jpg')] bg-cover bg-center opacity-10"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                                <Leaf className="w-8 h-8 text-green-300" />
                            </div>
                            <h3 className="text-3xl font-bold">¿Mayorista?</h3>
                            <p className="text-green-100 max-w-sm mx-auto">
                                Únete a nuestra red de distribuidores y lleva los mejores productos de cáñamo a tus clientes.
                            </p>
                            <button className="inline-flex items-center gap-2 bg-white text-green-900 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors">
                                Contáctanos <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Products;
