import { motion } from 'framer-motion';
import { Heart, Sprout, Users, Rocket, Award, CheckCircle, ArrowRight } from 'lucide-react';
// Images are now in public folder
const handsImage = "/hemp-hands-soil.jpg";
const fiberImage = "/hemp-fiber-roll.jpg";
const leavesImage = "/hemp-leaves-vertical.jpg";
const gummiesImage = "/hemp-gummies.jpg";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const About = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={leavesImage}
                        alt="Hemp Leaves"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-coope-green-300 font-bold tracking-widest uppercase mb-4"
                    >
                        Sobre Nosotros
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        Cultivando <span className="text-coope-green-400">Bienestar</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl max-w-2xl mx-auto text-gray-200"
                    >
                        Unimos tradición e innovación para construir un futuro sostenible a través del cáñamo.
                    </motion.p>
                </div>
            </section>

            {/* Our Story / Intro */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div {...fadeIn} className="lg:w-1/2">
                            <h2 className="text-4xl font-bold mb-6 text-gray-900">
                                Más que una industria, <br />
                                <span className="text-coope-green-600">una comunidad</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                CoopeHemp nació de la visión compartida de agricultores costarricenses que vieron en el cáñamo no solo un cultivo rentable, sino una oportunidad para regenerar nuestras tierras y empoderar a nuestras comunidades rurales.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Desde nuestros inicios, nos hemos dedicado a investigar, educar y desarrollar prácticas agrícolas que respetan los ciclos naturales, garantizando productos de la más alta pureza y calidad.
                            </p>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-4xl font-bold text-coope-green-600">50+</h3>
                                    <p className="text-sm text-gray-500 font-medium">Productores Asociados</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-4xl font-bold text-coope-green-600">100%</h3>
                                    <p className="text-sm text-gray-500 font-medium">Orgánico Certificado</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                                <img src={handsImage} alt="Hands in Soil" className="w-full object-cover h-[500px]" />
                            </div>
                            <div className="absolute top-10 -right-10 w-full h-full bg-coope-green-100/50 rounded-3xl -z-0" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Strategic Pillars */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">Pilares Estratégicos</h2>
                        <p className="text-gray-600 text-lg">Los cimientos sobre los que construimos nuestro compromiso.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Pillar 1 */}
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={fiberImage} alt="Sustainability" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-coope-earth-100 rounded-xl flex items-center justify-center text-coope-earth-600 mb-6">
                                    <Sprout size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">Sostenibilidad Integral</h3>
                                <p className="text-gray-600">
                                    Implementamos modelos de economía circular donde cada parte de la planta es aprovechada, minimizando residuos y maximizando el valor.
                                </p>
                            </div>
                        </motion.div>

                        {/* Pillar 2 */}
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={gummiesImage} alt="Innovation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                                    <Rocket size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">Innovación y Calidad</h3>
                                <p className="text-gray-600">
                                    Desarrollamos productos que cumplen con los más altos estándares internacionales, fusionando ciencia y naturaleza.
                                </p>
                            </div>
                        </motion.div>

                        {/* Pillar 3 */}
                        <motion.div
                            {...fadeIn}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="h-48 overflow-hidden bg-coope-green-800 flex items-center justify-center text-white/20">
                                <Users size={64} /> {/* Placeholder if no specific image fits well */}
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <Heart size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">Impacto Social</h3>
                                <p className="text-gray-600">
                                    Fomentamos el desarrollo económico local, creando empleos dignos y oportunidades de crecimiento para nuestras comunidades.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team / Leadership Placeholder */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">Nuestro Equipo</h2>
                        <p className="text-gray-600 text-lg">Liderazgo comprometido con la excelencia.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="text-center group">
                                <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden relative">
                                    {/* Placeholder Avatar */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <Users size={40} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Nombre Apellido</h3>
                                <p className="text-sm text-coope-green-600 font-medium">Cargo Directivo</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values List */}
            <section className="py-24 bg-coope-green-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Nuestros Valores</h2>
                            <div className="space-y-6">
                                {[
                                    { title: 'Transparencia', desc: 'Operamos con total claridad en todos nuestros procesos.' },
                                    { title: 'Responsabilidad', desc: 'Compromiso inquebrantable con el medio ambiente.' },
                                    { title: 'Excelencia', desc: 'Buscamos la perfección en cada producto.' },
                                    { title: 'Colaboración', desc: 'Creemos en el poder del trabajo en equipo.' }
                                ].map((val, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="mt-1 text-coope-green-400">
                                            <CheckCircle size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{val.title}</h3>
                                            <p className="text-gray-300">{val.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-[500px] overflow-hidden rounded-2xl relative">
                            <img src={leavesImage} alt="Values" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/10 backdrop-blur-md p-8 rounded-full border border-white/20">
                                    <Award size={64} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-coope-green-900/50" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-6">Sé parte de la revolución verde</h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                        Ya seas productor, inversionista o consumidor, hay un lugar para ti en CoopeHemp.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-coope-green-500 hover:bg-coope-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2">
                            Contáctanos <ArrowRight size={20} />
                        </button>
                        <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-colors">
                            Ver Productos
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
