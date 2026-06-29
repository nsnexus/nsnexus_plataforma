/* ============================================================
   NSNexus Admin Panel — admin.js
   Connects to Supabase to show users, purchases and stats
   ============================================================ */

/* -------- CONSTANTS -------- */
const ADMIN_EMAILS = ["narcisofelizardo@gmail.com"]; // Narciso Felizardo is pre-defined as Admin

/* -------- STATE -------- */
let allUsers = [];
let allPurchases = [];
let currentSection = 'overview';

/* -------- SIDEBAR TOGGLE -------- */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.querySelector('.admin-main');
  sidebar.classList.toggle('collapsed');
  sidebar.classList.toggle('open');
  main.classList.toggle('full');
}

/* -------- SECTION NAVIGATION -------- */
function showSection(name, el) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  if (el) el.classList.add('active');
  currentSection = name;
}

/* -------- GLOBAL SEARCH -------- */
function handleSearch(val) {
  if (currentSection === 'users') filterUsers(val);
  else if (currentSection === 'purchases') filterPurchases(val);
}

/* -------- UTILITY HELPERS -------- */
function formatBRL(val) {
  if (!val && val !== 0) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

function getCourseData(courseId) {
  return (typeof COURSES_DATA !== 'undefined' ? COURSES_DATA : []).find(c => c.id === courseId) || null;
}

function getCourseTagClass(course) {
  if (!course) return 'tag-sys';
  if (course.type === 'pdf') return 'tag-pdf';
  if (course.type === 'custom') return 'tag-custom';
  if (course.category === 'ia') return 'tag-ia';
  return 'tag-sys';
}

/* -------- LOAD ALL DATA -------- */
async function loadAll() {
  const btn = document.querySelector('.btn-refresh');
  if (btn) btn.classList.add('spinning');

  try {
    await Promise.all([loadUsers(), loadPurchases()]);
    populateFilterDropdowns();
    renderOverview();
    renderProductsSection();
  } catch (err) {
    console.error('[Admin] Erro ao carregar dados:', err);
  } finally {
    if (btn) btn.classList.remove('spinning');
  }
}

/* -------- LOAD USERS from Supabase -------- */
async function loadUsers() {
  if (!supabaseClient) {
    allUsers = getMockUsers();
    renderUsersTable(allUsers);
    return;
  }

  try {
    // Query the profiles table (has name, avatar_url, enrolled_courses, progress)
    const { data: profiles, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Try to fetch emails via admin API (only works with service-role key — will silently fail with anon key)
    let emailMap = {};
    try {
      const { data: adminData } = await supabaseClient.auth.admin.listUsers();
      if (adminData && adminData.users) {
        adminData.users.forEach(u => { emailMap[u.id] = u.email; });
      }
    } catch (_) {
      // Normal: anon key doesn't allow admin.listUsers(). Email will show as '—'
    }

    allUsers = (profiles || []).map(p => ({
      id: p.id,
      name: p.name || 'Sem nome',
      email: emailMap[p.id] || p.email || '—',
      avatar_url: p.avatar_url || null,
      enrolled_courses: p.enrolled_courses || [],
      progress: p.progress || {},
      created_at: p.created_at || null
    }));

    renderUsersTable(allUsers);
  } catch (err) {
    console.error('[Admin] Erro ao buscar usuários:', err);
    // Fallback to mock
    allUsers = getMockUsers();
    renderUsersTable(allUsers);
  }
}

/* -------- LOAD PURCHASES -------- */
async function loadPurchases() {
  // Purchases are derived from enrolled_courses on each profile
  // If a dedicated purchases table exists, query it here instead
  if (!supabaseClient) {
    allPurchases = getMockPurchases();
    renderPurchasesTable(allPurchases);
    return;
  }

  try {
    // Try a dedicated purchases table first
    const { data: purchases, error } = await supabaseClient
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && purchases && purchases.length > 0) {
      allPurchases = purchases.map(p => ({
        user_id: p.user_id,
        user_name: p.user_name || '—',
        user_email: p.user_email || '—',
        course_id: p.course_id || p.product_id || '',
        created_at: p.created_at
      }));
    } else {
      // Derive purchases from profiles.enrolled_courses
      allPurchases = [];
      allUsers.forEach(u => {
        (u.enrolled_courses || []).forEach(cid => {
          allPurchases.push({
            user_id: u.id,
            user_name: u.name,
            user_email: u.email,
            course_id: cid,
            progress: u.progress[cid] || null
          });
        });
      });
    }

    renderPurchasesTable(allPurchases);
  } catch (err) {
    console.error('[Admin] Erro ao buscar compras:', err);
    allPurchases = getMockPurchases();
    renderPurchasesTable(allPurchases);
  }
}

/* -------- MOCK DATA (local fallback) -------- */
function getMockUsers() {
  return [
    { id: 'u1', name: 'Lucas Souza', email: 'lucas@email.com', enrolled_courses: ['biblioteca-prompts-ia', 'sistemas-sharepoint-moderno'], progress: { 'biblioteca-prompts-ia': { percentage: 80 }, 'sistemas-sharepoint-moderno': { percentage: 35 } }, created_at: '2026-06-10T09:00:00Z' },
    { id: 'u2', name: 'Ana Ribeiro', email: 'ana.ribeiro@empresa.com', enrolled_courses: ['biblioteca-prompts-ia'], progress: { 'biblioteca-prompts-ia': { percentage: 100 } }, created_at: '2026-06-15T14:30:00Z' },
    { id: 'u3', name: 'Carlos Mendes', email: 'carlos@gmail.com', enrolled_courses: ['sistemas-sharepoint-moderno', 'landing-page-whatsapp'], progress: { 'sistemas-sharepoint-moderno': { percentage: 10 } }, created_at: '2026-06-20T11:00:00Z' },
    { id: 'u4', name: 'Fernanda Lima', email: 'fernanda.lima@rh.com', enrolled_courses: ['biblioteca-prompts-ia', 'landing-page-whatsapp', 'sistemas-sharepoint-moderno'], progress: { 'biblioteca-prompts-ia': { percentage: 60 } }, created_at: '2026-06-22T08:00:00Z' },
    { id: 'u5', name: 'Ricardo Alves', email: 'ricardo.alves@outlook.com', enrolled_courses: [], progress: {}, created_at: '2026-06-25T16:00:00Z' }
  ];
}

function getMockPurchases() {
  const purchases = [];
  getMockUsers().forEach(u => {
    u.enrolled_courses.forEach(cid => {
      purchases.push({
        user_id: u.id, user_name: u.name, user_email: u.email,
        course_id: cid, progress: u.progress[cid] || null
      });
    });
  });
  return purchases;
}

/* -------- RENDER USERS TABLE -------- */
function renderUsersTable(users) {
  const tbody = document.getElementById('users-tbody');
  const count = document.getElementById('users-count');
  if (!tbody) return;

  count.textContent = users.length + ' usuário(s)';

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">👤</div><p>Nenhum usuário encontrado.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const initials = getInitials(u.name);
    const courses = u.enrolled_courses || [];
    const tagsHtml = courses.length
      ? courses.map(cid => {
          const course = getCourseData(cid);
          const label = course ? course.badgeLabel : cid;
          const cls = getCourseTagClass(course);
          return `<span class="tag ${cls}">${label}</span>`;
        }).join('')
      : '<span class="tag tag-custom" style="opacity:0.5">Sem compras</span>';

    return `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar">${initials}</div>
            <div>
              <div class="user-name">${escHtml(u.name)}</div>
            </div>
          </div>
        </td>
        <td>${escHtml(u.email)}</td>
        <td>${formatDate(u.created_at)}</td>
        <td><div class="tags-wrap">${tagsHtml}</div></td>
        <td>
          <button class="btn-view" onclick="openUserModal('${escAttr(u.id)}')">Ver Detalhes</button>
        </td>
      </tr>`;
  }).join('');
}

/* -------- RENDER PURCHASES TABLE -------- */
function renderPurchasesTable(purchases) {
  const tbody = document.getElementById('purchases-tbody');
  const count = document.getElementById('purchases-count');
  if (!tbody) return;

  count.textContent = purchases.length + ' compra(s)';

  if (!purchases.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">🛒</div><p>Nenhuma compra registrada.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = purchases.map(p => {
    const course = getCourseData(p.course_id);
    const courseName = course ? course.title : p.course_id;
    const price = course ? course.price : 0;
    const cls = getCourseTagClass(course);
    const label = course ? course.badgeLabel : p.course_id;
    const pct = p.progress ? (p.progress.percentage || 0) : 0;
    const initials = getInitials(p.user_name);

    return `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar">${initials}</div>
            <div class="user-name">${escHtml(p.user_name)}</div>
          </div>
        </td>
        <td>${escHtml(p.user_email)}</td>
        <td>
          <div>
            <span class="tag ${cls}" style="margin-bottom:4px;display:inline-block;">${label}</span><br/>
            <span style="font-size:12px;color:var(--text-secondary)">${escHtml(courseName)}</span>
          </div>
        </td>
        <td style="color:var(--color-success);font-weight:700;">${price > 0 ? formatBRL(price) : 'Sob consulta'}</td>
        <td>
          <div class="progress-wrap">
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <span class="progress-pct">${pct}%</span>
          </div>
        </td>
      </tr>`;
  }).join('');
}

/* -------- FILTER FUNCTIONS -------- */
function filterUsers(searchVal) {
  const courseFilter = document.getElementById('user-filter-course')?.value || '';
  const q = (searchVal || '').toLowerCase();
  const filtered = allUsers.filter(u => {
    const matchSearch = !q ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q);
    const matchCourse = !courseFilter || (u.enrolled_courses || []).includes(courseFilter);
    return matchSearch && matchCourse;
  });
  renderUsersTable(filtered);
}

function filterPurchases(searchVal) {
  const courseFilter = document.getElementById('purchase-filter')?.value || '';
  const q = (searchVal || '').toLowerCase();
  const filtered = allPurchases.filter(p => {
    const course = getCourseData(p.course_id);
    const courseName = course ? course.title : p.course_id;
    const matchSearch = !q ||
      (p.user_name || '').toLowerCase().includes(q) ||
      (p.user_email || '').toLowerCase().includes(q) ||
      courseName.toLowerCase().includes(q);
    const matchCourse = !courseFilter || p.course_id === courseFilter;
    return matchSearch && matchCourse;
  });
  renderPurchasesTable(filtered);
}

/* -------- POPULATE DROPDOWN FILTERS -------- */
function populateFilterDropdowns() {
  const courses = typeof COURSES_DATA !== 'undefined' ? COURSES_DATA : [];
  const options = courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('');

  const userFilter = document.getElementById('user-filter-course');
  const purchaseFilter = document.getElementById('purchase-filter');

  if (userFilter) userFilter.innerHTML = '<option value="">Todos os Produtos</option>' + options;
  if (purchaseFilter) purchaseFilter.innerHTML = '<option value="">Todos os Produtos</option>' + options;
}

/* -------- RENDER OVERVIEW -------- */
function renderOverview() {
  const courses = typeof COURSES_DATA !== 'undefined' ? COURSES_DATA : [];

  // KPI: total users
  document.getElementById('kpi-total-users').textContent = allUsers.length;

  // KPI: total purchases
  document.getElementById('kpi-total-purchases').textContent = allPurchases.length;

  // KPI: total revenue
  let totalRev = 0;
  allPurchases.forEach(p => {
    const course = getCourseData(p.course_id);
    if (course && course.price) totalRev += course.price;
  });
  document.getElementById('kpi-total-revenue').textContent = formatBRL(totalRev);

  // KPI: avg per user (users with at least 1 purchase)
  const buyingUsers = allUsers.filter(u => (u.enrolled_courses || []).length > 0).length;
  const avg = buyingUsers > 0 ? totalRev / buyingUsers : 0;
  document.getElementById('kpi-avg-per-user').textContent = formatBRL(avg);

  // Top products by sales count
  const salesCount = {};
  allPurchases.forEach(p => {
    salesCount[p.course_id] = (salesCount[p.course_id] || 0) + 1;
  });

  const topProducts = Object.entries(salesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cid, cnt]) => {
      const course = getCourseData(cid);
      return { course, cid, cnt };
    });

  const rankClasses = ['gold', 'silver', 'bronze', '', ''];
  const topEl = document.getElementById('top-products-list');
  if (topProducts.length === 0) {
    topEl.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><p>Nenhuma venda ainda.</p></div>';
  } else {
    topEl.innerHTML = topProducts.map(({ course, cid, cnt }, i) => {
      const name = course ? course.title : cid;
      const rev = course ? cnt * course.price : 0;
      return `
        <div class="top-product-item">
          <div class="product-rank ${rankClasses[i]}">${i + 1}</div>
          <div class="product-info">
            <div class="product-name">${escHtml(name)}</div>
            <div class="product-sales">${cnt} venda${cnt !== 1 ? 's' : ''}</div>
          </div>
          <div class="product-revenue">${formatBRL(rev)}</div>
        </div>`;
    }).join('');
  }

  // Recent users
  const recentUsers = [...allUsers]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const recentEl = document.getElementById('recent-users-list');
  if (recentUsers.length === 0) {
    recentEl.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><p>Nenhum usuário ainda.</p></div>';
  } else {
    recentEl.innerHTML = recentUsers.map(u => `
      <div class="recent-user-item">
        <div class="user-avatar" style="width:36px;height:36px;flex-shrink:0;">${getInitials(u.name)}</div>
        <div class="recent-user-info">
          <div class="recent-user-name">${escHtml(u.name)}</div>
          <div class="recent-user-email">${escHtml(u.email)}</div>
        </div>
        <div class="recent-user-date">${formatDate(u.created_at)}</div>
      </div>`).join('');
  }
}

/* -------- RENDER PRODUCTS SECTION -------- */
function renderProductsSection() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const courses = typeof COURSES_DATA !== 'undefined' ? COURSES_DATA : [];
  const salesCount = {};
  allPurchases.forEach(p => { salesCount[p.course_id] = (salesCount[p.course_id] || 0) + 1; });

  grid.innerHTML = courses.map(c => {
    const sales = salesCount[c.id] || 0;
    const cls = getCourseTagClass(c);
    return `
      <div class="product-card">
        <img src="${escAttr(c.banner)}" alt="${escAttr(c.title)}" onerror="this.style.background='#131724';this.style.height='160px'" />
        <div class="product-card-body">
          <div class="product-card-badge"><span class="tag ${cls}">${escHtml(c.badgeLabel)}</span></div>
          <div class="product-card-title">${escHtml(c.title)}</div>
          <div class="product-card-stats">
            <div class="product-card-price">${c.price > 0 ? formatBRL(c.price) : 'Sob consulta'}</div>
            <div class="product-card-students">👥 ${sales} aluno${sales !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* -------- USER DETAIL MODAL -------- */
function openUserModal(userId) {
  const user = allUsers.find(u => u.id === userId);
  if (!user) return;

  document.getElementById('modal-avatar').textContent = getInitials(user.name);
  document.getElementById('modal-name').textContent = user.name;
  document.getElementById('modal-email').textContent = user.email;
  document.getElementById('modal-date').textContent = 'Cadastrado em: ' + formatDate(user.created_at);

  const courses = user.enrolled_courses || [];
  const coursesEl = document.getElementById('modal-courses');
  if (courses.length === 0) {
    coursesEl.innerHTML = '<div class="modal-no-courses">Nenhum produto adquirido.</div>';
  } else {
    coursesEl.innerHTML = courses.map(cid => {
      const course = getCourseData(cid);
      const name = course ? course.title : cid;
      const price = course && course.price > 0 ? formatBRL(course.price) : 'Sob consulta';
      const pct = user.progress && user.progress[cid] ? (user.progress[cid].percentage || 0) : 0;
      return `
        <div class="modal-course-item">
          <div>
            <div class="modal-course-name">${escHtml(name)}</div>
            <div class="progress-wrap" style="margin-top:6px;">
              <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
              <span class="progress-pct">${pct}% concluído</span>
            </div>
          </div>
          <div class="modal-course-price">${price}</div>
        </div>`;
    }).join('');
  }

  document.getElementById('modal-overlay').classList.add('visible');
  document.getElementById('user-modal').classList.add('visible');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('visible');
  document.getElementById('user-modal').classList.remove('visible');
}

/* -------- ADMIN LOGOUT -------- */
async function adminLogout() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  localStorage.removeItem('nsnexus_admin');
  window.location.href = 'login.html';
}

/* -------- SECURITY HELPERS -------- */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
function escAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}

/* -------- ADMIN AUTH GUARD -------- */
async function checkAdminAccess() {
  if (supabaseClient) {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
      // Store intended destination and redirect to login
      localStorage.setItem('post_login_redirect', 'admin.html');
      window.location.href = 'login.html';
      return false;
    }
    // Optionally restrict to specific emails
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(session.user.email)) {
      alert('Acesso não autorizado. Apenas administradores podem acessar este painel.');
      window.location.href = 'index.html';
      return false;
    }
  } else {
    // In simulation mode, check if there is a simulated user logged in with the admin email
    let user = null;
    try {
      const userData = localStorage.getItem("nsnexus_user");
      if (userData) user = JSON.parse(userData);
    } catch (e) {
      console.error(e);
    }
    
    if (!user) {
      localStorage.setItem('post_login_redirect', 'admin.html');
      window.location.href = 'login.html';
      return false;
    }
    
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(user.email)) {
      alert('Acesso não autorizado. Apenas administradores podem acessar este painel.');
      window.location.href = 'index.html';
      return false;
    }
  }
  return true;
}

/* -------- INIT -------- */
document.addEventListener('DOMContentLoaded', async () => {
  const allowed = await checkAdminAccess();
  if (!allowed) return;
  await loadAll();
});
