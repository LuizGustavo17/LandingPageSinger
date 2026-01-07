// Global State
let currentTheme = localStorage.getItem('theme') || 'light';
let artistData = null;
let currentTrack = null;
let audio = null;
let currentTrackIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeThemeToggle();
    loadArtistData();
    getWeatherData();
    // Partículas serão criadas após o clima ser carregado
    setTimeout(() => {
        createParticles();
    }, 500);
    initializeScrollAnimations();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function initializeThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    toggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

// Weather Integration
async function getWeatherData() {
    const weatherInfo = document.getElementById('weatherInfo');
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherTemp = document.getElementById('weatherTemp');
    const weatherDesc = document.getElementById('weatherDesc');
    
    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    try {
                        const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
                        const weather = await response.json();
                        
                        updateWeatherUI(weather);
                        applyWeatherTheme(weather);
                    } catch (error) {
                        console.error('Error fetching weather:', error);
                        showDefaultWeather();
                    }
                },
                () => {
                    // User denied geolocation
                    fetch('/api/weather')
                        .then(res => res.json())
                        .then(weather => {
                            updateWeatherUI(weather);
                            applyWeatherTheme(weather);
                        })
                        .catch(() => showDefaultWeather());
                }
            );
        } else {
            fetch('/api/weather')
                .then(res => res.json())
                .then(weather => {
                    updateWeatherUI(weather);
                    applyWeatherTheme(weather);
                })
                .catch(() => showDefaultWeather());
        }
    } catch (error) {
        showDefaultWeather();
    }
}

function updateWeatherUI(weather) {
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherTemp = document.getElementById('weatherTemp');
    const weatherDesc = document.getElementById('weatherDesc');
    
    weatherIcon.textContent = weather.icon || '☀️';
    weatherTemp.textContent = `${weather.temperature}°`;
    weatherDesc.textContent = weather.description || 'Ensolarado';
    
    document.getElementById('weatherInfo').style.opacity = '1';
}

function showDefaultWeather() {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    const weather = {
        temperature: 22,
        description: isDay ? 'Ensolarado' : 'Céu limpo',
        icon: isDay ? '☀️' : '🌙',
        mood: 'vibrant',
        condition: isDay ? 'sunny' : 'clear',
        timeOfDay: isDay ? 'day' : 'night'
    };
    updateWeatherUI(weather);
    applyWeatherTheme(weather);
}

function applyWeatherTheme(weather) {
    const mood = weather.mood || 'vibrant';
    const condition = weather.condition || 'clear';
    const timeOfDay = weather.timeOfDay || (new Date().getHours() >= 6 && new Date().getHours() < 18 ? 'day' : 'night');
    
    document.body.setAttribute('data-mood', mood);
    document.body.setAttribute('data-condition', condition);
    document.body.setAttribute('data-time', timeOfDay);
    
    // Atualiza partículas com cores do tema
    updateParticlesTheme(mood);
    
    // Adiciona classe de transição suave
    document.body.style.transition = 'all 0.8s ease-in-out';
}

// Particles Animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    // Limpa partículas existentes
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
    
    // Aplica tema inicial
    const currentMood = document.body.getAttribute('data-mood') || 'vibrant';
    updateParticlesTheme(currentMood);
}

// Atualiza tema das partículas
function updateParticlesTheme(mood) {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.transition = 'all 0.8s ease-in-out';
    });
}

// Load Artist Data
async function loadArtistData() {
    try {
        const response = await fetch('/api/artist');
        artistData = await response.json();
        
        updateHeroSection();
        renderTracks();
        renderAlbums();
        renderShows();
        renderSocialLinks();
    } catch (error) {
        console.error('Error loading artist data:', error);
    }
}

function updateHeroSection() {
    if (!artistData) return;
    
    document.getElementById('heroGenre').textContent = artistData.genre;
    document.getElementById('heroBio').textContent = artistData.bio;
    document.getElementById('followers').textContent = formatNumber(artistData.followers);
    document.getElementById('listeners').textContent = formatNumber(artistData.monthlyListeners);
    document.getElementById('artistImage').src = artistData.image;
    document.getElementById('spotifyBtn').href = artistData.social.spotify;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// Render Tracks
function renderTracks() {
    const tracksGrid = document.getElementById('tracksGrid');
    if (!artistData || !tracksGrid) return;
    
    tracksGrid.innerHTML = artistData.topTracks.map((track, index) => `
        <div class="track-card" data-track-id="${track.id}" data-track-index="${index}">
            <div class="track-number">${String(index + 1).padStart(2, '0')}</div>
            <div class="track-info">
                <div>
                    <div class="track-name">${track.name}</div>
                    <div class="track-album">${track.album}</div>
                </div>
                <button class="track-play-btn" onclick="playTrack(${index}, event)">
                    ▶
                </button>
            </div>
            <div class="track-stats">
                <span class="track-plays">${formatNumber(track.plays)} plays</span>
                <span class="track-duration">${track.duration}</span>
            </div>
        </div>
    `).join('');
}

// Render Albums
function renderAlbums() {
    const albumsGrid = document.getElementById('albumsGrid');
    if (!artistData || !albumsGrid) return;
    
    albumsGrid.innerHTML = artistData.albums.map(album => `
        <div class="album-card" onclick="window.open('${artistData.social.spotify}', '_blank')">
            <img src="${album.image}" alt="${album.name}" class="album-art">
            <div class="album-info">
                <div class="album-name">${album.name}</div>
                <div class="album-year">${album.year}</div>
                <div class="album-tracks">${album.tracks} faixas</div>
            </div>
        </div>
    `).join('');
}

// Render Shows
function renderShows() {
    const showsList = document.getElementById('showsList');
    if (!artistData || !showsList) return;
    
    showsList.innerHTML = artistData.upcomingShows.map(show => `
        <div class="show-card">
            <div class="show-info">
                <div class="show-venue">${show.venue}</div>
                <div class="show-location">${show.city}</div>
                <div class="show-date">${formatDate(show.date)}</div>
            </div>
            <div class="show-actions">
                <span class="show-time">${show.time}</span>
                <a href="${artistData.social.spotify}" class="btn-ticket" target="_blank">Ver no Spotify</a>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

// Render Social Links
function renderSocialLinks() {
    const socialLinks = document.getElementById('socialLinks');
    if (!artistData || !socialLinks) return;
    
    const icons = {
        spotify: '🎵',
        instagram: '📷',
        twitter: '🐦',
        youtube: '▶️'
    };
    
    socialLinks.innerHTML = Object.entries(artistData.social).map(([platform, url]) => `
        <a href="${url}" class="social-link" target="_blank" aria-label="${platform}">
            ${icons[platform] || '🔗'}
        </a>
    `).join('');
}

// Audio Player
function playTrack(index, event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (!artistData || !artistData.topTracks[index]) return;
    
    currentTrackIndex = index;
    currentTrack = artistData.topTracks[index];
    
    // Se não houver preview, redireciona para o Spotify
    if (!currentTrack.preview) {
        window.open(artistData.social.spotify, '_blank');
        return;
    }
    
    // Stop current audio if playing
    if (audio) {
        audio.pause();
        audio = null;
    }
    
    // Create new audio element
    audio = new Audio(currentTrack.preview);
    
    audio.addEventListener('loadedmetadata', () => {
        updatePlayerUI();
        showAudioPlayer();
    });
    
    audio.addEventListener('timeupdate', () => {
        updateProgressBar();
    });
    
    audio.addEventListener('ended', () => {
        playNext();
    });
    
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
        // Se houver erro, redireciona para o Spotify
        window.open(artistData.social.spotify, '_blank');
    });
    
    // Update plays count
    updateTrackPlays(currentTrack.id);
}

function updatePlayerUI() {
    if (!currentTrack) return;
    
    document.getElementById('playerTrackName').textContent = currentTrack.name;
    document.getElementById('playerArtist').textContent = artistData.name;
    document.getElementById('playerArt').style.backgroundImage = `url(${artistData.image})`;
    document.getElementById('playerArt').style.backgroundSize = 'cover';
    document.getElementById('playerArt').style.backgroundPosition = 'center';
    
    const playBtn = document.getElementById('playBtn');
    playBtn.textContent = audio && !audio.paused ? '⏸' : '▶';
}

function showAudioPlayer() {
    const player = document.getElementById('audioPlayer');
    player.classList.add('active');
}

function hideAudioPlayer() {
    const player = document.getElementById('audioPlayer');
    player.classList.remove('active');
    if (audio) {
        audio.pause();
        audio = null;
    }
}

function togglePlayPause() {
    if (!audio) return;
    
    const playBtn = document.getElementById('playBtn');
    
    if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸';
    } else {
        audio.pause();
        playBtn.textContent = '▶';
    }
}

function playNext() {
    if (!artistData) return;
    
    const nextIndex = (currentTrackIndex + 1) % artistData.topTracks.length;
    playTrack(nextIndex);
}

function playPrevious() {
    if (!artistData) return;
    
    const prevIndex = currentTrackIndex === 0 
        ? artistData.topTracks.length - 1 
        : currentTrackIndex - 1;
    playTrack(prevIndex);
}

function updateProgressBar() {
    if (!audio) return;
    
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress || 0;
    
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

function seekAudio(value) {
    if (!audio) return;
    
    const seekTime = (value / 100) * audio.duration;
    audio.currentTime = seekTime;
}

// Initialize Audio Player Controls
document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const closePlayer = document.getElementById('closePlayer');
    const progressBar = document.getElementById('progressBar');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlayPause);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', playPrevious);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', playNext);
    }
    
    if (closePlayer) {
        closePlayer.addEventListener('click', hideAudioPlayer);
    }
    
    if (progressBar) {
        progressBar.addEventListener('input', (e) => {
            seekAudio(e.target.value);
        });
    }
});

// Update Track Plays
async function updateTrackPlays(trackId) {
    try {
        await fetch('/api/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trackId })
        });
    } catch (error) {
        console.error('Error updating track plays:', error);
    }
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Observe cards
    document.querySelectorAll('.track-card, .album-card, .show-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Make playTrack globally available
window.playTrack = playTrack;
