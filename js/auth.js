/* Simulating User Authentication & Progress Tracking + Supabase Real Integration */

// Default mock student data for first-time login (used in local simulation mode)
const DEFAULT_STUDENT_DATA = {
  name: "Lucas Souza",
  email: "lucas@email.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
  enrolledCourses: ["pbi-basico-avancado", "power-apps-sistemas"],
  progress: {
    "pbi-basico-avancado": {
      completedLessons: ["pbi-1-1", "pbi-1-2"],
      percentage: 16
    },
    "power-apps-sistemas": {
      completedLessons: ["apps-1-1"],
      percentage: 25
    }
  }
};

// Check route guards
function checkRouteGuard() {
  const user = localStorage.getItem("nsnexus_user");
  const path = window.location.pathname;
  
  if (!user && (path.includes("dashboard.html") || path.includes("player.html"))) {
    window.location.href = "login.html";
  }
}

// Helper to redirect user to their intended page after successful login
function navigatePostLogin() {
  const redirectUrl = localStorage.getItem("post_login_redirect");
  if (redirectUrl) {
    localStorage.removeItem("post_login_redirect");
    window.location.href = redirectUrl;
  } else {
    window.location.href = "dashboard.html";
  }
}

// 1. Sync Supabase Session on load
async function syncSupabaseSession() {
  if (!supabaseClient) {
    checkRouteGuard();
    return;
  }

  try {
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError) throw sessionError;

    if (session && session.user) {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      let enrolled = [];
      let progress = {};

      if (profile) {
        enrolled = profile.enrolled_courses || [];
        progress = profile.progress || {};
      }

      // Check for pending unlock from Mercado Pago redirect
      const pendingUnlock = localStorage.getItem("pending_unlock");
      if (pendingUnlock) {
        if (!enrolled.includes(pendingUnlock)) {
          enrolled.push(pendingUnlock);
          progress[pendingUnlock] = { completedLessons: [], percentage: 0 };
          
          // Update profile in Supabase
          if (profile) {
            await supabaseClient
              .from('profiles')
              .update({ enrolled_courses: enrolled, progress: progress })
              .eq('id', session.user.id);
          }
        }
        localStorage.removeItem("pending_unlock");
        alert("O acesso ao seu produto adquirido foi ativado na sua conta!");
      }

      if (profile) {
        const localUser = {
          name: profile.name,
          email: session.user.email,
          avatar: profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
          enrolledCourses: enrolled,
          progress: progress
        };
        localStorage.setItem("nsnexus_user", JSON.stringify(localUser));
      }
    } else {
      // If logged out from Supabase, clean localStorage
      localStorage.removeItem("nsnexus_user");
    }
  } catch (err) {
    console.error("Erro ao sincronizar sessão do Supabase:", err);
  } finally {
    checkRouteGuard();
  }
}

// 2. SignUp logic
async function signup(name, email, password) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name
          }
        }
      });
      if (error) throw error;
      
      if (data && data.user) {
        alert("Conta criada com sucesso! Verifique seu e-mail de confirmação ou faça login.");
        return true;
      }
    } catch (err) {
      alert("Erro ao registrar: " + err.message);
      return false;
    }
  } else {
    // Local Simulation
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
    
    // Check for pending unlock
    const pendingUnlock = localStorage.getItem("pending_unlock");
    if (pendingUnlock) {
      if (!newUser.enrolledCourses.includes(pendingUnlock)) {
        newUser.enrolledCourses.push(pendingUnlock);
        if (!newUser.progress) newUser.progress = {};
        newUser.progress[pendingUnlock] = { completedLessons: [], percentage: 0 };
      }
      localStorage.removeItem("pending_unlock");
      alert("Simulador: O acesso ao seu produto adquirido foi ativado na sua nova conta!");
    }
    
    localStorage.setItem("nsnexus_user", JSON.stringify(newUser));
    return true;
  }
}

// 3. Login logic
async function login(email, password) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) throw error;

      if (data && data.user) {
        // Force session sync
        await syncSupabaseSession();
        return true;
      }
    } catch (err) {
      alert("Erro ao autenticar: " + err.message);
      return false;
    }
  } else {
    // Local Simulation
    const user = { ...DEFAULT_STUDENT_DATA, email: email };
    
    // Check for pending unlock
    const pendingUnlock = localStorage.getItem("pending_unlock");
    if (pendingUnlock) {
      if (!user.enrolledCourses.includes(pendingUnlock)) {
        user.enrolledCourses.push(pendingUnlock);
        if (!user.progress) user.progress = {};
        user.progress[pendingUnlock] = { completedLessons: [], percentage: 0 };
      }
      localStorage.removeItem("pending_unlock");
      alert("Simulador: O acesso ao seu produto adquirido foi ativado na sua conta!");
    }
    
    localStorage.setItem("nsnexus_user", JSON.stringify(user));
    return true;
  }
}

// 4. Logout logic
async function logoutUser() {
  if (supabaseClient) {
    try {
      await supabaseClient.auth.signOut();
    } catch (err) {
      console.error("Erro no logout do Supabase:", err);
    }
  }
  localStorage.removeItem("nsnexus_user");
  window.location.href = "index.html";
}

// 5. Complete lesson and update progress percentage
async function completeLesson(courseId, lessonId) {
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
  
  // Calculate percentage
  const course = COURSES_DATA.find(c => c.id === courseId);
  if (course) {
    let totalLessons = 0;
    course.syllabus.forEach(mod => totalLessons += mod.lessons.length);
    
    if (totalLessons > 0) {
      progressObj.percentage = Math.round((progressObj.completedLessons.length / totalLessons) * 100);
    }
  }
  
  // Save local
  localStorage.setItem("nsnexus_user", JSON.stringify(user));

  // Save to Supabase (if connected)
  if (supabaseClient) {
    try {
      const { data: { user: sbUser } } = await supabaseClient.auth.getUser();
      if (sbUser) {
        const { error } = await supabaseClient
          .from('profiles')
          .update({ progress: user.progress })
          .eq('id', sbUser.id);
        if (error) throw error;
      }
    } catch (err) {
      console.error("Erro ao sincronizar progresso no Supabase:", err);
    }
  }
  
  return user;
}

// 6. Check for Mercado Pago return query strings to dynamically unlock courses/products
async function checkPaymentReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status") || urlParams.get("payment_status");
  const courseId = urlParams.get("course") || urlParams.get("courseId") || urlParams.get("id") || urlParams.get("external_reference");
  
  if (status === "approved" && courseId) {
    const userData = localStorage.getItem("nsnexus_user");
    if (userData) {
      const user = JSON.parse(userData);
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        if (!user.progress) user.progress = {};
        user.progress[courseId] = { completedLessons: [], percentage: 0 };
        
        // Save local
        localStorage.setItem("nsnexus_user", JSON.stringify(user));

        // Save to Supabase (if connected)
        if (supabaseClient) {
          try {
            const { data: { user: sbUser } } = await supabaseClient.auth.getUser();
            if (sbUser) {
              const { error } = await supabaseClient
                .from('profiles')
                .update({ 
                  enrolled_courses: user.enrolledCourses,
                  progress: user.progress 
                })
                .eq('id', sbUser.id);
              if (error) throw error;
            }
          } catch (err) {
            console.error("Erro ao sincronizar compra no Supabase:", err);
          }
        }
        
        // Clean URL parameters using history API to prevent popups on reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        alert("Seu pagamento foi confirmado com sucesso! O acesso ao produto foi liberado.");
        window.location.reload();
      } else {
        // Clean URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    } else {
      // User is not logged in! Save pending unlock and redirect to login
      localStorage.setItem("pending_unlock", courseId);
      
      // Clean URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      alert("Pagamento aprovado com sucesso! Por favor, faça login ou crie uma conta para liberar o acesso ao produto.");
      window.location.href = "login.html";
    }
  }
}

// 7. Google Authentication handler (Keep simulated for convenience or link to Supabase OAuth in future)
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

  // Check for pending unlock
  const pendingUnlock = localStorage.getItem("pending_unlock");
  if (pendingUnlock) {
    if (!googleUser.enrolledCourses.includes(pendingUnlock)) {
      googleUser.enrolledCourses.push(pendingUnlock);
      if (!googleUser.progress) googleUser.progress = {};
      googleUser.progress[pendingUnlock] = { completedLessons: [], percentage: 0 };
    }
    localStorage.removeItem("pending_unlock");
    alert("Simulador: O acesso ao seu produto adquirido foi ativado na sua conta Google!");
  }

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
async function handleGoogleCredentialResponse(response) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });
      if (error) throw error;
      
      // Sync session
      await syncSupabaseSession();
      navigatePostLogin();
    } catch (err) {
      alert("Erro ao autenticar com o Google no Supabase: " + err.message);
    }
  } else {
    // Local Simulation
    const responsePayload = decodeJwtResponse(response.credential);
    if (responsePayload) {
      loginWithGoogle(responsePayload.name, responsePayload.email, responsePayload.picture);
      navigatePostLogin();
    }
  }
}

// Simulated mock Google login button trigger (with Supabase OAuth fallback)
async function triggerMockGoogleLogin() {
  if (typeof supabaseClient !== "undefined" && supabaseClient) {
    if (window.location.protocol.startsWith("http")) {
      try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + window.location.pathname.replace("login.html", "dashboard.html").replace("registro.html", "dashboard.html")
          }
        });
        if (error) throw error;
      } catch (err) {
        alert("Erro no Login do Google via Supabase: " + err.message + "\n\nVerifique se o provider Google está ativo no console do seu Supabase.");
      }
      return;
    } else {
      alert("Aviso: Login real com Google (OAuth) não funciona abrindo arquivos diretamente pelo navegador (protocolo file://).\n\nPara usar login real, rode o projeto usando um servidor local (como Live Server do VS Code) ou hospede o site em algum serviço (Vercel, Netlify, etc).\n\nIniciando o simulador local para testes...");
    }
  }

  const name = prompt("Simulador Google: Digite seu Nome:", "Seu Nome");
  if (!name) return;
  const email = prompt("Simulador Google: Digite seu E-mail:", "seuemail@email.com");
  if (!email) return;
  
  loginWithGoogle(name, email, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop");
  navigatePostLogin();
}

// Initialize dynamic display controls & Supabase Sync on load
document.addEventListener("DOMContentLoaded", () => {
  const mockBtn = document.getElementById("mock-google-btn");
  const realContainer = document.getElementById("google-sdk-container");
  
  if (mockBtn && realContainer && window.location.protocol.startsWith("http")) {
    mockBtn.style.display = "none";
    realContainer.style.display = "flex";
  }
});

syncSupabaseSession().then(() => {
  checkPaymentReturn();
});
