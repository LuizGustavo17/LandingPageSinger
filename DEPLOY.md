# 🚀 Guia de Deploy no Vercel

Este guia explica como fazer deploy da landing page no Vercel.

## Pré-requisitos

1. Conta no [Vercel](https://vercel.com) (gratuita)
2. Conta no [GitHub](https://github.com) (opcional, mas recomendado)

## Opção 1: Deploy via GitHub (Recomendado) ⭐

### Passo 1: Criar repositório no GitHub

1. Crie um novo repositório no GitHub
2. No terminal, execute:

```bash
git init
git add .
git commit -m "Initial commit - Landing page Spotify"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

> **Nota**: Substitua `SEU_USUARIO` e `SEU_REPOSITORIO` pelos seus dados do GitHub

### Passo 2: Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar GitHub)
2. Clique em **"Add New..."** → **"Project"**
3. Clique em **"Import Git Repository"**
4. Selecione seu repositório do GitHub
5. O Vercel detectará automaticamente:
   - ✅ Framework Preset: Other
   - ✅ Root Directory: `./`
   - ✅ Build Command: (deixar vazio)
   - ✅ Output Directory: (deixar vazio)
6. Clique em **"Deploy"**

### Passo 3: Aguardar o Deploy

- O deploy leva cerca de 1-2 minutos
- Você verá a URL do projeto (ex: `seu-projeto.vercel.app`)
- Clique na URL para ver sua landing page funcionando! 🎉

## Opção 2: Deploy via CLI do Vercel

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Fazer login

```bash
vercel login
```

Isso abrirá o navegador para autenticação.

### Passo 3: Deploy (Teste)

```bash
vercel
```

Siga as instruções no terminal:
- Set up and deploy? → Digite **Y** e Enter
- Which scope? → Selecione sua conta/organização
- Link to existing project? → Digite **N** (primeiro deploy)
- What's your project's name? → Pressione Enter (usa o nome da pasta) ou digite um nome
- In which directory is your code located? → Pressione Enter (usa `./`)
- Want to override the settings? → Digite **N**

### Passo 4: Deploy de Produção

Após testar localmente, faça deploy de produção:

```bash
vercel --prod
```

Ou simplesmente:

```bash
vercel -p
```

## Estrutura do Projeto

O projeto está configurado assim:

```
├── server.js          # Servidor Express (API)
├── vercel.json        # Configuração do Vercel
├── package.json       # Dependências
└── public/            # Arquivos estáticos
    ├── index.html
    ├── css/
    └── js/
```

## ⚙️ Configuração do Vercel

O projeto já vem com `vercel.json` configurado para:

- ✅ Rotear `/api/*` para `server.js` (endpoints da API)
- ✅ Servir arquivos estáticos da pasta `public/` (Express já faz isso)
- ✅ Funcionar como servidor Node.js completo

**Você não precisa alterar nada!** O Vercel detecta automaticamente a configuração.

## ✅ Após o Deploy

1. Acesse a URL fornecida pelo Vercel (ex: `seu-projeto.vercel.app`)
2. A landing page estará funcionando com **todas as funcionalidades**:
   - ✅ Dark mode
   - ✅ Integração com clima
   - ✅ Player de música
   - ✅ Animações
   - ✅ API funcionando em `/api/artist` e `/api/weather`

3. **Teste as funcionalidades:**
   - Permita geolocalização para ver o clima
   - Teste o toggle de dark mode
   - Clique nas músicas para tocar

## Variáveis de Ambiente (Futuro)

Se no futuro você quiser usar uma API real de clima (OpenWeatherMap), adicione:

1. No Vercel Dashboard → Settings → Environment Variables
2. Adicione: `WEATHER_API_KEY` = sua chave da API
3. No código, use: `process.env.WEATHER_API_KEY`

## Domínio Customizado

1. Vercel Dashboard → Settings → Domains
2. Adicione seu domínio
3. Siga as instruções para configurar DNS

## Atualizações

Após fazer alterações no código:

- **GitHub**: Faça `git push` e o Vercel fará deploy automático
- **CLI**: Execute `vercel --prod` novamente

## Troubleshooting

### Erro: "Cannot find module"
- Certifique-se de que todas as dependências estão no `package.json`
- Execute `npm install` localmente para testar

### API não funciona
- Verifique se o `vercel.json` está correto
- Certifique-se de que as rotas `/api/*` estão apontando para `server.js`

### Arquivos estáticos não carregam
- Verifique se a pasta `public/` existe
- Verifique se o `vercel.json` está servindo corretamente

## Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Vercel Node.js](https://vercel.com/docs/runtimes#official-runtimes/node-js)
- [Dashboard Vercel](https://vercel.com/dashboard)

---

🎉 **Pronto!** Sua landing page estará no ar em alguns minutos!
