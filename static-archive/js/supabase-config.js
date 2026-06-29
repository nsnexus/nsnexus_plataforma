/* Supabase Client Configuration & Initialization for NSNexus */

// Configurado com as credenciais reais do seu projeto
const SUPABASE_URL = "https://xdejjgeigrbsbkqakari.supabase.co"; // URL reconstruída a partir da chave do seu projeto
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZWpqZ2VpZ3Jic2JrcWFrYXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjY5NzEsImV4cCI6MjA5ODAwMjk3MX0.cy8kAaSWPQtu_tws8-vh4-yadd2Dvaxht0yWTjjNqtA"; // Sua chave Anon pública

let supabaseClient = null;

try {
  if (typeof supabase !== "undefined" && SUPABASE_URL && !SUPABASE_URL.includes("seu-projeto")) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase inicializado com sucesso.");
  } else {
    console.log("Supabase rodando em modo Simulação (preencha as chaves em js/supabase-config.js para conectar de verdade).");
  }
} catch (error) {
  console.error("Erro ao inicializar cliente Supabase:", error);
}
