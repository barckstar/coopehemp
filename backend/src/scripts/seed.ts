import { MedusaContainer } from "@medusajs/framework/types"
import { BLOG_MODULE } from "../modules/blog"
import type BlogModuleService from "../modules/blog/service"
import { NEWSLETTER_MODULE } from "../modules/newsletter"
import type NewsletterModuleService from "../modules/newsletter/service"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

// ---------------------------------------------------------------------------
// Blog seed data — 10 themed posts (bilingual: es + en)
// ---------------------------------------------------------------------------

const POSTS = [
  {
    slug: "canamo-industrial-mil-usos",
    cover_image: "/hemp-plant.jpg",
    category: "Educación",
    author_name: "Dra. Valeria Solano",
    published_at: daysAgo(5),
    translations: [
      {
        locale: "es",
        title: "El cáñamo industrial: una planta con mil usos",
        excerpt:
          "Desde fibras textiles hasta biocombustibles, el cáñamo industrial es una de las plantas más versátiles que existen. Descubrí por qué ha conquistado a agricultores de todo el mundo.",
        content: `
## Una planta, infinitas posibilidades

El cáñamo industrial (*Cannabis sativa* L.) lleva más de 10 000 años acompañando a la humanidad. Sus tallos producen fibra resistente para ropa, cuerdas y papel; sus semillas son un superalimento repleto de proteínas y ácidos grasos esenciales; y su flor concentra cannabinoides con alto potencial terapéutico.

### Usos principales

1. **Fibra textil**: La fibra bast del tallo es duradera, transpirable y biodegradable. Marcas de moda sostenible la prefieren sobre el algodón convencional.
2. **Construcción**: El hurd o agramiza mezclado con cal genera el llamado hempcrete, un material aislante, ignífugo y con huella de carbono negativa.
3. **Alimentación**: Las semillas contienen todos los aminoácidos esenciales y una relación omega-6/omega-3 óptima para la salud humana.
4. **Medicina y cosméticos**: El CBD extraído de la flor está en estudio para manejo del dolor crónico, ansiedad y epilepsia refractaria.
5. **Biocombustibles**: La biomasa de cáñamo puede convertirse en etanol y biodiesel de forma eficiente.

### ¿Por qué en Costa Rica?

Las condiciones tropicales de Costa Rica, con luz solar abundante y suelos fértiles, ofrecen un entorno privilegiado para el cultivo orgánico de cáñamo. CoopeHemp R.L. trabaja para demostrar que este cultivo puede transformar la economía rural del país y reducir la dependencia de insumos agrícolas importados.

> "El cáñamo no es el futuro. Es el presente que recién estamos aprendiendo a aprovechar." — Dra. Valeria Solano
        `,
      },
      {
        locale: "en",
        title: "Industrial Hemp: A Plant with a Thousand Uses",
        excerpt:
          "From textile fibers to biofuels, industrial hemp is one of the most versatile plants on Earth. Discover why it has won over farmers worldwide.",
        content: `
## One Plant, Infinite Possibilities

Industrial hemp (*Cannabis sativa* L.) has been humanity's companion for over 10,000 years. Its stalks yield strong fiber for clothing, rope, and paper; its seeds are a superfood packed with protein and essential fatty acids; and its flowers concentrate cannabinoids with high therapeutic potential.

### Main Uses

1. **Textile fiber**: Bast fiber from the stalk is durable, breathable, and biodegradable. Sustainable fashion brands prefer it over conventional cotton.
2. **Construction**: Hurd mixed with lime creates hempcrete — an insulating, fire-resistant material with a negative carbon footprint.
3. **Food**: Hemp seeds contain all essential amino acids and an optimal omega-6/omega-3 ratio for human health.
4. **Medicine & cosmetics**: CBD extracted from flowers is being studied for chronic pain, anxiety, and refractory epilepsy management.
5. **Biofuels**: Hemp biomass can be efficiently converted into ethanol and biodiesel.

### Why Costa Rica?

Costa Rica's tropical conditions — abundant sunlight and fertile soils — provide a privileged environment for organic hemp cultivation. CoopeHemp R.L. works to demonstrate that this crop can transform the country's rural economy and reduce dependence on imported agricultural inputs.
        `,
      },
    ],
  },

  {
    slug: "historia-coopehemp-comunidad",
    cover_image: "/hemp-hands-soil.jpg",
    category: "Comunidad",
    author_name: "Leonel Castro",
    published_at: daysAgo(12),
    translations: [
      {
        locale: "es",
        title: "Cómo nació CoopeHemp: la historia de una comunidad que apostó al cáñamo",
        excerpt:
          "Más de 50 productores costarricenses se unieron con un objetivo común: cultivar cáñamo de manera sostenible y construir un futuro mejor para sus familias.",
        content: `
## El inicio de un sueño colectivo

En 2020, un grupo de agricultores de las provincias de Cartago, Heredia y Alajuela comenzó a reunirse para hablar de una planta que prometía cambiar su realidad: el cáñamo industrial. Muchos de ellos venían de cultivos tradicionales que habían perdido rentabilidad; otros eran jóvenes emprendedores que buscaban alternativas sostenibles.

La idea era sencilla pero ambiciosa: formar una cooperativa que les permitiera compartir conocimientos, reducir costos y acceder a mercados que individualmente serían imposibles de alcanzar.

### Los primeros pasos

El camino no fue fácil. La normativa costarricense sobre el cáñamo industrial era inexistente en ese momento. El grupo contrató asesoría legal, se reunió con el Ministerio de Agricultura y Ganadería (MAG) y con el SENASA, y comenzó a construir el marco regulatorio junto a las autoridades.

En enero de 2021, CoopeHemp R.L. fue oficialmente inscrita en el Registro de Cooperativas del INFOCOOP, con 52 asociados fundadores.

### Hoy

Hoy somos más de 50 productores activos en las 7 provincias del país, con más de 320 hectáreas bajo cultivo y 15+ productos en desarrollo. Pero más que las cifras, lo que nos define es la comunidad: vecinos que se ayudan, que comparten técnicas, que celebran juntos las cosechas y que aprenden de los errores colectivamente.
        `,
      },
      {
        locale: "en",
        title: "How CoopeHemp Was Born: The Story of a Community That Bet on Hemp",
        excerpt:
          "Over 50 Costa Rican farmers joined forces with a common goal: to grow hemp sustainably and build a better future for their families.",
        content: `
## The Beginning of a Collective Dream

In 2020, a group of farmers from the provinces of Cartago, Heredia, and Alajuela began meeting to talk about a plant that promised to change their reality: industrial hemp. Many came from traditional crops that had lost profitability; others were young entrepreneurs seeking sustainable alternatives.

The idea was simple but ambitious: form a cooperative that would allow them to share knowledge, reduce costs, and access markets that would be impossible to reach individually.

### First Steps

The road was not easy. Costa Rican regulations on industrial hemp were nonexistent at the time. The group hired legal advice, met with the Ministry of Agriculture (MAG) and SENASA, and began building the regulatory framework alongside authorities.

In January 2021, CoopeHemp R.L. was officially registered in the INFOCOOP Cooperative Registry, with 52 founding associates.

### Today

Today we have more than 50 active producers across all 7 provinces of the country, with over 320 hectares under cultivation and 15+ products in development. But more than the numbers, what defines us is the community: neighbors who help each other, share techniques, celebrate harvests together, and learn from mistakes collectively.
        `,
      },
    ],
  },

  {
    slug: "hempcrete-construccion-sostenible",
    cover_image: "/hemp-field.jpg",
    category: "Construcción",
    author_name: "Ing. Carlos Ruiz",
    published_at: daysAgo(18),
    translations: [
      {
        locale: "es",
        title: "Hempcrete: el material de construcción del futuro ya está aquí",
        excerpt:
          "El hempcrete combina la agramiza del cáñamo con cal para crear un material de construcción ignífugo, aislante y con huella de carbono negativa.",
        content: `
## ¿Qué es el hempcrete?

El hempcrete (o cañacrete) es un biocompuesto creado mezclando agramiza de cáñamo (el núcleo leñoso del tallo) con cal hidráulica y agua. El resultado es un material de construcción liviano, altamente aislante y que, a diferencia del concreto convencional, **absorbe CO₂ de la atmósfera** durante todo su ciclo de vida.

### Propiedades destacadas

| Propiedad | Hempcrete | Concreto convencional |
|-----------|-----------|----------------------|
| Peso (kg/m³) | 300–500 | 2 400 |
| Aislamiento térmico | Excelente | Bajo |
| Huella de carbono | Negativa | Alta |
| Resistencia al fuego | Alta | Moderada |
| Biodegradabilidad | Sí | No |

### El proyecto CoopeHemp en Alajuela

Uno de nuestros asociados, don Juan Pablo Fonseca, construyó en 2024 una bodega agrícola de 200 m² usando hempcrete producido con la agramiza de su propio campo. El resultado: una estructura fresca en verano, cálida en época lluviosa, y con un ahorro energético estimado del 40% respecto a una construcción convencional.

El costo por m² fue un 15% mayor al del bloque de cemento, pero el ahorro en climatización y el valor de reventa compensa la inversión en menos de 5 años.

### El potencial en Costa Rica

Con zonas costeras que demandan aislamiento térmico y una crisis de vivienda asequible, el hempcrete tiene un potencial enorme en el mercado costarricense. CoopeHemp está en conversaciones con el Ministerio de Vivienda para incluir este material en los estándares de construcción sostenible del país.
        `,
      },
      {
        locale: "en",
        title: "Hempcrete: The Building Material of the Future Is Already Here",
        excerpt:
          "Hempcrete combines hemp hurd with lime to create a fire-resistant, insulating building material with a negative carbon footprint.",
        content: `
## What Is Hempcrete?

Hempcrete is a biocomposite created by mixing hemp hurd (the woody core of the stalk) with hydraulic lime and water. The result is a lightweight, highly insulating building material that, unlike conventional concrete, **absorbs CO₂ from the atmosphere** throughout its entire lifecycle.

### Key Properties

| Property | Hempcrete | Conventional Concrete |
|----------|-----------|----------------------|
| Weight (kg/m³) | 300–500 | 2,400 |
| Thermal insulation | Excellent | Low |
| Carbon footprint | Negative | High |
| Fire resistance | High | Moderate |
| Biodegradability | Yes | No |

### The CoopeHemp Project in Alajuela

In 2024, one of our associates, Juan Pablo Fonseca, built a 200 m² agricultural storage facility using hempcrete produced from hurd off his own field. The result: a structure that stays cool in summer and warm in the rainy season, with an estimated 40% energy savings compared to conventional construction.

The cost per m² was 15% higher than cement block, but savings in climate control and resale value offset the investment in less than 5 years.
        `,
      },
    ],
  },

  {
    slug: "cbd-salud-ciencia",
    cover_image: "/hemp-oil.jpg",
    category: "Medicinal",
    author_name: "Dra. Sofía Ureña",
    published_at: daysAgo(25),
    translations: [
      {
        locale: "es",
        title: "CBD y salud: qué dice la ciencia en 2025",
        excerpt:
          "Revisamos la evidencia científica más reciente sobre el cannabidiol: dolores crónicos, ansiedad, epilepsia y lo que aún no sabemos.",
        content: `
## El cannabidiol bajo la lupa científica

El CBD (cannabidiol) es uno de más de 100 cannabinoides presentes en la planta de cannabis. A diferencia del THC, no produce efectos psicoactivos, lo que lo convierte en el centro de una intensa actividad de investigación médica en todo el mundo.

### Lo que la evidencia respaldada

**Epilepsia refractaria**: El caso más robusto. La FDA de Estados Unidos aprobó en 2018 el medicamento Epidiolex (CBD puro) para el tratamiento del síndrome de Dravet y el síndrome de Lennox-Gastaut. Estudios clínicos mostraron una reducción de hasta el 41% en la frecuencia de convulsiones.

**Ansiedad**: Múltiples ensayos clínicos de fase II muestran reducción significativa en escalas de ansiedad (GAD-7, HAMD) con dosis de 300–600 mg/día. Sin embargo, los estudios a largo plazo siguen siendo escasos.

**Dolor crónico**: La evidencia es prometedora pero heterogénea. Mejor respuesta en dolores neuropáticos que en dolores inflamatorios.

**Sueño**: Dosis bajas (25–75 mg) parecen mejorar la calidad del sueño en personas con ansiedad asociada; dosis altas pueden tener el efecto contrario.

### Lo que aún no sabemos

- Dosis óptimas para condiciones específicas
- Interacciones con medicamentos de uso común (especialmente anticoagulantes)
- Efectos del uso a largo plazo
- Biodisponibilidad según la vía de administración (oral vs. sublingual vs. tópico)

### El rol de CoopeHemp

Los asociados de CoopeHemp que cultivan variedades ricas en CBD trabajan en colaboración con la Universidad de Costa Rica para caracterizar los perfiles cannabinoides de sus plantas. El objetivo: sentar las bases científicas para productos medicinales de calidad farmacéutica producidos localmente.
        `,
      },
      {
        locale: "en",
        title: "CBD and Health: What Science Says in 2025",
        excerpt:
          "We review the most recent scientific evidence on cannabidiol: chronic pain, anxiety, epilepsy, and what we still don't know.",
        content: `
## Cannabidiol Under the Microscope

CBD (cannabidiol) is one of over 100 cannabinoids found in the cannabis plant. Unlike THC, it produces no psychoactive effects, making it the center of intense medical research worldwide.

### Evidence-Backed Uses

**Refractory epilepsy**: The strongest case. The US FDA approved Epidiolex (pure CBD) in 2018 for Dravet syndrome and Lennox-Gastaut syndrome. Clinical studies showed up to a 41% reduction in seizure frequency.

**Anxiety**: Multiple Phase II clinical trials show significant reduction in anxiety scales (GAD-7, HAMD) at doses of 300–600 mg/day. However, long-term studies remain scarce.

**Chronic pain**: Evidence is promising but heterogeneous. Better response in neuropathic pain than inflammatory pain.

**Sleep**: Low doses (25–75 mg) appear to improve sleep quality in people with associated anxiety; high doses may have the opposite effect.

### What We Still Don't Know

- Optimal doses for specific conditions
- Interactions with common medications (especially anticoagulants)
- Long-term use effects
- Bioavailability across administration routes (oral vs. sublingual vs. topical)
        `,
      },
    ],
  },

  {
    slug: "canamo-cosmetica-revolucion-natural",
    cover_image: "/hemp-leaves-vertical.jpg",
    category: "Cosmética",
    author_name: "Andrea Bonilla",
    published_at: daysAgo(33),
    translations: [
      {
        locale: "es",
        title: "Cáñamo en cosmética: la revolución verde que transforma la belleza",
        excerpt:
          "El aceite de semilla de cáñamo y los extractos de CBD están redefiniendo la industria cosmética. Conocé los productos que ya están cambiando la rutina de cuidado personal.",
        content: `
## La piel, el mayor órgano del cuerpo, merece lo mejor

El sistema endocannabinoide no se limita al cerebro. La piel tiene receptores CB1 y CB2 que interactúan con los cannabinoides, lo que abre una ventana terapéutica y cosmética sin precedentes.

### Aceite de semilla de cáñamo: hidratación de alto nivel

A diferencia del aceite de CBD (extraído de la flor), el aceite de semilla de cáñamo no contiene cannabinoides significativos. Sin embargo, su composición lipídica es excepcional:

- **Ácido linoleico (omega-6)**: 55–60% — barrera cutánea y anti-inflamatorio
- **Ácido α-linolénico (omega-3)**: 15–25% — propiedades anti-envejecimiento
- **Ácido gamma-linolénico (GLA)**: 2–4% — único entre los aceites vegetales, clave para pieles con acné y eczema

El índice comedogénico es 0, lo que significa que no obstruye poros. Ideal para pieles grasas y mixtas.

### Productos CBD tópicos

Los extractos ricos en CBD en formulaciones tópicas (cremas, serums, bálsamos) muestran propiedades:
- **Anti-inflamatorias**: reducción de enrojecimiento y sensibilidad
- **Reguladoras del sebo**: menos producción de grasa en pieles acneicas
- **Analgésicas locales**: alivio de dolores musculares y articulares

### Línea CoopeHemp: en desarrollo

Con la agramiza de cáñamo como exfoliante natural y el aceite de semilla como base, los asociados de CoopeHemp están desarrollando una línea de cosmética 100% costarricense, sin parabenos, sin sulfatos y con trazabilidad completa desde la semilla hasta el frasco.
        `,
      },
      {
        locale: "en",
        title: "Hemp in Cosmetics: The Green Revolution Transforming Beauty",
        excerpt:
          "Hemp seed oil and CBD extracts are redefining the cosmetics industry. Discover the products already changing personal care routines.",
        content: `
## The Skin — The Body's Largest Organ — Deserves the Best

The endocannabinoid system isn't limited to the brain. Skin has CB1 and CB2 receptors that interact with cannabinoids, opening an unprecedented therapeutic and cosmetic window.

### Hemp Seed Oil: High-Level Hydration

Unlike CBD oil (extracted from the flower), hemp seed oil contains no significant cannabinoids. However, its lipid composition is exceptional:

- **Linoleic acid (omega-6)**: 55–60% — skin barrier and anti-inflammatory
- **α-Linolenic acid (omega-3)**: 15–25% — anti-aging properties
- **Gamma-linolenic acid (GLA)**: 2–4% — unique among vegetable oils, key for acne-prone and eczema skin

The comedogenic index is 0, meaning it won't clog pores. Ideal for oily and combination skin.

### Topical CBD Products

CBD-rich extracts in topical formulations (creams, serums, balms) show:
- **Anti-inflammatory** properties: reduced redness and sensitivity
- **Sebum-regulating**: less oil production in acne-prone skin
- **Local analgesic**: relief from muscle and joint pain

### CoopeHemp Line: In Development

Using hemp hurd as a natural exfoliant and seed oil as a base, CoopeHemp associates are developing a 100% Costa Rican cosmetics line — paraben-free, sulfate-free, and with full traceability from seed to bottle.
        `,
      },
    ],
  },

  {
    slug: "normativa-canamo-costa-rica-2025",
    cover_image: "/hemp-fiber-roll.jpg",
    category: "Normativa",
    author_name: "Lic. Rodrigo Mora",
    published_at: daysAgo(40),
    translations: [
      {
        locale: "es",
        title: "Marco normativo del cáñamo en Costa Rica: guía actualizada 2025",
        excerpt:
          "Todo lo que necesitás saber sobre los permisos, licencias y regulaciones para cultivar y comercializar cáñamo industrial en Costa Rica.",
        content: `
## El marco legal en evolución

Costa Rica ha dado pasos significativos hacia la regulación del cáñamo industrial en los últimos años. Aquí un resumen de las principales normas vigentes en 2025.

### Ley de Cannabis y Derivados (Ley 9967)

Aprobada en 2023, esta ley establece el marco general para el uso medicinal, industrial y científico del cannabis en Costa Rica. Para el cáñamo industrial (THC ≤ 0.3%), permite:

- Cultivo con licencia del SENASA
- Procesamiento y transformación
- Exportación de productos derivados
- Investigación científica

### Requisitos para licencia de cultivo

1. **Persona física o jurídica** debidamente inscrita
2. **Póliza de seguro** agrícola activa
3. **Plan de manejo** del cultivo aprobado por el MAG
4. **Análisis de semillas** certificadas con THC ≤ 0.3%
5. **Inspección previa** del terreno por SENASA
6. Pago de **tarifa de licencia**: ₡185 000/año para pequeños productores

### Lo que CoopeHemp hace por sus asociados

CoopeHemp R.L. cuenta con un departamento legal que acompaña a cada asociado en el proceso de obtención de licencias, desde la documentación inicial hasta la renovación anual. La cooperativa negocia también contratos colectivos con SENASA para reducir los tiempos de inspección.

### Cambios esperados para 2025–2026

El MEIC trabaja en una normativa específica para productos cosméticos derivados del cáñamo. Se espera que en 2026 Costa Rica tenga un marco completo que permita la exportación directa de extractos de CBD a mercados europeos y estadounidenses.
        `,
      },
      {
        locale: "en",
        title: "Hemp Regulatory Framework in Costa Rica: Updated Guide 2025",
        excerpt:
          "Everything you need to know about permits, licenses, and regulations for cultivating and commercializing industrial hemp in Costa Rica.",
        content: `
## The Evolving Legal Framework

Costa Rica has taken significant steps toward regulating industrial hemp in recent years. Here is a summary of the main regulations in force in 2025.

### Cannabis and Derivatives Law (Law 9967)

Approved in 2023, this law establishes the general framework for medicinal, industrial, and scientific use of cannabis in Costa Rica. For industrial hemp (THC ≤ 0.3%), it allows:

- Cultivation with a SENASA license
- Processing and transformation
- Export of derived products
- Scientific research

### Cultivation License Requirements

1. **Individual or corporate entity** duly registered
2. **Active agricultural insurance** policy
3. **Crop management plan** approved by MAG
4. **Certified seed analysis** with THC ≤ 0.3%
5. **Prior site inspection** by SENASA
6. **License fee** payment: ₡185,000/year for small producers

### What CoopeHemp Does for Its Associates

CoopeHemp R.L. has a legal department that accompanies each associate through the licensing process, from initial documentation to annual renewal. The cooperative also negotiates collective contracts with SENASA to reduce inspection turnaround times.
        `,
      },
    ],
  },

  {
    slug: "fibra-canamo-moda-sostenible",
    cover_image: "/hemp-fiber-roll.jpg",
    category: "Cultivo",
    author_name: "María Fernanda Ureña",
    published_at: daysAgo(48),
    translations: [
      {
        locale: "es",
        title: "Fibra de cáñamo: la revolución silenciosa en la moda sostenible",
        excerpt:
          "Mientras la industria textil busca alternativas al algodón y el poliéster, la fibra de cáñamo emerge como la opción más completa: resistente, suave, biodegradable.",
        content: `
## El problema con el algodón convencional

El algodón ocupa solo el 2.5% de la tierra agrícola mundial pero consume el 16% de todos los pesticidas del planeta. Además, requiere entre 10 000 y 20 000 litros de agua por kilogramo de fibra producida.

El poliéster, derivado del petróleo, no es mejor: libera microfibras plásticas en cada lavado y tarda siglos en degradarse.

## La fibra de cáñamo, una alternativa superior

| Característica | Algodón | Poliéster | Cáñamo |
|---------------|---------|-----------|--------|
| Agua (L/kg) | 15 000 | 125 | 300–500 |
| Pesticidas | Alto | Petroquímico | Casi nulo |
| Biodegradable | Sí | No | Sí |
| Durabilidad | Media | Alta | Alta |
| Suavidad | Alta | Variable | Media-Alta* |

*La fibra de cáñamo se ablanda significativamente con cada lavado.

### El proceso en CoopeHemp

1. **Cosecha**: La planta se corta cuando la fibra alcanza su madurez óptima (40–60 días post-siembra).
2. **Enriado**: Las plantas se dejan en el campo 2–4 semanas para que microorganismos separen la fibra del tallo.
3. **Agramizado**: Proceso mecánico que separa la fibra bast del hurd leñoso.
4. **Peinado y clasificación**: La fibra se clasifica por longitud y finura.

El producto final se comercializa a talleres textiles artesanales en San José y a empresas de exportación que fabrican ropa hemp para marcas internacionales.
        `,
      },
      {
        locale: "en",
        title: "Hemp Fiber: The Silent Revolution in Sustainable Fashion",
        excerpt:
          "As the textile industry seeks alternatives to cotton and polyester, hemp fiber emerges as the most complete option: durable, soft, and biodegradable.",
        content: `
## The Problem with Conventional Cotton

Cotton occupies only 2.5% of the world's farmland but consumes 16% of all pesticides on the planet. It also requires between 10,000 and 20,000 liters of water per kilogram of fiber produced.

Polyester, derived from petroleum, is no better: it releases plastic microfibers with every wash and takes centuries to break down.

## Hemp Fiber: A Superior Alternative

| Feature | Cotton | Polyester | Hemp |
|---------|--------|-----------|------|
| Water (L/kg) | 15,000 | 125 | 300–500 |
| Pesticides | High | Petrochemical | Near zero |
| Biodegradable | Yes | No | Yes |
| Durability | Medium | High | High |
| Softness | High | Variable | Medium-High* |

*Hemp fiber softens significantly with each wash.

### The Process at CoopeHemp

1. **Harvest**: The plant is cut when the fiber reaches optimal maturity (40–60 days post-sowing).
2. **Retting**: Plants are left in the field 2–4 weeks for microorganisms to separate fiber from stalk.
3. **Decortication**: Mechanical process separating bast fiber from the woody hurd.
4. **Combing and grading**: Fiber is classified by length and fineness.
        `,
      },
    ],
  },

  {
    slug: "temporada-siembra-2025",
    cover_image: "/hands-soil-group.jpg",
    category: "Comunidad",
    author_name: "Luisa Araya",
    published_at: daysAgo(55),
    translations: [
      {
        locale: "es",
        title: "Temporada de siembra 2025: lo que aprendimos en nuestros primeros campos",
        excerpt:
          "Reflexiones desde el campo: los éxitos, los errores y las lecciones de la temporada de siembra más ambiciosa de CoopeHemp hasta la fecha.",
        content: `
## El campo como aula

La teoría es indispensable, pero el campo es el mejor maestro. En la temporada 2025, CoopeHemp coordinó la siembra simultánea de 85 hectáreas distribuidas entre 18 fincas en 4 provincias. Los resultados fueron mixtos, y eso nos enseñó más de lo que esperábamos.

### Lo que funcionó

**Variedades adaptadas al trópico**: Las variedades Futura 75 y Carmagnola se adaptaron bien a las condiciones de Cartago y Heredia, con rendimientos de fibra de 3.8–4.2 toneladas por hectárea.

**Sistema de riego por goteo**: Las fincas que implementaron riego por goteo redujeron el consumo de agua en un 60% y tuvieron plantas más uniformes.

**Red de intercambio entre fincas**: El programa de visitas cruzadas entre fincas permitió que los productores novatos aprendieran directamente de los más experimentados.

### Lo que ajustamos

**Densidad de siembra**: Sembramos demasiado denso en algunas parcelas buscando maximizar rendimiento. El resultado fue plantas más débiles y mayor incidencia de hongos. Reducimos de 60 a 45 kg/ha de semilla para la segunda siembra del año.

**Gestión del enriado**: En las zonas más lluviosas de Limón, el proceso de enriado fue inconsistente debido a la humedad excesiva. Estamos explorando alternativas de enriado controlado en cámara.

### Mirando hacia 2026

Con las lecciones de esta temporada, proyectamos ampliar a 200 hectáreas en 2026, incorporar 12 nuevos asociados y lanzar nuestro primer lote de aceite de cáñamo certificado para el mercado nacional.
        `,
      },
      {
        locale: "en",
        title: "2025 Growing Season: What We Learned in Our First Fields",
        excerpt:
          "Reflections from the field: the successes, mistakes, and lessons from CoopeHemp's most ambitious growing season to date.",
        content: `
## The Field as Classroom

Theory is indispensable, but the field is the best teacher. In the 2025 season, CoopeHemp coordinated the simultaneous sowing of 85 hectares across 18 farms in 4 provinces. Results were mixed — and that taught us more than we expected.

### What Worked

**Tropically adapted varieties**: Futura 75 and Carmagnola varieties adapted well to Cartago and Heredia conditions, with fiber yields of 3.8–4.2 tonnes per hectare.

**Drip irrigation**: Farms that implemented drip irrigation reduced water consumption by 60% and had more uniform plants.

**Cross-farm exchange network**: The cross-visit program allowed novice producers to learn directly from more experienced ones.

### What We Adjusted

**Planting density**: We planted too densely in some plots trying to maximize yield. The result was weaker plants and higher fungal incidence. We reduced from 60 to 45 kg/ha of seed for the second planting of the year.

**Retting management**: In the rainier areas of Limón, the retting process was inconsistent due to excess humidity. We're exploring controlled-chamber retting alternatives.
        `,
      },
    ],
  },

  {
    slug: "semillas-canamo-superalimento",
    cover_image: "/hemp-plant.jpg",
    category: "Nutrición",
    author_name: "Dra. Valeria Solano",
    published_at: daysAgo(62),
    translations: [
      {
        locale: "es",
        title: "Semillas de cáñamo: el superalimento del siglo XXI",
        excerpt:
          "Proteínas completas, grasas saludables, minerales y fibra dietética. Las semillas de cáñamo son uno de los alimentos más nutricionalmente completos que existen.",
        content: `
## El perfil nutricional que impresiona

30 gramos de semillas de cáñamo peladas contienen:

- **Proteína**: 9.5 g (con todos los aminoácidos esenciales)
- **Grasa total**: 14.5 g (90% insaturada)
- **Omega-6 (LA)**: 8 g
- **Omega-3 (ALA)**: 2.5 g
- **Fibra**: 1.2 g
- **Magnesio**: 210 mg (50% del valor diario)
- **Zinc**: 3 mg (27% del valor diario)
- **Hierro**: 2.4 mg (13% del valor diario)

### La proteína más completa del reino vegetal

Las semillas de cáñamo contienen todos los aminoácidos esenciales, incluyendo lisina, metionina y cisteína — los que más escasean en las dietas basadas en plantas. La proteína edestina, propia del cáñamo, es la más similar a la proteína del plasma humano, lo que facilita enormemente su digestión y asimilación.

### Cómo incorporarlas

- **Crudas**: Espolvoréalas sobre ensaladas, yogur o fruta.
- **En licuados**: 2–3 cucharadas elevan el contenido proteico de cualquier batido.
- **Aceite**: Perfecto para aderezos fríos (no resistente al calor).
- **Harina**: Sustituye hasta el 30% de la harina en repostería.
- **Leche vegetal**: Una taza de semillas + 3 tazas de agua = leche de cáñamo cremosa.

### La visión de CoopeHemp

Varios de nuestros asociados procesan semillas para la elaboración de mantequilla de cáñamo, granolas y harinas que se comercializan en ferias de productos orgánicos y tiendas naturistas en San José, Heredia y Liberia.
        `,
      },
      {
        locale: "en",
        title: "Hemp Seeds: The Superfood of the 21st Century",
        excerpt:
          "Complete proteins, healthy fats, minerals, and dietary fiber. Hemp seeds are one of the most nutritionally complete foods that exist.",
        content: `
## The Impressive Nutritional Profile

30 grams of hulled hemp seeds contain:

- **Protein**: 9.5 g (with all essential amino acids)
- **Total fat**: 14.5 g (90% unsaturated)
- **Omega-6 (LA)**: 8 g
- **Omega-3 (ALA)**: 2.5 g
- **Fiber**: 1.2 g
- **Magnesium**: 210 mg (50% of daily value)
- **Zinc**: 3 mg (27% of daily value)
- **Iron**: 2.4 mg (13% of daily value)

### The Most Complete Plant Protein

Hemp seeds contain all essential amino acids, including lysine, methionine, and cysteine — those most lacking in plant-based diets. Hemp's edestin protein is the most similar to human plasma protein, making it exceptionally easy to digest and assimilate.

### How to Use Them

- **Raw**: Sprinkle over salads, yogurt, or fruit.
- **In smoothies**: 2–3 tablespoons boost the protein content of any shake.
- **Oil**: Perfect for cold dressings (not heat-resistant).
- **Flour**: Replaces up to 30% of flour in baking.
- **Plant milk**: One cup of seeds + 3 cups of water = creamy hemp milk.
        `,
      },
    ],
  },

  {
    slug: "mercado-canamo-latinoamerica-2025",
    cover_image: "/hemp-gummies.jpg",
    category: "Mercado",
    author_name: "Lic. Fernando Castro",
    published_at: daysAgo(70),
    translations: [
      {
        locale: "es",
        title: "El mercado del cáñamo en Latinoamérica: oportunidades y desafíos en 2025",
        excerpt:
          "El mercado global del cáñamo proyecta superar los USD 18 000 millones para 2027. ¿Cuánto puede capturar Costa Rica y la región?",
        content: `
## Un mercado en expansión explosiva

Según Grand View Research, el mercado global de cáñamo industrial alcanzó los USD 6 800 millones en 2024 y crecerá a una tasa compuesta anual (CAGR) del 16.2% hasta 2030. Los segmentos con mayor crecimiento son: CBD (medicinal y cosmético), alimentos y bebidas, y materiales de construcción.

### El mapa latinoamericano

| País | Estado regulatorio | Fortaleza |
|------|--------------------|-----------|
| Colombia | Exporta flor y extractos | Licencias ágiles, clima ideal |
| Uruguay | Regulado desde 2013 | Marco maduro, mercado interno pequeño |
| Argentina | En transición | Gran capacidad agrícola |
| Costa Rica | Ley 9967 (2023) | Imagen verde, acceso a mercados EU y EE.UU. |
| México | En proceso | Mercado interno enorme |
| Brasil | Importación solo | Mayor consumidor potencial |

### La ventaja costarricense

Costa Rica tiene dos activos únicos en este mercado:
1. **Reputación de sostenibilidad**: La marca "Costa Rica verde" es reconocida globalmente y facilita la colocación de productos en mercados premium.
2. **Tratados comerciales**: El CAFTA-DR y el acuerdo con la Unión Europea dan acceso preferencial a los dos mayores mercados de cáñamo del mundo.

### El rol de CoopeHemp

CoopeHemp ha establecido contactos con importadores en Alemania, Países Bajos y California para exportar aceite de semilla de cáñamo y fibra textil en 2026. La certificación orgánica SENASA es la llave de entrada a estos mercados.
        `,
      },
      {
        locale: "en",
        title: "The Hemp Market in Latin America: Opportunities and Challenges in 2025",
        excerpt:
          "The global hemp market is projected to exceed USD 18 billion by 2027. How much can Costa Rica and the region capture?",
        content: `
## An Explosively Expanding Market

According to Grand View Research, the global industrial hemp market reached USD 6.8 billion in 2024 and will grow at a compound annual growth rate (CAGR) of 16.2% through 2030. The fastest-growing segments are: CBD (medicinal and cosmetic), food and beverages, and building materials.

### The Latin American Map

| Country | Regulatory Status | Strength |
|---------|------------------|---------|
| Colombia | Exports flower and extracts | Agile licensing, ideal climate |
| Uruguay | Regulated since 2013 | Mature framework, small domestic market |
| Argentina | In transition | Large agricultural capacity |
| Costa Rica | Law 9967 (2023) | Green image, EU and US market access |
| Mexico | In process | Enormous domestic market |
| Brazil | Import only | Largest potential consumer |

### The Costa Rican Advantage

Costa Rica has two unique assets in this market:
1. **Sustainability reputation**: The "Green Costa Rica" brand is globally recognized and facilitates product placement in premium markets.
2. **Trade agreements**: CAFTA-DR and the EU agreement provide preferential access to the world's two largest hemp markets.

### CoopeHemp's Role

CoopeHemp has established contacts with importers in Germany, the Netherlands, and California to export hemp seed oil and textile fiber in 2026. SENASA organic certification is the key to entering these markets.
        `,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Newsletter sample subscribers
// ---------------------------------------------------------------------------

const SUBSCRIBERS = [
  { email: "ana.productora@coopehemp.cr", locale: "es" },
  { email: "rodrigo.mora@coopehemp.cr", locale: "es" },
  { email: "demo.subscriber@example.com", locale: "en" },
]

// ---------------------------------------------------------------------------
// Exec entry point
// ---------------------------------------------------------------------------

export default async function seedDatabase({
  container,
}: {
  container: MedusaContainer
}) {
  console.log("\n🌱 Iniciando seed de CoopeHemp...\n")

  // ── Blog posts ────────────────────────────────────────────────────────────
  const blogService: BlogModuleService = container.resolve(BLOG_MODULE)

  const [existingPosts] = await blogService.listAndCountBlogPosts({}, { take: 1 })
  if (existingPosts.length > 0) {
    console.log("⚠️  Ya existen blog posts en la base de datos. Saltando seed de blog.")
  } else {
    console.log(`📝 Creando ${POSTS.length} artículos del blog...`)
    for (const post of POSTS) {
      await blogService.createBlogPosts({
        ...post,
        is_published: true,
      })
      console.log(`   ✓ "${post.translations[0].title}"`)
    }
  }

  // ── Newsletter subscribers ────────────────────────────────────────────────
  const newsletterService: NewsletterModuleService =
    container.resolve(NEWSLETTER_MODULE)

  const [existingSubs] = await newsletterService.listAndCountNewsletterSubscribers(
    {},
    { take: 1 }
  )
  if (existingSubs.length > 0) {
    console.log("⚠️  Ya existen suscriptores. Saltando seed de newsletter.")
  } else {
    console.log(`\n📧 Creando ${SUBSCRIBERS.length} suscriptores de muestra...`)
    for (const sub of SUBSCRIBERS) {
      // generate a simple token
      const token = Buffer.from(`${sub.email}-${Date.now()}`).toString("base64url")
      await newsletterService.createNewsletterSubscribers({
        email: sub.email,
        locale: sub.locale,
        is_active: true,
        unsubscribe_token: token,
      })
      console.log(`   ✓ ${sub.email}`)
    }
  }

  console.log("\n✅ Seed completado con éxito.\n")
}
