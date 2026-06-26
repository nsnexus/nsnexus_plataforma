/* Mocked Data for NSNexus Platform */

const COURSES_DATA = [
  {
    id: "biblioteca-prompts-ia",
    title: "Biblioteca de Prompts NSNexus: IA para Negócios",
    description: "Acesse nosso acervo completo com prompts estruturados de alta performance para ChatGPT, Gemini e Microsoft Copilot. Automatize relatórios, analise dados de forma preditiva e otimize a rotina operacional da sua área.",
    price: 99.00,
    originalPrice: 197.00,
    paymentLink: "https://mpago.la/2aRktmV", // Link de pagamento real de R$ 99,00 do Mercado Pago
    duration: "23 Categorias",
    lessonsCount: "+2.500 Prompts",
    instructor: "Criado por especialistas em IA",
    type: "pdf",
    category: "ia",
    badgeClass: "badge-ia",
    badgeLabel: "IA & Prompts",
    level: "Todos os Níveis",
    rating: 4.95,
    reviewsCount: 184,
    banner: "images/prompt-library-banner.png",
    syllabus: [
      {
        moduleTitle: "Nossos Prompts Organizacionais por Área",
        lessons: [
          { id: "cat-1", title: "Negócios, Planejamento Estratégico, RH e Vendas", duration: "250 prompts", type: "pdf" },
          { id: "cat-2", title: "Automação, Make/Zapier, M365 e Engenharia de Prompt", duration: "300 prompts", type: "pdf" },
          { id: "cat-3", title: "Design Visual, Imagens (Midjourney/DALL-E) e Vídeos (Runway/Sora)", duration: "350 prompts", type: "pdf" },
          { id: "cat-4", title: "Copywriting, E-mail Marketing, LinkedIn, Instagram e SEO", duration: "300 prompts", type: "pdf" }
        ]
      }
    ]
  },
  {
    id: "sistemas-sharepoint-moderno",
    title: "Criação de Sistemas Web no SharePoint Moderno",
    description: "Substitua o Power Apps e economize com licenças extras. Aprenda a configurar portais corporativos e cadastros no SharePoint sem precisar de programação! O curso é ensinado por profissional especializado através de um agente de IA exclusivo que será compartilhado e configurado passo-a-passo.",
    price: 249.00,
    originalPrice: 497.00,
    paymentLink: "https://mpago.la/2GNXFeY", // Link de pagamento real de R$ 249,00 do Mercado Pago
    duration: "Configuração Assistida",
    lessonsCount: "Agente de IA",
    instructor: "Ensinado por profissional via Agente (Sem Programação)",
    type: "service",
    category: "sistemas",
    badgeClass: "badge-systems",
    badgeLabel: "Sistemas & SharePoint",
    level: "Sem Programação",
    rating: 4.9,
    reviewsCount: 142,
    banner: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      {
        moduleTitle: "Módulo 1: Portais Modernos no SharePoint",
        lessons: [
          { id: "sys-sp-1-1", title: "Introdução à hospedagem de apps web no Modern Page", duration: "25 min", type: "video" },
          { id: "sys-sp-1-2", title: "Conectando Formulários HTML ao SharePoint Lists", duration: "38 min", type: "video" }
        ]
      },
      {
        moduleTitle: "Módulo 2: Segurança e Controle de Acessos",
        lessons: [
          { id: "sys-sp-2-1", title: "Permissões nativas baseadas em grupos do Azure AD", duration: "30 min", type: "video" }
        ]
      },
      {
        moduleTitle: "Módulo 3: Configuração Assistida com Agente de IA",
        lessons: [
          { id: "sys-sp-3-1", title: "Ativação e compartilhamento do seu Agente de IA", duration: "15 min", type: "video" },
          { id: "sys-sp-3-2", title: "Como configurar portais e cadastros de forma guiada (Sem Programação)", duration: "45 min", type: "video" }
        ]
      }
    ]
  },
  {
    id: "landing-page-whatsapp",
    title: "Criação de Site Simples para WhatsApp",
    description: "Criamos um site de alta conversão (landing page) sob medida para o seu negócio, focado em direcionar clientes direto para o seu WhatsApp. Perfeito para qualquer nicho ou empresa (lojas, mecânicas, clínicas, consultores, etc.). Desenvolvimento expresso e profissional sem complicação.",
    price: 149.00,
    originalPrice: 297.00,
    paymentLink: "https://mpago.la/2ohH6w9", // Link de pagamento real do Mercado Pago
    duration: "Entrega em até 3 dias",
    lessonsCount: "Design Exclusivo",
    instructor: "Desenvolvido por equipe especializada",
    type: "service",
    category: "sistemas",
    badgeClass: "badge-systems",
    badgeLabel: "Serviço de Criação",
    level: "Qualquer Empresa ou Nicho",
    rating: 4.95,
    reviewsCount: 47,
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    syllabus: []
  }
];

const SERVICES_DATA = [
  {
    id: "consultoria-power-bi",
    title: "Desenvolvimento de Dashboards Estratégicos (Power BI)",
    icon: "bar_chart",
    description: "Criamos a estrutura de dados e dashboards inteligentes para sua área, permitindo monitoramento de metas em tempo real.",
    features: [
      "Modelagem Star Schema de alta performance",
      "Fórmulas DAX customizadas",
      "Layout e UX corporativo responsivo",
      "Treinamento de entrega e Handover do projeto"
    ],
    priceText: "Sob consulta"
  },
  {
    id: "desenvolvimento-sistemas",
    title: "Sistemas Corporativos Sob Medida",
    icon: "code",
    description: "Substitua processos obsoletos em papel ou planilhas por portais interativos integrados diretamente no SharePoint ou Teams da sua empresa.",
    features: [
      "Desenvolvimento low-code (Power Apps) ou customizado (HTML/CSS/JS)",
      "Automatizações com Power Automate",
      "Totalmente integrado à segurança Microsoft 365",
      "Interface limpa e intuitiva"
    ],
    priceText: "Sob consulta"
  },
  {
    id: "consultoria-ia",
    title: "Implementação de Soluções de IA & Copilot",
    icon: "psychology",
    description: "Auxiliamos sua empresa a adotar ferramentas de Inteligência Artificial para produtividade, automação de tarefas e análise inteligente de dados.",
    features: [
      "Desenvolvimento de Chatbots corporativos personalizados",
      "Automação de e-mails e leitura inteligente de arquivos com IA Builder",
      "Consultoria de adoção de licenças Microsoft Copilot",
      "Criação de fluxos analíticos de decisão"
    ],
    priceText: "Sob consulta"
  }
];

const TESTIMONIALS_DATA = [
  {
    name: "Carolina Mendes",
    title: "Influenciadora do YouTube & Instagram (Comprou a Biblioteca)",
    quote: "A Biblioteca de Prompts da NSNexus mudou minha produção de conteúdo. Consigo estruturar roteiros inteiros para o YouTube e posts de alto impacto para o Instagram em minutos usando ChatGPT e Gemini. Economizo horas todos os dias!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
  },
  {
    name: "Rodrigo Silva",
    title: "Diretor de TI, Logística Express (Comprou o Curso de Sistemas)",
    quote: "O curso de SharePoint Moderno foi fantástico. Aprendemos a criar portais corporativos leves em HTML/JS direto na nossa própria estrutura, aposentando licenças caras do Power Apps na empresa.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
  },
  {
    name: "Marcos Oliveira",
    title: "Proprietário, AutoCar Mecânica (Contratou Consultoria)",
    quote: "Contratamos a consultoria da NSNexus para desenvolver um sistema personalizado de ordens de serviço e controle de estoque. A gestão da oficina melhorou 100%, reduzindo desperdícios e agilizando o atendimento.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
  }
];
