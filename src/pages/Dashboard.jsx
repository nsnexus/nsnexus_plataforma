import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COURSES_DATA } from '../data/platformData';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'white' }}>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  // Find enrolled courses from COURSES_DATA
  const enrolledCoursesList = COURSES_DATA.filter(c => user.enrolledCourses?.includes(c.id));
  
  // Find recommended courses (not enrolled yet)
  const recommendedCoursesList = COURSES_DATA.filter(c => !user.enrolledCourses?.includes(c.id) && !c.isClosed);

  // Helper to calculate progress
  const getCourseProgress = (course) => {
    const totalLessons = course.syllabus?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;
    
    if (totalLessons === 0) return { percentage: 0, completedCount: 0, totalCount: 0 };
    
    const completedList = user.progress?.[course.id]?.completedLessons || [];
    const percentage = Math.min(100, Math.round((completedList.length / totalLessons) * 100));
    
    return {
      percentage,
      completedCount: completedList.length,
      totalCount: totalLessons
    };
  };

  // Helper to get continue link
  const getContinueLink = (course) => {
    const completedList = user.progress?.[course.id]?.completedLessons || [];
    
    let nextLessonId = null;
    if (course.syllabus) {
      for (const mod of course.syllabus) {
        for (const les of mod.lessons) {
          if (!completedList.includes(les.id)) {
            nextLessonId = les.id;
            break;
          }
        }
        if (nextLessonId) break;
      }
    }

    // Default to first lesson if all completed or none found
    if (!nextLessonId && course.syllabus?.[0]?.lessons?.[0]) {
      nextLessonId = course.syllabus[0].lessons[0].id;
    }

    return `/player/${course.id}/${nextLessonId}`;
  };

  return (
    <main style={{ paddingTop: '100px', minHeight: '90vh', background: 'var(--bg-primary)', color: 'white' }}>
      <section className="container" style={{ paddingBottom: 'var(--space-20)' }}>
        
        {/* Student Profile Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', background: 'rgba(15, 23, 42, 0.45)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', marginBottom: 'var(--space-10)', flexWrap: 'wrap' }}>
          <img 
            src={user.avatar_url} 
            alt={user.name} 
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-cyan)' }} 
          />
          <div>
            <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 'bold' }}>Olá, {user.name}!</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Estudante NSNexus • {user.email}</p>
          </div>
          {user.role === 'admin' && (
            <Link to="/admin" className="btn btn-sm btn-primary" style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', border: 'none', color: 'white' }}>
              Acessar Painel Admin
            </Link>
          )}
        </div>

        {/* Enrolled Courses Grid */}
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--space-6)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            Meus Cursos & Ferramentas
          </h2>

          {enrolledCoursesList.length > 0 ? (
            <div className="card-grid">
              {enrolledCoursesList.map(course => {
                const isBiblioteca = course.id === 'biblioteca-prompts-ia';
                const { percentage, completedCount, totalCount } = getCourseProgress(course);

                return (
                  <div key={course.id} className="course-card">
                    <div className="course-card__thumb">
                      <img src={course.banner} alt={course.title} />
                      <div className="course-card__badge-group">
                        <span className={`badge ${course.badgeClass}`}>{course.badgeLabel}</span>
                      </div>
                    </div>
                    <div className="course-card__content" style={{ display: 'flex', flexDirection: 'column', height: 'auto' }}>
                      <h3 className="course-card__title" style={{ marginTop: '0' }}>{course.title}</h3>
                      
                      {!isBiblioteca && (
                        <div style={{ margin: 'var(--space-4) 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            <span>Progresso</span>
                            <span>{percentage}% ({completedCount}/{totalCount} aulas)</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--accent-cyan)', transition: 'width 0.3s' }}></div>
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)' }}>
                        {isBiblioteca ? (
                          <Link to="/biblioteca-prompts" className="btn btn-primary btn-full" style={{ justifyContent: 'center' }}>
                            Acessar Biblioteca
                          </Link>
                        ) : (
                          <Link to={getContinueLink(course)} className="btn btn-primary btn-full" style={{ justifyContent: 'center' }}>
                            {completedCount > 0 ? 'Continuar Curso' : 'Iniciar Curso'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-6)', background: 'rgba(15, 23, 42, 0.25)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--text-muted)' }}>school</span>
              <h3 style={{ marginTop: 'var(--space-4)' }}>Nenhum curso matriculado</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 'var(--space-2) 0 var(--space-6) 0' }}>Você ainda não adquiriu nenhum treinamento corporativo.</p>
              <Link to="/cursos" className="btn btn-primary">Explorar Cursos</Link>
            </div>
          )}
        </div>

        {/* Recommended Section */}
        {recommendedCoursesList.length > 0 && (
          <div>
            <h2 style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--space-6)' }}>Recomendado para Você</h2>
            <div className="card-grid">
              {recommendedCoursesList.slice(0, 3).map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-card__thumb">
                    <img src={course.banner} alt={course.title} />
                    <div className="course-card__badge-group">
                      <span className={`badge ${course.badgeClass}`}>{course.badgeLabel}</span>
                    </div>
                  </div>
                  <div className="course-card__content">
                    <h3 className="course-card__title" style={{ marginTop: '0' }}>{course.title}</h3>
                    <p className="course-card__desc">{course.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>R$ {course.price.toFixed(2)}</span>
                      <Link to={`/curso/${course.id}`} className="btn btn-sm btn-outline">Saber Mais</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  );
};
export default Dashboard;
