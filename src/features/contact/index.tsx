import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, TrendingUp, Users, ArrowRight } from 'lucide-react';
import useScrollToTop from '../../shared/hooks/useScrollToTop';

const Contact = () => {
    useScrollToTop();

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const marketData = [
        { year: '2024', value: '$1000 M', label: 'Estimado' },
        { year: '2028', value: '$4000 M', label: 'Proyección' },
        { year: '2032', value: '$8000 M', label: 'Proyección' },
        { year: '2035', value: '$13300 M', label: 'Futuro' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/src/assets/hemp-field-sunrise.jpg"
                        alt="Sunrise over hemp field"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 text-center text-white p-6 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                    >
                        Hablemos
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-xl md:text-2xl font-light text-neutral-200 max-w-2xl mx-auto"
                    >
                        Únete a la revolución sostenible. Estamos aquí para responder tus dudas y construir juntos un futuro más verde.
                    </motion.p>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Information & Form */}
                    <div className="space-y-12">
                        <motion.div {...fadeInUp} className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-green-900 mb-4">Ponte en Contacto</h2>
                                <p className="text-neutral-600 text-lg">
                                    ¿Tienes preguntas sobre Coopehemp o quieres involucrarte? Escríbenos y nuestro equipo te responderá a la brevedad.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                                    <a href="mailto:info@coopehemp.com" className="text-green-700 hover:text-green-800 transition-colors">info@coopehemp.com</a>
                                </div>

                                <div className="p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-semibold text-neutral-900 mb-1">Teléfono</h3>
                                    <a href="tel:+50600000000" className="text-green-700 hover:text-green-800 transition-colors">+506 0000-0000</a>
                                </div>
                            </div>

                            <div className="flex items-start p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 shrink-0 mr-4">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-1">Ubicación</h3>
                                    <p className="text-neutral-600">Costa Rica</p>
                                    <p className="text-neutral-500 text-sm mt-1">Oficinas Centrales</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Form */}
                        <motion.form
                            {...fadeInUp}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-neutral-100"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-700">Nombre</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" placeholder="Tu nombre" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-700">Email</label>
                                        <input type="email" className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" placeholder="ejemplo@correo.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700">Asunto</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" placeholder="¿En qué podemos ayudarte?" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700">Mensaje</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-neutral-50 border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 resize-none" placeholder="Escribe tu mensaje aquí..."></textarea>
                                </div>
                                <button className="w-full py-4 bg-green-900 text-white rounded-xl font-medium hover:bg-green-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                                    Enviar Mensaje
                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.form>
                    </div>

                    {/* Right Column: Market Growth & Community */}
                    <div className="space-y-12">

                        {/* Market Growth Section */}
                        <motion.div
                            {...fadeInUp}
                            className="bg-green-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
                        >
                            {/* Abstract decorative background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-800/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                        <TrendingUp className="w-6 h-6 text-green-300" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Crecimiento del Mercado <br /><span className="text-green-300">en Latinoamérica</span></h2>
                                </div>

                                <div className="space-y-8">
                                    {marketData.map((item, index) => (
                                        <motion.div
                                            key={item.year}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative"
                                        >
                                            <div className="flex items-end justify-between mb-2">
                                                <span className="text-green-300/80 text-sm font-medium tracking-wider">{item.year}</span>
                                                <span className="text-3xl font-bold">{item.value}</span>
                                            </div>
                                            <div className="w-full h-2 bg-green-800/50 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${(parseInt(item.value.replace(/\D/g, '')) / 13300) * 100}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full"
                                                />
                                            </div>
                                            <p className="text-right text-xs text-green-400/60 mt-1">{item.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Community Image Card */}
                        <motion.div
                            {...fadeInUp}
                            transition={{ delay: 0.2 }}
                            className="relative rounded-3xl overflow-hidden group h-[400px]"
                        >
                            <img
                                src="/src/assets/hands-soil-group.jpg"
                                alt="Community planting together"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <div className="flex items-center gap-2 mb-2 text-green-300">
                                    <Users className="w-5 h-5" />
                                    <span className="font-semibold tracking-wide text-sm uppercase">Comunidad</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Cultivando Juntos</h3>
                                <p className="text-neutral-300 mb-6 max-w-sm">
                                    El cáñamo no es solo un cultivo, es una oportunidad para fortalecer nuestras comunidades y regenerar nuestra tierra.
                                </p>
                                <button className="flex items-center gap-2 text-white font-medium hover:gap-4 transition-all">
                                    Conoce nuestra historia <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
