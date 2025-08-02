/**
 * VitalDX - Fixed Quiz with Single Navigation
 * Fixes: Next button working + No duplicate navigation
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
        try {
            const response = await fetch('./quiz-data.json');
            this.quizData = await response.json();
        } catch (error) {
            // Create sample data if no quiz-data.json
            this.quizData = this.createSampleQuizData();
        }
        
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
                        { text: "Severe fatigue and body aches", value: "severe", weight: 3, icon: "🔴", color: "#EF4444" },
                        { text: "Moderate fatigue and some aches", value: "moderate", weight: 2, icon: "🟡", color: "#F59E0B" },
                        { text: "Mild fatigue", value: "mild", weight: 1, icon: "🟢", color: "#10B981" },
                        { text: "Feeling normal", value: "normal", weight: 0, icon: "✅", color: "#3B82F6" }
                    ]
                },
                {
                    id: 2,
                    question: "Do you have a sore throat or runny nose?",
                    type: "multiple-choice",
                    options: [
                        { text: "Both sore throat and runny nose", value: "both", weight: 3, icon: "🤧", color: "#EF4444" },
                        { text: "Sore throat only", value: "sore_throat", weight: 2, icon: "😷", color: "#F59E0B" },
                        { text: "Runny nose only", value: "runny_nose", weight: 2, icon: "🤧", color: "#F59E0B" },
                        { text: "Neither", value: "neither", weight: 0, icon: "😊", color: "#10B981" }
                    ]
                },
                {
                    id: 3,
                    question: "Have you been in close contact with someone confirmed to have COVID-19?",
                    type: "multiple-choice",
                    options: [
                        { text: "Yes, confirmed close contact", value: "confirmed", weight: 3, icon: "⚠️", color: "#EF4444" },
                        { text: "Possible contact / unsure", value: "possible", weight: 2, icon: "🤔", color: "#F59E0B" },
                        { text: "No known contact", value: "no_contact", weight: 0, icon: "✅", color: "#10B981" }
                    ]
                },
                {
                    id: 4,
                    question: "When did your symptoms first appear?",
                    type: "multiple-choice",
                    options: [
                        { text: "Today", value: "today", weight: 3, icon: "🕐", color: "#EF4444" },
                        { text: "1-3 days ago", value: "recent", weight: 2, icon: "📅", color: "#F59E0B" },
                        { text: "4-7 days ago", value: "week", weight: 2, icon: "📆", color: "#F59E0B" },
                        { text: "More than a week ago", value: "old", weight: 1, icon: "📋", color: "#3B82F6" },
                        { text: "I don't have symptoms", value: "none", weight: 0, icon: "😊", color: "#10B981" }
                    ]
                }
            ],
            scoring: {
                low: { min: 0, max: 3, level: "Low Risk", color: "#10B981" },
                moderate: { min: 4, max: 7, level: "Moderate Risk", color: "#F59E0B" },
                high: { min: 8, max: 12, level: "High Risk", color: "#EF4444" }
            }
        };
    }

    setupQuizContainer() {
        const quizContent = document.querySelector('.quiz-content');
        if (!quizContent) return;

        // SINGLE NAVIGATION - Remove duplicate buttons
        quizContent.innerHTML = `
            <div class="quiz-progress-container" style="margin-bottom: 2rem;">
                <div class="progress-bar" style="
                    width: 100%;
                    height: 8px;
                    background: #E5E7EB;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                ">
                    <div class="progress-fill" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%);
                        border-radius: 8px;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div class="progress-text" style="
                    text-align: center;
                    color: #6B7280;
                    font-weight: 600;
                ">Question 1 of ${this.quizData.questions.length}</div>
            </div>
            <div class="single-question-container">
                <!-- Question will be dynamically inserted here -->
            </div>
        `;

        // Apply white theme styling to container
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
            quizContainer.style.cssText = `
                background: #ffffff;
                border: 2px solid #E5E7EB;
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                margin: 2rem auto;
                max-width: 800px;
            `;
        }
    }

    async showSingleQuestion(index) {
        if (!this.quizData || index >= this.quizData.questions.length) return;

        const question = this.quizData.questions[index];
        const container = document.querySelector('.single-question-container');
        
        if (!container) return;

        // Create new question card
        const questionCard = this.createQuestionCard(question, index);
        container.innerHTML = '';
        container.appendChild(questionCard);

        // Update progress
        this.updateProgress();
    }

    createQuestionCard(question, index) {
        const card = document.createElement('div');
        card.className = 'question-card';
        
        // White theme styling
        card.style.cssText = `
            background: #F8FAFC;
            border: 2px solid #E2E8F0;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
        `;

        card.innerHTML = `
            <div class="question-header" style="margin-bottom: 2rem;">
                <div class="question-number" style="
                    display: inline-block;
                    background: #3B82F6;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 700;
                    margin-bottom: 1rem;
                ">
                    Question ${index + 1} of ${this.quizData.questions.length}
                </div>
                <h3 class="question-title" style="
                    font-size: 1.3rem;
                    color: #1F2937;
                    line-height: 1.5;
                    margin: 0;
                ">${question.question}</h3>
            </div>
            <div class="question-options">
                ${question.options.map((option, optIndex) => `
                    <button class="option-btn" 
                            data-value="${option.value}" 
                            data-weight="${option.weight}"
                            data-question="${index}"
                            style="
                                background: #ffffff;
                                border: 2px solid #E5E7EB;
                                border-radius: 12px;
                                padding: 1rem 1.5rem;
                                margin-bottom: 1rem;
                                width: 100%;
                                text-align: left;
                                color: #374151;
                                font-size: 1rem;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                display: flex;
                                align-items: center;
                                gap: 1rem;
                                min-height: 60px;
                            "
                            onclick="window.symptomChecker.selectOption(this)">
                        <span class="option-icon" style="font-size: 1.5rem;">${option.icon}</span>
                        <span class="option-text" style="flex: 1;">${option.text}</span>
                        <span class="option-checkmark" style="opacity: 0; color: #10B981; font-weight: bold;">✓</span>
                    </button>
                `).join('')}
            </div>
            
            <!-- SINGLE NAVIGATION BUTTONS -->
            <div class="quiz-navigation" style="
                display: flex;
                justify-content: space-between;
                gap: 1rem;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #E5E7EB;
            ">
                <button id="prevBtn" class="nav-btn" ${this.currentQuestion === 0 ? 'disabled' : ''} 
                        onclick="window.symptomChecker.previousQuestion()"
                        style="
                            background: #F3F4F6;
                            border: 2px solid #D1D5DB;
                            border-radius: 8px;
                            color: #6B7280;
                            padding: 0.75rem 1.5rem;
                            font-weight: 600;
                            cursor: ${this.currentQuestion === 0 ? 'not-allowed' : 'pointer'};
                            opacity: ${this.currentQuestion === 0 ? '0.5' : '1'};
                            transition: all 0.2s ease;
                            min-width: 120px;
                        ">
                    ← Previous
                </button>
                <button id="nextBtn" class="nav-btn" disabled
                        onclick="window.symptomChecker.nextQuestion()"
                        style="
                            background: #3B82F6;
                            border: 2px solid #3B82F6;
                            border-radius: 8px;
                            color: white;
                            padding: 0.75rem 1.5rem;
                            font-weight: 600;
                            cursor: not-allowed;
                            opacity: 0.5;
                            transition: all 0.2s ease;
                            min-width: 120px;
                        ">
                    Next →
                </button>
            </div>
        `;

        return card;
    }

    selectOption(button) {
        const questionIndex = parseInt(button.dataset.question);
        const value = button.dataset.value;
        const weight = parseInt(button.dataset.weight) || 0;
        const questionCard = button.closest('.question-card');
        
        // Clear previous selections
        questionCard.querySelectorAll('.option-btn').forEach(btn => {
            btn.style.background = '#ffffff';
            btn.style.borderColor = '#E5E7EB';
            btn.style.transform = '';
            btn.querySelector('.option-checkmark').style.opacity = '0';
        });

        // Select current option
        const option = this.quizData.questions[questionIndex].options.find(opt => opt.value === value);
        if (option) {
            button.style.background = '#EFF6FF';
            button.style.borderColor = option.color;
            button.style.transform = 'scale(1.02)';
            button.querySelector('.option-checkmark').style.opacity = '1';
        }

        // Store answer
        this.answers[questionIndex] = {
            value: value,
            weight: weight,
            text: button.querySelector('.option-text').textContent
        };

        // Enable next button
        const nextBtn = questionCard.querySelector('#nextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.cursor = 'pointer';
            nextBtn.style.opacity = '1';
            nextBtn.style.background = '#3B82F6';
        }
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
            progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.quizData.questions.length}`;
        }
    }

    completeQuiz() {
        const totalScore = Object.values(this.answers).reduce((sum, answer) => sum + answer.weight, 0);
        
        // Hide quiz container
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.style.opacity = '0';
        
        setTimeout(() => {
            quizContainer.style.display = 'none';
            this.showResults(totalScore);
        }, 300);
    }

    showResults(score) {
        let level = 'low';
        if (score >= this.quizData.scoring.high.min) level = 'high';
        else if (score >= this.quizData.scoring.moderate.min) level = 'moderate';
        
        const levelData = this.quizData.scoring[level];
        
        // Create results section
        const resultsHTML = `
            <div class="results-container" style="
                max-width: 800px;
                margin: 2rem auto;
                background: #ffffff;
                border: 2px solid #E5E7EB;
                border-radius: 16px;
                padding: 3rem;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            ">
                <div class="score-circle" style="
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 2rem;
                    background: ${levelData.color};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                ">${score}</div>
                
                <h2 style="color: ${levelData.color}; margin-bottom: 1rem; font-size: 2rem;">${levelData.level}</h2>
                <p style="color: #6B7280; font-size: 1.1rem; margin-bottom: 2rem; line-height: 1.6;">
                    Based on your responses, your risk assessment score is ${score} out of ${this.quizData.questions.length * 3}.
                    ${level === 'high' ? 'Consider consulting with a healthcare professional.' : 
                      level === 'moderate' ? 'Monitor your symptoms and consider medical advice if they worsen.' :
                      'Your symptoms appear minimal. Continue healthy practices.'}
                </p>
                
                <div class="result-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" style="
                        background: #F3F4F6;
                        border: 2px solid #D1D5DB;
                        border-radius: 8px;
                        color: #374151;
                        padding: 1rem 2rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">Take Quiz Again</button>
                    <button onclick="window.location.href='/'" style="
                        background: #3B82F6;
                        border: 2px solid #3B82F6;
                        border-radius: 8px;
                        color: white;
                        padding: 1rem 2rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">Explore More Tools</button>
                </div>
            </div>
        `;
        
        // Insert results
        const container = document.querySelector('.quiz-section .container');
        if (container) {
            container.innerHTML = resultsHTML;
        }
    }

    showLoadingSpinner() {
        const quizContent = document.querySelector('.quiz-content');
        if (quizContent) {
            quizContent.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <div class="spinner" style="
                        width: 40px;
                        height: 40px;
                        margin: 0 auto 1rem;
                        border: 3px solid #E5E7EB;
                        border-top: 3px solid #3B82F6;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                    <p style="color: #6B7280;">Loading quiz...</p>
                </div>
            `;
        }
        
        // Add spinner animation
        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
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
                    background: #FEF2F2;
                    border: 2px solid #FECACA;
                    border-radius: 12px;
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <p style="color: #B91C1C; font-size: 1.1rem;">${message}</p>
                </div>
            `;
        }
    }
}

// Initialize the quiz - SINGLE INSTANCE
document.addEventListener('DOMContentLoaded', function() {
    const toolName = document.querySelector('[data-tool]')?.dataset.tool || 'health-check';
    window.symptomChecker = new SymptomChecker(toolName);
});
