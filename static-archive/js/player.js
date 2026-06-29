/* Course Player Interactive Script */

document.addEventListener("DOMContentLoaded", () => {
  initPlayer();
});

function initPlayer() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("course") || "pbi-basico-avancado";
  const activeLessonId = urlParams.get("lesson");

  const course = COURSES_DATA.find(c => c.id === courseId);
  if (!course) {
    document.getElementById("player-container").innerHTML = "<p>Curso não encontrado.</p>";
    return;
  }

  // Set course title
  document.getElementById("course-title").textContent = course.title;

  // Find first lesson if none active
  let activeLesson = null;
  course.syllabus.forEach(mod => {
    mod.lessons.forEach(les => {
      if (!activeLesson && (!activeLessonId || les.id === activeLessonId)) {
        activeLesson = les;
      }
    });
  });

  if (!activeLesson && course.syllabus[0] && course.syllabus[0].lessons[0]) {
    activeLesson = course.syllabus[0].lessons[0];
  }

  // Draw Course Syllabus (Sidebar accordion)
  renderSyllabusSidebar(course, activeLesson, courseId);
  
  // Render Lesson Content Area (Video Player or PDF Viewer)
  renderLessonContent(courseId, activeLesson);
}

function renderSyllabusSidebar(course, activeLesson, courseId) {
  const sidebar = document.getElementById("player-syllabus");
  if (!sidebar) return;

  const user = getCurrentUser();
  const completedList = (user && user.progress[courseId]) ? user.progress[courseId].completedLessons : [];

  sidebar.innerHTML = course.syllabus.map((mod, modIdx) => `
    <div class="player-mod">
      <div class="player-mod__header">
        <span>${mod.moduleTitle}</span>
      </div>
      <div class="player-mod__list">
        ${mod.lessons.map(les => {
          const isActive = les.id === activeLesson.id;
          const isCompleted = completedList.includes(les.id);
          
          return `
            <a href="player.html?course=${courseId}&lesson=${les.id}" class="player-les ${isActive ? 'player-les--active' : ''}">
              <div class="player-les__check ${isCompleted ? 'player-les__check--done' : ''}" onclick="toggleComplete(event, '${courseId}', '${les.id}')">
                ${isCompleted ? '✓' : ''}
              </div>
              <div class="player-les__info">
                <span class="player-les__title">${les.title}</span>
                <span class="player-les__meta">
                  <span style="font-family: 'Material Symbols Outlined', sans-serif; font-size: 12px; margin-right: 2px;">
                    ${les.type === 'pdf' ? 'menu_book' : 'play_circle'}
                  </span>
                  ${les.duration}
                </span>
              </div>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function renderLessonContent(courseId, lesson) {
  const mediaContainer = document.getElementById("player-media");
  const metaContainer = document.getElementById("player-meta");
  if (!mediaContainer || !metaContainer) return;

  // Render player based on type
  if (lesson.type === "pdf") {
    // PDF mockup viewer
    mediaContainer.innerHTML = `
      <div class="pdf-viewer">
        <div class="pdf-viewer__header">
          <span>Visualizando Material: <strong>${lesson.title}</strong></span>
          <div style="display: flex; gap: var(--space-2);">
            <button class="btn btn-sm btn-secondary" onclick="alert('Zoom out simulado')">-</button>
            <span style="display:flex; align-items:center; font-size:var(--font-sm);">Página 1 de ${lesson.duration}</span>
            <button class="btn btn-sm btn-secondary" onclick="alert('Zoom in simulado')">+</button>
          </div>
        </div>
        <div class="pdf-viewer__page">
          <div class="pdf-viewer__dummy-page">
            <h3 style="margin-bottom: var(--space-4); color: var(--accent-cyan); font-family: var(--font-heading);">${lesson.title}</h3>
            <p style="margin-bottom: var(--space-3);">Este é um documento PDF simulado para estudos corporativos na plataforma NSNexus.</p>
            <p style="margin-bottom: var(--space-3);">Todo o conteúdo técnico relacionado a esta aula está consolidado em um material interativo em PDF.</p>
            <div style="border-left: 3px solid var(--accent-blue); padding-left: var(--space-4); margin: var(--space-6) 0; font-style: italic; color: var(--text-secondary);">
              "A modelagem Star Schema permite otimizar suas consultas DAX organizando seus dados em tabelas Dimensão e Fato, facilitando o entendimento de negócios."
            </div>
            <p>Role o material para ler todo o conteúdo ou faça o download abaixo para estudar offline.</p>
            <button class="btn btn-sm btn-outline" style="margin-top: var(--space-6)">Download PDF Completo</button>
          </div>
        </div>
      </div>
    `;
  } else {
    // Video Custom Player (styled HTML video player with controls overlay)
    mediaContainer.innerHTML = `
      <div class="video-player">
        <video id="main-video" poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1280&auto=format&fit=crop" style="width: 100%; height: 100%; object-fit: cover;">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-code-on-a-computer-screen-close-up-3032-large.mp4" type="video/mp4">
        </video>
        <div class="video-player__controls">
          <button class="btn btn-sm btn-primary" id="video-play-btn">Play</button>
          <div style="flex-grow: 1; height: 4px; background: rgba(255,255,255,0.2); position: relative; border-radius: 2px; overflow: hidden; cursor: pointer;">
            <div id="video-progress" style="position: absolute; left: 0; top: 0; height: 100%; width: 0%; background: var(--accent-cyan);"></div>
          </div>
          <span style="font-size: var(--font-xs);" id="video-timer">00:00 / 01:25</span>
        </div>
      </div>
    `;

    // Handle Custom video actions
    const video = document.getElementById("main-video");
    const playBtn = document.getElementById("video-play-btn");
    const progress = document.getElementById("video-progress");
    const timer = document.getElementById("video-timer");

    if (video && playBtn) {
      playBtn.addEventListener("click", () => {
        if (video.paused) {
          video.play();
          playBtn.textContent = "Pause";
        } else {
          video.pause();
          playBtn.textContent = "Play";
        }
      });

      video.addEventListener("timeupdate", () => {
        const pct = (video.currentTime / video.duration) * 100;
        progress.style.width = pct + "%";
        
        // Format time
        const curMins = Math.floor(video.currentTime / 60).toString().padStart(2, '0');
        const curSecs = Math.floor(video.currentTime % 60).toString().padStart(2, '0');
        const durMins = Math.floor(video.duration / 60 || 0).toString().padStart(2, '0');
        const durSecs = Math.floor(video.duration % 60 || 0).toString().padStart(2, '0');
        
        timer.textContent = `${curMins}:${curSecs} / ${durMins}:${durSecs}`;
      });
    }
  }

  // Draw lesson metadata details below the video
  metaContainer.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-4);">
      <h2 style="font-size: var(--font-2xl); font-family: var(--font-heading); font-weight: 700;">${lesson.title}</h2>
      <button class="btn btn-sm btn-primary" onclick="markAsCompleted('${courseId}', '${lesson.id}')">Concluir Aula</button>
    </div>
    <p style="color: var(--text-secondary);">Esta é uma aula voltada a tomadores de decisão na empresa, visando maximizar o ROI e otimizar processos em escala.</p>
  `;
}

function toggleComplete(event, courseId, lessonId) {
  event.preventDefault();
  event.stopPropagation();
  markAsCompleted(courseId, lessonId);
}

function markAsCompleted(courseId, lessonId) {
  completeLesson(courseId, lessonId);
  initPlayer(); // Re-render to show updated checkmarks and sidebar percentages
}
