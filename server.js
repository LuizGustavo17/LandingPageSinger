const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (deve vir antes das rotas)
// No Vercel, __dirname aponta para a raiz do projeto
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath, {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Dados mock do artista em memória
const artistData = {
  id: '1',
  name: 'Alex Rivera',
  genre: 'Electronic Pop',
  followers: 125000,
  monthlyListeners: 850000,
  bio: 'Artista independente de Electronic Pop que mistura sintetizadores atmosféricos com vocais emotivos. Sua música transporta os ouvintes para paisagens sonoras únicas.',
  image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  topTracks: [
    {
      id: '1',
      name: 'Midnight Dreams',
      duration: '3:45',
      plays: 2450000,
      album: 'Neon Nights',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      personality: { energy: 3, mood: 4, vibe: 5, time: 4 } // Calmo, noturno, introspectivo
    },
    {
      id: '2',
      name: 'Electric Pulse',
      duration: '4:12',
      plays: 1890000,
      album: 'Neon Nights',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      personality: { energy: 5, mood: 5, vibe: 5, time: 5 } // Energético, festivo, dançante
    },
    {
      id: '3',
      name: 'City Lights',
      duration: '3:28',
      plays: 1670000,
      album: 'Urban Vibes',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      personality: { energy: 4, mood: 3, vibe: 4, time: 3 } // Urbano, moderno, equilibrado
    },
    {
      id: '4',
      name: 'Stellar Wave',
      duration: '4:05',
      plays: 1520000,
      album: 'Neon Nights',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      personality: { energy: 2, mood: 2, vibe: 2, time: 2 } // Tranquilo, meditativo, relaxante
    },
    {
      id: '5',
      name: 'Digital Sunset',
      duration: '3:55',
      plays: 1380000,
      album: 'Urban Vibes',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      personality: { energy: 3, mood: 4, vibe: 3, time: 4 } // Nostálgico, contemplativo
    },
    {
      id: '6',
      name: 'Neon Heartbeat',
      duration: '4:20',
      plays: 1200000,
      album: 'Neon Nights',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      personality: { energy: 5, mood: 5, vibe: 5, time: 5 } // Super energético, festa
    },
    {
      id: '7',
      name: 'Silent Echoes',
      duration: '3:15',
      plays: 1100000,
      album: 'Urban Vibes',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      personality: { energy: 1, mood: 1, vibe: 1, time: 1 } // Muito calmo, melancólico
    },
    {
      id: '8',
      name: 'Dance Floor Anthem',
      duration: '4:30',
      plays: 980000,
      album: 'Neon Nights',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      personality: { energy: 5, mood: 5, vibe: 5, time: 4 } // Festa, dança, alegre
    },
    {
      id: '9',
      name: 'Morning Breeze',
      duration: '3:40',
      plays: 950000,
      album: 'Urban Vibes',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      personality: { energy: 2, mood: 3, vibe: 2, time: 2 } // Fresco, leve, matinal
    },
    {
      id: '10',
      name: 'Cosmic Journey',
      duration: '5:10',
      plays: 920000,
      album: 'Neon Nights',
      preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
      personality: { energy: 3, mood: 3, vibe: 4, time: 3 } // Espacial, atmosférico, equilibrado
    }
  ],
  albums: [
    {
      id: '1',
      name: 'Neon Nights',
      year: 2024,
      tracks: 12,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
      color: '#FF6B9D'
    },
    {
      id: '2',
      name: 'Urban Vibes',
      year: 2023,
      tracks: 10,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
      color: '#4ECDC4'
    }
  ],
  upcomingShows: [
    {
      id: '1',
      venue: 'Electric Hall',
      city: 'São Paulo, SP',
      date: '2024-12-15',
      time: '21:00',
      tickets: 'https://ticketmaster.com/event1'
    },
    {
      id: '2',
      venue: 'Neon Club',
      city: 'Rio de Janeiro, RJ',
      date: '2024-12-22',
      time: '22:00',
      tickets: 'https://ticketmaster.com/event2'
    },
    {
      id: '3',
      venue: 'Skyline Arena',
      city: 'Belo Horizonte, MG',
      date: '2025-01-10',
      time: '20:30',
      tickets: 'https://ticketmaster.com/event3'
    }
  ],
  social: {
    spotify: 'https://open.spotify.com/artist/alexrivera',
    instagram: 'https://instagram.com/alexrivera',
    twitter: 'https://twitter.com/alexrivera',
    youtube: 'https://youtube.com/@alexrivera'
  }
};

// Rotas explícitas para arquivos estáticos (backup caso express.static não funcione no Vercel)
app.get('/css/:file', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'css', req.params.file);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

app.get('/js/:file', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'js', req.params.file);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

// Endpoint para obter dados do artista
app.get('/api/artist', (req, res) => {
  res.json(artistData);
});

// Endpoint para obter clima baseado na localização
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      // Retorna dados mock se não houver coordenadas
      const hour = new Date().getHours();
      const isDay = hour >= 6 && hour < 18;
      return res.json({
        temperature: 22,
        condition: isDay ? 'sunny' : 'clear',
        description: isDay ? 'Ensolarado' : 'Céu limpo',
        humidity: 65,
        icon: isDay ? '☀️' : '🌙',
        mood: 'vibrant',
        timeOfDay: isDay ? 'day' : 'night'
      });
    }

    // Usando API OpenWeatherMap (requer API key)
    // Para demo, vamos usar dados simulados baseados na localização
    const mockWeather = getMockWeather(lat, lon);
    res.json(mockWeather);
  } catch (error) {
    console.error('Weather API error:', error);
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    res.json({
      temperature: 20,
      condition: isDay ? 'sunny' : 'clear',
      description: isDay ? 'Ensolarado' : 'Céu limpo',
      humidity: 60,
      icon: isDay ? '☀️' : '🌙',
      mood: 'vibrant',
      timeOfDay: isDay ? 'day' : 'night'
    });
  }
});

// Função para simular dados de clima baseado na localização
function getMockWeather(lat, lon) {
  // Simula diferentes condições baseadas na latitude, longitude e hora
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const hour = new Date().getHours();
  const month = new Date().getMonth(); // 0-11
  
  let condition, description, icon, mood;
  
  // Determina a estação baseada no mês (hemisfério norte/sul)
  const isNorthernHemisphere = latitude > 0;
  let season; // 0=inverno, 1=primavera, 2=verão, 3=outono
  if (isNorthernHemisphere) {
    if (month >= 2 && month <= 4) season = 1; // Primavera
    else if (month >= 5 && month <= 7) season = 2; // Verão
    else if (month >= 8 && month <= 10) season = 3; // Outono
    else season = 0; // Inverno
  } else {
    // Hemisfério sul (estações invertidas)
    if (month >= 8 && month <= 10) season = 1; // Primavera
    else if (month >= 11 || month <= 1) season = 2; // Verão
    else if (month >= 2 && month <= 4) season = 3; // Outono
    else season = 0; // Inverno
  }
  
  // Determina se é dia ou noite (6h - 18h = dia, resto = noite)
  const isDay = hour >= 6 && hour < 18;
  const timeOfDay = isDay ? 'day' : 'night';
  
  // Gera número aleatório para variação (0-1)
  const random = Math.random();
  
  if (latitude > 0 && latitude < 30) {
    // Regiões tropicais/quentes
    if (random > 0.8 && season === 2) {
      condition = 'rainy';
      description = 'Chuvoso';
      icon = '🌧️';
      mood = 'vibrant'; // Mantém vibrant mesmo com chuva (tropical)
    } else if (isDay) {
      condition = 'sunny';
      description = 'Ensolarado';
      icon = '☀️';
      mood = 'vibrant';
    } else {
      condition = 'clear';
      description = 'Céu limpo';
      icon = '🌙';
      mood = 'vibrant';
    }
  } else if (latitude >= 30 && latitude < 60) {
    // Regiões temperadas
    if (random > 0.75 && season === 0) {
      condition = 'snowy';
      description = 'Neve';
      icon = '❄️';
      mood = 'calm';
    } else if (random > 0.7) {
      condition = 'rainy';
      description = 'Chuvoso';
      icon = '🌧️';
      mood = 'balanced';
    } else if (isDay) {
      condition = 'partly-cloudy';
      description = 'Parcialmente nublado';
      icon = '⛅';
      mood = 'balanced';
    } else {
      condition = 'clear';
      description = 'Céu limpo';
      icon = '🌙';
      mood = 'balanced';
    }
  } else {
    // Regiões mais frias (polares/temperadas frias)
    if (random > 0.6 && season === 0) {
      condition = 'snowy';
      description = 'Neve';
      icon = '❄️';
      mood = 'calm';
    } else {
      condition = 'cloudy';
      description = isDay ? 'Nublado' : 'Noite nublada';
      icon = isDay ? '☁️' : '🌑';
      mood = 'calm';
    }
  }
  
  // Cálculo de temperatura mais realista
  let baseTemp = 20;
  if (latitude > 0 && latitude < 30) {
    baseTemp = 28; // Tropical
  } else if (latitude >= 30 && latitude < 60) {
    baseTemp = 15; // Temperado
  } else {
    baseTemp = 5; // Frio
  }
  
  // Ajuste sazonal
  const seasonAdjustment = (season === 2 ? 8 : season === 0 ? -8 : 0);
  const hourAdjustment = Math.sin(hour * Math.PI / 12) * 5;
  const temperature = baseTemp + seasonAdjustment + hourAdjustment;
  
  return {
    temperature: Math.round(temperature),
    condition,
    description,
    humidity: 50 + Math.random() * 30,
    icon,
    mood,
    timeOfDay // 'day' ou 'night'
  };
}

// Endpoint para atualizar estatísticas (simulação)
app.post('/api/stats', (req, res) => {
  // Simula incremento de plays
  const trackId = req.body.trackId;
  if (trackId) {
    const track = artistData.topTracks.find(t => t.id === trackId);
    if (track) {
      track.plays += Math.floor(Math.random() * 100);
    }
  }
  res.json({ success: true, data: artistData });
});

// Endpoint para calcular música recomendada baseada no quiz
app.post('/api/quiz/result', (req, res) => {
  const answers = req.body.answers; // Array de respostas [1-5 para cada pergunta]
  
  if (!answers || answers.length < 4) {
    return res.status(400).json({ error: 'Respostas incompletas' });
  }
  
  // Calcula perfil do usuário baseado nas respostas
  // answers[0] = energia (1-5)
  // answers[1] = humor (1-5)
  // answers[2] = vibe (1-5)
  // answers[3] = momento do dia (1-5)
  
  const userProfile = {
    energy: answers[0],
    mood: answers[1],
    vibe: answers[2],
    time: answers[3]
  };
  
  // Calcula similaridade com cada música
  let bestMatch = null;
  let bestScore = -1;
  
  artistData.topTracks.forEach(track => {
    if (!track.personality) return;
    
    const score = calculateMatchScore(userProfile, track.personality);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = track;
    }
  });
  
  res.json({
    success: true,
    recommendedTrack: bestMatch,
    matchScore: Math.round((bestScore / 4) * 100), // Percentual de match
    userProfile: userProfile
  });
});

function calculateMatchScore(userProfile, trackPersonality) {
  // Calcula a diferença absoluta (quanto menor, melhor o match)
  const energyDiff = Math.abs(userProfile.energy - trackPersonality.energy);
  const moodDiff = Math.abs(userProfile.mood - trackPersonality.mood);
  const vibeDiff = Math.abs(userProfile.vibe - trackPersonality.vibe);
  const timeDiff = Math.abs(userProfile.time - trackPersonality.time);
  
  // Score inverso: quanto menor a diferença, maior o score
  const totalDiff = energyDiff + moodDiff + vibeDiff + timeDiff;
  const maxDiff = 4 * 4; // Máxima diferença possível (4 perguntas * 4 de diferença máxima)
  const score = maxDiff - totalDiff;
  
  return score;
}

// Rota catch-all: serve index.html para todas as rotas que não são APIs
// O express.static já serviu os arquivos estáticos se existirem
app.get('*', (req, res) => {
  // Ignora requisições para API
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve index.html para todas as outras rotas (SPA)
  const indexPath = path.resolve(__dirname, 'public', 'index.html');
  res.sendFile(indexPath);
});

// Export para Vercel
module.exports = app;

// Listen apenas se não estiver no Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎵 Servidor rodando em http://localhost:${PORT}`);
  });
}
