/* Dados fictícios do protótipo. Nomes e empresas são ilustrativos. */
const CATEGORIES = {
  sites:      { label: "Sites", short: "Sites" },
  vendas:     { label: "Vendas", short: "Vendas" },
  prospeccao: { label: "Prospecção", short: "Prospecção" },
  ia:         { label: "IA & Automação", short: "IA & Automação" },
};

/*
 * Configuração de acesso do protótipo.
 * demoMode: abre a plataforma direto com o usuário demo, sem login.
 * authRequired: quando true, rotas internas exigem sessão e redirecionam para #/login.
 * Para reativar o login no futuro: demoMode = false, authRequired = true.
 */
const APP = { version: "0.2.0", demoMode: true, authRequired: false };

/* Usuário demo (PRO para liberar a visualização de todas as áreas). */
const USER = {
  name: "Visitante FavCode", first: "Visitante", initials: "VF", slug: "visitante-favcode", role: "Desenvolvedor Web & Automação",
  city: "Brasil", coins: 1250, level: 7, levelName: "Construtor", xp: 3850, xpNext: 5000,
  streak: 9, plan: "PRO", hoursMonth: 14.5, lessonsWeek: 11, certificates: 4,
};

const COURSES = [
  { id: "agentes-ia", cat: "ia", title: "Agentes de IA para negócios", instructor: "Lívia Prado", level: "Intermediário", lessons: 28, hours: "9h 40m", progress: 46, seed: 3,
    promise: "Projete, construa e venda agentes que resolvem processos reais de empresas — do diagnóstico ao contrato.", featured: true },
  { id: "sites-que-vendem", cat: "sites", title: "Sites que vendem", instructor: "Rafael Tavares", level: "Intermediário", lessons: 24, hours: "7h 15m", progress: 62, seed: 7 },
  { id: "n8n-pro", cat: "ia", title: "Automação com n8n", instructor: "Diego Monteiro", level: "Iniciante", lessons: 19, hours: "5h 50m", progress: 18, seed: 11 },
  { id: "outbound-b2b", cat: "prospeccao", title: "Prospecção outbound B2B", instructor: "Camila Reis", level: "Intermediário", lessons: 16, hours: "4h 30m", progress: 0, seed: 5 },
  { id: "fechamento", cat: "vendas", title: "Fechamento sem desconto", instructor: "Bruno Andrade", level: "Avançado", lessons: 12, hours: "3h 20m", progress: 0, seed: 13 },
  { id: "landing-pages", cat: "sites", title: "Landing pages de alta conversão", instructor: "Rafael Tavares", level: "Iniciante", lessons: 21, hours: "6h 05m", progress: 100, seed: 2 },
  { id: "cold-email", cat: "prospeccao", title: "Cold email que recebe resposta", instructor: "Camila Reis", level: "Iniciante", lessons: 10, hours: "2h 45m", progress: 0, seed: 17 },
  { id: "nextjs", cat: "sites", title: "Next.js do zero ao deploy", instructor: "Thiago Sena", level: "Intermediário", lessons: 34, hours: "12h 10m", progress: 8, seed: 19 },
  { id: "vendas-devs", cat: "vendas", title: "Vendas consultivas para devs", instructor: "Bruno Andrade", level: "Iniciante", lessons: 14, hours: "4h 00m", progress: 0, seed: 23 },
  { id: "prompt", cat: "ia", title: "Prompt engineering aplicado", instructor: "Lívia Prado", level: "Iniciante", lessons: 15, hours: "3h 55m", progress: 100, seed: 29 },
  { id: "precificacao", cat: "vendas", title: "Precificação de projetos", instructor: "Ana Ferraz", level: "Intermediário", lessons: 11, hours: "3h 05m", progress: 0, seed: 31 },
  { id: "linkedin-social", cat: "prospeccao", title: "Social selling no LinkedIn", instructor: "Camila Reis", level: "Intermediário", lessons: 13, hours: "3h 40m", progress: 0, seed: 37 },
];

const TRACKS = [
  { id: "freela-sites", title: "Freelancer de Sites", cat: "sites", courses: 5, hours: 32, progress: 54, desc: "Da primeira landing page ao primeiro contrato recorrente.", seed: 41 },
  { id: "automacao", title: "Automação & IA", cat: "ia", courses: 6, hours: 38, progress: 31, desc: "Agentes, integrações e produtos de automação vendáveis.", seed: 43 },
  { id: "closer", title: "Closer Digital", cat: "vendas", courses: 4, hours: 18, progress: 0, desc: "Diagnóstico, proposta e fechamento com previsibilidade.", seed: 47 },
  { id: "prospeccao-ativa", title: "Prospecção Ativa", cat: "prospeccao", courses: 4, hours: 15, progress: 0, desc: "Gere pipeline próprio sem depender de indicação.", seed: 53 },
];

const PLAYER = {
  courseId: "agentes-ia",
  current: "m2l4",
  modules: [
    { title: "Fundamentos de agentes", lessons: [
      { id: "m1l1", title: "O que é (e o que não é) um agente", dur: "12:40", done: true },
      { id: "m1l2", title: "Mapeando processos automatizáveis", dur: "18:05", done: true },
      { id: "m1l3", title: "Arquitetura: ferramentas, memória e contexto", dur: "21:30", done: true },
    ]},
    { title: "Construindo o primeiro agente", lessons: [
      { id: "m2l1", title: "Setup do ambiente", dur: "09:15", done: true },
      { id: "m2l2", title: "Definindo ferramentas", dur: "16:50", done: true },
      { id: "m2l3", title: "Memória de longo prazo", dur: "19:20", done: true },
      { id: "m2l4", title: "Orquestrando múltiplas ferramentas", dur: "24:10", done: false },
      { id: "m2l5", title: "Testes e avaliação", dur: "17:45", done: false },
    ]},
    { title: "Levando para o cliente", lessons: [
      { id: "m3l1", title: "Diagnóstico com o cliente", dur: "14:00", done: false },
      { id: "m3l2", title: "Proposta e precificação", dur: "20:35", done: false, locked: true },
      { id: "m3l3", title: "Implantação e suporte", dur: "15:10", done: false, locked: true },
    ]},
  ],
};

const EVENTS = [
  { type: "Mentoria", title: "Revisão de proposta comercial", who: "Ana Ferraz", date: "Qua, 08 out", time: "19:30", vip: false },
  { type: "Live VIP", title: "Hot seat: precificando agentes de IA", who: "Lívia Prado", date: "Qui, 09 out", time: "20:00", vip: true },
  { type: "Workshop", title: "Deploy na prática com Next.js", who: "Thiago Sena", date: "Sáb, 11 out", time: "10:00", vip: false },
];

const POSTS = [
  { id: 1, author: "Júlia Martins", initials: "JM", role: "Automação · Nível 18", badge: "PRO", cat: "Vitória", time: "há 2 h",
    text: "Fechei meu primeiro contrato recorrente de automação: R$ 2.400/mês para uma clínica. O que destravou foi a aula de diagnóstico — parei de vender ferramenta e comecei a vender hora economizada.",
    likes: 128, comments: 34, liked: false, saved: false, seed: 61, hue: "ia" },
  { id: 2, author: "Pedro Henrique", initials: "PH", role: "Sites · Nível 9", cat: "Dúvida", time: "há 5 h",
    text: "Como vocês estruturam o briefing para landing pages de infoprodutores? Estou perdendo muito tempo em revisões depois da entrega.",
    likes: 22, comments: 17, liked: true, saved: true },
  { id: 3, author: "Larissa Costa", initials: "LC", role: "Vendas · Nível 14", badge: "PRO", cat: "Material", time: "ontem",
    text: "Compartilhando o template de proposta que uso há 6 meses. Taxa de fechamento subiu de 18% para 31% depois que comecei a abrir com o custo do problema.",
    likes: 342, comments: 58, liked: false, saved: false, attachment: "proposta-comercial-v3.pdf" },
];

const COMMUNITY_TOPICS = ["Todos", "Vitórias", "Dúvidas", "Materiais", "Feedback", "Networking"];

const OPPORTUNITIES = [
  { id: 1, role: "Desenvolvedor(a) Front-end Pleno", company: "Lumina Digital", type: "CLT", mode: "Remoto", skills: ["React", "Next.js", "Tailwind"], pay: "R$ 7.000 – 9.500", date: "há 1 dia", match: 92, kind: "Vaga" },
  { id: 2, role: "Automação de atendimento via WhatsApp", company: "Clínica Vitta", type: "Projeto", mode: "Remoto", skills: ["n8n", "API WhatsApp", "OpenAI"], pay: "R$ 4.500 fixo", date: "há 3 h", match: 88, kind: "Projeto" },
  { id: 3, role: "SDR — Software B2B", company: "Kora Systems", type: "PJ", mode: "Híbrido · São Paulo", skills: ["Outbound", "HubSpot", "Cold call"], pay: "R$ 3.500 + variável", date: "há 2 dias", match: 74, kind: "Vaga" },
  { id: 4, role: "Site institucional + blog", company: "Ferraz Arquitetura", type: "Projeto", mode: "Remoto", skills: ["Webflow", "SEO", "Copy"], pay: null, date: "há 4 dias", match: 81, kind: "Projeto" },
];

const MENTORS = [
  { id: 1, name: "Lívia Prado", initials: "LP", spec: "Agentes de IA & produtos de automação", tags: ["IA", "Produto", "Precificação"], rating: 4.9, reviews: 212, avail: "Próxima vaga: qui, 14h", access: "PRO", hue: "ia", seed: 71 },
  { id: 2, name: "Bruno Andrade", initials: "BA", spec: "Vendas consultivas e fechamento", tags: ["Vendas", "Negociação"], rating: 4.8, reviews: 168, avail: "Próxima vaga: amanhã, 19h", access: "Todos", hue: "vendas", seed: 73 },
  { id: 3, name: "Camila Reis", initials: "CR", spec: "Prospecção outbound e social selling", tags: ["Prospecção", "LinkedIn", "Cold email"], rating: 4.9, reviews: 131, avail: "Agenda aberta esta semana", access: "PRO", hue: "prospeccao", seed: 79 },
  { id: 4, name: "Thiago Sena", initials: "TS", spec: "Arquitetura front-end e carreira dev", tags: ["Next.js", "Carreira"], rating: 4.7, reviews: 96, avail: "Próxima vaga: seg, 10h", access: "Todos", hue: "sites", seed: 83 },
];

const COIN_HISTORY = [
  { label: "Aula concluída · Memória de longo prazo", amount: +20, when: "hoje" },
  { label: "Resposta marcada como útil na comunidade", amount: +50, when: "ontem" },
  { label: "Sequência de 7 dias", amount: +100, when: "03 out" },
  { label: "Resgate · Revisão de portfólio", amount: -600, when: "28 set" },
  { label: "Certificado · Prompt engineering aplicado", amount: +250, when: "24 set" },
];

const COIN_REWARDS = [
  { title: "Revisão de portfólio", desc: "Feedback em vídeo de um mentor", cost: 600, icon: "fileUser" },
  { title: "Mentoria relâmpago", desc: "20 min individuais", cost: 1500, icon: "video" },
  { title: "Destaque em Oportunidades", desc: "Perfil em evidência por 7 dias", cost: 900, icon: "trend" },
  { title: "Acesso antecipado", desc: "Novos cursos antes do lançamento", cost: 3000, icon: "zap" },
];

const BADGES = [
  { name: "Primeiro contrato", icon: "award", earned: true },
  { name: "Sequência 7 dias", icon: "flame", earned: true },
  { name: "Mentor da comunidade", icon: "users", earned: true },
  { name: "Trilha completa", icon: "route", earned: false },
  { name: "100 aulas", icon: "playCircle", earned: false },
];

const RESUME = {
  headline: "Desenvolvedor Web & Automação — sites que convertem e processos que rodam sozinhos",
  about: "Construo sites de alta conversão e automações com IA para pequenas e médias empresas. Nos últimos 18 meses, entreguei 27 projetos para clínicas, escritórios e infoprodutores, com foco em resultado mensurável: mais leads, menos trabalho manual.",
  skills: [
    { group: "Desenvolvimento", items: ["HTML/CSS", "JavaScript", "React", "Next.js", "Webflow"] },
    { group: "Automação & IA", items: ["n8n", "Make", "OpenAI API", "Agentes", "APIs REST"] },
    { group: "Negócio", items: ["Diagnóstico", "Proposta comercial", "Prospecção B2B"] },
  ],
  experience: [
    { role: "Desenvolvedor & Consultor de Automação", org: "Autônomo", period: "2025 — atual", desc: "Projetos de sites e automação para 20+ clientes. Ticket médio de R$ 3.800, com 6 contratos recorrentes ativos." },
    { role: "Desenvolvedor Front-end Júnior", org: "Agência Órbita", period: "2023 — 2025", desc: "Desenvolvimento de landing pages e e-commerces. Responsável pela migração de 14 sites para Next.js." },
  ],
  projects: [
    { title: "Agente de triagem — Clínica Vitta", result: "−62% no tempo de resposta", cat: "ia", seed: 91 },
    { title: "Site + funil — Ferraz Arquitetura", result: "+3,1× leads qualificados", cat: "sites", seed: 93 },
  ],
};
