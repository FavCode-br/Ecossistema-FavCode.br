/* ==========================================================================
   FavCode — protótipo navegável (hash router + views)
   ========================================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const store = {
  get(key, fallback) { try { const v = localStorage.getItem(`fc:${key}`); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(`fc:${key}`, JSON.stringify(value)); } catch { /* storage indisponível */ } },
};
const fmt = (n) => n.toLocaleString("pt-BR");
const courseById = (id) => COURSES.find((c) => c.id === id);

/* ---- Navegação ---------------------------------------------------------- */
const NAV = [
  { group: "APRENDER", items: [
    { route: "home", label: "Início", icon: "home" },
    { route: "explorar", label: "Explorar", icon: "compass" },
    { route: "trilhas", label: "Trilhas", icon: "route" },
    { route: "aula", label: "Minhas aulas", icon: "playCircle" },
  ]},
  { group: "COMUNIDADE", items: [
    { route: "comunidade", label: "Comunidade", icon: "users", dot: true },
  ]},
  { group: "CARREIRA", items: [
    { route: "mentorias", label: "Mentorias", icon: "video" },
    { route: "oportunidades", label: "Oportunidades", icon: "briefcase", meta: "4" },
    { route: "curriculo", label: "Currículo", icon: "fileUser" },
  ]},
  { group: "BENEFÍCIOS", items: [
    { route: "vip", label: "Área VIP", icon: "gem" },
    { route: "favcoins", label: "FavCoins", icon: "coin" },
  ]},
  { group: "CONTA", items: [
    { route: "design-system", label: "Design System", icon: "palette" },
    { route: "login", label: "Sair", icon: "logout" },
  ]},
];
const BOTTOM_NAV = [
  { route: "home", label: "Home", icon: "home" },
  { route: "explorar", label: "Explorar", icon: "compass" },
  { route: "comunidade", label: "Comunidade", icon: "users" },
  { route: "trilhas", label: "Trilhas", icon: "route" },
  { route: "curriculo", label: "Perfil", icon: "user" },
];

/* ==========================================================================
   Componentes
   ========================================================================== */
function progressBar(value, cls = "") {
  return `<div class="progress ${cls}" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"><i style="--value:${value}%"></i></div>`;
}

function ring(value, { size = 112, stroke = 8, label = "", sub = "" } = {}) {
  const r = 50 - stroke / 2;
  const circ = 2 * Math.PI * r;
  const id = `rg${Math.random().toString(36).slice(2, 7)}`;
  return `<div class="ring" style="--size:${size}px;--stroke:${stroke}">
    <svg viewBox="0 0 100 100"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#126BFF"/><stop offset="1" stop-color="#00BBFF"/></linearGradient></defs>
      <circle class="ring-track" cx="50" cy="50" r="${r}"/>
      <circle class="ring-value" cx="50" cy="50" r="${r}" stroke="url(#${id})" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - value / 100)}" style="--circ:${circ}"/>
    </svg>
    <div class="ring-label"><strong>${label}</strong>${sub ? `<span>${sub}</span>` : ""}</div>
  </div>`;
}

function catTag(cat) { return `<span class="cat-tag" data-cat="${cat}">${CATEGORIES[cat].label}</span>`; }
function proBadge() { return `<span class="badge badge-pro">${fcSymbol({ size: 8 })} PRO</span>`; }

function courseCard(c) {
  const foot = c.progress === 100
    ? `<span class="done-mark">${icon("check", 14)} Concluído</span><span class="muted" style="margin-left:auto">Certificado</span>`
    : c.progress > 0
      ? `${progressBar(c.progress)}<span>${c.progress}%</span>`
      : `<span>${c.lessons} aulas · ${c.hours}</span>`;
  return `<a class="course-card" href="#/aula" data-cat="${c.cat}">
    <div class="course-thumb">
      ${fcArt({ hue: c.cat, seed: c.seed })}
      <div class="course-thumb-top">${catTag(c.cat)}</div>
      <div class="course-thumb-title">${c.title}</div>
      <div class="course-thumb-play"><span>${icon("play", 20)}</span></div>
    </div>
    <div class="course-body">
      <div class="course-meta"><span>${c.instructor}</span><i class="sep"></i><span>${c.level}</span></div>
      <div class="course-foot">${foot}</div>
    </div>
  </a>`;
}

function courseRow(title, sub, courses, id) {
  return `<section class="section">
    <div class="section-head">
      <div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>
      <div class="section-tools">
        <button class="row-arrow" data-scroll="${id}" data-dir="-1" aria-label="Anterior">${icon("chevronLeft", 18)}</button>
        <button class="row-arrow" data-scroll="${id}" data-dir="1" aria-label="Próximo">${icon("chevronRight", 18)}</button>
      </div>
    </div>
    <div class="row" id="${id}">${courses.map(courseCard).join("")}</div>
  </section>`;
}

function trackCard(t) {
  return `<a class="card card-hover track-card" href="#/trilhas" data-cat="${t.cat}">
    ${fcArt({ hue: t.cat, seed: t.seed })}
    ${catTag(t.cat)}
    <h3>${t.title}</h3>
    <p>${t.desc}</p>
    <div class="track-foot">
      ${t.progress > 0 ? `${progressBar(t.progress)}<span>${t.progress}%</span>` : `<span>${t.courses} cursos · ${t.hours}h</span><span style="margin-left:auto" class="link">Começar ${icon("arrowRight", 14)}</span>`}
    </div>
  </a>`;
}

function postCard(p) {
  return `<article class="card post" data-post="${p.id}">
    <header class="post-head">
      <div class="avatar ${p.badge ? "is-pro" : ""}" style="--size:42px">${p.initials}</div>
      <div class="post-author">
        <strong>${p.author} ${p.badge ? proBadge() : ""}</strong>
        <span>${p.role} · ${p.time}</span>
      </div>
      <span class="tag">${p.cat}</span>
    </header>
    <p class="post-text">${p.text}</p>
    ${p.seed ? `<div class="post-media">${fcArt({ hue: p.hue, seed: p.seed })}<div class="post-media-label"><strong>R$ 2.400/mês</strong><span class="badge badge-success">Contrato recorrente</span></div></div>` : ""}
    ${p.attachment ? `<div class="attachment">${icon("file", 18)}<span>${p.attachment}</span><button class="btn btn-ghost btn-sm">${icon("download", 16)} Baixar</button></div>` : ""}
    <footer class="post-actions">
      <button class="post-action heart ${p.liked ? "is-on" : ""}" data-like>${icon("heart", 18)}<b class="num">${p.likes}</b></button>
      <button class="post-action">${icon("message", 18)}<b class="num">${p.comments}</b><span>comentários</span></button>
      <button class="post-action push ${p.saved ? "is-on" : ""}" data-save aria-label="Salvar">${icon("bookmark", 18)}<span>Salvar</span></button>
      <button class="post-action" aria-label="Compartilhar">${icon("share", 18)}<span>Compartilhar</span></button>
    </footer>
  </article>`;
}

function emptyState({ title, text, cta, href, hue = "sites", seed = 5 }) {
  return `<div class="card empty">
    <div class="empty-art">${fcArt({ hue, seed })}</div>
    <h3>${title}</h3>
    <p>${text}</p>
    <a class="btn btn-primary" href="${href}">${cta} ${icon("arrowRight", 16)}</a>
  </div>`;
}

/* ==========================================================================
   Views
   ========================================================================== */
const VIEWS = {};

VIEWS.home = () => {
  const f = COURSES.find((c) => c.featured);
  const inProgress = COURSES.filter((c) => c.progress > 0 && c.progress < 100 && !c.featured).slice(0, 3);
  const lessonPct = Math.round((USER.xp / USER.xpNext) * 100);
  const days = ["S", "T", "Q", "Q", "S", "S", "D"];
  return `<div class="page">
    <section class="hero" data-cat="${f.cat}">
      <div class="hero-art">${fcArt({ hue: f.cat, seed: f.seed, variant: "hero" })}</div>
      <div class="hero-content">
        <div class="hero-meta">${catTag(f.cat)}<span class="badge badge-outline">Módulo 2 de 3</span></div>
        <h1>${f.title}</h1>
        <p class="hero-promise">${f.promise}</p>
        <div class="hero-progress">${progressBar(f.progress, "progress-lg")}<span>${f.progress}% · 15 aulas restantes</span></div>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="#/aula">${icon("play", 16)} Continuar aula 7</a>
          <a class="btn btn-secondary btn-lg" href="#/explorar">Ver conteúdo</a>
        </div>
      </div>
      <div class="hero-side">
        <span class="eyebrow">Próxima aula</span>
        <strong>Orquestrando múltiplas ferramentas</strong>
        <span>24 min · com ${f.instructor}</span>
      </div>
    </section>

    <div class="fold-grid">
      <div class="card card-pad">
        <div class="card-title-row"><h3>Continue aprendendo</h3><a class="link" href="#/explorar">Ver todos ${icon("arrowRight", 14)}</a></div>
        ${inProgress.map((c) => `<a class="continue-item" href="#/aula">
          <div class="continue-thumb">${fcArt({ hue: c.cat, seed: c.seed })}<span class="play-mini">${icon("play", 18)}</span></div>
          <div class="continue-body"><strong>${c.title}</strong><small>${c.instructor} · ${c.progress}% concluído</small>${progressBar(c.progress)}</div>
        </a>`).join("")}
      </div>

      <div class="card card-pad">
        <div class="card-title-row"><h3>Seu progresso</h3><span class="badge badge-outline">Nível ${USER.level}</span></div>
        <div class="progress-card-body">
          ${ring(lessonPct, { size: 96, label: `${lessonPct}%`, sub: USER.levelName })}
          <div class="stat-list">
            <div class="stat">Aulas/semana <strong>${USER.lessonsWeek}</strong></div>
            <div class="stat">Horas/mês <strong>${String(USER.hoursMonth).replace(".", ",")}</strong></div>
            <div class="stat">Certificados <strong>${USER.certificates}</strong></div>
          </div>
        </div>
        <div class="streak" aria-label="Sequência de ${USER.streak} dias">
          ${days.map((d, i) => `<i class="${i < 5 ? "on" : ""} ${i === 5 ? "today" : ""}">${d}</i>`).join("")}
        </div>
      </div>

      <div class="card card-pad">
        <div class="card-title-row"><h3>Próximo na agenda</h3><a class="link" href="#/mentorias">Agenda</a></div>
        <div class="event-next">
          <div class="date-block"><small>Out</small><strong>08</strong></div>
          <div>
            <span class="badge">${EVENTS[0].type}</span>
            <h4 style="margin-top:6px">${EVENTS[0].title}</h4>
            <p>${EVENTS[0].time} · com ${EVENTS[0].who}</p>
          </div>
        </div>
        <div class="event-list">
          ${EVENTS.slice(1).map((e) => `<div class="event-row"><span>${e.title}</span>${e.vip ? `<span class="badge badge-live">VIP</span>` : ""}<time>${e.date.split(",")[0]} · ${e.time}</time></div>`).join("")}
        </div>
      </div>
    </div>

    <section class="section">
      <div class="section-head"><div><h2>Trilhas</h2><p>Caminhos completos, do primeiro passo ao primeiro contrato.</p></div><a class="link" href="#/trilhas">Todas as trilhas ${icon("arrowRight", 14)}</a></div>
      <div class="tracks-grid">${TRACKS.map(trackCard).join("")}</div>
    </section>

    <section class="section">
      <div class="section-head"><div><h2>Acontecendo na comunidade</h2><p>O que outros membros estão construindo agora.</p></div><a class="link" href="#/comunidade">Abrir comunidade ${icon("arrowRight", 14)}</a></div>
      <div class="fold-grid is-pair">
        ${postCard({ ...POSTS[0], seed: null })}
        ${postCard(POSTS[2])}
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><h2>Oportunidades para você</h2><p>Selecionadas pelo seu currículo e trilhas.</p></div><a class="link" href="#/oportunidades">Ver todas ${icon("arrowRight", 14)}</a></div>
      <div class="opp-list">${OPPORTUNITIES.slice(0, 2).map(oppCard).join("")}</div>
    </section>

    ${courseRow("Recomendados para você", "Baseado na trilha Automação & IA.", COURSES.filter((c) => c.progress === 0), "row-rec")}
  </div>`;
};

VIEWS.explorar = () => {
  const active = store.get("cat", "todos");
  const list = active === "todos" ? COURSES : COURSES.filter((c) => c.cat === active);
  return `<div class="page">
    <div class="page-head"><div><h1>Explorar</h1><p>${COURSES.length} cursos em quatro verticais. Escolha por onde quer crescer.</p></div>
      <div class="chips" data-cat-chips>
        <button class="chip ${active === "todos" ? "is-active" : ""}" data-cat-filter="todos">Todos</button>
        ${Object.entries(CATEGORIES).map(([k, v]) => `<button class="chip ${active === k ? "is-active" : ""}" data-cat-filter="${k}">${v.label}</button>`).join("")}
      </div>
    </div>
    <div class="cat-hero-grid">
      ${Object.entries(CATEGORIES).map(([k, v], i) => `<button class="cat-card ${active === k ? "is-active" : ""}" data-cat="${k}" data-cat-filter="${k}">
        ${fcArt({ hue: k, seed: 100 + i * 7 })}<strong>${v.label}</strong><span>${COURSES.filter((c) => c.cat === k).length} cursos</span></button>`).join("")}
    </div>
    <div class="section-head"><h2>${active === "todos" ? "Todos os cursos" : CATEGORIES[active].label}</h2><span class="muted" style="font-size:var(--fs-sm)">${list.length} cursos</span></div>
    <div class="course-grid">${list.map(courseCard).join("")}</div>
  </div>`;
};

VIEWS.trilhas = () => `<div class="page">
  <div class="page-head"><div><h1>Trilhas</h1><p>Sequências pensadas para um resultado concreto. Cada trilha termina em um projeto real para o seu portfólio.</p></div></div>
  <div class="tracks-grid">${TRACKS.map(trackCard).join("")}</div>
  ${courseRow("Cursos da trilha Freelancer de Sites", "5 cursos · 32 horas", COURSES.filter((c) => c.cat === "sites" || c.id === "precificacao"), "row-tr1")}
  ${courseRow("Cursos da trilha Automação & IA", "6 cursos · 38 horas", COURSES.filter((c) => c.cat === "ia"), "row-tr2")}
</div>`;

VIEWS.aula = () => {
  const c = courseById(PLAYER.courseId);
  const all = PLAYER.modules.flatMap((m) => m.lessons);
  const done = all.filter((l) => l.done).length;
  const tab = store.get("lessonTab", "overview");
  const panels = {
    overview: `<p>Nesta aula você conecta o agente a três ferramentas — CRM, agenda e base de conhecimento — e define quando cada uma deve ser chamada. O foco é previsibilidade: o agente precisa escolher a ferramenta certa sem depender de prompts gigantes.</p>
      <h3>Você vai sair desta aula sabendo</h3>
      <ul class="check-list">
        <li>${icon("check", 16)} Descrever ferramentas para que o modelo as use corretamente</li>
        <li>${icon("check", 16)} Encadear chamadas e tratar falhas entre elas</li>
        <li>${icon("check", 16)} Registrar decisões do agente para auditoria do cliente</li>
      </ul>`,
    materiais: `<div class="material">${icon("file", 18)}<span>Diagrama de orquestração.pdf</span><button class="btn btn-ghost btn-sm">${icon("download", 16)}</button></div>
      <div class="material">${icon("file", 18)}<span>Template de definição de ferramentas.json</span><button class="btn btn-ghost btn-sm">${icon("download", 16)}</button></div>
      <div class="material">${icon("link", 18)}<span>Repositório do projeto da aula</span><button class="btn btn-ghost btn-sm">${icon("arrowRight", 16)}</button></div>`,
    duvidas: `<div class="feed">${postCard({ ...POSTS[1], id: 9, text: "Na parte de tratamento de falhas, vocês usam retry dentro do próprio agente ou deixam isso para a camada de integração?", cat: "Dúvida da aula" })}</div>`,
  };
  return `<div class="player-layout">
    <div class="player-main">
      <nav class="crumbs"><a href="#/explorar">${CATEGORIES[c.cat].label}</a>${icon("chevronRight", 14)}<a href="#/home">${c.title}</a>${icon("chevronRight", 14)}<span>Aula 7</span></nav>
      <div class="video">
        ${fcArt({ hue: c.cat, seed: 12, variant: "hero" })}
        <div class="video-center"><button class="video-play" aria-label="Reproduzir">${icon("play", 30)}</button></div>
        <div class="video-controls">
          <div class="video-scrub"><i></i></div>
          <div class="video-bar">
            <button class="icon-btn" aria-label="Reproduzir">${icon("play", 18)}</button>
            <button class="icon-btn hide-sm" aria-label="Próxima">${icon("skipForward", 18)}</button>
            <button class="icon-btn hide-sm" aria-label="Volume">${icon("volume", 18)}</button>
            <span class="num">08:12 / 24:10</span>
            <span class="spacer"></span>
            <button class="btn btn-ghost btn-sm hide-sm">1,25×</button>
            <button class="icon-btn" aria-label="Tela cheia">${icon("maximize", 18)}</button>
          </div>
        </div>
      </div>
      <div class="lesson-head">
        <div><span class="eyebrow">Módulo 2 · Aula 7</span><h1 style="margin-top:6px">Orquestrando múltiplas ferramentas</h1><p>${c.instructor} · 24 min · ${icon("coin", 14).replace('class="icon ', 'style="display:inline;vertical-align:-2px" class="icon ')} +20 FavCoins ao concluir</p></div>
        <div class="lesson-head-actions">
          <button class="btn btn-secondary">${icon("bookmark", 16)} Salvar</button>
          <button class="btn btn-primary" data-complete>${icon("check", 16)} Concluir aula</button>
        </div>
      </div>
      <div class="lesson-tabs"><div class="tabs" role="tablist">
        <button class="tab ${tab === "overview" ? "is-active" : ""}" data-lesson-tab="overview">Visão geral</button>
        <button class="tab ${tab === "materiais" ? "is-active" : ""}" data-lesson-tab="materiais">Materiais</button>
        <button class="tab ${tab === "duvidas" ? "is-active" : ""}" data-lesson-tab="duvidas">Dúvidas</button>
      </div></div>
      <div class="lesson-panel">${panels[tab]}</div>
    </div>
    <aside class="lessons" aria-label="Aulas do curso">
      <div class="lessons-head"><h2>${c.title}</h2>${progressBar(Math.round((done / all.length) * 100))}<small>${done} de ${all.length} aulas concluídas</small></div>
      ${PLAYER.modules.map((m, mi) => `<div class="module">
        <button class="module-title" data-module>${String(mi + 1).padStart(2, "0")} · ${m.title}${icon("chevronDown", 16)}</button>
        ${m.lessons.map((l) => `<a class="lesson ${l.done ? "is-done" : ""} ${l.id === PLAYER.current ? "is-current" : ""} ${l.locked ? "is-locked" : ""}" href="#/aula">
          <span class="lesson-state">${l.locked ? icon("lock", 12) : l.id === PLAYER.current ? icon("play", 10) : icon("check", 12)}</span>
          <span>${l.title}</span><time>${l.dur}</time></a>`).join("")}
      </div>`).join("")}
    </aside>
  </div>`;
};

VIEWS.comunidade = () => {
  const topic = store.get("topic", "Todos");
  return `<div class="page">
    <div class="page-head"><div><h1>Comunidade</h1><p>Mais de 8 mil profissionais trocando contratos, dúvidas e atalhos.</p></div>
      <div class="chips">${COMMUNITY_TOPICS.map((t) => `<button class="chip ${t === topic ? "is-active" : ""}" data-topic="${t}">${t}</button>`).join("")}</div>
    </div>
    <div class="community-layout">
      <div class="feed">
        <div class="card composer"><div class="avatar is-pro">${USER.initials}</div><input placeholder="Compartilhe uma vitória, dúvida ou material…" aria-label="Novo post"><button class="btn btn-primary btn-sm">Publicar</button></div>
        ${POSTS.map(postCard).join("")}
      </div>
      <aside class="side-stack">
        <div class="card card-pad">
          <div class="card-title-row"><h3>Destaques da semana</h3></div>
          ${[["Larissa Costa", "LC", "1.240 pts", true], ["Júlia Martins", "JM", "980 pts", true], ["Rodrigo Alves", "RA", "760 pts", false], [USER.name, USER.initials, "540 pts", true]].map(([n, i, p, pro], k) => `
            <div class="member-row"><span class="rank">${k + 1}</span><div class="avatar ${pro ? "is-pro" : ""}" style="--size:34px">${i}</div><div><strong>${n}</strong><span>${p}</span></div></div>`).join("")}
        </div>
        <div class="card card-pad">
          <div class="card-title-row"><h3>Próximos encontros</h3></div>
          ${EVENTS.map((e) => `<div class="live-row" style="padding:var(--sp-3) 0"><div><strong>${e.title}</strong><span>${e.date} · ${e.time}</span></div>${e.vip ? `<span class="badge badge-live">VIP</span>` : ""}</div>`).join("")}
        </div>
      </aside>
    </div>
  </div>`;
};

function oppCard(o) {
  return `<article class="card card-hover opp">
    <div class="opp-logo">${o.company.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
    <div>
      <div style="display:flex;align-items:center;gap:var(--sp-2);flex-wrap:wrap"><h3>${o.role}</h3><span class="badge ${o.kind === "Projeto" ? "badge-live" : "badge-outline"}">${o.kind}</span></div>
      <div class="opp-meta">
        <span>${icon("building", 15)}${o.company}</span>
        <span>${icon("mapPin", 15)}${o.mode}</span>
        <span>${icon("briefcase", 15)}${o.type}</span>
        <span>${icon("clock", 15)}${o.date}</span>
      </div>
      <div class="opp-skills">${o.skills.map((s) => `<span class="tag">${s}</span>`).join("")}</div>
    </div>
    <div class="opp-side">
      ${o.pay ? `<span class="opp-pay">${o.pay}</span>` : `<span class="opp-pay is-empty">Valor a combinar</span>`}
      <span class="match">${o.match}% compatível</span>
      <button class="btn btn-primary btn-sm">${o.kind === "Projeto" ? "Enviar proposta" : "Candidatar-se"}</button>
    </div>
  </article>`;
}

VIEWS.oportunidades = () => {
  const kind = store.get("oppKind", "Todas");
  const list = kind === "Todas" ? OPPORTUNITIES : OPPORTUNITIES.filter((o) => (kind === "Vagas" ? o.kind === "Vaga" : o.kind === "Projeto"));
  return `<div class="page page-narrow">
    <div class="page-head"><div><h1>Oportunidades</h1><p>Vagas e projetos de empresas parceiras, filtrados pelo seu currículo FavCode.</p></div>
      <div class="tabs">${["Todas", "Vagas", "Projetos"].map((k) => `<button class="tab ${k === kind ? "is-active" : ""}" data-opp-kind="${k}">${k}</button>`).join("")}</div>
    </div>
    <div class="opp-list">${list.map(oppCard).join("")}</div>
  </div>`;
};

VIEWS.mentorias = () => {
  const tab = store.get("mentorTab", "mentores");
  const body = tab === "agendadas"
    ? emptyState({ title: "Você ainda não tem mentorias agendadas.", text: "Uma conversa de 30 minutos com quem já fez o caminho pode economizar meses. Escolha um mentor e reserve um horário.", cta: "Explorar mentores", href: "#/mentorias?tab=mentores", hue: "prospeccao", seed: 9 })
    : `<div class="mentor-grid">${MENTORS.map((m) => `<article class="card card-hover mentor-card">
        <div style="position:relative">${fcPortrait({ hue: m.hue, seed: m.seed, initials: m.initials })}${m.access === "PRO" ? `<span class="mentor-badge badge badge-pro">${fcSymbol({ size: 8 })} FavCode PRO</span>` : ""}</div>
        <div class="mentor-body">
          <h3>${m.name}</h3>
          <p class="mentor-spec">${m.spec}</p>
          <div class="opp-skills tags" style="margin:0">${m.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--sp-2)"><span class="rating">${icon("star", 14)} ${String(m.rating).replace(".", ",")} <span>(${m.reviews})</span></span></div>
          <span class="avail">${m.avail}</span>
          <button class="btn btn-secondary btn-sm" style="margin-top:var(--sp-3)">Agendar</button>
        </div>
      </article>`).join("")}</div>`;
  return `<div class="page">
    <div class="page-head"><div><h1>Mentorias</h1><p>Sessões individuais com especialistas que vendem, entregam e contratam todos os dias.</p></div>
      <div class="tabs">${[["mentores", "Mentores"], ["agendadas", "Agendadas"]].map(([k, l]) => `<button class="tab ${k === tab ? "is-active" : ""}" data-mentor-tab="${k}">${l}</button>`).join("")}</div>
    </div>
    ${body}
  </div>`;
};

VIEWS.vip = () => `<div class="page">
  <section class="vip-hero">
    <div class="vip-hero-art">${fcSymbol({ size: 400 })}</div>
    <span class="badge badge-pro">${fcSymbol({ size: 8 })} Área VIP</span>
    <h1 style="margin-top:var(--sp-4)">Menos distância entre você e <em>quem já chegou lá.</em></h1>
    <p>Lives fechadas, hot seats e acesso direto aos instrutores. Um grupo menor, com mais contexto e respostas mais rápidas.</p>
    <div class="hero-actions"><a class="btn btn-brand btn-lg" href="#/vip">Ver próximas lives</a><a class="btn btn-secondary btn-lg" href="#/mentorias">Agendar mentoria</a></div>
    <div class="pillars">
      <div class="pillar"><small>ACESSO</small><strong>Conteúdo antes de todos</strong><p>Novos cursos e materiais liberados primeiro.</p></div>
      <div class="pillar"><small>PROXIMIDADE</small><strong>Instrutores por perto</strong><p>Lives semanais com perguntas abertas.</p></div>
      <div class="pillar"><small>ACELERAÇÃO</small><strong>Hot seats</strong><p>Seu projeto analisado ao vivo.</p></div>
      <div class="pillar"><small>EXCLUSIVIDADE</small><strong>Círculo reduzido</strong><p>Grupo de membros PRO com networking ativo.</p></div>
    </div>
  </section>
  <div class="vip-grid section" style="margin-top:var(--sp-6)">
    <div class="card card-pad">
      <div class="card-title-row"><h3>Próximas lives VIP</h3><span class="badge badge-live">Ao vivo qui, 20h</span></div>
      ${[["Hot seat: precificando agentes de IA", "Lívia Prado · qui, 09 out · 20:00", "ia"], ["Bastidores de um contrato de R$ 30 mil", "Bruno Andrade · ter, 14 out · 19:30", "vendas"], ["Revisão de portfólios ao vivo", "Thiago Sena · sex, 17 out · 18:00", "sites"]].map(([t, s, h], i) => `
        <div class="live-row"><div class="continue-thumb" style="width:84px">${fcArt({ hue: h, seed: 200 + i })}</div><div><strong>${t}</strong><span>${s}</span></div><button class="btn btn-secondary btn-sm">Lembrar</button></div>`).join("")}
    </div>
    <div class="card card-premium card-pad">
      <div class="card-title-row"><h3>Seu acesso PRO</h3>${proBadge()}</div>
      <ul class="check-list">
        <li>${icon("check", 16)} 2 mentorias individuais por mês</li>
        <li>${icon("check", 16)} Todas as lives e gravações VIP</li>
        <li>${icon("check", 16)} Destaque em Oportunidades</li>
        <li>${icon("check", 16)} FavCoins em dobro em desafios</li>
      </ul>
      <hr class="fc-divider" style="margin:var(--sp-6) 0">
      <div class="stat">Renovação <strong>12 jan 2027</strong></div>
    </div>
  </div>
</div>`;

VIEWS.favcoins = () => `<div class="page">
  <div class="page-head"><div><h1>FavCoins</h1><p>Sua reputação no ecossistema FavCode. Ganhe aprendendo e ajudando — use em mentorias, revisões e visibilidade.</p></div></div>
  <div class="coins-hero">
    <div class="card card-premium card-pad">
      <div class="balance">
        <div class="balance-coin">${fcCoin({ size: 104 })}</div>
        <div><small>Saldo atual</small><strong class="num">${fmt(USER.coins)}</strong><small>+170 esta semana</small></div>
      </div>
      <div class="level-bar">
        <div class="level-bar-top"><span>Nível ${USER.level} · ${USER.levelName}</span><span class="num">${fmt(USER.xp)} / ${fmt(USER.xpNext)} XP</span></div>
        ${progressBar(Math.round((USER.xp / USER.xpNext) * 100), "progress-lg")}
      </div>
    </div>
    <div class="card card-pad">
      <div class="card-title-row"><h3>Conquistas</h3><span class="muted" style="font-size:var(--fs-sm)">3 de 5</span></div>
      <div class="badge-shelf">${BADGES.map((b) => `<div class="badge-item ${b.earned ? "" : "is-locked"}"><div class="badge-medal">${icon(b.earned ? b.icon : "lock", 20)}</div>${b.name}</div>`).join("")}</div>
    </div>
  </div>
  <section class="section">
    <div class="section-head"><div><h2>Trocar FavCoins</h2><p>Recompensas que aceleram sua carreira.</p></div></div>
    <div class="reward-grid">${COIN_REWARDS.map((r) => `<div class="card card-hover reward">
      <div class="reward-icon">${icon(r.icon, 20)}</div><h3>${r.title}</h3><p>${r.desc}</p>
      <div class="reward-foot"><span class="cost">${fcCoin({ size: 16 })} ${fmt(r.cost)}</span><button class="btn btn-secondary btn-sm" ${r.cost > USER.coins ? "disabled style='opacity:.45;cursor:not-allowed'" : ""}>Trocar</button></div>
    </div>`).join("")}</div>
  </section>
  <section class="section">
    <div class="section-head"><h2>Histórico</h2></div>
    <div class="card card-pad">${COIN_HISTORY.map((h) => `<div class="ledger-row"><span>${h.label}</span><span class="amount ${h.amount > 0 ? "pos" : "neg"}">${h.amount > 0 ? "+" : "−"}${fmt(Math.abs(h.amount))}</span><time>${h.when}</time></div>`).join("")}</div>
  </section>
</div>`;

VIEWS.curriculo = () => `<div class="page">
  <div class="resume">
    <div class="card resume-head">
      <div class="resume-head-art">${fcArt({ hue: "vip", seed: 300, variant: "hero" })}</div>
      <div class="resume-id">
        <div class="avatar is-pro">${USER.initials}</div>
        <div>
          <h1>${USER.name}</h1>
          <p>${RESUME.headline}</p>
          <div class="resume-id-meta"><span>${icon("mapPin", 15)} ${USER.city}</span><span>${icon("globe", 15)} Disponível para projetos remotos</span><span>${icon("award", 15)} ${USER.certificates} certificados FavCode</span></div>
        </div>
        <div class="resume-actions">
          <button class="btn btn-secondary">${icon("edit", 16)} Editar</button>
          <button class="btn btn-primary" data-share>${icon("share", 16)} Compartilhar</button>
        </div>
      </div>
    </div>
    <div class="resume-body">
      <div>
        <section class="card resume-section"><h2>Sobre</h2><p>${RESUME.about}</p></section>
        <section class="card resume-section"><h2>Experiência</h2>
          ${RESUME.experience.map((x) => `<div class="xp-item"><h3>${x.role}</h3><small>${x.org} · ${x.period}</small><p>${x.desc}</p></div>`).join("")}
        </section>
        <section class="card resume-section"><h2>Projetos em destaque</h2>
          <div class="project-grid">${RESUME.projects.map((p) => `<div class="project">${fcArt({ hue: p.cat, seed: p.seed })}<strong>${p.title}</strong><span>${p.result}</span></div>`).join("")}</div>
        </section>
      </div>
      <div>
        <section class="card resume-section"><h2>Competências</h2>
          ${RESUME.skills.map((g) => `<div class="skill-group"><h4>${g.group}</h4><div>${g.items.map((s) => `<span class="tag">${s}</span>`).join("")}</div></div>`).join("")}
        </section>
        <section class="card resume-section"><h2>Certificados</h2>
          ${COURSES.filter((c) => c.progress === 100).concat(courseById("sites-que-vendem"), courseById("agentes-ia")).slice(0, 4).map((c) => `<div class="cert"><span class="cert-icon">${icon("award", 18)}</span><div><strong>${c.title}</strong><span>FavCode · ${c.hours}</span></div></div>`).join("")}
        </section>
        <section class="card resume-section"><h2>Perfil público</h2>
          <p style="font-size:var(--fs-sm)">Link pronto para enviar a empresas e clientes.</p>
          <div class="share-box"><span>favcode.com.br/p/matheus-lima</span><button class="btn btn-secondary btn-sm" data-copy>${icon("link", 14)} Copiar</button></div>
        </section>
      </div>
    </div>
  </div>
</div>`;

VIEWS.login = () => `<div class="login">
  <div class="login-art">
    ${fcLockup({ size: 30 })}
    <div class="login-symbol">${fcSymbol({ size: 600 })}</div>
    <blockquote><h2>Aprenda o que o mercado está pagando agora.</h2><p>Cursos, comunidade, mentorias e oportunidades no mesmo lugar.</p></blockquote>
    <span class="tagline">TESTOU. FUNCIONOU. FAVORITOU.</span>
  </div>
  <div class="login-form-wrap">
    <form class="login-form" onsubmit="event.preventDefault(); location.hash = '#/home';">
      <div class="login-mobile-brand">${fcLockup({ size: 30 })}</div>
      <h1>Bem-vindo de volta</h1>
      <p>Entre para continuar de onde parou.</p>
      <label class="field"><span>E-mail</span><input type="email" placeholder="voce@email.com" autocomplete="email"></label>
      <label class="field"><span>Senha</span><input type="password" placeholder="••••••••" autocomplete="current-password"></label>
      <div class="login-row"><label><input type="checkbox" checked> Manter conectado</label><a class="link" href="#/login">Esqueci a senha</a></div>
      <button class="btn btn-brand btn-lg btn-block" type="submit">Entrar</button>
      <div class="divider-text">ou</div>
      <button class="btn btn-secondary btn-lg btn-block" type="button" onclick="location.hash='#/home'">Entrar com link mágico</button>
    </form>
  </div>
</div>`;

VIEWS["design-system"] = () => {
  const sw = (name, v, token) => `<div class="swatch"><i style="background:${v}"></i><div><strong>${name}</strong><code>${token}</code></div></div>`;
  return `<div class="page">
    <div class="page-head"><div><h1>Design System</h1><p>Tokens e componentes da FavCode. Toda cor, gradiente e sombra da plataforma sai daqui (<code>assets/css/tokens.css</code>).</p></div></div>
    <section class="section" style="margin-top:0"><div class="section-head"><h2>Logotipo</h2></div>
      <div class="logo-variants">
        <div class="card logo-variant">${fcLockup({ size: 30 })}<span>Sidebar expandida</span></div>
        <div class="card logo-variant">${fcSymbol({ size: 30 })}<span>Sidebar recolhida · mobile</span></div>
        <div class="card logo-variant">${fcSymbol({ size: 18 })}<span>Favicon</span></div>
        <div class="card logo-variant">${fcCoin({ size: 40 })}<span>FavCoin</span></div>
      </div>
    </section>
    <section class="section"><div class="section-head"><h2>Cores</h2></div>
      <div class="ds-grid ds-swatches">
        ${sw("Background", "#02060E", "--background")}${sw("Background deep", "#000221", "--background-deep")}
        ${sw("Navy", "#020C47", "--c-navy-800")}${sw("Estrutural", "#011F65", "--c-navy-700")}
        ${sw("Primary strong", "#0356C5", "--primary-strong")}${sw("Primary", "#126BFF", "--primary")}
        ${sw("Ciano FavCode", "#00BBFF", "--accent")}${sw("Texto", "#F7FAFF", "--text")}
        ${sw("Texto secundário", "#A7B4C7", "--text-secondary")}${sw("Texto apagado", "#64748B", "--text-muted")}
      </div>
    </section>
    <section class="section"><div class="section-head"><h2>Gradientes</h2></div>
      <div class="ds-grid ds-gradients">
        ${sw("Brand", "var(--brand-gradient)", "--brand-gradient")}${sw("CTA especial", "var(--cta-gradient)", "--cta-gradient")}${sw("Linha (progresso)", "var(--brand-gradient-line)", "--brand-gradient-line")}
        ${sw("Premium", "var(--premium-gradient)", "--premium-gradient")}${sw("Background radial", "var(--background-radial)", "--background-radial")}
      </div>
    </section>
    <section class="section"><div class="section-head"><h2>Superfícies</h2></div>
      <div class="levels">
        <div class="level" style="background:var(--surface-0)"><strong>Level 0</strong><span>App background</span></div>
        <div class="level" style="background:var(--surface-1)"><strong>Level 1</strong><span>Sidebar / sections</span></div>
        <div class="level" style="background:var(--surface-2)"><strong>Level 2</strong><span>Cards</span></div>
        <div class="level" style="background:var(--surface-3)"><strong>Level 3</strong><span>Modals / active / premium</span></div>
      </div>
    </section>
    <section class="section"><div class="section-head"><h2>Categorias</h2></div>
      <div class="cat-hero-grid">${Object.entries(CATEGORIES).map(([k, v], i) => `<div class="cat-card" data-cat="${k}">${fcArt({ hue: k, seed: 100 + i * 7 })}<strong>${v.label}</strong><span>--cat-${k}</span></div>`).join("")}</div>
    </section>
    <section class="section"><div class="section-head"><h2>Tipografia</h2></div>
      <div class="card card-pad">
        <div class="type-row"><code>H1 · Sora 650</code><h1>Isso não parece um curso comum.</h1></div>
        <div class="type-row"><code>H2 · Sora 600</code><h2>Continue aprendendo</h2></div>
        <div class="type-row"><code>H3 · Sora 600</code><h3>Orquestrando múltiplas ferramentas</h3></div>
        <div class="type-row"><code>Body · Manrope</code><p>Projete, construa e venda agentes que resolvem processos reais de empresas.</p></div>
        <div class="type-row"><code>Metadata</code><p class="muted" style="font-size:var(--fs-sm)">Lívia Prado · 24 min · Intermediário</p></div>
      </div>
    </section>
    <section class="section"><div class="section-head"><h2>Componentes</h2></div>
      <div class="card card-pad" style="display:grid;gap:var(--sp-6)">
        <div class="ds-row"><button class="btn btn-brand">CTA especial</button><button class="btn btn-primary">Primário</button><button class="btn btn-secondary">Secundário</button><button class="btn btn-ghost">Ghost</button></div>
        <div class="ds-row">${proBadge()}<span class="badge badge-live">Ao vivo</span><span class="badge badge-success">Concluído</span><span class="badge badge-outline">Nível 12</span>${catTag("sites")}${catTag("vendas")}${catTag("prospeccao")}${catTag("ia")}</div>
        <div class="ds-row" style="gap:var(--sp-8)">${ring(72, { size: 88, label: "72%" })}<div style="flex:1;min-width:200px">${progressBar(46, "progress-lg")}</div>${fcLoader()}</div>
      </div>
    </section>
  </div>`;
};

/* ==========================================================================
   Shell
   ========================================================================== */
function sidebar(route) {
  return `<aside class="sidebar" aria-label="Navegação principal">
    <div class="sidebar-head">
      <a class="sidebar-brand" href="#/home">${fcLockup({ size: 22 })}</a>
      <button class="sidebar-toggle" data-collapse aria-label="Recolher menu">${icon("panelLeft", 18)}</button>
    </div>
    <nav class="sidebar-nav">
      ${NAV.map((g) => `<div class="nav-group"><span class="nav-label">${g.group}</span>
        ${g.items.map((it) => `<a class="nav-item ${it.route === route ? "is-active" : ""}" href="#/${it.route}" title="${it.label}">
          ${icon(it.icon, 19)}<span class="nav-text">${it.label}</span>${it.meta ? `<span class="nav-meta">${it.meta}</span>` : ""}${it.dot ? `<span class="nav-dot"></span>` : ""}
        </a>`).join("")}
      </div>`).join("")}
    </nav>
    <div class="sidebar-foot">
      <div class="plan-card">${proBadge()}<p>Live VIP quinta às 20h: precificando agentes de IA.</p><a class="btn btn-secondary btn-sm" href="#/vip">Abrir Área VIP</a></div>
    </div>
  </aside>`;
}

function topbar() {
  return `<header class="topbar">
    <a class="topbar-mobile-brand" href="#/home" aria-label="FavCode">${fcSymbol({ size: 22 })}</a>
    <div class="search" data-search>
      <label class="search-field">${icon("search", 18)}<input type="search" placeholder="Buscar cursos, aulas, pessoas…" aria-label="Buscar" data-search-input><span class="kbd">/</span></label>
      <div class="search-results" data-search-results></div>
    </div>
    <div class="topbar-actions">
      <a class="coin-pill" href="#/favcoins" aria-label="${fmt(USER.coins)} FavCoins">${fcCoin({ size: 20 })}<span class="num">${fmt(USER.coins)}</span></a>
      <button class="icon-btn" aria-label="Notificações">${icon("bell", 20)}<span class="badge-dot"></span></button>
      <a class="avatar-btn" href="#/curriculo" aria-label="Perfil"><span class="avatar is-pro">${USER.initials}</span></a>
    </div>
  </header>`;
}

function bottomNav(route) {
  return `<nav class="bottom-nav" aria-label="Navegação">${BOTTOM_NAV.map((it) => `<a class="${it.route === route ? "is-active" : ""}" href="#/${it.route}">${icon(it.icon, 21)}${it.label}</a>`).join("")}</nav>`;
}

/* ==========================================================================
   Router
   ========================================================================== */
const app = document.getElementById("app");

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "") || "home";
  const [path, query = ""] = raw.split("?");
  return { route: VIEWS[path] ? path : "home", params: new URLSearchParams(query) };
}

function render() {
  const { route, params } = parseRoute();
  if (route === "mentorias" && params.get("tab")) store.set("mentorTab", params.get("tab"));
  const collapsed = store.get("collapsed", false);

  if (route === "login") {
    app.className = "app is-bare";
    app.innerHTML = `<main class="view-enter">${VIEWS.login()}</main>`;
  } else {
    app.className = `app ${collapsed ? "is-collapsed" : ""}`;
    app.innerHTML = `${sidebar(route)}<div class="main">${topbar()}<main class="view-enter" id="view">${VIEWS[route]()}</main></div>${bottomNav(route)}`;
  }
  document.title = route === "home" ? "FavCode" : `${(NAV.flatMap((g) => g.items).find((i) => i.route === route) || { label: "FavCode" }).label} · FavCode`;
  window.scrollTo({ top: 0 });
}

/* ---- Interações (delegação) ------------------------------------------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a");
  if (!t) return;

  if (t.matches("[data-collapse]")) {
    const next = !app.classList.contains("is-collapsed");
    app.classList.toggle("is-collapsed", next);
    store.set("collapsed", next);
  } else if (t.matches("[data-scroll]")) {
    const row = document.getElementById(t.dataset.scroll);
    row.scrollBy({ left: row.clientWidth * 0.9 * Number(t.dataset.dir), behavior: "smooth" });
  } else if (t.matches("[data-cat-filter]")) {
    const cur = store.get("cat", "todos");
    const v = t.dataset.catFilter;
    store.set("cat", cur === v && v !== "todos" ? "todos" : v);
    rerenderView();
  } else if (t.matches("[data-topic]")) {
    store.set("topic", t.dataset.topic); rerenderView();
  } else if (t.matches("[data-opp-kind]")) {
    store.set("oppKind", t.dataset.oppKind); rerenderView();
  } else if (t.matches("[data-mentor-tab]")) {
    store.set("mentorTab", t.dataset.mentorTab); rerenderView();
  } else if (t.matches("[data-lesson-tab]")) {
    store.set("lessonTab", t.dataset.lessonTab); rerenderView(false);
  } else if (t.matches("[data-module]")) {
    t.parentElement.classList.toggle("is-closed");
  } else if (t.matches("[data-like]")) {
    const on = t.classList.toggle("is-on");
    const n = t.querySelector("b"); n.textContent = Number(n.textContent) + (on ? 1 : -1);
  } else if (t.matches("[data-save]")) {
    t.classList.toggle("is-on");
  } else if (t.matches("[data-copy]")) {
    try { navigator.clipboard.writeText("https://favcode.com.br/p/matheus-lima"); } catch { /* sem clipboard */ }
    t.innerHTML = `${icon("check", 14)} Copiado`;
    setTimeout(() => { t.innerHTML = `${icon("link", 14)} Copiar`; }, 1600);
  } else if (t.matches("[data-complete]")) {
    t.innerHTML = `${icon("check", 16)} Aula concluída · +20 ${fcCoin({ size: 16 })}`;
    t.classList.replace("btn-primary", "btn-brand");
  }
});

// No mobile a busca é só um ícone; o toque expande o campo antes de focar.
document.addEventListener("click", (e) => {
  const field = e.target.closest(".search-field");
  if (!field) return;
  $("[data-search]").classList.add("is-expanded");
  $("[data-search-input]").focus();
});

function rerenderView(resetScroll = true) {
  const { route } = parseRoute();
  const view = $("#view");
  const y = window.scrollY;
  view.innerHTML = VIEWS[route]();
  if (!resetScroll) window.scrollTo({ top: y });
}

/* ---- Busca ------------------------------------------------------------ */
document.addEventListener("input", (e) => {
  if (!e.target.matches("[data-search-input]")) return;
  const q = e.target.value.trim().toLowerCase();
  const box = $("[data-search]");
  const results = $("[data-search-results]");
  if (!q) { box.classList.remove("is-open"); return; }
  const hits = COURSES.filter((c) => (c.title + c.instructor + CATEGORIES[c.cat].label).toLowerCase().includes(q)).slice(0, 5);
  results.innerHTML = hits.length
    ? hits.map((c, i) => `<a class="search-result ${i === 0 ? "is-focus" : ""}" href="#/aula"><span class="search-result-thumb">${fcArt({ hue: c.cat, seed: c.seed })}</span><div><strong>${c.title}</strong><span>${CATEGORIES[c.cat].label} · ${c.instructor}</span></div></a>`).join("")
    : `<div class="search-empty">Nada encontrado para “${e.target.value}”. Tente o nome de uma ferramenta, como <b>n8n</b> ou <b>Next.js</b>.</div>`;
  box.classList.add("is-open");
});
document.addEventListener("focusin", (e) => { if (e.target.matches("[data-search-input]")) $("[data-search]").classList.add("is-expanded"); });
document.addEventListener("focusout", (e) => {
  if (!e.target.matches("[data-search-input]")) return;
  setTimeout(() => { const s = $("[data-search]"); if (s) s.classList.remove("is-open", "is-expanded"); }, 150);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && !e.target.matches("input, textarea")) { const i = $("[data-search-input]"); if (i) { e.preventDefault(); i.focus(); } }
  if (e.key === "Escape" && e.target.matches("[data-search-input]")) e.target.blur();
});

window.addEventListener("hashchange", render);
render();
