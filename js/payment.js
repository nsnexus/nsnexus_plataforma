/* Mercado Pago Payment Integration Logic */

document.addEventListener("DOMContentLoaded", () => {
  initCheckout();
});

let selectedCourse = null;

function initCheckout() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  
  if (!courseId) {
    alert("Nenhum curso selecionado para checkout.");
    window.location.href = "cursos.html";
    return;
  }
  
  selectedCourse = COURSES_DATA.find(c => c.id === courseId);
  if (!selectedCourse) {
    alert("Curso inválido.");
    window.location.href = "cursos.html";
    return;
  }
  
  // Render Cart Info
  document.getElementById("cart-thumb").src = selectedCourse.banner;
  document.getElementById("cart-category").textContent = selectedCourse.badgeLabel;
  document.getElementById("cart-title").textContent = selectedCourse.title;
  
  const priceFormatted = "R$ " + selectedCourse.price.toFixed(2);
  document.getElementById("cart-price").textContent = priceFormatted;
  document.getElementById("cart-total").textContent = priceFormatted;
  
  // Fill Installment values for Credit Card select options
  const totalValElements = document.querySelectorAll(".card-total-val");
  const halfValElements = document.querySelectorAll(".card-half-val");
  const thirdValElements = document.querySelectorAll(".card-third-val");
  const sixthValElements = document.querySelectorAll(".card-sixth-val");
  const twelfthValElements = document.querySelectorAll(".card-twelfth-val");
  
  totalValElements.forEach(el => el.textContent = selectedCourse.price.toFixed(2));
  halfValElements.forEach(el => el.textContent = (selectedCourse.price / 2).toFixed(2));
  thirdValElements.forEach(el => el.textContent = (selectedCourse.price / 3).toFixed(2));
  sixthValElements.forEach(el => el.textContent = (selectedCourse.price / 6).toFixed(2));
  twelfthValElements.forEach(el => el.textContent = (selectedCourse.price / 12).toFixed(2));
  
  // Initialize real Mercado Pago SDK Client (if credential public key is present)
  initMercadoPagoSDK();
}

function switchPaymentMethod(method) {
  // Reset payment option selected state
  const options = document.querySelectorAll(".payment-option");
  options.forEach(opt => opt.classList.remove("payment-option--active"));
  
  // Hide all details panels
  const panels = document.querySelectorAll(".payment-details");
  panels.forEach(p => p.classList.remove("payment-details--active"));
  
  // Activate selected method
  if (method === 'pix') {
    options[0].classList.add("payment-option--active");
    document.getElementById("details-pix").classList.add("payment-details--active");
  } else if (method === 'card') {
    options[1].classList.add("payment-option--active");
    document.getElementById("details-card").classList.add("payment-details--active");
  } else if (method === 'mp') {
    options[2].classList.add("payment-option--active");
    document.getElementById("details-mp").classList.add("payment-details--active");
  }
}

function copyPixCode() {
  const codeInput = document.getElementById("pix-code");
  if (codeInput) {
    codeInput.select();
    codeInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(codeInput.value);
    alert("Código Copia e Cola copiado com sucesso!");
  }
}

function simulateSuccessPayment() {
  const user = getCurrentUser();
  if (!user || !selectedCourse) return;
  
  // Enroll user to the selected course
  if (!user.enrolledCourses.includes(selectedCourse.id)) {
    user.enrolledCourses.push(selectedCourse.id);
    user.progress[selectedCourse.id] = { completedLessons: [], percentage: 0 };
    localStorage.setItem("nsnexus_user", JSON.stringify(user));
  }
  
  alert("Pagamento confirmado com sucesso! Redirecionando para a sua área de estudos.");
  window.location.href = "dashboard.html";
}

/* REAL MERCADO PAGO INTEGRATION (Checkout Pro / Wallet Button) */
function initMercadoPagoSDK() {
  try {
    // Check if SDK script loaded correctly
    if (typeof MercadoPago === "undefined") {
      console.log("Mercado Pago SDK não carregado (comum em execução offline).");
      return;
    }
    
    // Replace 'YOUR_PUBLIC_KEY' with your real Mercado Pago public key credential
    const mp = new MercadoPago('APP_USR-cec0c83c-014b-427d-811e-cea808d6b761', {
      locale: 'pt-BR'
    });
    
    // To enable the real wallet payment button, you must generate a Preference ID on a backend server
    // Example Node.js code to generate a preference ID is listed below.
    // Once you have the preferenceId, uncomment the code block to load the Wallet Brick:
    
    /*
    const bricksBuilder = mp.bricks();
    bricksBuilder.create("wallet", "walletCardPanel", {
      initialization: {
        preferenceId: "YOUR_PREFERENCE_ID_FROM_BACKEND",
      },
      customization: {
        texts: {
          valueProp: "smart_option",
        },
      },
    });
    */
    
  } catch (error) {
    console.error("Erro ao inicializar SDK do Mercado Pago:", error);
  }
}

/* 
===================================================================
COMO GERAR O PREFERENCE_ID DO MERCADO PAGO (Código de Backend Exemplo):
===================================================================
Você deve criar uma rota no seu servidor (Node.js/Express) que chame a API do Mercado Pago:

const mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken("SEU_ACCESS_TOKEN_PRIVADO");

app.post('/create-preference', async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: req.body.title,
          unit_price: Number(req.body.price),
          quantity: 1,
          currency_id: 'BRL'
        }
      ],
      back_urls: {
        success: "https://seusite.com/dashboard.html",
        failure: "https://seusite.com/cursos.html",
        pending: "https://seusite.com/dashboard.html"
      },
      auto_return: "approved",
    };
    
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
===================================================================
*/
