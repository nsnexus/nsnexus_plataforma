import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { COURSES_DATA } from '../data/platformData';
import { useAuth } from '../context/AuthContext';

export const Player = () => {
  const { courseId, lessonId } = useParams();
  const { user, updateProgress } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const foundCourse = COURSES_DATA.find(c => c.id === courseId);
    setCourse(foundCourse);

    if (foundCourse) {
      let foundLesson = null;
      foundCourse.syllabus.forEach(mod => {
        mod.lessons.forEach(les => {
          if (les.id === lessonId) {
            foundLesson = les;
          }
        });
      });

      // Default to first lesson if not found or not specified
      if (!foundLesson && foundCourse.syllabus[0] && foundCourse.syllabus[0].lessons[0]) {
        foundLesson = foundCourse.syllabus[0].lessons[0];
      }
      setActiveLesson(foundLesson);
    }
  }, [courseId, lessonId]);

  if (!course || !activeLesson) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'white' }}>
        <p>Carregando aula...</p>
      </div>
    );
  }

  // Double check security block (if user isn't enrolled)
  const isEnrolled = user && user.enrolledCourses && user.enrolledCourses.includes(courseId);
  if (user && !isEnrolled) {
    return (
      <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'white', gap: '20px' }}>
        <h2>Acesso Negado</h2>
        <p>Você não possui inscrição ativa neste curso.</p>
        <Link to="/cursos" className="btn btn-primary">Ver Catálogo de Cursos</Link>
      </div>
    );
  }

  // Get list of completed lessons
  const completedList = (user && user.progress && user.progress[courseId]) 
    ? user.progress[courseId].completedLessons || [] 
    : [];
  const isActiveCompleted = completedList.includes(activeLesson.id);

  // Find next lesson
  let allLessonsList = [];
  course.syllabus.forEach(mod => {
    mod.lessons.forEach(les => {
      allLessonsList.push(les);
    });
  });

  const currentIndex = allLessonsList.findIndex(l => l.id === activeLesson.id);
  const nextLesson = allLessonsList[currentIndex + 1];

  const handleToggleComplete = async (e, targetLessonId) => {
    e.preventDefault();
    e.stopPropagation();
    const isCompleted = completedList.includes(targetLessonId);
    await updateProgress(courseId, targetLessonId, !isCompleted);
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/player/${courseId}/${nextLesson.id}`);
    } else {
      alert("Parabéns! Você concluiu todas as aulas deste curso.");
      navigate('/dashboard');
    }
  };

  return (
    <main style={{ paddingTop: '80px', minHeight: '90vh', background: 'var(--bg-primary)', color: 'white', display: 'flex' }} className="player-page-container">
      
      {/* Sidebar: Modules Accordion */}
      <aside style={{ width: '320px', background: 'rgba(15, 23, 42, 0.6)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', flexShrink: 0 }} className="player-sidebar">
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)' }}>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', fontSize: 'var(--font-sm)', marginBottom: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span> Dashboard
          </Link>
          <h2 style={{ fontSize: 'var(--font-md)', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={course.title}>
            {course.title}
          </h2>
        </div>

        <div style={{ overflowY: 'auto', flexGrow: 1 }} id="player-syllabus">
          {course.syllabus.map((mod, modIdx) => (
            <div key={modIdx} className="player-mod">
              <div className="player-mod__header" style={{ padding: 'var(--space-3) var(--space-4)', background: 'rgba(0,0,0,0.2)', fontSize: 'var(--font-xs)', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                {mod.moduleTitle}
              </div>
              <div className="player-mod__list">
                {mod.lessons.map(les => {
                  const isActive = les.id === activeLesson.id;
                  const isCompleted = completedList.includes(les.id);
                  
                  return (
                    <Link 
                      key={les.id} 
                      to={`/player/${courseId}/${les.id}`} 
                      className={`player-les ${isActive ? 'player-les--active' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: 'var(--space-3) var(--space-4)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.02)' }}
                    >
                      <div 
                        className={`player-les__check ${isCompleted ? 'player-les__check--done' : ''}`}
                        onClick={(e) => handleToggleComplete(e, les.id)}
                        style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)', background: isCompleted ? 'rgba(0, 245, 212, 0.1)' : 'transparent', flexShrink: 0 }}
                      >
                        {isCompleted && '✓'}
                      </div>
                      <div className="player-les__info" style={{ flexGrow: 1, minWidth: 0 }}>
                        <span className="player-les__title" style={{ display: 'block', fontSize: 'var(--font-sm)', color: isActive ? 'var(--accent-cyan)' : 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {les.title}
                        </span>
                        <span className="player-les__meta" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                            {les.type === 'pdf' ? 'menu_book' : 'play_circle'}
                          </span>
                          {les.duration}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Pane */}
      <section style={{ flexGrow: 1, padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} className="player-content-pane">
        
        {/* Video / Slide Area */}
        <div style={{ flexGrow: 1, background: '#090a0f', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }} id="player-media">
          {activeLesson.type === 'pdf' ? (
            <div className="pdf-viewer" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="pdf-viewer__header" style={{ padding: 'var(--space-3) var(--space-4)', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', fontSize: 'var(--font-sm)' }}>
                <span>Material Didático: <strong>{activeLesson.title}</strong></span>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => alert('Zoom out simulado')}>-</button>
                  <span style={{ display: 'flex', alignItems: 'center' }}>Página 1 de {activeLesson.duration}</span>
                  <button className="btn btn-sm btn-secondary" onClick={() => alert('Zoom in simulado')}>+</button>
                </div>
              </div>
              <div className="pdf-viewer__page" style={{ flexGrow: 1, padding: 'var(--space-8)', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
                <div className="pdf-viewer__dummy-page" style={{ background: 'rgba(15, 23, 42, 0.45)', border: '1px solid var(--border-color)', padding: 'var(--space-6)', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h3 style={{ color: 'var(--accent-cyan)', fontSize: 'var(--font-lg)', fontWeight: 'bold' }}>{activeLesson.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', lineHeight: 1.6 }}>
                    Este é um documento didático estruturado para estudos corporativos da NSNexus.
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', lineHeight: 1.6 }}>
                    O conteúdo completo desta aula está consolidado e disponível para leitura imediata na plataforma ou download.
                  </p>
                  <div style={{ borderLeft: '3px solid var(--accent-blue)', paddingLeft: 'var(--space-4)', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>
                    "A estruturação e automação de processos corporativos trazem redução de custos imediata e liberam o time para tarefas analíticas."
                  </div>
                  <button className="btn btn-sm btn-outline" style={{ alignSelf: 'flex-start', marginTop: '10px' }} onClick={() => alert('Material baixado!')}>
                    Download PDF Completo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <video 
                src="https://assets.mixkit.co/videos/preview/mixkit-code-on-a-computer-screen-close-up-3032-large.mp4" 
                controls 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1280&auto=format&fit=crop"
              />
            </div>
          )}
        </div>

        {/* Footer Meta Area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }} id="player-meta">
          <div>
            <h1 style={{ fontSize: 'var(--font-lg)', fontWeight: 'bold' }}>{activeLesson.title}</h1>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Módulo: {course.syllabus.find(m => m.lessons.includes(activeLesson))?.moduleTitle}</p>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button 
              className={`btn ${isActiveCompleted ? 'btn-secondary' : 'btn-outline'}`}
              onClick={(e) => handleToggleComplete(e, activeLesson.id)}
            >
              {isActiveCompleted ? '✓ Concluído' : 'Marcar como Concluída'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleNextLesson}
            >
              {nextLesson ? 'Próxima Aula' : 'Concluir Curso'}
            </button>
          </div>
        </div>

      </section>

    </main>
  );
};
export default Player;
