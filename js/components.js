/* Shared UI Components Renderer */

// Get current user session
function getCurrentUser() {
  try {
    const user = window.localStorage.getItem("nsnexus_user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Erro ao ler nsnexus_user do localStorage:", e);
    try { window.localStorage.removeItem("nsnexus_user"); } catch (_) {}
    return null;
  }
}

// Log out user
function logoutUser() {
  localStorage.removeItem("nsnexus_user");
  window.location.href = "index.html";
}

// Generate consistent navigation menu
function renderNavbar() {
  const header = document.createElement("header");
  header.className = "header";
  
  const user = getCurrentUser();
  const path = window.location.pathname;
  const isIndex = path.endsWith("/") || path.endsWith("index.html") || path === "";
  const isCursos = path.includes("cursos.html") || path.includes("curso-detalhe.html");
  const isBiblioteca = path.includes("biblioteca-prompts.html");
  const isServicos = path.includes("servicos.html");
  const isSobre = path.includes("sobre.html");

  header.innerHTML = `
    <div class="container header__container">
      <a href="index.html" class="logo">
        <img src="images/logo.png" alt="NSNexus" style="height: 32px; width: 32px; object-fit: contain; border-radius: 6px;">
        <span>NSNexus</span>
      </a>
      
      <nav class="nav">
        <ul class="nav__list">
          <li><a href="index.html" class="nav__link ${isIndex ? 'nav__link--active' : ''}">Início</a></li>
          <li><a href="cursos.html" class="nav__link ${isCursos ? 'nav__link--active' : ''}">Cursos</a></li>
          <li><a href="biblioteca-prompts.html" class="nav__link ${isBiblioteca ? 'nav__link--active' : ''}">Prompts</a></li>
          <li><a href="servicos.html" class="nav__link ${isServicos ? 'nav__link--active' : ''}">Consultoria</a></li>
          <li><a href="sobre.html" class="nav__link ${isSobre ? 'nav__link--active' : ''}">Sobre</a></li>
        </ul>
      </nav>
      
      <div class="header__actions">
        ${user ? `
          ${user.email === 'narcisofelizardo@gmail.com' ? `<a href="admin.html" class="btn btn-sm btn-primary" style="background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue)); border: none; color: white;">Admin</a>` : ''}
          <a href="dashboard.html" class="btn btn-sm btn-outline">Dashboard</a>
          <button onclick="logoutUser()" class="btn btn-sm btn-ghost">Sair</button>
        ` : `
          <a href="login.html" class="btn btn-sm btn-ghost">Entrar</a>
          <a href="cursos.html" class="btn btn-sm btn-primary">Começar</a>
        `}
        <div class="menu-toggle" id="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `;

  document.body.prepend(header);

  // Setup mobile nav menu
  const mobileNav = document.createElement("div");
  mobileNav.className = "mobile-nav";
  mobileNav.id = "mobile-nav-drawer";
  mobileNav.innerHTML = `
    <ul class="mobile-nav__list">
      <li><a href="index.html" class="mobile-nav__link">Início</a></li>
      <li><a href="cursos.html" class="mobile-nav__link">Cursos</a></li>
      <li><a href="biblioteca-prompts.html" class="mobile-nav__link">Prompts</a></li>
      <li><a href="servicos.html" class="mobile-nav__link">Consultoria</a></li>
      <li><a href="sobre.html" class="mobile-nav__link">Sobre</a></li>
    </ul>
    <div style="display: flex; flex-direction: column; gap: var(--space-4); margin-top: auto;">
      ${user ? `
        ${user.email === 'narcisofelizardo@gmail.com' ? `<a href="admin.html" class="btn btn-primary btn-full" style="background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue)); border: none; color: white;">Painel Admin</a>` : ''}
        <a href="dashboard.html" class="btn btn-outline btn-full">Dashboard</a>
        <button onclick="logoutUser()" class="btn btn-ghost btn-full">Sair</button>
      ` : `
        <a href="login.html" class="btn btn-ghost btn-full">Entrar</a>
        <a href="cursos.html" class="btn btn-primary btn-full">Matricule-se</a>
      `}
    </div>
  `;
  document.body.appendChild(mobileNav);

  const overlay = document.createElement("div");
  overlay.className = "mobile-overlay";
  overlay.id = "mobile-nav-overlay";
  document.body.appendChild(overlay);

  // Set up event listeners for scroll effects
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  });

  // Set up mobile menu toggle triggers
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navDrawer = document.getElementById("mobile-nav-drawer");
  const navOverlay = document.getElementById("mobile-nav-overlay");

  if (toggleBtn && navDrawer && navOverlay) {
    toggleBtn.addEventListener("click", () => {
      navDrawer.classList.toggle("mobile-nav--open");
      navOverlay.classList.toggle("mobile-overlay--active");
    });

    navOverlay.addEventListener("click", () => {
      navDrawer.classList.remove("mobile-nav--open");
      navOverlay.classList.remove("mobile-overlay--active");
    });
  }
}

// Generate consistent footer layout
function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <a href="index.html" class="logo" style="margin-bottom: var(--space-4)">
            <img src="images/logo.png" alt="NSNexus" style="height: 32px; width: 32px; object-fit: contain; border-radius: 6px;">
            <span>NSNexus</span>
          </a>
          <p class="footer__about-text">
            NSNexus é a plataforma corporativa criada por especialistas para capacitar profissionais de negócio nas ferramentas que movem o mercado moderno.
          </p>
          <div class="footer__socials">
            <a href="#" class="footer__social-link" aria-label="LinkedIn">in</a>
            <a href="#" class="footer__social-link" aria-label="YouTube">YT</a>
            <a href="#" class="footer__social-link" aria-label="Instagram">IG</a>
          </div>
        </div>
        <div>
          <h4 class="footer__title">Navegação</h4>
          <ul class="footer__links">
            <li><a href="index.html" class="footer__link">Início</a></li>
            <li><a href="cursos.html" class="footer__link">Cursos</a></li>
            <li><a href="biblioteca-prompts.html" class="footer__link">Biblioteca de Prompts</a></li>
            <li><a href="servicos.html" class="footer__link">Consultoria</a></li>
            <li><a href="sobre.html" class="footer__link">Sobre</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer__title">Expertises</h4>
          <ul class="footer__links">
            <li><a href="cursos.html?category=power-bi" class="footer__link">Power BI</a></li>
            <li><a href="cursos.html?category=power-apps" class="footer__link">Power Apps</a></li>
            <li><a href="cursos.html?category=sharepoint" class="footer__link">SharePoint</a></li>
            <li><a href="cursos.html?category=ia" class="footer__link">Inteligência Artificial</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span class="footer__copy">© 2026 NSNexus. Todos os direitos reservados. | <a href="termos.html" style="text-decoration: underline;">Termos & Privacidade</a></span>
        <span class="footer__copy">Desenvolvido com foco em Negócio</span>
      </div>
    </div>
  `;
  document.body.appendChild(footer);
}

// Render course card
function generateCourseCard(course) {
  let metaHtml = "";
  if (course.id === 'biblioteca-prompts-ia') {
    metaHtml = `
      <span>${course.duration}</span>
      <span>•</span>
      <span>${course.lessonsCount}</span>
      <span>•</span>
      <span>${course.level}</span>
    `;
  } else {
    const suffix = typeof course.lessonsCount === 'number' ? ' aulas' : '';
    metaHtml = `
      <span>${course.duration}</span>
      <span>•</span>
      <span>${course.lessonsCount}${suffix}</span>
      <span>•</span>
      <span>${course.level}</span>
    `;
  }

  const isClosed = course.isClosed;
  const priceHtml = isClosed 
    ? `<span class="course-card__price">Sob Consulta</span>`
    : `
      <span class="course-card__price-original">R$ ${course.originalPrice.toFixed(2)}</span>
      <span class="course-card__price">R$ ${course.price.toFixed(2)}</span>
    `;

  const btnHtml = isClosed
    ? `<a href="curso-detalhe.html?id=${course.id}" class="btn btn-sm btn-secondary">Encomendar</a>`
    : `<a href="curso-detalhe.html?id=${course.id}" class="btn btn-sm btn-outline">Saber Mais</a>`;

  return `
    <div class="course-card">
      <div class="course-card__thumb">
        <img src="${course.banner}" alt="${course.title}">
        <div class="course-card__badge-group">
          <span class="badge ${course.badgeClass}">${course.badgeLabel}</span>
        </div>
      </div>
      <div class="course-card__content">
        ${course.id === 'biblioteca-prompts-ia' ? `<div class="course-card__promo-timer"><span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle; margin-right: 4px;">alarm</span>Promoção acaba em: &nbsp;<span id="card-promo-clock">00:00:00</span></div>` : ''}
        <div class="course-card__meta">
          ${metaHtml}
        </div>
        <h3 class="course-card__title">${course.title}</h3>
        <p class="course-card__desc">${course.description}</p>
        <div class="course-card__footer">
          <div>
            ${priceHtml}
          </div>
          ${btnHtml}
        </div>
      </div>
    </div>
  `;
}

// Render service/consulting card
function generateServiceCard(service) {
  return `
    <div class="service-card">
      <div class="service-card__icon">
        <span style="font-size: var(--font-3xl); font-family: 'Material Symbols Outlined', sans-serif;">${service.icon}</span>
      </div>
      <h3 class="service-card__title">${service.title}</h3>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-6); min-height: 75px;">${service.description}</p>
      <ul class="service-card__features">
        ${service.features.map(feat => `
          <li>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            ${feat}
          </li>
        `).join('')}
      </ul>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-6); border-top: 1px solid var(--border-color); padding-top: var(--space-4)">
        <span style="font-family: var(--font-heading); font-weight: 600; color: var(--text-muted)">Investimento</span>
        <span style="font-family: var(--font-heading); font-weight: 700; color: var(--accent-cyan); font-size: var(--font-lg)">${service.priceText}</span>
      </div>
      <a href="https://wa.me/5594991081351?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20consultoria." target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-full" style="margin-top: var(--space-4)">Falar com Especialista</a>
    </div>
  `;
}
