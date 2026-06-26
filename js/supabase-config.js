/* Supabase Client Configuration & Initialization for NSNexus */

// 1. Substitua os placeholders abaixo pelas credenciais do seu projeto Supabase:
const SUPABASE_URL = "https://seu-projeto.supabase.co"; // URL do seu projeto
const SUPABASE_ANON_KEY = "sua-chave-anon-publica-aqui"; // Chave Anon pública

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
