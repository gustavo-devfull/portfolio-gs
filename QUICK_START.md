# ⚡ Quick Start (5 Minutos)

## 1️⃣ Firebase Setup Rápido

### Abra Firebase Console
```
https://console.firebase.google.com
```

### Crie novo projeto
- Nome: `gustavo-santos-portfolio`
- Continuar → Desativar Analytics → Criar

### Ative Firestore
- Firestore Database → Criar Banco
- Modo de Teste → Next → Habilitar

### Ative Auth
- Authentication → Email/Senha → Ativar → Salvar

### Copie Credenciais
- ⚙️ Configurações → Seu Aplicativo → Web
- Copie a configuração firebaseConfig

## 2️⃣ Configure .env.local

```bash
cd "Portfolio Dev"
cp .env.example .env.local
```

Abra `.env.local` e cole:
```
VITE_FIREBASE_API_KEY=SUA_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 3️⃣ Configure Firestore Rules

Firebase Console → Firestore → Rules

Copie:
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

Clique "Publicar"

## 4️⃣ Seed de Projetos

Terminal:
```bash
npm run seed
```

**Você verá:**
```
🌱 Iniciando seed de projetos...
✅ Projeto criado: Dashboard de Análise... (id123)
✅ Projeto criado: E-commerce Platform... (id456)
... 6 mais projetos
✨ 8 projetos inseridos com sucesso!
```

## 5️⃣ Crie Usuário Admin

Firebase Console → Authentication

- Clique "Adicionar Usuário"
- Email: `admin@example.com`
- Senha: `senha123`
- Adicionar

## 6️⃣ Inicie o Site

```bash
npm run dev
```

Abra: **http://localhost:5174**

✅ Você deve ver 8 projetos com imagens
✅ Filtros funcionando
✅ Toggle PT/EN funcionando

## 7️⃣ Teste Admin

Acesse: **http://localhost:5174/admin/login**

Login com:
- Email: `admin@example.com`
- Senha: `senha123`

✅ Dashboard com stats
✅ Tabela de projetos
✅ Botão "Novo Projeto"

## 🎉 Pronto!

Seu portfólio está rodando com:
- ✅ 8 projetos reais
- ✅ Bilíngue PT/EN
- ✅ Admin funcional
- ✅ Imagens do Unsplash
- ✅ Dark mode nativo

---

## 📋 Projetos Inclusos

1. **Dashboard de Análise em Tempo Real** ⭐
2. **E-commerce Platform** ⭐
3. **Sistema de Gerenciamento de Projetos**
4. **App Mobile de Fitness** ⭐
5. **Plataforma de Educação Online** ⭐
6. **Sistema de CRM Empresarial**
7. **Dashboard de Saúde e Bem-estar** ⭐

(⭐ = Destaque)

---

## 🔧 Próximos Passos

- [ ] Editar projetos com suas informações reais
- [ ] Adicionar seus próprios projetos
- [ ] Fazer upload de imagens (FTP opcional)
- [ ] Customizar cores em `src/index.css`
- [ ] Editar links do Footer
- [ ] Deploy em Netlify/Vercel

---

Tem dúvidas? Veja `SETUP_INSTRUCTIONS.md` para detalhes completos.
