/* Lógica da Biblioteca de Prompts NSNexus */

let currentFilters = {
  category: "all",
  difficulty: "all",
  aiModel: "all",
  search: ""
};

// Pagination variables
let displayedCount = 0;
const PAGE_SIZE = 30;
let filteredPrompts = [];
let userHasAccess = false;

document.addEventListener("DOMContentLoaded", () => {
  checkUserAccess();
  initFilters();
  applyFiltersAndRender(true); // reset pagination and list
  setupLazyLoading();
});

// Check if user is logged in and has purchased the Prompt Library
function checkUserAccess() {
  const userJson = localStorage.getItem("nsnexus_user");
  if (userJson) {
    const user = JSON.parse(userJson);
    if (user.enrolledCourses && user.enrolledCourses.includes("biblioteca-prompts-ia")) {
      userHasAccess = true;
    }
  }
}

// Initialize sidebar and dropdown filter options
function initFilters() {
  // 1. Render Category sidebar links with counts
  const catList = document.getElementById("category-filter-list");
  if (catList) {
    let categoriesHtml = `
      <button class="category-btn active" data-category="all">
        <span>📂 Todas as Categorias</span>
        <span class="category-count">${PROMPTS_DATABASE.length}</span>
      </button>
    `;

    Object.keys(PROMPT_CATEGORIES).forEach(key => {
      const cat = PROMPT_CATEGORIES[key];
      const count = PROMPTS_DATABASE.filter(p => p.category === key).length;
      categoriesHtml += `
        <button class="category-btn" data-category="${key}">
          <span>${cat.label}</span>
          <span class="category-count">${count}</span>
        </button>
      `;
    });

    catList.innerHTML = categoriesHtml;

    // Attach click events
    const buttons = catList.querySelectorAll(".category-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilters.category = btn.getAttribute("data-category");
        applyFiltersAndRender(true);
      });
    });
  }

  // 2. Search input with debounce
  const searchInput = document.getElementById("prompt-search");
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentFilters.search = e.target.value.toLowerCase().trim();
        applyFiltersAndRender(true);
      }, 250);
    });
  }

  // 3. Difficulty and AI Model selects
  const diffSelect = document.getElementById("filter-difficulty");
  if (diffSelect) {
    diffSelect.addEventListener("change", (e) => {
      currentFilters.difficulty = e.target.value;
      applyFiltersAndRender(true);
    });
  }

  const aiSelect = document.getElementById("filter-aimodel");
  if (aiSelect) {
    aiSelect.addEventListener("change", (e) => {
      currentFilters.aiModel = e.target.value;
      applyFiltersAndRender(true);
    });
  }
}

// Filter prompts array based on search state
function applyFiltersAndRender(resetPagination = false) {
  if (resetPagination) {
    displayedCount = 0;
    const grid = document.getElementById("prompts-list-grid");
    if (grid) grid.innerHTML = "";
  }

  filteredPrompts = PROMPTS_DATABASE.filter(p => {
    // 1. Category Filter
    if (currentFilters.category !== "all" && p.category !== currentFilters.category) return false;
    
    // 2. Difficulty Filter
    if (currentFilters.difficulty !== "all" && p.difficulty.toLowerCase() !== currentFilters.difficulty) return false;
    
    // 3. AI Model Filter
    if (currentFilters.aiModel !== "all") {
      const modelLower = p.aiModel.toLowerCase();
      if (currentFilters.aiModel === "chatgpt" && !modelLower.includes("chatgpt")) return false;
      if (currentFilters.aiModel === "claude" && !modelLower.includes("claude")) return false;
      if (currentFilters.aiModel === "midjourney" && !modelLower.includes("midjourney")) return false;
      if (currentFilters.aiModel === "dalle" && !modelLower.includes("dall")) return false;
      if (currentFilters.aiModel === "runway" && !modelLower.includes("runway") && !modelLower.includes("sora")) return false;
      if (currentFilters.aiModel === "suno" && !modelLower.includes("suno")) return false;
    }

    // 4. Search Filter
    if (currentFilters.search !== "") {
      const matchText = (p.title + " " + p.prompt + " " + p.tags.join(" ")).toLowerCase();
      if (!matchText.includes(currentFilters.search)) return false;
    }

    return true;
  });

  // Update dynamic counter
  const counterEl = document.getElementById("filtered-counter");
  if (counterEl) {
    counterEl.innerHTML = `Mostrando <strong>${Math.min(displayedCount + PAGE_SIZE, filteredPrompts.length)}</strong> de <strong>${filteredPrompts.length}</strong> prompts`;
  }

  renderMorePrompts();
}

// Render next block of prompts
function renderMorePrompts() {
  const grid = document.getElementById("prompts-list-grid");
  if (!grid) return;

  const nextBatch = filteredPrompts.slice(displayedCount, displayedCount + PAGE_SIZE);
  
  if (nextBatch.length === 0 && displayedCount === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <span class="material-symbols-outlined">search_off</span>
        <h3>Nenhum prompt encontrado</h3>
        <p>Tente ajustar os filtros ou digitar termos de busca mais gerais.</p>
      </div>
    `;
    return;
  }

  const cardsHtml = nextBatch.map(p => {
    const categoryInfo = PROMPT_CATEGORIES[p.category] || { label: p.category, icon: "lightbulb" };
    
    // Hide details or show full if unlocked
    let previewText = p.prompt;
    let blurStyle = "";
    let lockedBadgeHtml = "";
    
    if (!userHasAccess) {
      previewText = "PROMPT PREMIUM TRUNCADO E BLOQUEADO. ADQUIRA A BIBLIOTECA COMPLETA POR R$ 99,00 PARA DESBLOQUEAR ESTE E TODOS OS OUTROS 1.199 PROMPTS DE ALTA PERFORMANCE.";
      blurStyle = 'style="filter: blur(4px); user-select: none;"';
      lockedBadgeHtml = `<span class="prompt-card__badge" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);"><span class="material-symbols-outlined" style="font-size:12px; vertical-align:middle; margin-right:4px;">lock</span>Bloqueado</span>`;
    } else {
      lockedBadgeHtml = `<span class="prompt-card__badge prompt-card__badge--ia">${p.aiModel}</span>`;
    }

    const diffClass = p.difficulty === "Avançado" ? "prompt-card__badge--avancado" : "";

    return `
      <div class="prompt-card animate-fade-in-up" data-id="${p.id}">
        <div class="prompt-card__header">
          <span style="font-size: var(--font-xs); color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
            <span class="material-symbols-outlined" style="font-size:16px;">${categoryInfo.icon}</span>
            ${categoryInfo.label}
          </span>
          ${lockedBadgeHtml}
        </div>
        <h3 class="prompt-card__title">${p.title}</h3>
        <div class="prompt-card__preview" ${blurStyle}>${previewText}</div>
        <div class="prompt-card__footer">
          <button onclick="handleViewPrompt('${p.id}')" class="btn btn-sm btn-secondary" style="flex:1;">Ver Detalhes</button>
          <button onclick="handleCopyPrompt('${p.id}', event)" class="btn btn-sm btn-primary" style="gap: 4px;">
            <span class="material-symbols-outlined" style="font-size: 16px;">content_copy</span> Copiar
          </button>
        </div>
      </div>
    `;
  }).join("");

  if (displayedCount === 0) {
    grid.innerHTML = cardsHtml;
  } else {
    grid.insertAdjacentHTML("beforeend", cardsHtml);
  }

  displayedCount += nextBatch.length;

  // Update counter again
  const counterEl = document.getElementById("filtered-counter");
  if (counterEl) {
    counterEl.innerHTML = `Mostrando <strong>${displayedCount}</strong> de <strong>${filteredPrompts.length}</strong> prompts`;
  }
}

// Infinite scroll trigger
function setupLazyLoading() {
  const sentinel = document.getElementById("load-more-sentinel");
  if (!sentinel) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && displayedCount < filteredPrompts.length) {
      renderMorePrompts();
    }
  }, {
    rootMargin: "200px"
  });

  observer.observe(sentinel);
}

// Copy prompt logic
function handleCopyPrompt(promptId, event) {
  if (event) event.stopPropagation();

  if (!userHasAccess) {
    showUnlockModal();
    return;
  }

  const promptObj = PROMPTS_DATABASE.find(p => p.id === promptId);
  if (!promptObj) return;

  navigator.clipboard.writeText(promptObj.prompt).then(() => {
    showToast("Prompt copiado para a área de transferência!");
  }).catch(err => {
    console.error("Erro ao copiar: ", err);
  });
}

// View details modal logic
function handleViewPrompt(promptId) {
  const promptObj = PROMPTS_DATABASE.find(p => p.id === promptId);
  if (!promptObj) return;

  const modal = document.getElementById("prompt-details-modal");
  const box = document.getElementById("modal-box-content");
  if (!modal || !box) return;

  const categoryInfo = PROMPT_CATEGORIES[promptObj.category] || { label: promptObj.category, icon: "lightbulb" };

  if (!userHasAccess) {
    const course = COURSES_DATA.find(c => c.id === "biblioteca-prompts-ia");
    const link = course ? course.paymentLink : "checkout.html?id=biblioteca-prompts-ia";
    box.innerHTML = `
      <div style="text-align: center; padding: var(--space-4) 0;">
        <span class="material-symbols-outlined" style="font-size: 64px; color: #ef4444; margin-bottom: var(--space-4);">lock</span>
        <h2 style="font-size: var(--font-2xl); margin-bottom: var(--space-2);">Prompt Premium Bloqueado</h2>
        <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto var(--space-8) auto;">
          Esta biblioteca de prompts de alta performance é exclusiva para alunos. Desbloqueie o acesso a todos os 1.200 prompts estruturados por R$ 99,00.
        </p>
        <div style="display:flex; gap: var(--space-4); justify-content:center;">
          <a href="${link}" ${link.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary">Adquirir Acesso (R$ 99,00)</a>
          <button onclick="closeModal()" class="btn btn-secondary">Voltar</button>
        </div>
      </div>
    `;
  } else {
    box.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-4);">
        <span style="font-size: var(--font-xs); color: var(--text-muted); display:flex; align-items:center; gap:4px;">
          <span class="material-symbols-outlined" style="font-size:16px;">${categoryInfo.icon}</span>
          ${categoryInfo.label}
        </span>
        <span class="prompt-card__badge prompt-card__badge--ia">${promptObj.aiModel}</span>
      </div>
      <h2 style="font-family: var(--font-heading); font-size: var(--font-2xl); margin-bottom: var(--space-4);">${promptObj.title}</h2>
      
      <div class="prompt-modal__text" id="modal-prompt-text">${promptObj.prompt}</div>
      
      <div style="display:flex; gap: var(--space-4); flex-wrap: wrap; margin-bottom: var(--space-6);">
        <span class="prompt-card__badge prompt-card__badge--dificuldade">Dificuldade: ${promptObj.difficulty}</span>
        ${promptObj.tags.map(t => `<span class="prompt-card__badge" style="background:rgba(255,255,255,0.03); color:var(--text-secondary);">#${t}</span>`).join("")}
      </div>

      <div style="display:flex; gap: var(--space-4); justify-content: flex-end;">
        <button onclick="closeModal()" class="btn btn-secondary">Fechar</button>
        <button onclick="handleCopyPrompt('${promptObj.id}')" class="btn btn-primary" style="gap: var(--space-2);">
          <span class="material-symbols-outlined" style="font-size: 20px;">content_copy</span> Copiar Prompt
        </button>
      </div>
    `;
  }

  modal.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("prompt-details-modal");
  if (modal) modal.classList.remove("active");
}

// Show redirect message if locked
function showUnlockModal() {
  const modal = document.getElementById("prompt-details-modal");
  const box = document.getElementById("modal-box-content");
  if (!modal || !box) return;

  const course = COURSES_DATA.find(c => c.id === "biblioteca-prompts-ia");
  const link = course ? course.paymentLink : "checkout.html?id=biblioteca-prompts-ia";

  box.innerHTML = `
    <div style="text-align: center; padding: var(--space-4) 0;">
      <span class="material-symbols-outlined" style="font-size: 64px; color: #ef4444; margin-bottom: var(--space-4);">lock</span>
      <h2 style="font-size: var(--font-2xl); margin-bottom: var(--space-2);">Conteúdo Exclusivo</h2>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto var(--space-8) auto;">
        Desbloqueie o acesso a mais de 1.200 prompts prontos de IA para negócios por R$ 99,00.
      </p>
      <div style="display:flex; gap: var(--space-4); justify-content:center;">
        <a href="${link}" ${link.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary">Adquirir Acesso (R$ 99,00)</a>
        <button onclick="closeModal()" class="btn btn-secondary">Cancelar</button>
      </div>
    </div>
  `;
  modal.classList.add("active");
}

// Copy prompt feedback notifications
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color: var(--accent-cyan);">check_circle</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Automatically remove toast after fadeOut ends
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
