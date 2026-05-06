# Portfólio Profissional - Gustavo Santos

Um portfólio web moderno e profissional desenvolvido com React, Tailwind CSS, Firebase e Netlify Functions.

## 🎯 Características

### Frontend Público
- ✨ Design premium com dark mode nativo
- 🌍 Bilíngue (Português/Inglês) com toggle dinâmico
- 📱 Responsivo e mobile-first
- 🎬 Animações suaves (Framer Motion)
- 🖼️ Galeria de imagens com lightbox
- ⚡ Lazy loading de imagens
- 🚀 Performance otimizada

### Painel Admin
- 🔐 Autenticação via Firebase Auth
- 📝 CRUD completo de projetos
- 🖼️ Upload de imagens para FTP via função serverless
- 👁️ Pré-visualização em tempo real
- 🏷️ Campos bilíngues automáticos
- ⭐ Sistema de projetos em destaque

### Tecnologias
- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v7

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Button, Badge, Spinner, Modal
│   ├── layout/          # Header, Footer, Layout
│   ├── projects/        # ProjectCard, Grid, Gallery
│   └── admin/           # ProjectForm, ImageUploader
├── pages/
│   ├── Home.tsx
│   ├── ProjectDetail.tsx
│   └── admin/           # Login, Dashboard, New, Edit
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   └── useTranslation.ts
├── lib/
│   ├── firebase.ts
│   └── ftp.ts
├── store/               # languageStore (Zustand)
├── i18n/                # Traduções PT/EN
├── types/               # TypeScript interfaces
└── utils/               # Funções auxiliares
```

## 🚀 Quick Start

### 1. Instale dependências

```bash
npm install
```

### 2. Configure .env.local

```bash
cp .env.example .env.local
```

Preencha com suas credenciais Firebase e FTP.

### 3. Inicie o desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

## 🎨 Design System

### Cores
- **Background**: `#0A0A0A`
- **Surface**: `#111111`
- **Text**: `#E5E5E5`
- **Accent**: `#6EE7B7`

### Typography
- **Sans**: Inter
- **Display**: Syne

## 📚 Estrutura de Dados (Firestore)

### Coleção: `projects`

```typescript
{
  id: string
  title: { pt: string, en: string }
  slug: string
  description: { pt: string, en: string }
  content: {
    challenge: { pt: string, en: string }
    solution: { pt: string, en: string }
    result: { pt: string, en: string }
  }
  images: string[]
  coverImage: string
  techs: string[]
  category: 'web' | 'system' | 'dashboard' | 'mobile'
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## 📝 Rotas

### Public
- `/` - Home com grid de projetos
- `/project/:slug` - Detalhe do projeto

### Admin (Protegidas)
- `/admin/login` - Login
- `/admin` - Dashboard
- `/admin/new` - Criar projeto
- `/admin/edit/:id` - Editar projeto

## 🔧 Configuração

### Firebase
1. Crie projeto em [Firebase Console](https://console.firebase.google.com)
2. Ative Firestore + Auth (Email/Password)
3. Regras de segurança do Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### FTP Upload
- Usa função serverless em `netlify/functions/upload-ftp.ts`
- Credenciais via variáveis de ambiente
- Retorna URL pública do arquivo

## 📦 Build & Deploy

```bash
npm run build      # Build para produção
npm run dev        # Desenvolvimento
```

### Deploy (Netlify)
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🛠️ Tecnologias Principais

- React 19
- Vite 8
- Tailwind CSS 4
- Firebase 11
- Framer Motion 12
- Zustand 5
- React Router 7

## 📄 Próximos Passos

- [ ] Analytics
- [ ] Newsletter
- [ ] Blog
- [ ] Comentários
- [ ] Sitemap

---

**Desenvolvido com ❤️ por Gustavo Santos**
