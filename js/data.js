/* Mocked Data for NSNexus Platform */

const COURSES_DATA = [
  {
    id: "biblioteca-prompts-ia",
    title: "Biblioteca de Prompts NSNexus: IA para Negócios",
    description: "Acesse nosso acervo completo com prompts estruturados de alta performance para ChatGPT, Claude e Microsoft Copilot. Automatize relatórios, analise dados de forma preditiva e otimize a rotina operacional da sua área.",
    price: 99.00,
    originalPrice: 197.00,
    paymentLink: "https://mpago.la/2aRktmV", // Link de pagamento real de R$ 99,00 do Mercado Pago
    duration: "20h",
    lessonsCount: 45,
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
        moduleTitle: "Módulo 1: Fundamentos de Engenharia de Prompt",
        lessons: [
          { id: "prompt-1-1", title: "Como Estruturar Prompts para Negócios", duration: "15 min", type: "video" },
          { id: "prompt-1-2", title: "Biblioteca Completa de Prompts de Finanças, RH e Logística", duration: "82 pág", type: "pdf" }
        ]
      },
      {
        moduleTitle: "Módulo 2: Automação Inteligente de PDFs e Relatórios",
        lessons: [
          { id: "prompt-2-1", title: "Configurando Automações com IA Builder e Flow", duration: "32 min", type: "video" }
        ]
      }
    ]
  },
  {
    id: "sistemas-sharepoint-moderno",
    title: "Criação de Sistemas Web no SharePoint Moderno",
    description: "Substitua o Power Apps e economize com licenças extras. Aprenda a desenvolver portais corporativos, cadastros e intranets leves com HTML, CSS e JavaScript puro rodando diretamente dentro da infraestrutura do seu SharePoint.",
    price: 197.00,
    originalPrice: 497.00,
    paymentLink: "https://link.mercadopago.com.br/nsnexussharepoint", // Substitua pelo link de R$ 197,00 gerado no seu painel do Mercado Pago
    duration: "40h",
    lessonsCount: 95,
    type: "video",
    category: "sistemas",
    badgeClass: "badge-systems",
    badgeLabel: "Sistemas & SharePoint",
    level: "Iniciante ao Avançado",
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
      }
    ]
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
    title: "Gerente de Operações, Vale",
    quote: "A NSNexus transformou nossos relatórios mensais. O dashboard desenvolvido em Power BI reduziu nosso tempo de análise de 3 dias para 5 minutos.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
  },
  {
    name: "Rodrigo Silva",
    title: "Diretor de TI, Logística Express",
    quote: "Os treinamentos de Power Apps da plataforma ajudaram nosso time a desenvolver aplicativos internos rapidamente, economizando milhares de reais em licenças.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
  },
  {
    name: "Mariana Costa",
    title: "Analista de Processos, TechCorp",
    quote: "Excelente didática! O método focado em negócio ajudou a entender DAX de uma forma muito mais simples. Recomendo muito o curso e as consultorias.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
  }
];
