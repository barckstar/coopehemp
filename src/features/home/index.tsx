import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Droplet, Sun, Users } from 'lucide-react';
const fieldImage = "/hemp-field.jpg";
const oilImage = "/hemp-oil.jpg";
const productImage = "/productos/hemp-product.jpg";
// import logoImage from '../../assets/logo.png'; // Used in header/footer mostly

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={fieldImage}
            alt="Hemp Field"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Impulsando el futuro <br />
            <span className="text-coope-green-400">sostenible del cáñamo</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-200"
          >
            Somos una plataforma cooperativa que conecta productores, industria y comunidad para desarrollar el potencial del cáñamo en Costa Rica.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-coope-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-coope-green-700 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2">
              Únete a nosotros <ArrowRight size={20} />
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center">
              Conoce más
            </button>
          </motion.div>
        </div>
      </section>

      {/* Values / Benefits Section */}
      <section className="py-24 bg-coope-green-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Leaf size={40} />, title: '100% Sostenible', desc: 'Cultivos regenerativos que benefician al suelo y al medio ambiente.' },
              { icon: <Users size={40} />, title: 'Cooperativa', desc: 'Un modelo justo que empodera a los agricultores locales.' },
              { icon: <Droplet size={40} />, title: 'Calidad Premium', desc: 'Productos de cáñamo de la más alta pureza y estándares.' },
              { icon: <Sun size={40} />, title: 'Innovación', desc: 'Tecnología de punta aplicada al desarrollo agrícola.' }
            ].map((item, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-coope-green-100/50 group"
              >
                <div className="w-16 h-16 bg-coope-green-100 rounded-2xl flex items-center justify-center text-coope-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              {...fadeInUp}
              className="lg:w-1/2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src={oilImage} alt="Hemp Oil" className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white text-lg font-medium">Extractos puros y naturales</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              className="lg:w-1/2"
            >
              <h4 className="text-coope-green-600 font-bold tracking-wider uppercase mb-4">Nuestra Missión</h4>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
                Revolucionando la agricultura en <span className="text-coope-earth-600">Costa Rica</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                En CoopeHemp, creemos en el poder transformador del cáñamo. No solo como cultivo, sino como motor de cambio social y ambiental.
              </p>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Nuestra cooperativa une fuerzas para garantizar prácticas justas, educación continua y productos que mejoran la calidad de vida de nuestros consumidores mientras sanamos la tierra.
              </p>
              <button className="text-coope-green-700 font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all group">
                Leer nuestra historia <ArrowRight size={20} className="group-hover:text-coope-green-500" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Nuestros Productos</h2>
            <p className="text-gray-600 text-lg">Descubre la versatilidad del cáñamo en nuestra línea de productos premium.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden h-[500px] shadow-2xl"
            >
              <img src={productImage} alt="Edibles" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute bottom-0 left-0 p-10">
                <h3 className="text-3xl font-bold text-white mb-2">Comestibles & Superfoods</h3>
                <p className="text-gray-200 mb-6">Nutrición deliciosa y saludable.</p>
                <button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-coope-green-50 transition-colors">
                  Ver Productos
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-8">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative rounded-3xl overflow-hidden h-full min-h-[500px] shadow-2xl"
              >
                <div className="absolute inset-0 bg-coope-green-900" /> {/* Placeholder/Color background as variant */}
                <img src={oilImage} alt="CBD Oil" className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col justify-center items-start p-12">
                  <h3 className="text-3xl font-bold text-white mb-2">Aceites & Terapéuticos</h3>
                  <p className="text-coope-green-100 mb-8 max-w-sm">
                    Bienestar natural con nuestros aceites de CBD de espectro completo y fórmulas terapéuticas.
                  </p>
                  <button className="border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-coope-green-900 transition-colors">
                    Explorar Línea
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-coope-green-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-32" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">¿Listo para ser parte del cambio?</h2>
          <p className="text-xl text-coope-green-100 mb-12 max-w-2xl mx-auto">
            Únete a nuestra comunidad de productores, inversionistas y consumidores conscientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-coope-green-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              Contáctanos Ahora
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
