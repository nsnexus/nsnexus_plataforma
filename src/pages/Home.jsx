import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { COURSES_DATA, SERVICES_DATA, TESTIMONIALS_DATA } from '../data/platformData';
import { CourseCard } from '../components/CourseCard';
import { ServiceCard } from '../components/ServiceCard';

const SHOWCASE_PROJECTS = [
  {
    id: "proj-1",
    title: "Portal ANS Digital",
    type: "sharepoint",
    badge: "SharePoint & HTML/JS",
    desc: "Substituição completa do Power Apps. Portal de controle operacional leve integrado nativamente no SharePoint Online.",
    metricIcon: "speed",
    metricLabel: "Carregamento instantâneo (< 1s)",
    mediaUrl: "/videos/ans_digital.mp4",
    isClosed: false
  },
  {
    id: "proj-2",
    title: "Dashboard de Kaizens",
    type: "sharepoint",
    badge: "SharePoint & HTML/JS",
    desc: "Dashboard integrado para registro e monitoramento de Kaizens em tempo real, sincronizado de forma automática via SharePoint.",
    metricIcon: "trending_up",
    metricLabel: "Gestão visual de melhorias",
    mediaUrl: "/videos/kaizen.mp4",
    isClosed: false
  },
  {
    id: "proj-3",
    title: "Sistema de Provas DBU",
    type: "sharepoint",
    badge: "SharePoint & HTML/JS",
    desc: "Plataforma de avaliações corporativas integrada ao SharePoint, gerando histórico de notas com painel administrativo para edição.",
    metricIcon: "quiz",
    metricLabel: "Correção automática e relatórios",
    mediaUrl: "/videos/provas_dbu.mp4",
    isClosed: false
  },
  {
    id: "proj-4",
    title: "Gestão Pernambucana",
    type: "web",
    badge: "Sistemas Web",
    desc: "Sistema estilo SaaS para gestão da rotina industrial (retífica, usinagem e mecânica) com cadastro operacional e painel financeiro.",
    metricIcon: "precision_manufacturing",
    metricLabel: "Faturamento e controle industrial",
    mediaUrl: "/videos/pernambucana.mp4",
    isClosed: false
  },
  {
    id: "proj-5",
    title: "Portal Imobiliário",
    type: "web",
    badge: "Criação de Sites",
    desc: "Site imobiliário moderno de alta conversão com catálogo de imóveis interativo, filtros de busca avançados e contato via WhatsApp.",
    metricIcon: "home",
    metricLabel: "Integração direta com WhatsApp",
    mediaUrl: "/videos/imobiliaria.mp4",
    isClosed: false
  },
  {
    id: "proj-6",
    title: "Delivery de Pizzaria",
    type: "web",
    badge: "Criação de Sites",
    desc: "Cardápio interativo e landing page otimizada de delivery para pizzaria, com fechamento de pedidos direto para o WhatsApp comercial.",
    metricIcon: "restaurant",
    metricLabel: "Pedidos e taxas automatizadas",
    mediaUrl: "/videos/pizzaria.mp4",
    isClosed: false
  },
  {
    id: "proj-7",
    title: "App Viva (Aura)",
    type: "powerapps",
    badge: "Power Apps",
    desc: "Aplicativo gamificado para incentivo a tarefas diárias de saúde física e mental das equipes da Aura.",
    metricIcon: "volunteer_activism",
    metricLabel: "Engajamento e bem-estar",
    mediaUrl: "/images/viva.jpeg",
    isStatic: true
  },
  {
    id: "proj-8",
    title: "App Autonova",
    type: "powerapps",
    badge: "Power Apps",
    desc: "Aplicativo de check-in e check-out de frotas com câmera integrada para controle de danos físicos de veículos da Autonova.",
    metricIcon: "directions_car",
    metricLabel: "Laudo com foto e assinatura digital",
    mediaUrl: "/images/autonova.png",
    isStatic: true
  },
  {
    id: "proj-9",
    title: "App ComoEstou",
    type: "powerapps",
    badge: "Power Apps",
    desc: "Preenchimento e painel de estado emocional diário das equipes da Geralogística para monitorar clima.",
    metricIcon: "mood",
    metricLabel: "Acompanhamento preventivo de clima",
    mediaUrl: "/images/comoestou.jpeg",
    isStatic: true
  }
];

export const Home = () => {
  const [modalVideo, setModalVideo] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  
  // Testimonials stack states
  const [testimonials, setTestimonials] = useState(TESTIMONIALS_DATA);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const frontCardRef = useRef(null);

  // Featured lists
  const featuredCourses = COURSES_DATA.slice(0, 3);
  const featuredServices = SERVICES_DATA;

  // Open video modal
  const openVideo = (url, title) => {
    setModalVideo(url);
    setModalTitle(title);
  };

  // Close video modal
  const closeVideo = () => {
    setModalVideo(null);
    setModalTitle('');
  };

  // Rotate testimonials stack
  const shuffleTestimonials = () => {
    setTestimonials(prev => {
      const next = [...prev];
      const first = next.shift();
      next.push(first);
      return next;
    });
  };

  // Drag and drop handlers for testimonials stack
  const handleDragStart = (clientX) => {
    setDragStartX(clientX);
    setDragCurrentX(clientX);
    setIsDragging(true);
    if (frontCardRef.current) {
      frontCardRef.current.style.transition = 'none';
    }
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    setDragCurrentX(clientX);
    const deltaX = clientX - dragStartX;
    if (deltaX < 50 && frontCardRef.current) {
      const rotation = -6 + (deltaX / 10);
      frontCardRef.current.style.transform = `translate3d(${deltaX}px, 0, 0) rotate(${rotation}deg)`;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaX = dragCurrentX - dragStartX;
    
    if (frontCardRef.current) {
      frontCardRef.current.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease';
      
      if (deltaX < -120) {
        // Swipe left animation
        frontCardRef.current.style.transform = 'translate3d(-400px, 0, 0) rotate(-15deg)';
        frontCardRef.current.style.opacity = '0';
        
        setTimeout(() => {
          shuffleTestimonials();
          if (frontCardRef.current) {
            frontCardRef.current.style.transform = '';
            frontCardRef.current.style.opacity = '';
            frontCardRef.current.style.transition = '';
          }
        }, 200);
      } else {
        // Bounce back
        frontCardRef.current.style.transform = '';
        setTimeout(() => {
          if (frontCardRef.current) {
            frontCardRef.current.style.transition = '';
          }
        }, 350);
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background">
          <div className="hero__glow hero__glow--cyan"></div>
          <div className="hero__glow hero__glow--violet"></div>
        </div>

        <div className="container hero__container">
          <div className="hero__content reveal active">
            <span className="hero__badge">
              <span className="hero__badge-dot"></span>
              Plataforma Corporativa & Consultoria
            </span>
            
            <h1 className="hero__title">
              Desenvolva Tecnologias sob a <span className="accent-gradient">Ótica de Negócios</span>
            </h1>
            
            <p className="hero__subtitle">
              Aprenda Power BI, Power Apps, SharePoint, Sistemas e IA sob a ótica de negócios. Domine as ferramentas que aceleram decisões e automatizam rotinas.
            </p>
            
            <div className="hero__actions">
              <Link to="/cursos" className="btn btn-lg btn-primary">
                Ver Catálogo de Cursos
              </Link>
              <Link to="/servicos" className="btn btn-lg btn-outline">
                Solicitar Consultoria
              </Link>
            </div>
          </div>

          <div className="hero__media reveal active">
            <div className="hero__media-wrapper">
              <img src="/images/hero.svg" alt="Ilustração de Tecnologia" className="hero__media-img" />
              <div className="hero__media-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Cards Section */}
      <section className="container" style={{ paddingBottom: 'var(--space-12)' }}>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card__icon" style={{ background: 'rgba(0, 245, 212, 0.1)', color: 'var(--accent-cyan)' }}>
              <span className="material-symbols-outlined">bar_chart</span>
            </div>
            <h3>Power BI</h3>
            <p>Dashboards profissionais e modelagem de dados Star Schema para tomada de decisão ágil e precisa.</p>
            <div className="feature-card__bg-icon" style={{ opacity: 0.03, color: 'var(--accent-cyan)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '140px' }}>bar_chart</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon" style={{ background: 'rgba(112, 0, 255, 0.1)', color: 'var(--accent-purple)' }}>
              <span className="material-symbols-outlined">widgets</span>
            </div>
            <h3>Power Apps</h3>
            <p>Substitua planilhas por aplicativos corporativos mobile/web sob medida integrados ao M365.</p>
            <div className="feature-card__bg-icon" style={{ opacity: 0.03, color: 'var(--accent-purple)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '140px' }}>widgets</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon" style={{ background: 'rgba(0, 180, 255, 0.1)', color: 'var(--accent-blue)' }}>
              <span className="material-symbols-outlined">hub</span>
            </div>
            <h3>SharePoint Moderno</h3>
            <p>Portais e formulários HTML/JS integrados nativamente nas listas de SharePoint de forma otimizada.</p>
            <div className="feature-card__bg-icon" style={{ opacity: 0.03, color: 'var(--accent-blue)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '140px' }}>hub</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="container" style={{ paddingBottom: 'var(--space-20)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <span className="accent-gradient" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 'var(--font-sm)', letterSpacing: '0.05em' }}>
              Treinamento de Impacto
            </span>
            <h2 style={{ fontSize: 'var(--font-3xl)', marginTop: 'var(--space-2)' }}>Nossos Cursos Destaques</h2>
          </div>
          <Link to="/cursos" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Ver Todos Cursos <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </Link>
        </div>

        <div className="courses-grid" id="featured-courses-grid">
          {featuredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Portfolio Showcase Section */}
      <section className="container" style={{ paddingBottom: 'var(--space-20)' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto var(--space-12) auto' }}>
          <span className="accent-gradient" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 'var(--font-sm)', letterSpacing: '0.05em' }}>
            Portfólio de Projetos Reais
          </span>
          <h2 style={{ fontSize: 'var(--font-3xl)', marginTop: 'var(--space-2)' }}>
            Sistemas Entregues pela NSNexus
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-3)' }}>
            Clique nas demonstrações em vídeo de portais SharePoint e sites desenvolvidos por nós para grandes e médias corporações.
          </p>
        </div>

        {/* Portfolio Grid Layout */}
        <div className="courses-grid">
          {SHOWCASE_PROJECTS.map(proj => (
            <div 
              key={proj.id} 
              className={`showcase-card ${!proj.isStatic ? 'showcase-card--video' : ''}`}
              onClick={() => !proj.isStatic && openVideo(proj.mediaUrl, proj.title)}
              style={{ cursor: proj.isStatic ? 'default' : 'pointer' }}
            >
              <div className="showcase-card__img-wrapper">
                {proj.isStatic ? (
                  <img src={proj.mediaUrl} alt={proj.title} />
                ) : (
                  <>
                    <video src={proj.mediaUrl} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="showcase-card__play-btn">
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>play_arrow</span>
                    </div>
                  </>
                )}
              </div>
              <span className={`showcase-card__badge showcase-card__badge--${proj.type}`}>
                {proj.badge}
              </span>
              <h3 className="showcase-card__title">{proj.title}</h3>
              <p className="showcase-card__desc">{proj.desc}</p>
              <div className="showcase-card__metric">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{proj.metricIcon}</span>
                <span>{proj.metricLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)', padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto var(--space-12) auto' }}>
            <span className="accent-gradient" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 'var(--font-sm)', letterSpacing: '0.05em' }}>
              Sucesso Comprovado
            </span>
            <h2 style={{ fontSize: 'var(--font-3xl)', marginTop: 'var(--space-2)' }}>O que dizem os nossos clientes e alunos</h2>
          </div>
          
          <div className="testimonial-stack-container">
            <div className="testimonial-stack" id="testimonial-stack">
              {testimonials.map((test, index) => {
                let posClass = "pos-hidden";
                let isFront = false;
                if (index === 0) {
                  posClass = "pos-front";
                  isFront = true;
                } else if (index === 1) {
                  posClass = "pos-middle";
                } else if (index === 2) {
                  posClass = "pos-back";
                }

                return (
                  <div 
                    key={test.name}
                    ref={isFront ? frontCardRef : null}
                    className={`testimonial-card-stack-item ${posClass}`} 
                    data-index={index}
                    onMouseDown={(e) => isFront && handleDragStart(e.clientX)}
                    onMouseMove={(e) => isFront && handleDragMove(e.clientX)}
                    onMouseUp={() => isFront && handleDragEnd()}
                    onMouseLeave={() => isFront && handleDragEnd()}
                    onTouchStart={(e) => isFront && handleDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => isFront && handleDragMove(e.touches[0].clientX)}
                    onTouchEnd={() => isFront && handleDragEnd()}
                    style={{ cursor: isFront ? 'grab' : 'default', touchAction: 'none' }}
                  >
                    <img src={test.avatar} alt={`Avatar of ${test.name}`} className="testimonial-card-stack-item__avatar" />
                    <span className="testimonial-card-stack-item__quote">"{test.quote}"</span>
                    <span className="testimonial-card-stack-item__author">{test.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{test.title}</span>
                  </div>
                );
              })}
            </div>
            
            <p className="testimonial-stack-hint">
              <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>swipe</span>
              Arraste o card da frente para a esquerda para ver o próximo depoimento, ou clique no botão abaixo:
            </p>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button className="btn btn-sm btn-secondary" onClick={shuffleTestimonials}>Próximo Depoimento</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Banner Section */}
      <section className="container" style={{ padding: 'var(--space-20) 0' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-16) var(--space-8)', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-cyan-glow)' }}>
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 245, 212, 0.08) 0%, rgba(6, 7, 13, 0) 70%)', pointerEvents: 'none' }}></div>
          
          <span className="accent-gradient" style={{ fontWeight: 700, fontSize: 'var(--font-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', marginBottom: 'var(--space-4)' }}>
            Acelere seus Resultados
          </span>
          <h2 style={{ fontSize: 'var(--font-4xl)', marginBottom: 'var(--space-6)', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
            Quer decolar sua carreira ou sua empresa?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto var(--space-8) auto' }}>
            Seja através de nossos cursos práticos ou de uma consultoria premium sob demanda, nós temos as ferramentas certas para elevar o nível das suas entregas corporativas.
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/cursos" className="btn btn-lg btn-primary">Matricular-se nos Cursos</Link>
            <Link to="/servicos" className="btn btn-lg btn-outline">Solicitar Consultoria</Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {modalVideo && (
        <div id="video-modal" className="video-modal video-modal--active" onClick={closeVideo}>
          <div className="video-modal__content animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <button id="video-modal-close" className="video-modal__close" onClick={closeVideo}>
              &times;
            </button>
            <div className="video-modal__body" id="video-modal-body">
              <h3 style={{ marginBottom: '15px', color: 'white' }}>{modalTitle}</h3>
              <video src={modalVideo} controls autoPlay style={{ width: '100%', borderRadius: '8px' }}></video>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Home;
