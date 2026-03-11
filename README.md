# Flugo — Cadastro de Colaboradores

Aplicação frontend desenvolvida como desafio técnico para a [Flugo](https://flugo.com.br/). Permite o cadastro de colaboradores através de um formulário multi-step com persistência no Firebase.

---

## Tecnologias

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/)
- [Firebase Firestore](https://firebase.google.com/)
- [React Router DOM](https://reactrouter.com/)
- [DiceBear](https://www.dicebear.com/) — avatares gerados dinamicamente

---

## Funcionalidades

- Formulário multi-step (Infos Básicas → Infos Profissionais → Confirmação)
- Validação de campos em tempo real (nome, e-mail, departamento)
- Persistência de dados via Firebase Firestore
- Listagem de colaboradores com ordenação por coluna
- Avatares únicos gerados por nome
- Layout responsivo com navbar retrátil

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/flugo-application.git

# Acesse a pasta
cd flugo-application

# Instale as dependências
npm install
```

### Configuração do Firebase

Crie um arquivo `.env` na raiz do projeto com as suas credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

> As credenciais podem ser obtidas no [Firebase Console](https://console.firebase.google.com/) em **Project Settings → Your apps → SDK setup and configuration**.

### Rodando o projeto

```bash
npm run dev
```

Acesse em: `http://localhost:5173`

---

## Deploy

A aplicação está hospedada na Vercel:
🔗 [flugo-application.vercel.app](https://flugo-application.vercel.app)

---

## Estrutura do projeto

```
src/
├── assets/         # Imagens e ícones
├── components/     # Componentes reutilizáveis (Navbar, Buttons, Switch)
├── pages/          # Páginas (Colaboradores, Formulário)
├── utils/          # Funções Firebase (get, post)
└── main.tsx        # Entrada da aplicação
```
