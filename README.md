# FavCode Platform

Plataforma de membros e ecossistema FavCode: cursos, trilhas, comunidade, mentorias, oportunidades, currículo, Área VIP e FavCoins.

> **Testou. Funcionou. Favoritou.**

Este repositório contém o **protótipo navegável** da área de membros, com o design system oficial da FavCode já aplicado.

## Stack

- HTML, CSS e JavaScript puro (sem framework, sem dependências)
- Roteamento por hash (`#/rota`), renderização no cliente
- Fontes: Sora, Manrope e JetBrains Mono (Google Fonts)
- `serve.js`: servidor estático mínimo em Node para desenvolvimento local

## Instalar e rodar localmente

Requisito: Node.js 18+.

```bash
npm install
npm run dev
```

Abra http://localhost:5173. Para mudar a porta, use `PORT` (veja `.env.example`).

## Build

```bash
npm run lint    # verificação de sintaxe dos scripts
npm run build   # roda o lint; o site é estático, a saída é a própria raiz
```

## Principais rotas

| Rota | Tela |
| --- | --- |
| `#/home` | Dashboard: hero, continue aprendendo, progresso e agenda |
| `#/explorar` | Catálogo por vertical (Sites, Vendas, Prospecção, IA & Automação) |
| `#/trilhas` | Trilhas de aprendizagem |
| `#/aula` | Player com lista de aulas |
| `#/comunidade` | Feed social |
| `#/mentorias` | Mentores e agendamentos (com estado vazio) |
| `#/oportunidades` | Vagas e projetos |
| `#/curriculo` | Perfil profissional compartilhável |
| `#/vip` | Área VIP |
| `#/favcoins` | Saldo, conquistas e recompensas |
| `#/login` | Login |
| `#/design-system` | Documentação viva de tokens e componentes |

## Estrutura

```
index.html              # entrada da aplicação
serve.js                # servidor local (dev)
assets/
  brand/favicon.svg
  css/tokens.css        # fonte única de cores, gradientes, superfícies, tipo e motion
  css/app.css           # layout e componentes (consome só tokens)
  js/brand.js           # símbolo FavCode em vetor, FavCoin, loader e arte gerada
  js/icons.js           # ícones
  js/data.js            # dados mockados
  js/app.js             # router, shell e telas
```

## Dados mockados

Todo o conteúdo (usuário, cursos, trilhas, posts, vagas, mentores, FavCoins) está em `assets/js/data.js`. Nomes e empresas são fictícios. Capas e retratos são gerados a partir das faixas do símbolo FavCode, e não há imagens de pessoas reais.

## Níveis de acesso: FREE / MEMBER / PRO

| Nível | Acesso previsto |
| --- | --- |
| FREE | Aulas abertas, comunidade em modo leitura e vitrine de cursos |
| MEMBER | Catálogo completo, trilhas, certificados, comunidade, oportunidades e FavCoins |
| PRO | Tudo do MEMBER, mais Área VIP, lives e hot seats, mentorias com o selo FavCode PRO e destaque em oportunidades |

### Modo demo (acesso público)

Quem abre o link entra direto na Home como **Visitante FavCode (PRO)**, sem login. A sessão demo é criada automaticamente no `localStorage`. A configuração fica em `APP`, no topo de `data.js`:

```js
const APP = { version: "0.2.0", demoMode: true, authRequired: false };
```

Para reativar o login, use `demoMode: false, authRequired: true`: as rotas internas passam a redirecionar para `#/login`. A tela de login continua acessível em `#/login`, ou pelo item "Sair".

No protótipo, o usuário demo é **PRO** (`USER.plan` em `data.js`). Os selos PRO e o acesso dos mentores (`access: "PRO" | "Todos"`) já estão na interface. O bloqueio real por nível depende do back-end.

## Integrações futuras

- Autenticação e controle de plano (FREE/MEMBER/PRO)
- Back-end/banco para cursos, progresso, comunidade e FavCoins
- Hospedagem de vídeo para o player
- Agenda de mentorias e pagamentos/assinaturas
- Migração para framework (ex.: Next.js), reaproveitando `tokens.css` como base do design system

## Deploy na Vercel

1. Na Vercel, clique em **Add New → Project** e importe este repositório.
2. Em **Framework Preset**, escolha **Other**.
3. Deixe **Build Command** como `npm run build` (ou vazio) e **Output Directory** vazio, para usar a raiz.
4. Clique em **Deploy**. Nenhuma variável de ambiente é necessária.

Como o roteamento é por hash, não é preciso configurar rewrites.
