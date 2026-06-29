import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { COURSES_DATA } from '../data/platformData';
import { CourseCard } from '../components/CourseCard';

export const Cursos = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      if (categoryParam === 'ia') {
        setActiveCategory('ia');
      } else if (categoryParam === 'sistemas' || categoryParam === 'power-bi' || categoryParam === 'power-apps' || categoryParam === 'sharepoint') {
        setActiveCategory('sistemas');
      }
    }
  }, [searchParams]);

  // Filter courses
  const filteredCourses = activeCategory === 'all' 
    ? COURSES_DATA 
    : COURSES_DATA.filter(c => c.category === activeCategory);

  return (
    <main style={{ paddingTop: '100px', minHeight: '80vh', background: 'var(--bg-primary)' }}>
      <section className="container" style={{ paddingBottom: 'var(--space-20)' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto var(--space-12) auto' }}>
          <span className="accent-gradient" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 'var(--font-sm)', letterSpacing: '0.05em' }}>
            Nossos Treinamentos
          </span>
          <h2 style={{ fontSize: 'var(--font-3xl)', marginTop: 'var(--space-2)' }}>Cursos Práticos de Negócios</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-3)' }}>
            Acelere sua carreira e otimize sua empresa dominando as ferramentas do ecossistema moderno da Microsoft e de IA Generativa.
          </p>
        </div>

        {/* Filter Tab Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-10)', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveCategory('all')} 
            className={`btn btn-sm ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            Tudo ({COURSES_DATA.length})
          </button>
          <button 
            onClick={() => setActiveCategory('ia')} 
            className={`btn btn-sm ${activeCategory === 'ia' ? 'btn-primary' : 'btn-outline'}`}
          >
            IA & Prompts ({COURSES_DATA.filter(c => c.category === 'ia').length})
          </button>
          <button 
            onClick={() => setActiveCategory('sistemas')} 
            className={`btn btn-sm ${activeCategory === 'sistemas' ? 'btn-primary' : 'btn-outline'}`}
          >
            Sistemas & SharePoint ({COURSES_DATA.filter(c => c.category === 'sistemas').length})
          </button>
        </div>

        {/* Grid List */}
        <div className="card-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--text-secondary)' }}>
              <h3>Nenhum curso encontrado nesta categoria.</h3>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
export default Cursos;
