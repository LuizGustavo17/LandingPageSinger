// Quiz State
let quizState = {
    currentQuestion: 0,
    answers: [],
    isActive: false
};

// Quiz Questions
const quizQuestions = [
    {
        question: "Qual é o seu nível de energia hoje?",
        options: [
            { text: "Muito baixo, preciso relaxar", value: 1, emoji: "😴" },
            { text: "Baixo, estou tranquilo", value: 2, emoji: "😌" },
            { text: "Moderado, equilibrado", value: 3, emoji: "😊" },
            { text: "Alto, estou animado", value: 4, emoji: "😃" },
            { text: "Muito alto, pronto para festa!", value: 5, emoji: "🎉" }
        ]
    },
    {
        question: "Como está o seu humor?",
        options: [
            { text: "Melancólico, introspectivo", value: 1, emoji: "😔" },
            { text: "Calmo, sereno", value: 2, emoji: "🧘" },
            { text: "Neutro, equilibrado", value: 3, emoji: "😐" },
            { text: "Alegre, positivo", value: 4, emoji: "😄" },
            { text: "Eufórico, muito feliz!", value: 5, emoji: "🤩" }
        ]
    },
    {
        question: "Que tipo de vibe você está procurando?",
        options: [
            { text: "Relaxante, meditativo", value: 1, emoji: "🌙" },
            { text: "Suave, contemplativo", value: 2, emoji: "🌊" },
            { text: "Equilibrado, versátil", value: 3, emoji: "⚖️" },
            { text: "Energético, dançante", value: 4, emoji: "💃" },
            { text: "Explosivo, festa total!", value: 5, emoji: "🔥" }
        ]
    },
    {
        question: "Qual é o melhor momento do dia para você ouvir música?",
        options: [
            { text: "Madrugada (00h - 6h)", value: 1, emoji: "🌃" },
            { text: "Manhã cedo (6h - 9h)", value: 2, emoji: "🌅" },
            { text: "Meio-dia (9h - 15h)", value: 3, emoji: "☀️" },
            { text: "Tarde/Noite (15h - 21h)", value: 4, emoji: "🌆" },
            { text: "Noite (21h - 00h)", value: 5, emoji: "🌙" }
        ]
    }
];

// Initialize Quiz
function initializeQuiz() {
    const quizStartBtn = document.getElementById('quizStartBtn');
    const heroQuizBtn = document.getElementById('heroQuizBtn');
    const restartQuizBtn = document.getElementById('restartQuizBtn');
    const quizNextBtn = document.getElementById('quizNextBtn');
    
    if (quizStartBtn) {
        quizStartBtn.addEventListener('click', startQuiz);
    }
    
    if (heroQuizBtn) {
        heroQuizBtn.addEventListener('click', () => {
            document.getElementById('quizSection').scrollIntoView({ behavior: 'smooth' });
            setTimeout(startQuiz, 500);
        });
    }
    
    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', resetQuiz);
    }
    
    if (quizNextBtn) {
        quizNextBtn.addEventListener('click', nextQuestion);
    }
    
    // Botão de "Ouvir no Spotify" já está como link no HTML, não precisa de handler
}

function startQuiz() {
    quizState = {
        currentQuestion: 0,
        answers: [],
        isActive: true
    };
    
    const quizIntro = document.getElementById('quizIntro');
    const quizWrapper = document.getElementById('quizWrapper');
    const quizResult = document.getElementById('quizResult');
    
    quizIntro.style.display = 'none';
    quizWrapper.style.display = 'block';
    quizResult.style.display = 'none';
    
    showQuestion(0);
}

function showQuestion(index) {
    if (index >= quizQuestions.length) {
        submitQuiz();
        return;
    }
    
    quizState.currentQuestion = index;
    const question = quizQuestions[index];
    
    // Update progress
    const progress = ((index + 1) / quizQuestions.length) * 100;
    document.getElementById('quizProgress').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Pergunta ${index + 1} de ${quizQuestions.length}`;
    
    // Update question title
    document.getElementById('questionTitle').textContent = question.question;
    
    // Render options
    const optionsContainer = document.getElementById('questionOptions');
    optionsContainer.innerHTML = question.options.map((option, optIndex) => `
        <div class="quiz-option" data-value="${option.value}" data-index="${optIndex}">
            <span class="option-emoji">${option.emoji}</span>
            <span class="option-text">${option.text}</span>
        </div>
    `).join('');
    
    // Add click listeners to options
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.addEventListener('click', () => selectOption(option));
    });
    
    // Reset next button
    const nextBtn = document.getElementById('quizNextBtn');
    nextBtn.disabled = true;
    nextBtn.textContent = index === quizQuestions.length - 1 ? 'Ver Resultado' : 'Próxima Pergunta';
}

function selectOption(optionElement) {
    // Remove previous selection
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    optionElement.classList.add('selected');
    
    // Store answer
    const value = parseInt(optionElement.dataset.value);
    quizState.answers[quizState.currentQuestion] = value;
    
    // Enable next button
    document.getElementById('quizNextBtn').disabled = false;
}

function nextQuestion() {
    if (quizState.answers[quizState.currentQuestion] === undefined) {
        return;
    }
    
    const nextIndex = quizState.currentQuestion + 1;
    showQuestion(nextIndex);
}

async function submitQuiz() {
    if (quizState.answers.length < quizQuestions.length) {
        alert('Por favor, responda todas as perguntas!');
        return;
    }
    
    try {
        const response = await fetch('/api/quiz/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers: quizState.answers })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResult(data);
        } else {
            alert('Erro ao processar o quiz. Tente novamente.');
        }
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Erro ao processar o quiz. Tente novamente.');
    }
}

function showResult(data) {
    const quizWrapper = document.getElementById('quizWrapper');
    const quizResult = document.getElementById('quizResult');
    
    quizWrapper.style.display = 'none';
    quizResult.style.display = 'block';
    
    // Update result UI
    const track = data.recommendedTrack;
    document.getElementById('matchPercentage').textContent = data.matchScore + '%';
    document.getElementById('resultTrackName').textContent = track.name;
    document.getElementById('resultTrackAlbum').textContent = track.album;
    document.getElementById('resultTrackDuration').textContent = track.duration;
    
    // Set track art (using artist image as fallback)
    const trackArt = document.getElementById('resultTrackArt');
    // Try to get artistData from global scope or fetch it
    let artistImage = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800';
    if (typeof artistData !== 'undefined' && artistData && artistData.image) {
        artistImage = artistData.image;
    } else if (window.artistData && window.artistData.image) {
        artistImage = window.artistData.image;
    }
    trackArt.style.backgroundImage = `url(${artistImage})`;
    
    // Store recommended track for playing
    window.recommendedTrack = track;
    
    // Scroll to result
    quizResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function resetQuiz() {
    quizState = {
        currentQuestion: 0,
        answers: [],
        isActive: false
    };
    
    const quizIntro = document.getElementById('quizIntro');
    const quizWrapper = document.getElementById('quizWrapper');
    const quizResult = document.getElementById('quizResult');
    
    quizIntro.style.display = 'block';
    quizWrapper.style.display = 'none';
    quizResult.style.display = 'none';
    
    // Scroll to quiz section
    document.getElementById('quizSection').scrollIntoView({ behavior: 'smooth' });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
});

