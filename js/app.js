/* Global Platform Application Setup */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Always render Navbar and Footer
  renderNavbar();
  renderFooter();

  // Initialize global promo countdown for cards, popup, and details page
  initGlobalPromoCountdown();

  // 2. Page Specific Initializations
  const path = window.location.pathname;

  if (path.endsWith("index.html") || path.endsWith("/") || path === "") {
    initLandingPage();
  } else if (path.includes("cursos.html")) {
    initCatalogPage();
  } else if (path.includes("curso-detalhe.html")) {
    initDetailPage();
  } else if (path.includes("servicos.html")) {
    initServicesPage();
  } else if (path.includes("dashboard.html")) {
    initDashboardPage();
  }
});

// Landing Page Specific Setup
function initLandingPage() {
  // Render Highlight Courses
  const coursesContainer = document.getElementById("featured-courses-grid");
  if (coursesContainer) {
    const featured = COURSES_DATA.slice(0, 3);
    coursesContainer.innerHTML = featured.map(course => generateCourseCard(course)).join("");
  }

  // Render Highlight Services
  const servicesContainer = document.getElementById("featured-services-grid");
  if (servicesContainer) {
    servicesContainer.innerHTML = SERVICES_DATA.map(service => generateServiceCard(service)).join("");
  }

  // Render Testimonials
  const testimonialsContainer = document.getElementById("testimonials-swiper-wrapper");
  if (testimonialsContainer) {
    testimonialsContainer.innerHTML = TESTIMONIALS_DATA.map(test => `
      <div class="swiper-slide" style="height: auto;">
        <div class="testimonial-card" style="width: 100%; max-width: 380px; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
          <p class="testimonial-card__quote" style="flex-grow: 1;">"${test.quote}"</p>
          <div class="testimonial-card__author" style="margin-top: auto;">
            <div class="testimonial-card__avatar">
              <img src="${test.avatar}" alt="${test.name}">
            </div>
            <div>
              <h4 class="testimonial-card__name">${test.name}</h4>
              <span class="testimonial-card__title">${test.title}</span>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }

  // Initialize Swiper.js
  if (typeof Swiper !== "undefined") {
    // 1. Showcase Swiper
    new Swiper(".showcase-swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".showcase-swiper .swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: ".showcase-swiper .swiper-button-next",
        prevEl: ".showcase-swiper .swiper-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });

    // 2. Testimonials Swiper
    new Swiper(".testimonials-swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".testimonials-swiper .swiper-pagination",
        clickable: true,
        dynamicBullets: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  // Initialize Promo Popup Highlight
  initPromoPopup();
}

function initPromoPopup() {
  // 1. Inject Styles
  const style = document.createElement("style");
  style.textContent = `
    .promo-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(6, 7, 13, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      padding: 16px;
    }
    .promo-modal.active {
      opacity: 1;
      pointer-events: all;
    }
    .promo-modal__content {
      background: linear-gradient(135deg, #0f1322 0%, #080a10 100%);
      border: 1px solid rgba(0, 245, 212, 0.25);
      border-radius: 12px;
      width: 100%;
      max-width: 460px;
      padding: 32px;
      position: relative;
      box-shadow: 0 0 50px rgba(0, 245, 212, 0.15);
      text-align: center;
      transform: scale(0.95);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .promo-modal.active .promo-modal__content {
      transform: scale(1);
    }
    .promo-modal__close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 24px;
      cursor: pointer;
      line-height: 1;
    }
    .promo-modal__close:hover {
      color: #ffffff;
    }
    .promo-modal__badge {
      display: inline-block;
      background: rgba(0, 245, 212, 0.1);
      color: #00f5d4;
      border: 1px solid rgba(0, 245, 212, 0.25);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 4px 12px;
      border-radius: 50px;
      margin-bottom: 16px;
      text-transform: uppercase;
    }
    .promo-modal__title {
      font-family: inherit;
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 12px;
      color: #ffffff;
      line-height: 1.25;
    }
    .promo-modal__desc {
      font-size: 13.5px;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .promo-modal__timer-wrapper {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .promo-modal__timer-label {
      display: block;
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .promo-modal__timer {
      font-family: monospace;
      font-size: 28px;
      font-weight: 700;
      color: #ff5e62;
      text-shadow: 0 0 10px rgba(255, 94, 98, 0.4);
      letter-spacing: 1px;
    }
    .promo-modal__price-box {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .promo-modal__price-old {
      text-decoration: line-through;
      color: #64748b;
      font-size: 14px;
    }
    .promo-modal__price-new {
      font-size: 26px;
      font-weight: 800;
      color: #00f5d4;
    }
  `;
  document.head.appendChild(style);

  // 2. Inject HTML
  const modalDiv = document.createElement("div");
  modalDiv.id = "promo-popup-modal";
  modalDiv.className = "promo-modal";
  modalDiv.innerHTML = `
    <div class="promo-modal__content animate-fade-in-up">
      <button class="promo-modal__close" id="promo-popup-close">&times;</button>
      <div class="promo-modal__badge">Oferta Especial de Lançamento</div>
      <h2 class="promo-modal__title">Acelere sua Produtividade com IA</h2>
      <p class="promo-modal__desc">Desbloqueie o acesso vitalício à <strong>Biblioteca de Prompts Premium NSNexus</strong>. Mais de 2.500 comandos de alto impacto para <strong>ChatGPT, Gemini e Copilot</strong>.</p>
      
      <div class="promo-modal__timer-wrapper">
        <span class="promo-modal__timer-label">O desconto de R$ 99,00 expira em:</span>
        <div class="promo-modal__timer" id="promo-countdown-clock">03:00:00</div>
      </div>
      
      <div class="promo-modal__price-box">
        <span class="promo-modal__price-old">De R$ 197,00</span>
        <span class="promo-modal__price-new">Por R$ 99,00</span>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <a href="curso-detalhe.html?id=biblioteca-prompts-ia" class="btn btn-primary btn-full btn-lg">Aproveitar Desconto</a>
      </div>
    </div>
  `;
  document.body.appendChild(modalDiv);

  // 3. Event Listeners
  const closeBtn = document.getElementById("promo-popup-close");
  closeBtn.addEventListener("click", () => {
    modalDiv.classList.remove("active");
  });
  
  modalDiv.addEventListener("click", (e) => {
    if (e.target === modalDiv) {
      modalDiv.classList.remove("active");
    }
  });

  // 4. Trigger Popup delay (only if not shown in current session)
  if (!sessionStorage.getItem("promo_popup_shown")) {
    setTimeout(() => {
      modalDiv.classList.add("active");
      sessionStorage.setItem("promo_popup_shown", "true");
    }, 2500);
  }
}

// Global Promo Scarcity Countdown Timer
function initGlobalPromoCountdown() {
  let deadline = localStorage.getItem("promo_deadline");
  if (!deadline) {
    deadline = new Date().getTime() + 3 * 60 * 60 * 1000;
    localStorage.setItem("promo_deadline", deadline);
  } else {
    deadline = parseInt(deadline, 10);
  }

  function updateClocks() {
    const now = new Date().getTime();
    let distance = deadline - now;

    // Reset rolling window if elapsed
    if (distance < 0) {
      const newDeadline = new Date().getTime() + 3 * 60 * 60 * 1000;
      localStorage.setItem("promo_deadline", newDeadline);
      deadline = newDeadline;
      distance = newDeadline - now;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update popup clock
    const popupClock = document.getElementById("promo-countdown-clock");
    if (popupClock) popupClock.textContent = formattedTime;

    // Update all card clocks (Home / Catalog pages)
    const cardClocks = document.querySelectorAll("#card-promo-clock");
    cardClocks.forEach(c => {
      c.textContent = formattedTime;
    });

    // Update course details page clock
    const detailClock = document.getElementById("detail-promo-clock");
    if (detailClock) detailClock.textContent = formattedTime;
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

// Catalog Page Specific Setup
function initCatalogPage() {
  const grid = document.getElementById("catalog-grid");
  const searchInput = document.getElementById("catalog-search");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (!grid) return;

  let currentCategory = new URLSearchParams(window.location.search).get("category") || "all";
  let searchQuery = "";

  function renderFiltered() {
    let filtered = COURSES_DATA;

    if (currentCategory !== "all") {
      filtered = filtered.filter(c => c.category === currentCategory);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: var(--space-12) 0;">
        <h3 style="color: var(--text-secondary); margin-bottom: var(--space-2);">Nenhum curso encontrado</h3>
        <p style="color: var(--text-muted);">Tente buscar por termos diferentes ou selecione outra categoria.</p>
      </div>`;
    } else {
      grid.innerHTML = filtered.map(c => generateCourseCard(c)).join("");
    }
  }

  // Setup Search Input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderFiltered();
    });
  }

  // Setup Category buttons
  if (filterBtns) {
    filterBtns.forEach(btn => {
      const cat = btn.getAttribute("data-category");
      if (cat === currentCategory) {
        btn.classList.add("btn-primary");
        btn.classList.remove("btn-secondary");
      }

      btn.addEventListener("click", () => {
        filterBtns.forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.add("btn-primary");
        btn.classList.remove("btn-secondary");
        currentCategory = cat;
        renderFiltered();
      });
    });
  }

  renderFiltered();
}

// Detail Page Specific Setup
function initDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  const course = COURSES_DATA.find(c => c.id === courseId);
  if (!course) {
    document.getElementById("course-detail-container").innerHTML = "<p>Curso não encontrado.</p>";
    return;
  }

  // Bind values dynamically
  document.getElementById("detail-title").textContent = course.title;
  document.getElementById("detail-desc").textContent = course.description;
  document.getElementById("detail-duration").textContent = course.duration;
  
  const isLibrary = course.id === "biblioteca-prompts-ia";
  const isService = course.type === "service";
  document.getElementById("detail-lessons").textContent = isLibrary ? course.lessonsCount : course.lessonsCount + " aulas";
  document.getElementById("detail-level").textContent = course.level;
  document.getElementById("detail-badge").textContent = course.badgeLabel;
  document.getElementById("detail-badge").className = `badge ${course.badgeClass}`;
  if (course.isClosed) {
    document.getElementById("detail-price").textContent = "Sob Consulta";
    const origPriceEl = document.getElementById("detail-original-price");
    if (origPriceEl) {
      origPriceEl.style.display = "none";
      const labelEl = origPriceEl.previousElementSibling;
      if (labelEl) labelEl.textContent = "Sob Encomenda";
    }
  } else {
    document.getElementById("detail-price").textContent = "R$ " + course.price.toFixed(2);
    const origPriceEl = document.getElementById("detail-original-price");
    if (origPriceEl) {
      origPriceEl.style.display = "inline";
      origPriceEl.textContent = "R$ " + course.originalPrice.toFixed(2);
      const labelEl = origPriceEl.previousElementSibling;
      if (labelEl) labelEl.textContent = "Investimento Único";
    }
  }
  document.getElementById("detail-banner").src = course.banner;

  const enrollBtn = document.getElementById("enroll-btn");
  if (enrollBtn) {
    const dest = course.paymentLink || `checkout.html?id=${course.id}`;
    enrollBtn.setAttribute("data-dest", dest);
    if (course.isClosed) {
      enrollBtn.textContent = "Solicitar por Encomenda";
    } else {
      enrollBtn.textContent = "Comprar Agora";
    }
  }

  // Bind instructor field dynamically
  const instructorEl = document.getElementById("detail-instructor");
  if (instructorEl) {
    instructorEl.textContent = course.instructor || "Ensinado por profissional especializado";
  }

  // Customize checkout features for Prompt Library
  if (isLibrary) {
    const featTxt1 = document.getElementById("feature-txt-1");
    if (featTxt1) featTxt1.textContent = "Acesso vitalício à Biblioteca";

    const featIcon3 = document.getElementById("feature-icon-3");
    if (featIcon3) featIcon3.textContent = "sync";

    const featTxt3 = document.getElementById("feature-txt-3");
    if (featTxt3) featTxt3.textContent = "Atualizações mensais inclusas";

    // Inject countdown timer in the checkout card!
    const priceDiv = document.getElementById("detail-price");
    if (priceDiv) {
      const countdownDiv = document.createElement("div");
      countdownDiv.className = "course-card__promo-timer";
      countdownDiv.style.marginTop = "var(--space-2)";
      countdownDiv.style.marginBottom = "var(--space-4)";
      countdownDiv.innerHTML = `<span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle; margin-right: 4px;">alarm</span>Promoção acaba em: &nbsp;<span id="detail-promo-clock">00:00:00</span>`;
      priceDiv.parentNode.insertBefore(countdownDiv, priceDiv.nextSibling);
    }
  }

  // Customize checkout features for Services (e.g. Landing Page creation or SharePoint Moderno systems)
  if (isService) {
    // Change heading "O que você irá aprender" to "Sobre o Serviço"
    const headings = document.querySelectorAll("#course-detail-container h2");
    if (headings.length > 0) {
      headings[0].textContent = "Sobre o Serviço";
    }
    // Hide curriculum headers and accordion
    headings.forEach(h => {
      if (h.textContent.includes("Grade Curricular") || h.textContent.includes("Conteúdo")) {
        h.style.display = "none";
      }
    });
    const syllabusAccordion = document.getElementById("detail-syllabus");
    if (syllabusAccordion) {
      syllabusAccordion.style.display = "none";
    }

    // Change sidebar title to "Este serviço inclui:"
    const featTitle = document.getElementById("detail-features-title");
    if (featTitle) featTitle.textContent = "Este serviço inclui:";

    if (course.id === "landing-page-whatsapp") {
      const featIcon1 = document.getElementById("feature-icon-1");
      if (featIcon1) featIcon1.textContent = "public";
      const featTxt1 = document.getElementById("feature-txt-1");
      if (featTxt1) featTxt1.textContent = "Hospedagem inclusa no seu domínio/link";

      const featIcon2 = document.getElementById("feature-icon-2");
      if (featIcon2) featIcon2.textContent = "design_services";
      const featTxt2 = document.getElementById("detail-lessons");
      if (featTxt2) featTxt2.textContent = "Design Exclusivo & Responsivo";

      const featIcon3 = document.getElementById("feature-icon-3");
      if (featIcon3) featIcon3.textContent = "speed";
      const featTxt3 = document.getElementById("feature-txt-3");
      if (featTxt3) featTxt3.textContent = "Carregamento ultra-rápido no celular";

      const featIcon4 = document.getElementById("feature-icon-4");
      if (featIcon4) featIcon4.textContent = "schedule";
      const featTxt4 = document.getElementById("detail-duration");
      if (featTxt4) featTxt4.textContent = "Entrega expressa em até 3 dias";

      const featIcon5 = document.getElementById("feature-icon-5");
      if (featIcon5) featIcon5.textContent = "domain";
      const featTxt5 = document.getElementById("detail-level");
      if (featTxt5) featTxt5.textContent = "Qualquer Nicho ou Empresa";
    } else if (course.id === "sistemas-sharepoint-moderno") {
      const featIcon1 = document.getElementById("feature-icon-1");
      if (featIcon1) featIcon1.textContent = "database";
      const featTxt1 = document.getElementById("feature-txt-1");
      if (featTxt1) featTxt1.textContent = "Listas nativas do SharePoint";

      const featIcon2 = document.getElementById("feature-icon-2");
      if (featIcon2) featIcon2.textContent = "money_off";
      const featTxt2 = document.getElementById("detail-lessons");
      if (featTxt2) featTxt2.textContent = "Sem custo extra de licenciamento";

      const featIcon3 = document.getElementById("feature-icon-3");
      if (featIcon3) featIcon3.textContent = "admin_panel_settings";
      const featTxt3 = document.getElementById("feature-txt-3");
      if (featTxt3) featTxt3.textContent = "Segurança nativa com Azure AD";

      const featIcon4 = document.getElementById("feature-icon-4");
      if (featIcon4) featIcon4.textContent = "psychology";
      const featTxt4 = document.getElementById("detail-duration");
      if (featTxt4) featTxt4.textContent = "Configuração com Agente de IA";

      const featIcon5 = document.getElementById("feature-icon-5");
      if (featIcon5) featIcon5.textContent = "dashboard_customize";
      const featTxt5 = document.getElementById("detail-level");
      if (featTxt5) featTxt5.textContent = "Portais e Cadastros sob medida";
    }
  }

  // Syllabus Render
  const syllabusAccordion = document.getElementById("detail-syllabus");
  if (syllabusAccordion) {
    syllabusAccordion.innerHTML = course.syllabus.map(mod => {
      const headerCount = isLibrary ? "+2.500 Prompts" : (isService ? "" : mod.lessons.length + " aulas");
      return `
        <div style="margin-bottom: var(--space-4); border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow:hidden; background: var(--bg-secondary);">
          <div style="padding: var(--space-4); font-weight: 600; background: rgba(255,255,255,0.02); display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color);">
            <span>${mod.moduleTitle}</span>
            <span style="color: var(--text-muted); font-size: var(--font-sm);">${headerCount}</span>
          </div>
          <div style="padding: var(--space-2) var(--space-4);">
            ${mod.lessons.map(les => `
              <div style="padding: var(--space-3) 0; border-bottom: 1px solid rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: space-between; font-size: var(--font-sm);">
                <div style="display: flex; align-items: center; gap: var(--space-3);">
                  <span style="font-family: 'Material Symbols Outlined', sans-serif; font-size: 16px; color: var(--accent-cyan);">
                    ${isLibrary ? 'article' : (les.type === 'pdf' ? 'menu_book' : 'play_circle')}
                  </span>
                  <span>${les.title}</span>
                </div>
                <span style="color: var(--text-muted);">${isService ? '' : les.duration}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // Handle Enrollment simulation
  if (enrollBtn) {
    enrollBtn.addEventListener("click", (e) => {
      const dest = e.currentTarget.getAttribute("data-dest");
      if (course.isClosed) {
        window.open(dest, "_blank", "noopener,noreferrer");
        return;
      }
      const user = getCurrentUser();
      if (!user) {
        try {
          window.localStorage.setItem("post_login_redirect", dest);
        } catch (err) {
          console.error(err);
        }
        window.location.href = "login.html";
        return;
      }
      window.location.href = dest;
    });
  }
}

// Services Page Specific Setup
function initServicesPage() {
  const servicesGrid = document.getElementById("services-page-grid");
  if (servicesGrid) {
    servicesGrid.innerHTML = SERVICES_DATA.map(service => generateServiceCard(service)).join("");
  }
}

// Student Dashboard Specific Setup
function initDashboardPage() {
  const user = getCurrentUser();
  if (!user) return;

  // Set Profile Information
  document.getElementById("user-name").textContent = user.name;
  document.getElementById("user-email").textContent = user.email;
  if (user.avatar) {
    document.getElementById("user-avatar").src = user.avatar;
  }

  // Render enrolled courses list
  const coursesGrid = document.getElementById("dashboard-courses-grid");
  if (coursesGrid) {
    const enrolledList = COURSES_DATA.filter(c => user.enrolledCourses.includes(c.id));
    
    if (enrolledList.length === 0) {
      coursesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: var(--space-8) 0;">
          <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">Você ainda não possui cursos matriculados.</p>
          <a href="cursos.html" class="btn btn-primary">Ver Catálogo</a>
        </div>
      `;
    } else {
      coursesGrid.innerHTML = enrolledList.map(course => {
        const progress = user.progress[course.id] ? user.progress[course.id].percentage : 0;
        
        let releaseId = "";
        if (course.id === "landing-page-whatsapp" || course.id === "sistemas-sharepoint-moderno") {
          if (!user.progress[course.id]) {
            user.progress[course.id] = {};
          }
          if (!user.progress[course.id].releaseId) {
            const prefix = course.id === "sistemas-sharepoint-moderno" ? "NSN-SYS" : "NSN-WA";
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            user.progress[course.id].releaseId = `${prefix}-${randomNum}`;
            localStorage.setItem("nsnexus_user", JSON.stringify(user));
            
            // Sync with Supabase (if loaded)
            if (window.supabaseClient) {
              supabaseClient.auth.getUser().then(({ data: { user: sbUser } }) => {
                if (sbUser) {
                  supabaseClient.from("profiles").update({ progress: user.progress }).eq("id", sbUser.id);
                }
              });
            }
          }
          releaseId = user.progress[course.id].releaseId;
        }

        let buttonHtml = "";
        if (course.id === 'biblioteca-prompts-ia') {
          buttonHtml = `<a href="biblioteca-prompts.html" class="btn btn-primary btn-full">Acessar Biblioteca</a>`;
        } else if (course.id === 'landing-page-whatsapp') {
          const messageText = encodeURIComponent(`Olá! Acabei de adquirir o Serviço de Criação de Site para WhatsApp na NSNexus. Meu ID de Liberação é ${releaseId}. Gostaria de iniciar o projeto!`);
          buttonHtml = `<a href="https://wa.me/5594991081351?text=${messageText}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-full">Solicitar Site (ID: ${releaseId})</a>`;
        } else if (course.id === 'sistemas-sharepoint-moderno') {
          const messageText = encodeURIComponent(`Olá! Acabei de adquirir o Serviço de Sistemas no SharePoint Moderno na NSNexus. Meu ID de Liberação é ${releaseId}. Gostaria de iniciar a configuração com o Agente de IA!`);
          buttonHtml = `<a href="https://wa.me/5594991081351?text=${messageText}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-full">Solicitar Configuração (ID: ${releaseId})</a>`;
        } else {
          buttonHtml = `<a href="player.html?course=${course.id}" class="btn btn-primary btn-full">${progress > 0 ? "Continuar Estudando" : "Começar Curso"}</a>`;
        }

        return `
          <div class="course-card">
            <div class="course-card__thumb">
              <img src="${course.banner}" alt="${course.title}">
              <div class="course-card__badge-group">
                <span class="badge ${course.badgeClass}">${course.badgeLabel}</span>
              </div>
            </div>
            <div class="course-card__content">
              <h3 class="course-card__title" style="margin-top: var(--space-2);">${course.title}</h3>
              
              <!-- Progress Bar -->
              ${course.type === 'service' ? '' : `
              <div style="margin: var(--space-4) 0;">
                <div style="display: flex; justify-content: space-between; font-size: var(--font-xs); color: var(--text-secondary); margin-bottom: var(--space-1);">
                  <span>Progresso</span>
                  <span>${progress}%</span>
                </div>
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                  <div style="width: ${progress}%; height: 100%; background: var(--grad-primary); border-radius: 3px;"></div>
                </div>
              </div>
              `}
              
              <div class="course-card__footer" style="border: none; padding: 0;">
                ${buttonHtml}
              </div>
            </div>
          </div>
        `;
      }).join("");
    }
  }
}
