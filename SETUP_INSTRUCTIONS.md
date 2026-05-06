# 🚀 Instruções de Configuração Inicial

## Passo 1: Configurar Firebase

### 1.1 Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Adicionar Projeto"
3. Nome: `gustavo-santos-portfolio`
4. Não ativar Google Analytics
5. Clique em "Criar Projeto"

### 1.2 Ativar Firestore
1. No painel lateral, vá para "Firestore Database"
2. Clique em "Criar Banco de Dados"
3. Escolha: **Modo de Teste** (por enquanto)
4. Localização: `us-central1` (ou sua região)
5. Clique em "Criar"

### 1.3 Ativar Authentication
1. No painel lateral, vá para "Authentication"
2. Clique em "Começar"
3. Clique em "Email/Senha"
4. Ativar "Email/Senha"
5. Salvar

### 1.4 Obter Credenciais
1. Clique na engrenagem ⚙️ (Configurações do Projeto)
2. Vá para aba "Seu Aplicativo"
3. Clique em ícone do web app `<>`
4. Copie o objeto de configuração

## Passo 2: Configurar Variáveis de Ambiente

1. Crie arquivo `.env.local` na raiz do projeto:
```bash
cp .env.example .env.local
```

2. Preencha com suas credenciais Firebase:
```
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_id
VITE_FIREBASE_APP_ID=seu_app_id

# FTP (opcional por enquanto)
VITE_FTP_HOST=seu_ftp_host
VITE_FTP_USER=seu_usuario
VITE_FTP_PASS=sua_senha
VITE_FTP_BASE_PATH=/public_html/portfolio/images
VITE_FTP_BASE_URL=https://seu_dominio.com/portfolio/images
```

## Passo 3: Executar Seed de Projetos

1. Abra terminal na pasta do projeto
2. Execute:
```bash
npm run seed
```

Isso vai inserir **8 projetos de exemplo** no Firestore:
- ✅ Dashboard de Análise em Tempo Real
- ✅ E-commerce Platform
- ✅ Sistema de Gerenciamento de Projetos
- ✅ App Mobile de Fitness
- ✅ Plataforma de Educação Online
- ✅ Sistema de CRM Empresarial
- ✅ Dashboard de Saúde e Bem-estar

**Nota**: Se receber erro de permissão, configure as regras do Firestore:

Vá em **Firestore → Rules** e copie:
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

## Passo 4: Criar Usuário Admin

1. Vá para Firebase Console → Authentication
2. Clique em "Adicionar Usuário" (botão "Adicionar usuário")
3. Email: seu_email@example.com
4. Senha: Uma senha segura
5. Clique em "Adicionar usuário"

## Passo 5: Testar o Portfólio

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Abra no navegador: `http://localhost:5174`

3. Você deve ver:
   - ✅ Home com grid de 8 projetos
   - ✅ Filtros por categoria funcionando
   - ✅ Toggle PT/EN funcionando
   - ✅ Clique em projeto → detalhes completos

4. Teste o Admin:
   - Acesse: `http://localhost:5174/admin/login`
   - Login com o usuário criado no passo 4
   - Você pode criar/editar/deletar projetos

## 🎨 Próximas Customizações

### Adicionar seus projetos reais:

1. Acesse `/admin`
2. Clique em "Novo Projeto"
3. Preencha os campos (bilíngue PT/EN)
4. Faça upload de imagens via Unsplash URLs ou FTP
5. Clique em "Salvar"

### Editar dados do Footer:

Edite `src/components/layout/Footer.tsx`:
- Altere links do GitHub, LinkedIn
- Coloque seu email real

### Editar tema/cores:

Edite `src/index.css`:
- Mude as variáveis em `:root`
- Altere a fonte importada
- Customize animações e classes globais

## 🔐 Deploy em Produção

### Antes de fazer deploy:

1. **Mudar Firestore para Modo de Produção**:
   - Firebase Console → Firestore
   - Aba "Rules"
   - Copie as regras acima

2. **Criar conta de usuário admin real**

3. **Configurar domínio personalizado** (se houver)

### Deploy no Netlify:

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

## ❓ Troubleshooting

### "Não vejo os projetos depois do seed"
- Aguarde 5 segundos para cache do Firebase atualizar
- Recarregue a página (F5)
- Verifique Console DevTools (F12) por erros

### "Erro ao fazer login"
- Verifique se o usuário foi criado em Firebase Auth
- Verifique se a senha está correta
- Verifique se Firestore Rules estão configuradas

### "Upload de imagens não funciona"
- FTP é opcional por enquanto
- Use URLs de imagens externas (Unsplash)
- Para FTP, configure as credenciais no `.env.local`

## 📚 Estrutura de Dados

Cada projeto no Firestore tem:
```json
{
  "title": { "pt": "...", "en": "..." },
  "slug": "url-amigavel",
  "description": { "pt": "...", "en": "..." },
  "content": {
    "challenge": { "pt": "...", "en": "..." },
    "solution": { "pt": "...", "en": "..." },
    "result": { "pt": "...", "en": "..." }
  },
  "images": ["url1", "url2"],
  "coverImage": "url",
  "techs": ["React", "Node.js"],
  "category": "web|system|dashboard|mobile",
  "featured": true|false,
  "liveUrl": "https://...",
  "repoUrl": "https://..."
}
```

---

**Pronto!** Seu portfólio está configurado e funcionando. 🎉
