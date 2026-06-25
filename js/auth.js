/* Simulating User Authentication & Progress Tracking */

// Default mock student data for first-time login
const DEFAULT_STUDENT_DATA = {
  name: "Lucas Souza",
  email: "lucas@email.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
  enrolledCourses: ["pbi-basico-avancado", "power-apps-sistemas"],
  progress: {
    "pbi-basico-avancado": {
      completedLessons: ["pbi-1-1", "pbi-1-2"],
      percentage: 16 // 2 completed of 120 (simulated/custom for showcase)
    },
    "power-apps-sistemas": {
      completedLessons: ["apps-1-1"],
      percentage: 25 // 1 completed of 4 lessons
    }
  }
};

// Simulate sign up
function signup(name, email, password) {
  const newUser = {
    name: name,
    email: email,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
    enrolledCourses: ["pbi-basico-avancado"],
    progress: {
      "pbi-basico-avancado": {
        completedLessons: [],
        percentage: 0
      }
    }
  };
  localStorage.setItem("nsnexus_user", JSON.stringify(newUser));
  return true;
}

// Simulate login
function login(email, password) {
  // Simple validation bypass for showcase
  const user = { ...DEFAULT_STUDENT_DATA, email: email };
  localStorage.setItem("nsnexus_user", JSON.stringify(user));
  return true;
}

// Check route guards
function checkRouteGuard() {
  const user = localStorage.getItem("nsnexus_user");
  const path = window.location.pathname;
  
  if (!user && (path.includes("dashboard.html") || path.includes("player.html"))) {
    window.location.href = "login.html";
  }
}

// Complete lesson and update progress percentage
function completeLesson(courseId, lessonId) {
  const userData = localStorage.getItem("nsnexus_user");
  if (!userData) return;
  
  const user = JSON.parse(userData);
  if (!user.progress[courseId]) {
    user.progress[courseId] = { completedLessons: [], percentage: 0 };
  }
  
  const progressObj = user.progress[courseId];
  if (!progressObj.completedLessons.includes(lessonId)) {
    progressObj.completedLessons.push(lessonId);
  }
  
  // Calculate percentage (mock lookup in COURSES_DATA)
  const course = COURSES_DATA.find(c => c.id === courseId);
  if (course) {
    // Flatten lessons to get total
    let totalLessons = 0;
    course.syllabus.forEach(mod => totalLessons += mod.lessons.length);
    
    if (totalLessons > 0) {
      progressObj.percentage = Math.round((progressObj.completedLessons.length / totalLessons) * 100);
    }
  }
  
  localStorage.setItem("nsnexus_user", JSON.stringify(user));
  return user;
}

// Google Authentication handler
function loginWithGoogle(name, email, picture) {
  const googleUser = {
    name: name,
    email: email,
    avatar: picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
    enrolledCourses: ["pbi-basico-avancado"],
    progress: {
      "pbi-basico-avancado": {
        completedLessons: [],
        percentage: 0
      }
    }
  };
  localStorage.setItem("nsnexus_user", JSON.stringify(googleUser));
  return true;
}

// Client-side base64 JWT decoding helper
function decodeJwtResponse(token) {
  try {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erro ao decodificar token do Google", e);
    return null;
  }
}

// Google SDK Callback Handler
function handleGoogleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);
  if (responsePayload) {
    loginWithGoogle(responsePayload.name, responsePayload.email, responsePayload.picture);
    window.location.href = "dashboard.html";
  }
}

// Simulated mock Google login button trigger
function triggerMockGoogleLogin() {
  loginWithGoogle("Lucas Souza (Google)", "lucas.google@email.com", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop");
  window.location.href = "dashboard.html";
}

// Check route permission immediately when auth.js is loaded
checkRouteGuard();
