# DevPortfolio

**DevPortfolio** é uma plataforma onde desenvolvedores montam um portfólio com projetos, stack e links em poucos minutos, e onde recrutadores e outros devs podem encontrá-los filtrando por tecnologia.

Projeto final da disciplina de Programação Web (4º período).

![Home do DevPortfolio](docs/home.png)

<details>
<summary>Modo escuro e página completa</summary>

![Home no modo escuro](docs/home-dark.png)

![Home completa](docs/home-full.png)

</details>

> Os prints usam dados de exemplo.

## Funcionalidades

- **Cadastro e login** com validação inline e sessão via cookie (JWT).
- **Criação de portfólio em 5 etapas**: sobre você, stack, experiência, projeto em destaque e contato, com barra de progresso e validação de links.
- **Explorar devs**: busca por nome, filtros por stack e tecnologia, paginação e contador de resultados.
- **Página do dev**: projeto em destaque com capa e link, bio, tecnologias, experiência e atalhos para GitHub, LinkedIn e site.
- **Minha conta**: troca de foto (até 2 MB), nome, bio e links, sem sobrescrever o resto do portfólio.
- **Estados completos**: skeletons durante o carregamento, telas de vazio e de erro, toasts de sucesso e falha, e página 404.

## Design

A interface segue a direção "editorial de dev":

- **Cores**: base neutra quente, com um único acento laranja-tijolo. Modo claro e escuro automáticos, seguindo a preferência do sistema.
- **Tipografia**: [Geist e Geist Mono](https://vercel.com/font), com títulos grandes e espaçamento entre letras negativo.
- **Layout**: grade assimétrica de cards (largo e estreito alternados), responsiva do celular ao desktop, com menu lateral no mobile.
- **Movimento**: entradas escalonadas e microinterações de hover e clique. Tudo é desativado quando o sistema pede menos movimento (`prefers-reduced-motion`).
- **Acessibilidade**: link "pular para o conteúdo", foco visível, links e botões semânticos, `aria-current` na navegação e contraste AA.

Os tokens de cor e tipografia ficam em [`src/theme.ts`](src/theme.ts), como tema do MUI com CSS variables.

## Tecnologias

| Camada | Stack |
| --- | --- |
| Front-end | Next.js 15 (App Router), React 19, TypeScript |
| UI | Material UI 7 (tema com `colorSchemes` e CSS variables), Tailwind CSS 4, Sonner (toasts) |
| Back-end | Rotas de API do Next.js, JWT (`jsonwebtoken`), `bcryptjs` |
| Dados | Prisma ORM com PostgreSQL ou SQLite |

## Estrutura

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── devs/                 # Listagem e página de cada dev
│   ├── createPortfolio/      # Formulário em etapas
│   ├── profile/              # Minha conta
│   ├── auth/                 # Login e cadastro
│   ├── api/                  # auth, portfolio, user/profile
│   └── context/AuthContext.tsx
├── components/               # Navbar, Footer, PortfolioCard, EmptyBlock, stepper
├── repositories/ · usecases/ # Acesso a dados e regras de negócio
├── types/portfolio.ts
└── theme.ts                  # Tema claro/escuro
```

## Rodando localmente

Pré-requisitos: Node.js 20+ e um banco PostgreSQL (ou SQLite).

```bash
npm install
```

Crie um `.env` na raiz:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/devportfolio"
JWT_SECRET="uma-chave-secreta"
```

Gere o cliente do Prisma a partir do seu `prisma/schema.prisma`, aplique o schema e suba o servidor:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Cria uma conta |
| `POST` | `/api/auth/login` | Autentica e define o cookie de sessão |
| `POST` | `/api/auth/logout` | Encerra a sessão |
| `GET` | `/api/auth/me` | Usuário da sessão atual |
| `GET` | `/api/portfolio` | Lista todos os portfólios |
| `POST` | `/api/portfolio` | Cria ou atualiza o portfólio do usuário logado |
| `GET` | `/api/portfolio/:id` | Detalhes de um portfólio |
| `GET` / `POST` | `/api/user/profile` | Lê (com o portfólio) ou atualiza nome e foto |
