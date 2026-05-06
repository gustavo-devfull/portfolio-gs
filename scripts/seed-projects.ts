import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const projects = [
  {
    title: { pt: 'Dashboard de Análise em Tempo Real', en: 'Real-Time Analytics Dashboard' },
    slug: 'dashboard-analytics',
    description: {
      pt: 'Dashboard interativo com gráficos e métricas em tempo real, integrado com múltiplas APIs.',
      en: 'Interactive dashboard with charts and real-time metrics, integrated with multiple APIs.',
    },
    content: {
      challenge: {
        pt: 'Criar uma interface de dashboard que processasse dados em tempo real de múltiplas fontes, mantendo performance mesmo com grande volume de dados.',
        en: 'Create a dashboard interface that processes real-time data from multiple sources while maintaining performance with large data volumes.',
      },
      solution: {
        pt: 'Utilizei React com Context API para gerenciar estado global, WebSockets para atualizações em tempo real, e bibliotecas como Chart.js para visualizações. Implementei virtual scrolling para otimização.',
        en: 'Used React with Context API for global state management, WebSockets for real-time updates, and libraries like Chart.js for visualizations. Implemented virtual scrolling for optimization.',
      },
      result: {
        pt: 'Dashboard responsivo que carrega dados em tempo real, suportando 10mil+ atualizações por segundo sem degradação de performance. Redução de 40% no tempo de carregamento inicial.',
        en: 'Responsive dashboard that loads real-time data, supporting 10k+ updates per second without performance degradation. 40% reduction in initial load time.',
      },
    },
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    techs: ['React', 'TypeScript', 'Chart.js', 'WebSockets', 'Tailwind CSS'],
    category: 'dashboard',
    liveUrl: 'https://example.com/dashboard',
    repoUrl: 'https://github.com/gustavosantos/dashboard-analytics',
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-01-15')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-15')),
  },
  {
    title: { pt: 'E-commerce Platform', en: 'E-commerce Platform' },
    slug: 'ecommerce-platform',
    description: {
      pt: 'Plataforma de e-commerce completa com carrinho, pagamento e gerenciamento de inventário.',
      en: 'Complete e-commerce platform with shopping cart, payment processing, and inventory management.',
    },
    content: {
      challenge: {
        pt: 'Desenvolver uma plataforma de e-commerce escalável com sistema de pagamento seguro, gestão de inventário em tempo real e experiência de compra fluida.',
        en: 'Develop a scalable e-commerce platform with secure payment system, real-time inventory management, and smooth shopping experience.',
      },
      solution: {
        pt: 'Implementei arquitetura moderna com Next.js para SSR/SSG, Stripe para pagamentos, Redux para estado complexo, e PostgreSQL com Prisma para dados.',
        en: 'Implemented modern architecture with Next.js for SSR/SSG, Stripe for payments, Redux for complex state, and PostgreSQL with Prisma for data.',
      },
      result: {
        pt: 'Plataforma com 99.9% uptime, suporta 1000+ transações diárias, checkout em < 2 segundos. Taxa de conversão 35% acima da média da indústria.',
        en: 'Platform with 99.9% uptime, supports 1000+ daily transactions, checkout in < 2 seconds. Conversion rate 35% above industry average.',
      },
    },
    images: ['https://images.unsplash.com/photo-1557821552-17105176677c?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200',
    techs: ['Next.js', 'React', 'TypeScript', 'Stripe', 'PostgreSQL', 'Prisma'],
    category: 'web',
    liveUrl: 'https://example.com/ecommerce',
    repoUrl: 'https://github.com/gustavosantos/ecommerce',
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-02-10')),
    updatedAt: Timestamp.fromDate(new Date('2024-02-10')),
  },
  {
    title: { pt: 'Sistema de Gerenciamento de Projetos', en: 'Project Management System' },
    slug: 'project-management-system',
    description: {
      pt: 'SaaS para gerenciamento de projetos com colaboração em tempo real, kanban board e integração com ferramentas populares.',
      en: 'SaaS for project management with real-time collaboration, kanban board, and integration with popular tools.',
    },
    content: {
      challenge: {
        pt: 'Criar um sistema colaborativo que permitisse múltiplos usuários trabalharem simultaneamente com sincronização em tempo real, sem latência perceptível.',
        en: 'Create a collaborative system allowing multiple users to work simultaneously with real-time synchronization without noticeable latency.',
      },
      solution: {
        pt: 'Utilizei Firebase Realtime Database para sincronização, Vue.js para UI reactiva, drag-and-drop com Vuedraggable, e Websockets para atualizações imediatas.',
        en: 'Used Firebase Realtime Database for sync, Vue.js for reactive UI, drag-and-drop with Vuedraggable, and Websockets for immediate updates.',
      },
      result: {
        pt: '500+ usuários ativos diários, latência de sincronização < 100ms, suporte a 50+ integrações. NPS score de 72.',
        en: '500+ active daily users, sync latency < 100ms, support for 50+ integrations. NPS score of 72.',
      },
    },
    images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
    techs: ['Vue.js', 'Firebase', 'Tailwind CSS', 'Vuedraggable', 'Node.js'],
    category: 'system',
    liveUrl: 'https://example.com/projects',
    repoUrl: 'https://github.com/gustavosantos/project-mgmt',
    featured: false,
    createdAt: Timestamp.fromDate(new Date('2024-03-05')),
    updatedAt: Timestamp.fromDate(new Date('2024-03-05')),
  },
  {
    title: { pt: 'App Mobile de Fitness', en: 'Fitness Mobile App' },
    slug: 'fitness-mobile-app',
    description: {
      pt: 'Aplicativo mobile nativo para rastreamento de exercícios, planos de treino personalizados e integração com wearables.',
      en: 'Native mobile app for exercise tracking, personalized workout plans, and wearable integration.',
    },
    content: {
      challenge: {
        pt: 'Desenvolver um app que sincronizasse dados de múltiplos wearables, processasse dados de forma offline-first, e fornecesse análises precisas de atividade.',
        en: 'Develop an app that syncs data from multiple wearables, processes data in offline-first manner, and provides accurate activity analytics.',
      },
      solution: {
        pt: 'Implementei com React Native para iOS/Android, Redux para estado, SQLite para offline, integração com Apple HealthKit e Google Fit.',
        en: 'Implemented with React Native for iOS/Android, Redux for state, SQLite for offline, integration with Apple HealthKit and Google Fit.',
      },
      result: {
        pt: '50k+ downloads, rating 4.8 stars, 85% daily active user retention, integração com 20+ wearables.',
        en: '50k+ downloads, 4.8 star rating, 85% daily active user retention, integration with 20+ wearables.',
      },
    },
    images: ['https://images.unsplash.com/photo-1512941691920-25bda36dc643?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1512941691920-25bda36dc643?w=1200',
    techs: ['React Native', 'TypeScript', 'Redux', 'SQLite', 'Apple HealthKit'],
    category: 'mobile',
    liveUrl: 'https://example.com/fitness',
    repoUrl: 'https://github.com/gustavosantos/fitness-app',
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-04-20')),
    updatedAt: Timestamp.fromDate(new Date('2024-04-20')),
  },
  {
    title: { pt: 'Plataforma de Educação Online', en: 'Online Learning Platform' },
    slug: 'online-learning-platform',
    description: {
      pt: 'Plataforma de cursos online com vídeo streaming, testes interativos, certificados e sistema de mentoría.',
      en: 'Online learning platform with video streaming, interactive quizzes, certificates, and mentoring system.',
    },
    content: {
      challenge: {
        pt: 'Criar uma plataforma educacional com streaming de vídeo de alta qualidade, interatividade em tempo real e sistema de progresso robusto.',
        en: 'Create an educational platform with high-quality video streaming, real-time interactivity, and robust progress system.',
      },
      solution: {
        pt: 'Utilizei Vimeo API para streaming, React para frontend, Node.js com Express para backend, PostgreSQL para dados, e AWS S3 para armazenamento.',
        en: 'Used Vimeo API for streaming, React for frontend, Node.js with Express for backend, PostgreSQL for data, and AWS S3 for storage.',
      },
      result: {
        pt: '10k+ alunos inscritos, 200+ cursos, taxa de conclusão 72%, 99.5% uptime. Faturamento de $2M/ano.',
        en: '10k+ enrolled students, 200+ courses, 72% completion rate, 99.5% uptime. $2M/year revenue.',
      },
    },
    images: ['https://images.unsplash.com/photo-1516321318423-f06f70a504f0?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f0?w=1200',
    techs: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Vimeo', 'AWS'],
    category: 'web',
    liveUrl: 'https://example.com/courses',
    repoUrl: 'https://github.com/gustavosantos/learning-platform',
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-05-12')),
    updatedAt: Timestamp.fromDate(new Date('2024-05-12')),
  },
  {
    title: { pt: 'Sistema de CRM Empresarial', en: 'Enterprise CRM System' },
    slug: 'enterprise-crm',
    description: {
      pt: 'Sistema CRM empresarial com automação de vendas, gerenciamento de leads e relatórios avançados.',
      en: 'Enterprise CRM system with sales automation, lead management, and advanced reporting.',
    },
    content: {
      challenge: {
        pt: 'Desenvolver um CRM escalável para grandes empresas com centenas de usuários, suportando customizações complexas e integrações com sistemas legados.',
        en: 'Develop a scalable CRM for large enterprises with hundreds of users, supporting complex customizations and legacy system integrations.',
      },
      solution: {
        pt: 'Arquitetura baseada em microserviços, Frontend com Angular, Backend com Node.js, MongoDB para flexibilidade, Elasticsearch para buscas, e integração via APIs REST.',
        en: 'Microservices architecture, Angular frontend, Node.js backend, MongoDB for flexibility, Elasticsearch for search, REST API integrations.',
      },
      result: {
        pt: '50+ empresas clientes, 5000+ usuários, processamento de 1M+ transações/mês, ROI 300% em primeiro ano.',
        en: '50+ enterprise clients, 5000+ users, processing 1M+ transactions/month, 300% ROI in first year.',
      },
    },
    images: ['https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200',
    techs: ['Angular', 'Node.js', 'MongoDB', 'Elasticsearch', 'Docker', 'Kubernetes'],
    category: 'system',
    liveUrl: 'https://example.com/crm',
    repoUrl: 'https://github.com/gustavosantos/crm-system',
    featured: false,
    createdAt: Timestamp.fromDate(new Date('2024-06-08')),
    updatedAt: Timestamp.fromDate(new Date('2024-06-08')),
  },
  {
    title: { pt: 'Dashboard de Saúde e Bem-estar', en: 'Health & Wellness Dashboard' },
    slug: 'health-wellness-dashboard',
    description: {
      pt: 'Dashboard pessoal de saúde integrado com dispositivos wearables e aplicações médicas.',
      en: 'Personal health dashboard integrated with wearable devices and medical applications.',
    },
    content: {
      challenge: {
        pt: 'Integrar dados de múltiplos wearables, processar dados sensíveis de saúde com segurança HIPAA-compliant, e apresentar insights acionáveis.',
        en: 'Integrate data from multiple wearables, process sensitive health data with HIPAA-compliance, and present actionable insights.',
      },
      solution: {
        pt: 'Implementei com React + TypeScript, integração com Apple Health e Google Fit, criptografia end-to-end, autenticação OAuth2, e conformidade HIPAA.',
        en: 'Implemented with React + TypeScript, Apple Health and Google Fit integration, end-to-end encryption, OAuth2 authentication, HIPAA compliance.',
      },
      result: {
        pt: '20k+ usuários, 4.9 rating, zero data breaches, redução de 30% em tempo de consulta médica.',
        en: '20k+ users, 4.9 rating, zero data breaches, 30% reduction in medical consultation time.',
      },
    },
    images: ['https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800'],
    coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200',
    techs: ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL'],
    category: 'dashboard',
    liveUrl: 'https://example.com/health',
    repoUrl: 'https://github.com/gustavosantos/health-dashboard',
    featured: true,
    createdAt: Timestamp.fromDate(new Date('2024-07-03')),
    updatedAt: Timestamp.fromDate(new Date('2024-07-03')),
  },
]

async function seedProjects() {
  try {
    console.log('🌱 Iniciando seed de projetos...')
    const projectsCollection = collection(db, 'projects')

    for (const project of projects) {
      const docRef = await addDoc(projectsCollection, project)
      console.log(`✅ Projeto criado: ${project.title.pt} (${docRef.id})`)
    }

    console.log(`\n✨ ${projects.length} projetos inseridos com sucesso!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao inserir projetos:', error)
    process.exit(1)
  }
}

seedProjects()
