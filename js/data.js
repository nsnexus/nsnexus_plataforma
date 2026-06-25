/* Mocked Data for NSNexus Platform */

const COURSES_DATA = [
  {
    id: "pbi-basico-avancado",
    title: "Power BI Business-First: Do Zero ao Dashboard Executivo",
    description: "Esqueça fórmulas difíceis de decorar. Aprenda a modelar dados sob a ótica de negócios e crie dashboards que diretores realmente usam para tomar decisões.",
    price: 497.00,
    originalPrice: 997.00,
    duration: "45h",
    lessonsCount: 120,
    type: "video",
    category: "power-bi",
    badgeClass: "badge-pbi",
    badgeLabel: "Power BI",
    level: "Iniciante ao Avançado",
    rating: 4.9,
    reviewsCount: 342,
    banner: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      {
        moduleTitle: "Módulo 1: Mentalidade Business-First",
        lessons: [
          { id: "pbi-1-1", title: "O que o seu Diretor realmente quer ver?", duration: "12 min", type: "video" },
          { id: "pbi-1-2", title: "Definindo Indicadores de Sucesso (KPIs)", duration: "18 min", type: "video" },
          { id: "pbi-1-3", title: "Mapeamento de Processos e Fontes de Dados", duration: "15 min", type: "video" }
        ]
      },
      {
        moduleTitle: "Módulo 2: ETL e Modelagem de Dados",
        lessons: [
          { id: "pbi-2-1", title: "Power Query: Limpeza sem estresse", duration: "25 min", type: "video" },
          { id: "pbi-2-2", title: "Modelagem Star Schema vs. Snowflake", duration: "30 min", type: "video" },
          { id: "pbi-2-3", title: "Relacionamentos e Cardinalidade na Prática", duration: "20 min", type: "video" }
        ]
      },
      {
        moduleTitle: "Módulo 3: DAX com Analogias do Dia-a-Dia",
        lessons: [
          { id: "pbi-3-1", title: "O Porteiro VIP da Balada: Entendendo a CALCULATE", duration: "22 min", type: "video" },
          { id: "pbi-3-2", title: "Medidas vs. Colunas Calculadas", duration: "15 min", type: "video" },
          { id: "pbi-3-3", title: "Inteligência de Tempo sem mistério", duration: "28 min", type: "video" }
        ]
      }
    ]
  },
  {
    id: "power-apps-sistemas",
    title: "Power Apps & SharePoint: Criando Sistemas Corporativos Modernos",
    description: "Substitua planilhas compartilhadas e processos manuais por aplicativos canvas integrados ao SharePoint List. 100% focado em usabilidade e design corporativo.",
    price: 397.00,
    originalPrice: 797.00,
    duration: "35h",
    lessonsCount: 88,
    type: "video",
    category: "power-apps",
    badgeClass: "badge-apps",
    badgeLabel: "Power Apps",
    level: "Intermediário",
    rating: 4.8,
    reviewsCount: 198,
    banner: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      {
        moduleTitle: "Módulo 1: Planejando seu Primeiro App Canvas",
        lessons: [
          { id: "apps-1-1", title: "UX/UI para Aplicativos Internos", duration: "15 min", type: "video" },
          { id: "apps-1-2", title: "SharePoint como Banco de Dados do App", duration: "20 min", type: "video" }
        ]
      },
      {
        moduleTitle: "Módulo 2: Fórmulas de Controle e Lógica",
        lessons: [
          { id: "apps-2-1", title: "Power Fx: Filter, LookUp e Search", duration: "25 min", type: "video" },
          { id: "apps-2-2", title: "Criando Telas de Cadastro e Edição", duration: "30 min", type: "video" }
        ]
      }
    ]
  },
  {
    id: "sharepoint-portais",
    title: "Portais e Intranets Modernas com SharePoint",
    description: "Aprenda a estruturar o SharePoint Online da sua empresa. Crie intranets engajadoras, gerencie permissões corretas e integre com o ecossistema Microsoft.",
    price: 247.00,
    originalPrice: 497.00,
    duration: "20h",
    lessonsCount: 50,
    type: "pdf",
    category: "sharepoint",
    badgeClass: "badge-sharepoint",
    badgeLabel: "SharePoint",
    level: "Iniciante",
    rating: 4.7,
    reviewsCount: 114,
    banner: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      {
        moduleTitle: "Módulo 1: Estruturando o SharePoint do Zero",
        lessons: [
          { id: "sp-1-1", title: "Guia PDF: Arquitetura de Informação", duration: "45 pág", type: "pdf" },
          { id: "sp-1-2", title: "Guia PDF: Controle de Acesso e Permissões", duration: "32 pág", type: "pdf" }
        ]
      }
    ]
  },
  {
    id: "ia-business",
    title: "Inteligência Artificial Aplicada a Negócios e Automação",
    description: "Utilize Copilots, ChatGPT, Power Automate e IA Builder para automatizar a leitura de PDFs, responder e-mails automáticos e gerar relatórios executivos.",
    price: 597.00,
    originalPrice: 1197.00,
    duration: "50h",
    lessonsCount: 140,
    type: "video",
    category: "ia",
    badgeClass: "badge-ia",
    badgeLabel: "IA",
    level: "Avançado",
    rating: 4.9,
    reviewsCount: 228,
    banner: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      {
        moduleTitle: "Módulo 1: Fundamentos de Engenharia de Prompt",
        lessons: [
          { id: "ia-1-1", title: "Prompts estruturados para análise de dados", duration: "20 min", type: "video" },
          { id: "ia-1-2", title: "Construindo relatórios analíticos automáticos", duration: "25 min", type: "video" }
        ]
      }
    ]
  },
  {
    id: "sistemas-web-html",
    title: "Sistemas Web Corporativos com HTML, CSS e JS Puro",
    description: "Crie sistemas corporativos leves que funcionam no SharePoint sem precisar de licenças caras do Power Apps. Foco em Vale Design System e usabilidade.",
    price: 347.00,
    originalPrice: 697.00,
    duration: "30h",
    lessonsCount: 75,
    type: "video",
    category: "sistemas",
    badgeClass: "badge-systems",
    badgeLabel: "Sistemas",
    level: "Iniciante ao Avançado",
    rating: 4.85,
    reviewsCount: 89,
    banner: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop",
    syllabus: [
      {
        moduleTitle: "Módulo 1: Setup do Projeto e HTML5 Semântico",
        lessons: [
          { id: "sys-1-1", title: "Diferença entre Power Apps e Apps Web", duration: "18 min", type: "video" },
          { id: "sys-1-2", title: "Boas práticas de estrutura e Semântica HTML", duration: "22 min", type: "video" }
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
