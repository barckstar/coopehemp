import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx'; // Assuming clsx is installed or I should use template literals. I installed clsx.

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Products', path: '/products' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav
            className={clsx(
                'fixed w-full z-50 transition-all duration-300',
                scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-coope-green-500 rounded-lg flex items-center justify-center text-white group-hover:bg-coope-green-600 transition-colors">
                        <Leaf size={24} />
                    </div>
                    <span className={clsx(
                        "text-xl font-bold tracking-tight transition-colors",
                        scrolled ? "text-gray-900" : "text-white"
                    )}>
                        CoopeHemp
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "text-sm font-medium transition-colors hover:text-coope-green-500",
                                location.pathname === link.path
                                    ? "text-coope-green-500"
                                    : scrolled ? "text-gray-700" : "text-white/90"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button className="bg-coope-green-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-coope-green-600 transition-colors shadow-lg shadow-coope-green-500/20">
                        Get Started
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={clsx("md:hidden", scrolled ? "text-gray-900" : "text-white")}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-600 hover:text-coope-green-500 font-medium py-2"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
