import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Leaf } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-white">
                            <Leaf className="text-coope-green-500" />
                            <span className="text-xl font-bold">CoopeHemp</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Pioneering sustainable hemp production in Costa Rica. We connect producers, industry, and the public sector to build a greener future.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-sm hover:text-coope-green-400 transition-colors">About Us</Link></li>
                            <li><Link to="/products" className="text-sm hover:text-coope-green-400 transition-colors">Our Products</Link></li>
                            <li><Link to="/blog" className="text-sm hover:text-coope-green-400 transition-colors">News & Updates</Link></li>
                            <li><Link to="/contact" className="text-sm hover:text-coope-green-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-coope-green-500 mt-1" />
                                <span className="text-sm">San José, Costa Rica</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-coope-green-500" />
                                <span className="text-sm">info@coopehemp.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-coope-green-500" />
                                <span className="text-sm">+506 2222-2222</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Newsletter</h3>
                        <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border-none text-white px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-coope-green-500 outline-none text-sm"
                            />
                            <button className="bg-coope-green-500 text-white px-4 py-2 rounded-lg hover:bg-coope-green-600 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} CoopeHemp R.L. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
