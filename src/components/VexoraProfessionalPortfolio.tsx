import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronDown,
  Code2,
  Globe,
  LayoutGrid,
  Mail,
  MapPin,
  Menu,
  MonitorSmartphone,
  Palette,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Timer,
  X,
  Zap,
} from 'lucide-react';
import logoVexor from '../assets/images/logo-Vexor.png';
import autojobProject from '../assets/images/autojob-proyecto.png';
import autojobDiagrama from '../assets/images/autojob-diagrama.svg';
import papelcolorProject from '../assets/images/papelcolor-proyecto.png';
import papelcolorDiagrama from '../assets/images/papelcolor-diagrama.svg';
import vexoraPosCapture from '../assets/images/vexora-pos-captura.png';
import papelcolorPosCapture from '../assets/images/papelcolor-pos-captura.png';
import { WelcomeSplash } from './common/WelcomeSplash';
import { JsonLd } from './Seo/JsonLd';
import { useContacto } from '../features/contacto/hooks/useContacto';
import { useWebMetrics } from '../hooks/useWebMetrics';

const projects = [
  { title: 'Vexora POS', category: 'Sistema comercial', desc: 'Ventas, inventario, usuarios y operación centralizada para distintos tipos de negocio.', detail: 'Adaptable a papelería, ferretería, restaurantes, cerrajería, tiendas y ventas de ropa, con control operativo y experiencia web moderna.', icon: <ShoppingCart size={26} />, image: vexoraPosCapture, tag: 'Operación', time: 'A medida' },
  { title: 'PapelColor OS', category: 'Gestión comercial', desc: 'Panel administrativo para ventas, inventario, pedidos, impresión y control operativo.', detail: 'Integra indicadores comerciales, catálogo, productos e inventario en una plataforma diseñada para una operación diaria eficiente.', icon: <LayoutGrid size={26} />, image: papelcolorPosCapture, tag: 'Automatización', time: 'A medida' },
  { title: 'AutoJob', category: 'Automatización laboral', desc: 'Sistema que busca vacantes, centraliza oportunidades y acelera postulaciones con trazabilidad.', detail: 'Combinación de búsquedas automatizadas, extracción de contactos, alertas en tiempo real y auditoría de cada proceso.', icon: <Rocket size={26} />, image: autojobProject, tag: 'IA + Bots', time: 'A medida' },
  { title: 'PapelColor OS', category: 'Sistema de impresión', desc: 'Gestión integrada para ventas, inventario, impresión y control comercial.', detail: 'Arquitectura pensada para centralizar la operación de un negocio y reducir tareas repetitivas.', icon: <MonitorSmartphone size={26} />, image: papelcolorDiagrama, tag: 'POS', time: 'A medida' },
  { title: 'Automatizaciones Vexora', category: 'Integración', desc: 'Flujos inteligentes que conectan APIs, datos, Telegram y procesos empresariales.', detail: 'Diseñamos automatizaciones con seguridad, monitoreo y alertas para eliminar trabajo manual.', icon: <Zap size={26} />, image: autojobDiagrama, tag: 'APIs', time: 'A medida' },
  { title: 'Portafolio empresarial', category: 'Marca digital', desc: 'Presencia profesional para mostrar servicios, proyectos y convertir visitas en contactos.', detail: 'Contenido claro, diseño responsive, SEO técnico y formularios conectados a canales reales.', icon: <Palette size={26} />, image: papelcolorProject, tag: 'Marca', time: '7 días' },
];

const plans = [
  { name: 'Landing Page', cop: '$350.000', usd: '$90', desc: 'Para validar una oferta o lanzar una campaña con una página que convierte.', features: ['1 página', 'Diseño responsive', 'Formulario de contacto', 'Velocidad optimizada', 'WhatsApp integrado'], delivery: 'Entrega en 3 días' },
  { name: 'Portafolio / Negocio', cop: '$750.000', usd: '$190', desc: 'Presencia completa para una empresa o marca personal que necesita verse profesional.', features: ['Hasta 5 páginas', 'SEO básico', 'Panel administrable', 'Formulario + mapa', 'Diseño personalizado'], delivery: 'Entrega en 7 días', featured: true },
  { name: 'Sistema / A Medida', cop: '$1.800.000', usd: '$450', desc: 'Para operar en línea con un sistema construido alrededor de tu negocio.', features: ['Ventas o reservas', 'Pagos o integraciones', 'Panel de administración', 'Gestión de operaciones', 'Capacitación incluida'], delivery: 'Entrega personalizada' },
];

const services = [
  { name: 'Desarrollo de software', pct: 95, note: 'Web, escritorio y POS a medida' },
  { name: 'Automatización e IA', pct: 92, note: 'Bots, APIs y procesos inteligentes' },
  { name: 'Sistemas ERP & CRM', pct: 88, note: 'Inventario, ventas y operación' },
  { name: 'Infraestructura digital', pct: 86, note: 'Cloud, seguridad y despliegue' },
];

const steps = [
  { n: '01', title: 'Diagnóstico', desc: 'Entendemos tu operación, objetivos y público para definir alcance, inversión y prioridades.', icon: <Search size={24} /> },
  { n: '02', title: 'Diseño', desc: 'Diseñamos una solución alineada con tu marca y el recorrido real de tus usuarios.', icon: <Palette size={24} /> },
  { n: '03', title: 'Desarrollo', desc: 'Construimos con código limpio, integración segura y avances verificables.', icon: <Code2 size={24} /> },
  { n: '04', title: 'Entrega', desc: 'Probamos, desplegamos, documentamos y acompañamos el lanzamiento.', icon: <Rocket size={24} /> },
];

const factors = [
  { title: 'Tipo de solución', desc: 'Una landing no tiene la misma complejidad que un POS, ERP o plataforma con pagos.', icon: <Globe size={22} /> },
  { title: 'Cantidad de módulos', desc: 'Inventario, clientes, facturación, reportes y reservas amplían el alcance.', icon: <LayoutGrid size={22} /> },
  { title: 'Diseño personalizado', desc: 'Una identidad propia aumenta el trabajo visual, pero refleja mejor tu marca.', icon: <Palette size={22} /> },
  { title: 'Integraciones', desc: 'WhatsApp, Telegram, APIs externas, pagos y automatizaciones requieren diseño técnico.', icon: <Zap size={22} /> },
  { title: 'Hosting y soporte', desc: 'Dominio, infraestructura, mantenimiento y soporte tienen costos operativos distintos.', icon: <MonitorSmartphone size={22} /> },
];

const seoSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'VexoraIA',
  description: 'Automatización ejecutiva con IA, desarrollo de software y sistemas comerciales para empresas.',
  url: 'https://vexoraia.com',
  logo: 'https://vexoraia.com/logo-Vexor.png',
  areaServed: ['CO', 'US', 'LATAM'],
};

export default function VexoraProfessionalPortfolio() {

  const [showSplash, setShowSplash] = useState(true);
  const [menu, setMenu] = useState(false);
  const [currency, setCurrency] = useState<'COP' | 'USD'>('COP');
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', pais: '', mensaje: '', proyecto: 'Portafolio / Negocio' });
  const formRef = useRef<HTMLFormElement>(null);
  const { enviarMensajeFormulario, loading, success, error } = useContacto();
  useWebMetrics();

  const finishSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    const safetyTimer = window.setTimeout(finishSplash, 8000);
    return () => window.clearTimeout(safetyTimer);
  }, [finishSplash]);

  useEffect(() => {
    const nodes = document.querySelectorAll('.vp-reveal');

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [showAllProjects]);

  const visibleProjects = showAllProjects ? projects : projects.slice(0, 3);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.correo.trim() || !form.telefono.trim() || !form.pais.trim() || !form.mensaje.trim()) return;
    const enviado = await enviarMensajeFormulario(form.nombre.trim(), form.telefono.trim(), form.pais.trim(), form.mensaje.trim(), form.correo.trim(), form.proyecto);
    if (enviado) setForm({ nombre: '', correo: '', telefono: '', pais: '', mensaje: '', proyecto: 'Portafolio / Negocio' });
  };

  const nav = [
    ['Sobre Vexora', '#sobre-vexora'],
    ['Proyectos', '#proyectos'],
    ['Servicios', '#servicios'],
    ['Proceso', '#proceso'],
    ['Contacto', '#contacto'],
  ] as const;

  return (
    <>
      {showSplash && <WelcomeSplash onAnimationComplete={finishSplash} />}
      <JsonLd data={seoSchema} />
      <div className="vp-page min-h-screen antialiased">
        <header className="vp-header">
          <div className="vp-nav-wrap">
            <a className="vp-brand" href="#inicio" aria-label="Ir al inicio">
              <img src={logoVexor} alt="VexoraIA" />
              <span><strong>VexoraIA</strong><small>Digital Engineering</small></span>
            </a>
            <nav className="vp-nav" aria-label="Navegación principal">
              {nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
            </nav>
            <div className="vp-nav-actions">
              <span className="vp-status"><i /> Disponible</span>
              <a className="vp-primary-small" href="#contacto">Cotizar proyecto</a>
              <button className="vp-menu-button" type="button" onClick={() => setMenu((value) => !value)} aria-label="Abrir menú">
                {menu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          {menu && <nav className="vp-mobile-nav">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}</nav>}
        </header>

        <main>
          <section id="inicio" className="vp-hero">
            <div className="vp-orb vp-orb-one" /><div className="vp-orb vp-orb-two" />
            <div className="vp-hero-grid">
              <div>
                <p className="vp-kicker"><Sparkles size={14} /> Automatización ejecutiva · Colombia · 2026</p>
                <h1>VexoraIA <span>Desarrollo, IA y sistemas comerciales</span></h1>
                <p className="vp-hero-copy">Diseñamos software, automatizamos procesos y construimos plataformas que llevan a las empresas al siguiente nivel tecnológico.</p>
                <div className="vp-hero-actions">
                  <a className="vp-primary" href="#proyectos">Ver proyectos <ArrowRight size={17} /></a>
                  <a className="vp-secondary" href="#contacto">Cotizar proyecto <ArrowUpRight size={17} /></a>
                </div>
                <div className="vp-stats">
                  <div><strong>20+</strong><span>Proyectos</span></div>
                  <div><strong>IA</strong><span>Automatización</span></div>
                  <div><strong>100%</strong><span>Enfoque profesional</span></div>
                </div>
                <p className="vp-meta"><span><MapPin size={13} /> Colombia · Trabajo remoto</span><span><ShieldCheck size={13} /> Código seguro y escalable</span></p>
              </div>

              <div className="vp-identity-wrap">
                <div className="vp-identity">
                  <div className="vp-identity-top"><span>Infraestructura digital</span><span className="vp-shield"><ShieldCheck size={18} /></span></div>
                  <img className="vp-identity-logo" src={logoVexor} alt="Logo VexoraIA" />
                  <h2>Diseño + código + inteligencia</h2>
                  <p>Sistemas que se ven bien, operan rápido y protegen tu negocio.</p>
                  <div className="vp-capabilities"><span>✓ Responsive</span><span>✓ Automatización</span><span>✓ Cloud</span><span>✓ Seguridad</span></div>
                  <div className="vp-delivery"><span>Próxima entrega</span><strong>3 a 14 días</strong></div>
                </div>
                <div className="vp-review"><span>★★★★★</span><b>Soluciones profesionales</b></div>
              </div>
            </div>
          </section>

          <section id="sobre-vexora" className="vp-section vp-about">
            <div className="vp-reveal vp-about-grid">
              <div>
                <p className="vp-section-kicker">Sobre VexoraIA</p>
                <h2>Tu operación, convertida en una plataforma que trabaja contigo.</h2>
                <p>Transformamos procesos lentos y repetitivos en ecosistemas digitales eficientes, rentables y escalables.</p>
                <p>Integramos software a medida, inteligencia artificial, sistemas centralizados, bots y infraestructura moderna con un proceso claro y medible.</p>
                <div className="vp-tags">{['Web y POS', 'IA y bots', 'ERP y CRM', 'Responsive', 'SEO', 'Seguridad'].map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              <div className="vp-skills-card">
                <div className="vp-card-heading"><h3>Especialidades</h3><span>Nivel de dominio</span></div>
                <div className="vp-skills">{services.map((service) => <div key={service.name}><div className="vp-skill-label"><strong>{service.name}</strong><b>{service.pct}%</b></div><p>{service.note}</p><div className="vp-progress"><i style={{ width: `${service.pct}%` }} /></div></div>)}</div>
              </div>
            </div>
          </section>

          <section id="proyectos" className="vp-section vp-projects">
            <div className="vp-section-heading vp-reveal"><div><p className="vp-section-kicker">Proyectos</p><h2>Soluciones que generan<br /> impacto real</h2></div><p>Productos y sistemas desarrollados para mejorar operación, ventas y trazabilidad.</p></div>
            <div className="vp-project-grid">{visibleProjects.map((project) => <article key={`${project.title}-${project.category}`} className="vp-project-card vp-reveal"><div className="vp-project-media"><img src={project.image} alt={project.title} /><span>{project.tag}</span></div><div className="vp-project-copy"><p>{project.category} · {project.time}</p><h3>{project.title}</h3><span>{project.desc}</span><button type="button" onClick={() => setSelected(project)}>Ver proyecto <ArrowRight size={16} /></button></div></article>)}</div>
            <button className="vp-view-all" type="button" onClick={() => setShowAllProjects((value) => !value)}>{showAllProjects ? 'Ver menos proyectos' : 'Ver los 6 proyectos'}<ChevronDown size={16} /></button>
          </section>

          <section id="servicios" className="vp-section vp-plans">
            <div className="vp-section-heading vp-reveal vp-centered"><div><p className="vp-section-kicker">Servicios y precios</p><h2>Inversión clara, sin sorpresas</h2><p>El alcance y precio final se confirman según contenido, integraciones y complejidad.</p></div><div className="vp-currency"><button type="button" onClick={() => setCurrency('COP')} className={currency === 'COP' ? 'active' : ''}>Pesos COP</button><button type="button" onClick={() => setCurrency('USD')} className={currency === 'USD' ? 'active' : ''}>Dólares USD</button></div></div>
            <div className="vp-plan-grid">{plans.map((plan) => <article key={plan.name} className={`vp-plan-card vp-reveal ${plan.featured ? 'featured' : ''}`}><div className="vp-plan-heading"><h3>{plan.name}</h3>{plan.featured && <b>MÁS ELEGIDO</b>}</div><p>{plan.desc}</p><div className="vp-price"><strong>{currency === 'COP' ? plan.cop : plan.usd}</strong><span>{currency}</span></div><small><Timer size={14} /> {plan.delivery}</small><ul>{plan.features.map((feature) => <li key={feature}><Check size={13} /> {feature}</li>)}</ul><a href="#contacto">Cotizar {plan.name}</a></article>)}</div>
          </section>

          <section className="vp-section vp-cost">
            <div className="vp-cost-grid">
              <div className="vp-reveal"><p className="vp-section-kicker">Guía transparente</p><h2>¿Qué define el alcance de un sistema?</h2><p>Un proyecto cambia según operaciones, usuarios, integraciones y nivel de automatización.</p><div className="vp-factor-list">{factors.map((factor) => <div key={factor.title}><span>{factor.icon}</span><div><h3>{factor.title}</h3><p>{factor.desc}</p></div></div>)}</div></div>
              <div className="vp-estimate vp-reveal"><p><Sparkles size={16} /> Alcance VexoraIA</p><h3>Diseñamos la solución exacta</h3><div className="vp-estimate-box"><span>Rango típico de proyectos</span><strong>$350.000 – $1.800.000+</strong><small>COP según complejidad</small></div><a href="#contacto">Pedir diagnóstico exacto</a><small>No incluye dominio, hosting anual ni soporte especializado.</small></div>
            </div>
          </section>

          <section id="proceso" className="vp-section vp-process"><div className="vp-section-heading vp-reveal vp-centered"><div><p className="vp-section-kicker">Proceso</p><h2>Simple, claro y sin estrés</h2></div></div><div className="vp-process-grid">{steps.map((step, index) => <article key={step.title} className="vp-process-card vp-reveal"><strong>{step.n}</strong><span>{step.icon}</span><h3>{step.title}</h3><p>{step.desc}</p>{index < 3 && <ArrowRight className="vp-process-arrow" size={18} />}</article>)}</div></section>

          <section id="contacto" className="vp-section vp-contact"><div className="vp-contact-grid"><div className="vp-reveal"><p className="vp-section-kicker">Contacto</p><h2>Hablemos de tu próximo proyecto</h2><p>Cuéntanos qué necesitas y recibirás una propuesta con alcance, inversión y tiempos.</p><div className="vp-contact-list"><div><Mail size={18} /><span><small>Correo comercial</small><strong>vexora907@gmail.com</strong></span></div><div><MapPin size={18} /><span><small>Ubicación</small><strong>Colombia · Trabajo remoto</strong></span></div><div><Timer size={18} /><span><small>Respuesta</small><strong>En menos de 24 horas hábiles</strong></span></div></div></div><form ref={formRef} onSubmit={handleSubmit} className="vp-form vp-reveal" aria-label="Formulario de contacto de VexoraIA"><h3>Solicita tu cotización</h3><p>Completa el formulario y empecemos.</p><div className="vp-form-row"><label>Nombre *<input required value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Tu nombre" /></label><label>Correo electrónico *<input required type="email" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} placeholder="tu@correo.com" /></label></div><div className="vp-form-row"><label>Número de contacto *<input required value={form.telefono} onChange={(event) => setForm({ ...form, telefono: event.target.value })} placeholder="+57 300 000 0000" /></label><label>País *<input required value={form.pais} onChange={(event) => setForm({ ...form, pais: event.target.value })} placeholder="Colombia" /></label></div><label>Tipo de proyecto<select value={form.proyecto} onChange={(event) => setForm({ ...form, proyecto: event.target.value })}><option>Portafolio / Negocio</option><option>Landing Page</option><option>Sistema POS</option><option>Automatización con IA</option><option>ERP / CRM</option><option>Otro proyecto</option></select></label><label>Describe tu proyecto *<textarea required rows={5} value={form.mensaje} onChange={(event) => setForm({ ...form, mensaje: event.target.value })} placeholder="Cuéntanos tu idea, objetivo y plazo..." /></label><button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar solicitud'} <ArrowRight size={17} /></button>{success && <p className="vp-success">Tu mensaje se envió correctamente.</p>}{error && <p className="vp-error" role="alert">{error}</p>}<button type="button" className="vp-example" onClick={() => setExpanded((value) => !value)}>Ver ejemplo de mensaje <ChevronDown size={16} /></button>{expanded && <p className="vp-example-text">Hola VexoraIA, tenemos una empresa y queremos digitalizar ventas e inventario. Queremos lanzar en cuatro semanas.</p>}</form></div></section>
        </main>

        <footer className="vp-footer"><div className="vp-footer-inner"><div><p className="vp-footer-brand"><img src={logoVexor} alt="" /> VexoraIA</p><p>Automatización ejecutiva con IA para empresas.</p></div><nav><a href="#sobre-vexora">Sobre Vexora</a><a href="#proyectos">Proyectos</a><a href="#servicios">Servicios</a><a href="#contacto">Contacto</a></nav><p>VexoraIA © {new Date().getFullYear()} · Digital Engineering</p></div></footer>

        {selected && <div className="vp-modal-backdrop" onMouseDown={() => setSelected(null)}><div className="vp-modal" onMouseDown={(event) => event.stopPropagation()}><div className="vp-modal-media"><img src={selected.image} alt={selected.title} /><button type="button" onClick={() => setSelected(null)} aria-label="Cerrar detalle"><X size={18} /></button></div><div className="vp-modal-copy"><p>{selected.category} · {selected.time}</p><h3>{selected.title}</h3><span>{selected.desc}</span><b>{selected.detail}</b><a href="#contacto" onClick={() => setSelected(null)}>Cotizar un proyecto como este</a></div></div></div>}
      </div>
    </>
  );
}
