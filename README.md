# 🎵 Landing Page - Artista Spotify

Landing page responsiva com dark mode para artista do Spotify, com integração de clima e animações dinâmicas.

## ✨ Características

- 🎨 Design moderno e responsivo (100% mobile-friendly)
- 🌙 Dark mode com toggle
- 🌤️ Integração com dados de clima baseado na localização
- 🎭 Animações suaves e interativas
- 🎵 Player de áudio integrado
- 📱 Totalmente responsivo
- ⚡ API REST simples com dados em memória

## 🚀 Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

### 3. Acessar a aplicação

Abra seu navegador em: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
├── server.js          # Servidor Express com API
├── package.json       # Dependências do projeto
├── public/            # Arquivos estáticos
│   ├── index.html     # Página principal
│   ├── css/
│   │   └── style.css  # Estilos e animações
│   └── js/
│       └── main.js    # Lógica JavaScript
└── README.md          # Este arquivo
```

## 🎯 Funcionalidades

### API Endpoints

- `GET /api/artist` - Retorna dados do artista
- `GET /api/weather?lat={lat}&lon={lon}` - Retorna dados de clima
- `POST /api/stats` - Atualiza estatísticas (simulação)

### Recursos da Landing Page

1. **Hero Section**: Apresentação do artista com estatísticas
2. **Top Tracks**: Lista das principais músicas com player
3. **Álbuns**: Galeria de álbuns do artista
4. **Shows**: Próximos eventos e shows
5. **Social Links**: Links para redes sociais
6. **Weather Integration**: Interface adaptada ao clima local
7. **Dark Mode**: Alternância entre tema claro e escuro

## 🎨 Personalização

Os dados do artista estão em `server.js` no objeto `artistData`. Você pode modificar:
- Informações do artista
- Músicas e álbuns
- Shows agendados
- Links sociais

## 🌐 Integração com Clima

A aplicação detecta automaticamente a localização do usuário (com permissão) e adapta:
- Cores e gradientes da interface
- Estilo visual baseado nas condições climáticas
- Exibição de informações meteorológicas

## 📱 Responsividade

A landing page é totalmente responsiva e funciona perfeitamente em:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Monitores grandes (1920px+)

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Fontes**: Google Fonts (Poppins)
- **Ícones**: Emojis Unicode

## 📝 Notas

- Os dados são armazenados em memória (sem banco de dados)
- Os previews de áudio são exemplos do SoundHelix
- As imagens são do Unsplash (placeholder)
- A API de clima usa dados simulados baseados na localização

## 🚀 Deploy no Vercel

Para fazer deploy no Vercel, consulte o guia completo em [DEPLOY.md](./DEPLOY.md).

**Deploy rápido via GitHub:**
1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Clique em "Deploy" (tudo já está configurado!)

**Deploy via CLI:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

## 🎉 Divirta-se!

Customize a landing page conforme suas necessidades e crie uma experiência única para seus visitantes!
