import { useEffect, useState } from 'react';
import { WelcomeSplash } from './components/common/WelcomeSplash';
import logoVexor from './assets/images/logo-Vexor.png';
import autojobProject from './assets/images/autojob-proyecto.png';
import autojobDiagrama from './assets/images/autojob-diagrama.svg';
import papelcolorProject from './assets/images/papelcolor-proyecto.png';
import papelcolorDiagrama from './assets/images/papelcolor-diagrama.svg';
import { useWebMetrics } from './hooks/useWebMetrics';
import { useContacto } from './features/contacto/hooks/useContacto';
import { JsonLd } from './components/Seo/JsonLd';

const projectSlides = [autojobProject, autojobDiagrama];

const papelcolorProjectDetails = {
  title: 'PapelColor OS',
  summary: 'Sistema de gestión para ventas, inventario, impresión y control operativo de un negocio comercial con flujo de trabajo enfocado en productividad.',
  highlights: ['POS', 'Inventario', 'Impresión', 'KPI y versiones'],
  image: papelcolorProject,
  diagram: papelcolorDiagrama,
};

const projectCards = [
  {
    title: 'AutoJob',
    summary: 'Sistema de búsqueda laboral automatizada que centraliza vacantes, filtra oportunidades y acelera la postulación con control y trazabilidad.',
  },
  {
    title: 'Solución',
    summary: 'Desarrollo de un software integral de automatización e integración de APIs para centralizar y acelerar el ciclo de postulación, con búsqueda inteligente de vacantes, extracción de contactos, envío automatizado de propuestas y alertas en tiempo real vía Telegram.',
  },
  {
    title: 'Objetivo e impacto',
    summary: 'Objetivo principal: maximizar la tasa de postulaciones efectivas, eliminar el tiempo operativo manual y mantener un control de auditoría instantáneo sobre cada proceso. El resultado es una reducción significativa del tiempo, mayor trazabilidad y una ejecución más precisa en cada envío.',
  },
];

const cvHighlights = [
  'Diseñamos e implementamos infraestructura digital de alto rendimiento para empresas en crecimiento.',
  'Convertimos procesos operativos lentos en ecosistemas automatizados, rentables y escalables.',
  'Desarrollo de software a medida, automatización con IA, bots y sistemas de gestión centralizada.',
  'Arquitectura cloud moderna, soporte técnico dedicado y enfoque en retorno de inversión (ROI).',
];

const cvServices = [
  {
    title: 'Desarrollo de Software a Medida (Web, Desktop & POS)',
    description: 'Construcción de plataformas digitales adaptadas a la operativa real de tu negocio: sistemas POS de escritorio, e-commerce B2B/B2C y aplicaciones web.',
  },
  {
    title: 'Automatización con Inteligencia Artificial & Bots',
    description: 'Integración de APIs inteligentes, scrapers de datos, bots de atención y ventas (WhatsApp/Telegram) y flujos de respuesta automática.',
  },
  {
    title: 'Sistemas de Gestión Centralizada (ERP & CRM)',
    description: 'Centralización de inventarios, bases de datos de clientes, facturación y tableros analíticos en la nube.',
  },
];

const seoSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'VexoraIA',
  description:
    'VexoraIA ofrece automatización ejecutiva con IA, consultoría digital y portafolios web premium para empresas en Colombia y mercados internacionales.',
  url: 'https://vexoraia.com',
  logo: 'https://vexoraia.com/logo-Vexor.png',
  image: 'https://vexoraia.com/og-image.jpg',
  priceRange: '$$$',
  areaServed: ['CO', 'US', 'LATAM'],
  serviceType: [
    'Automatización con IA',
    'Asistentes de Decisión',
    'Portafolio Web Ejecutivo',
    'Consultoría Digital',
  ],
  sameAs: [
    'https://www.facebook.com/people/Vexorai/61594290724202/',
    'https://wa.me/3247635413',
    'https://vexoraia.com',
  ],
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    pais: '',
    mensaje: '',
  });
  const { enviarMensajeFormulario, loading, success, error } = useContacto();
  useWebMetrics();

  useEffect(() => {
    if (showSplash) return;

    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % projectSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [showSplash]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.nombre.trim() || !formData.correo.trim() || !formData.telefono.trim() || !formData.pais.trim() || !formData.mensaje.trim()) {
      return;
    }

    const enviado = await enviarMensajeFormulario(
      formData.nombre.trim(),
      formData.telefono.trim(),
      formData.pais.trim(),
      formData.mensaje.trim(),
      formData.correo.trim(),
    );

    if (enviado) {
      setFormData({
        nombre: '',
        correo: '',
        telefono: '',
        pais: '',
        mensaje: '',
      });
    }
  };

  return (
    <>
      <JsonLd data={seoSchema} />
      <div className="app-shell">
        {showSplash ? (
          <WelcomeSplash onAnimationComplete={() => setShowSplash(false)} />
        ) : (
          <div className="app-main-shell">
            <header className="topbar">
              <div className="brand-wrap">
                <img src={logoVexor} alt="Logo de VexoraIA - automatización ejecutiva con IA" className="brand-logo" />
                <span className="brand-wordmark">VEXORAIA</span>
              </div>

              <nav className="main-nav" aria-label="Navegación principal">
                <a href="#inicio" className="nav-link">Inicio</a>
                <a href="#proyectos" className="nav-link">Proyectos</a>
                <a href="#cv" className="nav-link">Hoja de Vida</a>
                <a href="#contacto" className="nav-link">Contacto</a>
              </nav>
            </header>

            <main className="content-panel">
              <section id="inicio" className="info-section intro-section" aria-label="Sección de inicio">
                <div className="section-header">
                  <span className="eyebrow">VEXORAI</span>
                  <h1 className="page-title">VexoraIA - Automatización Ejecutiva con IA</h1>
                </div>

                <div className="cv-panel">
                  <div>
                    <p className="cv-intro">
                      En VEXORAI llevamos tu empresa al siguiente nivel tecnológico:
                    </p>
                    <ul className="cv-list compact-list">
                      <li>Software a medida: Sistemas POS, web y escritorio.</li>
                      <li>Inteligencia Artificial: Automatización de procesos.</li>
                      <li>Sistemas de gestión: ERP y CRM para inventario y clientes.</li>
                    </ul>
                    <p className="cv-intro highlight-intro">
                      Conectamos empresas.
                    </p>
                    <p className="cv-intro">
                      Diseñamos e implementamos infraestructura digital de alto rendimiento para empresas en crecimiento. Convertimos procesos operativos lentos en ecosistemas automatizados, rentables y 100% escalables.
                    </p>
                  </div>

                  <div className="mission-box">
                    <h3>Misión</h3>
                    <blockquote>
                      “Diseñar, desarrollar e implementar ecosistemas de software, inteligencia artificial e infraestructura digital de alto rendimiento para empresas en crecimiento. Nos enfocamos en transformar procesos operativos complejos y repetitivos en sistemas automatizados, eficientes y escalables, impulsando la rentabilidad y la competitividad de nuestros clientes mediante soluciones tecnológicas innovadoras y a medida.”
                    </blockquote>
                  </div>
                </div>
              </section>

            <section id="proyectos" className="info-section" aria-label="Sección de proyectos">
              <div className="section-header">
                <span className="eyebrow">Proyectos</span>
                <h2>Soluciones que generan impacto.</h2>
                <h3 className="section-subtitle">autojob_bot: Bot de Automatización de Postulaciones Laborales con Google Jobs API y Notificaciones en Tiempo Real </h3>
              </div>

              <div className="project-showcase">
                <div className="project-carousel">
                  <img
                    src={projectSlides[activeSlide]}
                    alt="Proyecto destacado"
                    className="project-slide-image"
                  />
                </div>
              </div>

              <div className="project-grid">
                {projectCards.map((project) => (
                  <article key={project.title} className="project-card">
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                  </article>
                ))}
              </div>

              <div className="project-feature">
                <div className="feature-copy">
                  <span className="eyebrow">Proyecto 02</span>
                  <h3>{papelcolorProjectDetails.title}</h3>
                  <p>{papelcolorProjectDetails.summary}</p>
                  <div className="project-badges">
                    {papelcolorProjectDetails.highlights.map((item) => (
                      <span key={item} className="project-badge">{item}</span>
                    ))}
                  </div>
                </div>

                <div className="feature-visuals">
                  <div className="feature-visual-card">
                    <img src={papelcolorProjectDetails.image} alt="Captura de PapelColor OS" className="feature-main-image" />
                  </div>
                  <div className="feature-visual-card">
                    <img src={papelcolorProjectDetails.diagram} alt="Diagrama del flujo de PapelColor OS" className="feature-diagram" />
                  </div>
                </div>
              </div>
            </section>

            <section id="cv" className="info-section" aria-label="Sección de hoja de vida">
              <div className="section-header">
                <span className="eyebrow">VEXORAI</span>
                <h2>Software &amp; Digital Transformation</h2>
              </div>

              <div className="cv-panel">
                <div className="services-box">
                  <h3>Nuestros servicios</h3>
                  <div className="services-list">
                    {cvServices.map((service) => (
                      <div key={service.title} className="service-item">
                        <strong>{service.title}</strong>
                        <p>{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="why-box">
                  <h3>Por qué elegir VEXORAI</h3>
                  <ol>
                    <li>Soluciones llave en mano: entrega de código fuente documentado, capacitación al equipo y soporte técnico dedicado.</li>
                    <li>Arquitectura cloud escalable: sistemas sobre infraestructura moderna con 99.9% de disponibilidad y alta seguridad.</li>
                    <li>Enfoque en retorno de inversión (ROI): cada desarrollo está orientado a reducir costos operativos o incrementar las ventas.</li>
                  </ol>
                </div>

                <ul className="cv-list">
                  {cvHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="contact-box">
                  <h3>Contacto</h3>
                  <p>¿Listo para digitalizar y escalar tu empresa? Agenda un diagnóstico técnico de 15 minutos con nuestros ingenieros.</p>
                  <p>WhatsApp / Teléfono: +57 3247635413</p>
                  <p>Correo Comercial: vexora907@gmail.com</p>
                  <p>Firma: VEXORAI - Digital Engineering</p>
                </div>
              </div>
            </section>

            <section id="contacto" className="info-section" aria-label="Sección de contacto">
              <div className="section-header">
                <span className="eyebrow">Contacto</span>
                <h2>Hablemos de tu próximo proyecto.</h2>
              </div>

              <div className="contact-panel">
                <a href="mailto:vexora907@gmail.com" className="contact-link">vexora907@gmail.com</a>
                <a
                  href="https://wa.me/3247635413"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link secondary"
                >
                  WhatsApp
                </a>
                <a
                href="https://www.facebook.com/people/Vexorai/61594290724202/"
                target="_blank"
                rel="noreferrer"
                className="contact-link secondary"
                >
                  Facebook
                </a>
              </div>

              <form className="contact-form-card" onSubmit={handleSubmit} aria-label="Formulario de contacto de VexoraIA">
                <div className="form-row">
                  <label className="field">
                    <span>Nombre</span>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={(event) => handleInputChange('nombre', event.target.value)}
                    />
                  </label>

                  <label className="field">
                    <span>Correo electrónico</span>
                    <input
                      type="email"
                      required
                      placeholder="tuemail@ejemplo.com"
                      value={formData.correo}
                      onChange={(event) => handleInputChange('correo', event.target.value)}
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label className="field">
                    <span>Número de contacto</span>
                    <input
                      type="tel"
                      required
                      placeholder="+57 300 000 0000"
                      value={formData.telefono}
                      onChange={(event) => handleInputChange('telefono', event.target.value)}
                    />
                  </label>

                  <label className="field">
                    <span>País</span>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Colombia"
                      value={formData.pais}
                      onChange={(event) => handleInputChange('pais', event.target.value)}
                    />
                  </label>
                </div>

                <label className="field">
                  <span>Describe tu proyecto</span>
                  <textarea
                    rows={5}
                    required
                    placeholder="Cuéntanos brevemente qué quieres desarrollar y cuál es tu objetivo."
                    value={formData.mensaje}
                    onChange={(event) => handleInputChange('mensaje', event.target.value)}
                  />
                </label>

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>

                {success && <p className="form-success">Tu mensaje se envió correctamente.</p>}
                {error && <p className="form-error" role="alert">{error}</p>}
              </form>
            </section>
          </main>

          <footer className="site-footer" aria-label="Pie de página de VexoraIA">
            <p>VexoraIA © {new Date().getFullYear()} · Automatización ejecutiva con IA para empresas.</p>
          </footer>
        </div>
      )}
    </div>
    </>
  );
}
