/**
 * VitalDex - Beautiful One-by-One Glassmorphism Quiz
 * Each question appears in its own stunning glass card
 */

class SymptomChecker {
    constructor(toolName) {
        this.toolName = toolName;
        this.quizData = null;
        this.currentQuestion = 0;
        this.answers = {};
        this.totalScore = 0;
        this.isQuizCompleted = false;
        this.init();
    }

    async init() {
        try {
            this.showLoadingSpinner();
            await this.loadQuizData();
            this.setupQuizContainer();
            this.showSingleQuestion(0);
            this.setupEventListeners();
            this.hideLoadingSpinner();
        } catch (error) {
            console.error('Quiz initialization failed:', error);
            this.showError('Failed to load quiz. Please refresh the page.');
        }
    }

    async loadQuizData() {
        // Load quiz data from your existing quiz-data.json
        const response = await fetch('./quiz-data.json');
        this.quizData = await response.json();
        
        // If no quiz data, create sample data
        if (!this.quizData || !this.quizData.questions) {
            this.quizData = this.createSampleQuizData();
        }
    }

    createSampleQuizData() {
        return {
            questions: [
                {
                    id: 1,
                    question: "Do you have body aches, fatigue, or feel generally unwell?",
                    type: "multiple-choice",
                    options: [
                        { text: "Severe fatigue and body aches", value: "severe", weight: 3, icon: "🔴", color: "#FF5252" },
                        { text: "Moderate fatigue and some aches", value: "moderate", weight: 2, icon: "🟡", color: "#FFC107" },
                        { text: "Mild fatigue", value: "mild", weight: 1, icon: "🟢", color: "#4CAF50" },
                        { text: "Feeling normal", value: "normal", weight: 0, icon: "✅", color: "#00BCD4" }
                    ]
                },
                {
                    id: 2,
                    question: "Do you have a sore throat or runny nose?",
                    type: "multiple-choice",
                    options: [
                        { text: "Both sore throat and runny nose", value: "both", weight: 3, icon: "🤧", color: "#FF5252" },
                        { text: "Sore throat only", value: "sore_throat", weight: 2, icon: "😷", color: "#FF9800" },
                        { text: "Runny nose only", value: "runny_nose", weight: 2, icon: "🤧", color: "#FF9800" },
                        { text: "Neither", value: "neither", weight: 0, icon: "😊", color: "#4CAF50" }
                    ]
                },
                {
                    id: 3,
                    question: "Have you been in close contact with someone confirmed to have COVID-19?",
                    type: "multiple-choice",
                    options: [
                        { text: "Yes, confirmed close contact", value: "confirmed", weight: 3, icon: "⚠️", color: "#F44336" },
                        { text: "Possible contact / unsure", value: "possible", weight: 2, icon: "🤔", color: "#FF9800" },
                        { text: "No known contact", value: "no_contact", weight: 0, icon: "✅", color: "#4CAF50" }
                    ]
                },
                {
                    id: 4,
                    question: "When did your symptoms first appear?",
                    type: "multiple-choice",
                    options: [
                        { text: "Today", value: "today", weight: 3, icon: "🕐", color: "#E91E63" },
                        { text: "1-3 days ago", value: "recent", weight: 2, icon: "📅", color: "#FF9800" },
                        { text: "4-7 days ago", value: "week", weight: 2, icon: "📆", color: "#FF9800" },
                        { text: "More than a week ago", value: "old", weight: 1, icon: "📋", color: "#2196F3" },
                        { text: "I don't have symptoms", value: "none", weight: 0, icon: "😊", color: "#4CAF50" }
                    ]
                }
            ],
            scoring: {
                low: { min: 0, max: 3, level: "Low Risk", color: "#4CAF50" },
                moderate: { min: 4, max: 7, level: "Moderate Risk", color: "#FF9800" },
                high: { min: 8, max: 12, level: "High Risk", color: "#F44336" }
            }
        };
    }

    setupQuizContainer() {
        const quizContent = document.querySelector('.quiz-content');
        if (!quizContent) return;

        // Clear existing content
        quizContent.innerHTML = `
            <div class="quiz-progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-text">Question 1 of ${this.quizData.questions.length}</div>
            </div>
            <div class="single-question-container">
                <!-- Question will be dynamically inserted here -->
            </div>
            <div class="quiz-navigation">
                <button id="prevBtn" class="quiz-nav-btn secondary" disabled>
                    <span>←</span> Previous
                </button>
                <button id="nextBtn" class="quiz-nav-btn primary" disabled>
                    Next <span>→</span>
                </button>
            </div>
        `;

        // Apply glassmorphism styling to container
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
            quizContainer.style.cssText += `
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 24px;
                padding: 3rem;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                position: relative;
                overflow: hidden;
            `;
        }
    }

    async showSingleQuestion(index) {
        if (!this.quizData || index >= this.quizData.questions.length) return;

        const question = this.quizData.questions[index];
        const container = document.querySelector('.single-question-container');
        
        if (!container) return;

        // Animate out current question if exists
        const existingCard = container.querySelector('.question-card');
        if (existingCard) {
            await this.animateQuestionOut(existingCard);
        }

        // Create new question card
        const questionCard = this.createQuestionCard(question, index);
        container.innerHTML = '';
        container.appendChild(questionCard);

        // Animate in new question
        await this.animateQuestionIn(questionCard);

        // Update progress
        this.updateProgress();
        this.updateNavigationButtons();
    }

    createQuestionCard(question, index) {
        const card = document.createElement('div');
        card.className = 'question-card glass-question-card';
        
        // Apply beautiful glassmorphism styling
        card.style.cssText = `
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 20px;
            padding: 2.5rem;
            margin-bottom: 2rem;
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transform: translateY(30px);
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        // Add floating gradient background
        const gradient = document.createElement('div');
        gradient.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(from 0deg, transparent, rgba(100, 181, 246, 0.1), transparent);
            animation: rotate 15s linear infinite;
            pointer-events: none;
        `;
        card.appendChild(gradient);

        // Question content
        const content = document.createElement('div');
        content.className = 'question-content';
        content.style.cssText = `
            position: relative;
            z-index: 2;
        `;

        content.innerHTML = `
            <div class="question-header">
                <div class="question-number">
                    <span class="q-num">${index + 1}</span>
                    <span class="q-total">/ ${this.quizData.questions.length}</span>
                </div>
                <h3 class="question-title">${question.question}</h3>
            </div>
            <div class="question-options">
                ${question.options.map((option, optIndex) => `
                    <button class="glass-option-btn" 
                            data-value="${option.value}" 
                            data-weight="${option.weight}"
                            data-question="${index}"
                            style="
                                background: rgba(255, 255, 255, 0.08);
                                backdrop-filter: blur(15px);
                                border: 2px solid rgba(255, 255, 255, 0.15);
                                border-radius: 16px;
                                padding: 1.2rem 1.5rem;
                                margin-bottom: 1rem;
                                width: 100%;
                                text-align: left;
                                color: white;
                                font-size: 1rem;
                                font-weight: 500;
                                cursor: pointer;
                                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                                display: flex;
                                align-items: center;
                                gap: 1rem;
                                position: relative;
                                overflow: hidden;
                                opacity: 0;
                                transform: translateX(-20px);
                                animation: slideInOption 0.6s ease-out ${optIndex * 0.1}s forwards;
                            "
                            onmouseover="this.style.background='rgba(${this.hexToRgb(option.color)}, 0.15)'; this.style.borderColor='rgba(${this.hexToRgb(option.color)}, 0.4)'; this.style.transform='translateX(8px) scale(1.02)';"
                            onmouseout="if(!this.classList.contains('selected')) { this.style.background='rgba(255, 255, 255, 0.08)'; this.style.borderColor='rgba(255, 255, 255, 0.15)'; this.style.transform=''; }"
                            onclick="this.parentElement.parentElement.parentElement.parentElement.querySelector('.symptom-checker').selectOption(this)">
                        <span class="option-icon" style="font-size: 1.5rem;">${option.icon}</span>
                        <span class="option-text">${option.text}</span>
                        <span class="option-checkmark" style="margin-left: auto; opacity: 0; transition: all 0.3s ease;">✓</span>
                    </button>
                `).join('')}
            </div>
        `;

        card.appendChild(content);

        // Add rotation animation keyframes if not exist
        if (!document.getElementById('rotate-animation')) {
            const style = document.createElement('style');
            style.id = 'rotate-animation';
            style.textContent = `
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes slideInOption {
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        return card;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16)
            : "255, 255, 255";
    }

    async animateQuestionOut(element) {
        return new Promise(resolve => {
            element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.transform = 'translateX(-50px) scale(0.95)';
            element.style.opacity = '0';
            element.style.filter = 'blur(5px)';
            setTimeout(resolve, 500);
        });
    }

    async animateQuestionIn(element) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            });
            setTimeout(resolve, 600);
        });
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevBtn')?.addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextBtn')?.addEventListener('click', () => this.nextQuestion());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.quiz-container')) {
                if (e.key === 'ArrowLeft' && this.currentQuestion > 0) {
                    this.previousQuestion();
                } else if (e.key === 'ArrowRight' && this.canProceed()) {
                    this.nextQuestion();
                }
            }
        });

        // Create global method for option selection
        window.selectOption = (button) => this.selectOption(button);
    }

    selectOption(button) {
        const questionIndex = parseInt(button.dataset.question);
        const value = button.dataset.value;
        const weight = parseInt(button.dataset.weight) || 0;
        const questionCard = button.closest('.question-card');
        
        // Clear previous selections
        questionCard.querySelectorAll('.glass-option-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.querySelector('.option-checkmark').style.opacity = '0';
            if (btn !== button) {
                btn.style.background = 'rgba(255, 255, 255, 0.08)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                btn.style.transform = '';
            }
        });

        // Select current option with beautiful animation
        button.classList.add('selected');
        const option = this.quizData.questions[questionIndex].options.find(opt => opt.value === value);
        if (option) {
            button.style.background = `rgba(${this.hexToRgb(option.color)}, 0.25)`;
            button.style.borderColor = `rgba(${this.hexToRgb(option.color)}, 0.6)`;
            button.style.transform = 'translateX(8px) scale(1.02)';
            button.style.boxShadow = `0 8px 25px rgba(${this.hexToRgb(option.color)}, 0.3)`;
        }
        
        button.querySelector('.option-checkmark').style.opacity = '1';

        // Store answer
        this.answers[questionIndex] = {
            value: value,
            weight: weight,
            text: button.querySelector('.option-text').textContent
        };

        // Update navigation
        this.updateNavigationButtons();

        // Auto-advance after selection (with delay for visual feedback)
        setTimeout(() => {
            if (this.canProceed() && this.currentQuestion < this.quizData.questions.length - 1) {
                this.nextQuestion();
            }
        }, 1000);
    }

    nextQuestion() {
        if (!this.canProceed()) return;

        if (this.currentQuestion < this.quizData.questions.length - 1) {
            this.currentQuestion++;
            this.showSingleQuestion(this.currentQuestion);
        } else {
            this.completeQuiz();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showSingleQuestion(this.currentQuestion);
        }
    }

    canProceed() {
        return this.answers.hasOwnProperty(this.currentQuestion);
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            const progress = ((this.currentQuestion + 1) / this.quizData.questions.length) * 100;
            progressFill.style.width = `${progress}%`;
            progressFill.style.background = `linear-gradient(90deg, 
                rgba(100, 181, 246, 0.8) 0%, 
                rgba(33, 150, 243, 0.9) 50%, 
                rgba(100, 181, 246, 0.8) 100%)`;
            progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.quizData.questions.length}`;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
            prevBtn.style.opacity = this.currentQuestion === 0 ? '0.5' : '1';
        }

        if (nextBtn) {
            nextBtn.disabled = !this.canProceed();
            nextBtn.style.opacity = !this.canProceed() ? '0.5' : '1';
            
            if (this.currentQuestion === this.quizData.questions.length - 1) {
                nextBtn.innerHTML = '<span>🎯</span> Get Results';
            } else {
                nextBtn.innerHTML = 'Next <span>→</span>';
            }
        }
    }

    completeQuiz() {
        const totalScore = Object.values(this.answers).reduce((sum, answer) => sum + answer.weight, 0);
        
        // Hide quiz container
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.style.transform = 'scale(0.95)';
        quizContainer.style.opacity = '0';
        
        setTimeout(() => {
            quizContainer.style.display = 'none';
            this.showResults(totalScore);
        }, 500);
    }

    showResults(score) {
        const resultsSection = document.getElementById('resultsSection') || this.createResultsSection();
        
        let level = 'low';
        if (score >= this.quizData.scoring.high.min) level = 'high';
        else if (score >= this.quizData.scoring.moderate.min) level = 'moderate';
        
        const levelData = this.quizData.scoring[level];
        
        resultsSection.innerHTML = `
            <div class="results-card" style="
                background: rgba(255, 255, 255, 0.12);
                backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 24px;
                padding: 3rem;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            ">
                <div class="score-display" style="
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 2rem;
                    background: linear-gradient(135deg, rgba(${this.hexToRgb(levelData.color)}, 0.2) 0%, rgba(${this.hexToRgb(levelData.color)}, 0.4) 100%);
                    backdrop-filter: blur(15px);
                    border: 2px solid rgba(${this.hexToRgb(levelData.color)}, 0.5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 8px 32px rgba(${this.hexToRgb(levelData.color)}, 0.3);
                ">${score}</div>
                
                <h2 style="color: white; margin-bottom: 1rem; font-size: 2rem;">${levelData.level}</h2>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.1rem; margin-bottom: 2rem;">
                    Based on your responses, your risk assessment score is ${score} out of ${this.quizData.questions.length * 3}.
                </p>
                
                <div class="result-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" style="
                        background: rgba(255, 255, 255, 0.15);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        border-radius: 12px;
                        color: white;
                        padding: 1rem 2rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Take Quiz Again</button>
                    <button onclick="window.location.href='/'" style="
                        background: rgba(100, 181, 246, 0.3);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(100, 181, 246, 0.5);
                        border-radius: 12px;
                        color: white;
                        padding: 1rem 2rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Explore More Tools</button>
                </div>
            </div>
        `;
        
        resultsSection.style.display = 'block';
        
        // Animate results in
        requestAnimationFrame(() => {
            const resultsCard = resultsSection.querySelector('.results-card');
            resultsCard.style.opacity = '1';
            resultsCard.style.transform = 'translateY(0)';
        });
        
        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
    }

    createResultsSection() {
        const section = document.createElement('div');
        section.id = 'resultsSection';
        section.className = 'quiz-results';
        document.querySelector('.quiz-section .container').appendChild(section);
        return section;
    }

    showLoadingSpinner() {
        const quizContent = document.querySelector('.quiz-content');
        if (quizContent) {
            quizContent.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <div class="glass-loading-spinner" style="
                        width: 60px;
                        height: 60px;
                        margin: 0 auto 1rem;
                        border: 3px solid rgba(255, 255, 255, 0.3);
                        border-top: 3px solid rgba(100, 181, 246, 0.8);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                    <p style="color: white;">Loading beautiful quiz...</p>
                </div>
            `;
        }
        
        // Add spinner animation
        if (!document.getElementById('spinner-animation')) {
            const style = document.createElement('style');
            style.id = 'spinner-animation';
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    hideLoadingSpinner() {
        // Loading will be replaced by first question
    }

    showError(message) {
        const quizContent = document.querySelector('.quiz-content');
        if (quizContent) {
            quizContent.innerHTML = `
                <div style="
                    text-align: center; 
                    padding: 3rem;
                    background: rgba(244, 67, 54, 0.1);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(244, 67, 54, 0.3);
                    border-radius: 16px;
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <p style="color: white; font-size: 1.1rem;">${message}</p>
                </div>
            `;
        }
    }
}

// Initialize the beautiful one-by-one quiz
document.addEventListener('DOMContentLoaded', function() {
    const toolName = document.querySelector('[data-tool]')?.dataset.tool || 'health-check';
    new SymptomChecker(toolName);
});
