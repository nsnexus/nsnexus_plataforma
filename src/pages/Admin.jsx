import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { COURSES_DATA } from '../data/platformData';
import '../assets/styles/admin.css';

export const Admin = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Active section state
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Database lists
  const [dbUsers, setDbUsers] = useState([]);
  const [dbPurchases, setDbPurchases] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [purchaseFilter, setPurchaseFilter] = useState('all');

  // Manual purchase form states
  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [manualPrice, setManualPrice] = useState(0);
  const [addingPurchase, setAddingPurchase] = useState(false);

  // Fetch all profiles and purchases from Supabase
  const loadData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setDbUsers(profiles || []);

      // 2. Fetch purchases
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (purchasesError) throw purchasesError;
      setDbPurchases(purchases || []);

    } catch (err) {
      console.error('[Admin] Erro ao carregar dados:', err);
      alert('Erro ao buscar dados do banco de dados. Verifique suas regras de RLS.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdminLogout = async () => {
    await signOut();
    navigate('/');
  };

  // KPI calculations
  const kpis = useMemo(() => {
    const totalUsers = dbUsers.length;
    const totalPurchases = dbPurchases.length;
    
    // Sum only approved purchases
    const approvedPurchases = dbPurchases.filter(p => p.status === 'approved');
    const totalRevenue = approvedPurchases.reduce((sum, p) => sum + (Number(p.price_paid) || 0), 0);

    // Conversion rate: users who purchased at least one approved course
    const payingUserIds = new Set(approvedPurchases.map(p => p.user_id));
    const conversionRate = totalUsers > 0 
      ? Math.round((payingUserIds.size / totalUsers) * 100) 
      : 0;

    return {
      totalUsers,
      totalPurchases,
      totalRevenue,
      conversionRate
    };
  }, [dbUsers, dbPurchases]);

  // Filter lists based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return dbUsers;
    const query = searchTerm.toLowerCase().trim();
    return dbUsers.filter(u => 
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      u.id.includes(query)
    );
  }, [dbUsers, searchTerm]);

  const filteredPurchases = useMemo(() => {
    let result = dbPurchases;
    
    // Status Filter
    if (purchaseFilter !== 'all') {
      result = result.filter(p => p.status === purchaseFilter);
    }

    if (!searchTerm.trim()) return result;
    const query = searchTerm.toLowerCase().trim();
    return result.filter(p => 
      (p.user_name && p.user_name.toLowerCase().includes(query)) ||
      (p.user_email && p.user_email.toLowerCase().includes(query)) ||
      (p.course_id && p.course_id.toLowerCase().includes(query)) ||
      (p.payment_id && p.payment_id.toLowerCase().includes(query))
    );
  }, [dbPurchases, purchaseFilter, searchTerm]);

  // Handle manual purchase insert
  const handleAddManualPurchase = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !selectedCourseId) {
      alert("Selecione o usuário e o curso.");
      return;
    }

    setAddingPurchase(true);
    try {
      const selectedUser = dbUsers.find(u => u.id === selectedUserId);
      const selectedCourse = COURSES_DATA.find(c => c.id === selectedCourseId);
      
      const transactionId = 'MAN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      const { error } = await supabase
        .from('purchases')
        .insert({
          user_id: selectedUserId,
          user_email: selectedUser?.email || '',
          user_name: selectedUser?.name || 'Sem nome',
          course_id: selectedCourseId,
          price_paid: manualPrice || selectedCourse?.price || 0,
          status: 'approved',
          payment_id: transactionId
        });

      if (error) throw error;

      alert("Compra registrada com sucesso no banco de dados!");
      setShowAddPurchaseModal(false);
      setSelectedUserId('');
      setSelectedCourseId('');
      setManualPrice(0);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar compra: " + err.message);
    } finally {
      setAddingPurchase(false);
    }
  };

  // Toggle status of a purchase (Approve/Cancel)
  const togglePurchaseStatus = async (purchaseId, currentStatus) => {
    const nextStatus = currentStatus === 'approved' ? 'cancelled' : 'approved';
    if (!window.confirm(`Deseja alterar o status desta compra para ${nextStatus.toUpperCase()}?`)) return;

    try {
      const { error } = await supabase
        .from('purchases')
        .update({ status: nextStatus })
        .eq('id', purchaseId);

      if (error) throw error;
      
      alert("Status da transação atualizado com sucesso!");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar status: " + err.message);
    }
  };

  const getCourseTitle = (courseId) => {
    return COURSES_DATA.find(c => c.id === courseId)?.title || courseId;
  };

  return (
    <div className="admin-body-override" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', color: 'white' }}>
      
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`} id="sidebar" style={{ zIndex: 100 }}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <span className="brand-icon">⚡</span>
            <div>
              <div className="brand-name">NSNexus</div>
              <div className="brand-label">Painel Admin</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`} 
            onClick={() => { setActiveSection('overview'); setSidebarOpen(false); }}
          >
            <span className="nav-icon">📊</span>
            <span>Visão Geral</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`} 
            onClick={() => { setActiveSection('users'); setSidebarOpen(false); }}
          >
            <span className="nav-icon">👥</span>
            <span>Usuários ({dbUsers.length})</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'purchases' ? 'active' : ''}`} 
            onClick={() => { setActiveSection('purchases'); setSidebarOpen(false); }}
          >
            <span className="nav-icon">🛒</span>
            <span>Compras ({dbPurchases.length})</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'products' ? 'active' : ''}`} 
            onClick={() => { setActiveSection('products'); setSidebarOpen(false); }}
          >
            <span className="nav-icon">📦</span>
            <span>Produtos ({COURSES_DATA.length})</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleAdminLogout} style={{ width: '100%', cursor: 'pointer' }}>
            <span>🚪</span> Sair
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main" style={{ flexGrow: 1, padding: '30px', minWidth: 0 }}>
        
        {/* Topbar */}
        <header className="admin-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="topbar-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none' }} id="menu-toggle">☰</button>
            <div className="topbar-search" style={{ display: 'flex', alignItems: 'center', background: 'rgba(15,23,42,0.45)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '5px 15px' }}>
              <span className="search-icon" style={{ marginRight: '8px' }}>🔍</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuário, produto, e-mail..." 
                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '250px' }}
              />
            </div>
          </div>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="btn-refresh" onClick={loadData} title="Recarregar dados" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer' }}>
              <span>🔄</span>
            </button>
            <div className="admin-badge" style={{ background: 'rgba(0, 245, 212, 0.1)', color: 'var(--accent-cyan)', padding: '5px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-xs)' }}>
              <span className="admin-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></span>
              Admin
            </div>
          </div>
        </header>

        {loadingData ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '15px' }}>
            <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', borderLeftColor: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Carregando dados reais do Supabase...</p>
          </div>
        ) : (
          <>
            {/* ========== SECTION: OVERVIEW ========== */}
            {activeSection === 'overview' && (
              <section className="admin-section active">
                <div className="section-header" style={{ marginBottom: '25px' }}>
                  <h1 className="section-title" style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold' }}>Visão Geral</h1>
                  <p className="section-subtitle" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Resumo real da plataforma</p>
                </div>

                {/* KPI Grid */}
                <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                  <div className="kpi-card kpi-blue">
                    <div className="kpi-icon">👥</div>
                    <div className="kpi-content">
                      <div className="kpi-value">{kpis.totalUsers}</div>
                      <div className="kpi-label">Usuários Cadastrados</div>
                    </div>
                    <div className="kpi-glow"></div>
                  </div>
                  <div className="kpi-card kpi-cyan">
                    <div className="kpi-icon">🛒</div>
                    <div className="kpi-content">
                      <div className="kpi-value">{kpis.totalPurchases}</div>
                      <div className="kpi-label">Total de Compras</div>
                    </div>
                    <div className="kpi-glow"></div>
                  </div>
                  <div className="kpi-card kpi-purple">
                    <div className="kpi-icon">💰</div>
                    <div className="kpi-content">
                      <div className="kpi-value">R$ {kpis.totalRevenue.toFixed(2)}</div>
                      <div className="kpi-label">Receita Acumulada</div>
                    </div>
                    <div className="kpi-glow"></div>
                  </div>
                  <div className="kpi-card kpi-green">
                    <div className="kpi-icon">🎯</div>
                    <div className="kpi-content">
                      <div className="kpi-value">{kpis.conversionRate}%</div>
                      <div className="kpi-label">Taxa de Conversão</div>
                    </div>
                    <div className="kpi-glow"></div>
                  </div>
                </div>

                {/* Recent Purchases & Users columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                  
                  {/* Recent Purchases */}
                  <div style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 'bold', marginBottom: '15px' }}>Últimas Vendas</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {dbPurchases.slice(0, 5).map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <div>
                            <div style={{ fontSize: 'var(--font-sm)', fontWeight: 'bold' }}>{p.user_name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{getCourseTitle(p.course_id)}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 'var(--font-sm)', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>R$ {Number(p.price_paid).toFixed(2)}</div>
                            <div style={{ fontSize: '10px', color: p.status === 'approved' ? 'var(--accent-cyan)' : '#ef4444' }}>{p.status.toUpperCase()}</div>
                          </div>
                        </div>
                      ))}
                      {dbPurchases.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>Nenhuma compra registrada.</p>}
                    </div>
                  </div>

                  {/* Recent Signups */}
                  <div style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 'bold', marginBottom: '15px' }}>Novos Estudantes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {dbUsers.slice(0, 5).map(u => (
                        <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <img src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'} alt={u.name} style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
                          <div>
                            <div style={{ fontSize: 'var(--font-sm)', fontWeight: 'bold' }}>{u.name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                          <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)' }}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—'}
                          </span>
                        </div>
                      ))}
                      {dbUsers.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>Nenhum usuário registrado.</p>}
                    </div>
                  </div>

                </div>
              </section>
            )}

            {/* ========== SECTION: USERS ========== */}
            {activeSection === 'users' && (
              <section className="admin-section active">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <div>
                    <h1 className="section-title" style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold' }}>Usuários Cadastrados</h1>
                    <p className="section-subtitle" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Lista de estudantes com perfil ativo no banco</p>
                  </div>
                </div>

                <div className="table-responsive" style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-sm)' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '15px' }}>Estudante</th>
                        <th style={{ padding: '15px' }}>E-mail</th>
                        <th style={{ padding: '15px' }}>Nível / Regras</th>
                        <th style={{ padding: '15px' }}>Progresso Salvo</th>
                        <th style={{ padding: '15px' }}>Data Cadastro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'} alt={u.name} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                            <span>{u.name}</span>
                          </td>
                          <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{u.email}</td>
                          <td style={{ padding: '15px' }}>
                            <span className={`badge ${u.role === 'admin' ? 'badge-ia' : 'badge-closed'}`} style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: 'var(--text-muted)', fontSize: '11px' }}>
                            {u.progress ? Object.keys(u.progress).map(courseId => (
                              <div key={courseId}>{courseId}: {u.progress[courseId]?.completedLessons?.length || 0} aulas</div>
                            )) : '—'}
                          </td>
                          <td style={{ padding: '15px', color: 'var(--text-muted)' }}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—'}
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum usuário encontrado.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ========== SECTION: PURCHASES ========== */}
            {activeSection === 'purchases' && (
              <section className="admin-section active">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h1 className="section-title" style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold' }}>Registro de Compras</h1>
                    <p className="section-subtitle" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Histórico real de transações e acessos</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select 
                      value={purchaseFilter}
                      onChange={(e) => setPurchaseFilter(e.target.value)}
                      style={{ padding: '8px 12px', background: 'rgba(15,23,42,0.45)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                    >
                      <option value="all">Todas as Compras</option>
                      <option value="approved">Aprovadas</option>
                      <option value="pending">Pendentes</option>
                      <option value="cancelled">Canceladas</option>
                    </select>

                    <button className="btn btn-primary btn-sm" onClick={() => setShowAddPurchaseModal(true)}>
                      + Registrar Venda
                    </button>
                  </div>
                </div>

                <div className="table-responsive" style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-sm)' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '15px' }}>Estudante</th>
                        <th style={{ padding: '15px' }}>Produto</th>
                        <th style={{ padding: '15px' }}>ID Transação</th>
                        <th style={{ padding: '15px' }}>Valor</th>
                        <th style={{ padding: '15px' }}>Status</th>
                        <th style={{ padding: '15px' }}>Data</th>
                        <th style={{ padding: '15px', textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '15px' }}>
                            <span style={{ fontWeight: 'bold', display: 'block' }}>{p.user_name}</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{p.user_email}</span>
                          </td>
                          <td style={{ padding: '15px' }}>{getCourseTitle(p.course_id)}</td>
                          <td style={{ padding: '15px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{p.payment_id || p.id.substr(0,8)}</td>
                          <td style={{ padding: '15px', fontWeight: 'bold' }}>R$ {Number(p.price_paid).toFixed(2)}</td>
                          <td style={{ padding: '15px' }}>
                            <span className={`badge ${p.status === 'approved' ? 'badge-ia' : p.status === 'pending' ? 'badge-systems' : 'badge-closed'}`} style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                              {p.status}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: 'var(--text-muted)' }}>
                            {p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : '—'}
                          </td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <button 
                              onClick={() => togglePurchaseStatus(p.id, p.status)} 
                              className={`btn btn-sm ${p.status === 'approved' ? 'btn-outline' : 'btn-primary'}`}
                              style={{ padding: '4px 10px', fontSize: '10px' }}
                            >
                              {p.status === 'approved' ? 'Cancelar' : 'Aprovar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredPurchases.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma transação encontrada.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ========== SECTION: PRODUCTS ========== */}
            {activeSection === 'products' && (
              <section className="admin-section active">
                <div style={{ marginBottom: '25px' }}>
                  <h1 className="section-title" style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold' }}>Produtos Cadastrados</h1>
                  <p className="section-subtitle" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Catálogo de Cursos estáticos expostos na plataforma</p>
                </div>

                <div className="table-responsive" style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-sm)' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '15px' }}>ID Curso</th>
                        <th style={{ padding: '15px' }}>Título</th>
                        <th style={{ padding: '15px' }}>Categoria</th>
                        <th style={{ padding: '15px' }}>Preço</th>
                        <th style={{ padding: '15px' }}>Matrículas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COURSES_DATA.map(course => {
                        const purchasesCount = dbPurchases.filter(p => p.course_id === course.id && p.status === 'approved').length;
                        return (
                          <tr key={course.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '15px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{course.id}</td>
                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{course.title}</td>
                            <td style={{ padding: '15px' }}>
                              <span className={`badge ${course.badgeClass}`} style={{ fontSize: '10px' }}>
                                {course.badgeLabel}
                              </span>
                            </td>
                            <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                              {course.isClosed ? 'Sob Encomenda' : `R$ ${course.price.toFixed(2)}`}
                            </td>
                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{purchasesCount} vendas aprovadas</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}

      </main>

      {/* MANUAL PURCHASE MODAL */}
      {showAddPurchaseModal && (
        <div className="video-modal video-modal--active" onClick={() => setShowAddPurchaseModal(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="video-modal__content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', width: '90%', background: '#0f172a', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>Registrar Nova Venda Manual</h3>
              <button onClick={() => setShowAddPurchaseModal(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>

            <form onSubmit={handleAddManualPurchase} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* Select User */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Selecionar Estudante</label>
                <select 
                  required 
                  value={selectedUserId} 
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                >
                  <option value="">-- Selecione o Estudante --</option>
                  {dbUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              {/* Select Course */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Selecionar Curso / Produto</label>
                <select 
                  required 
                  value={selectedCourseId} 
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    const courseObj = COURSES_DATA.find(c => c.id === e.target.value);
                    setManualPrice(courseObj?.price || 0);
                  }}
                  style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                >
                  <option value="">-- Selecione o Curso --</option>
                  {COURSES_DATA.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Manual Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Preço Pago (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={manualPrice}
                  onChange={(e) => setManualPrice(parseFloat(e.target.value) || 0)}
                  style={{ padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
                />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddPurchaseModal(false)}>Cancelar</button>
                <button type="submit" disabled={addingPurchase} className="btn btn-primary">
                  {addingPurchase ? 'Registrando...' : 'Registrar Venda'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Admin;
