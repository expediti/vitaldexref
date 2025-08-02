/**
 * Simple Working Symptom Checker - Fixed Version
 */

class SymptomChecker {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.questions = [
            {
                question: "How are you feeling today?",
                options: [
                    { text: "Very unwell", weight: 3, color: "#EF4444", icon: "🔴" },
                    { text: "Somewhat unwell", weight: 2, color: "#F59E0B", icon: "🟡" },
                    { text: "Slightly unwell", weight: 1, color: "#10B981", icon: "🟢" },
                    { text: "Feeling fine", weight: 0, color: "#3B82F6", icon: "✅" }
                ]
            },
            {
                question: "Do you have any fever or body aches?",
                options: [
                    { text: "High fever with severe aches", weight: 3, color: "#EF4444", icon: "🌡️" },
                    { text: "Mild fever with some aches", weight: 2, color: "#F59E0B", icon: "🤒" },
                    { text: "No fever but slight aches", weight: 1, color: "#10B981", icon: "😐" },
                    { text: "No fever or aches", weight: 0, color: "#3B82F6", icon: "😊" }
                ]
            },
            {
                question: "Do you have any respiratory symptoms?",
                options: [
                    { text: "Severe cough or breathing difficulty", weight: 3, color: "#EF4444", icon: "😷" },
                    { text: "Persistent cough", weight: 2, color: "#F59E0B", icon: "😮‍💨" },
                    { text: "Occasional cough", weight: 1, color: "#10B981", icon: "😤" },
                    { text: "No respiratory symptoms", weight: 0, color: "#3B82F6", icon: "😌" }
                ]
            }
        ];
        this.init();
    }

    init() {
        console.log('Quiz starting...');
        this.setupQuiz();
        this.showQuestion(0);
    }

    setupQuiz() {
        const quizContent = document.querySelector('.quiz-content');
        if (!quizContent) {
            console.error('Quiz content container not found!');
            return;
        }

        quizContent.innerHTML = `
            <div class="progress-container" style="margin-bottom: 2rem;">
                <div class="progress-bar" style="
                    width: 100%;
                    height: 8px;
                    background: #E5E7EB;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                ">
                    <div class="progress-fill" style="
                        width: 0%;
                        height: 100%;
                        background: #3B82F6;
                        border-radius: 8px;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div class="progress-text" style="text-align: center; color: #6B7280;">
                    Question 1 of ${this.questions.length}
                </div>
            </div>
            <div id="questionContainer"></div>
        `;
    }

    showQuestion(index) {
        if (index >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[index];
        const container = document.getElementById('questionContainer');
        
        if (!container) {
            console.error('Question container not found!');
            return;
        }

        container.innerHTML = `
            <div class="question-card" style="
                background: #F8FAFC;
                border: 2px solid #E2E8F0;
                border-radius: 12px;
                padding: 2rem;
                margin-bottom: 2rem;
            ">
                <h3 style="
                    color: #1F2937;
                    margin-bottom: 2rem;
                    font-size: 1.3rem;
                    line-height: 1.5;
                ">
                    Question ${index + 1}: ${question.question}
                </h3>
                
                <div class="options">
                    ${question.options.map((option, optIndex) => `
                        <button 
                            class="option-btn" 
                            data-weight="${option.weight}"
                            data-color="${option.color}"
                            onclick="quiz.selectAnswer(${index}, ${optIndex}, this)"
                            style="
                                width: 100%;
                                text-align: left;
                                padding: 1rem 1.5rem;
                                margin-bottom: 1rem;
                                background: white;
                                border: 2px solid #E5E7EB;
                                border-radius: 12px;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                display: flex;
                                align-items: center;
                                gap: 1rem;
                                font-size: 1rem;
                            "
                            onmouseover="this.style.borderColor='${option.color}'; this.style.background='#F8FAFC';"
                            onmouseout="if(!this.classList.contains('selected')) { this.style.borderColor='#E5E7EB'; this.style.background='white'; }"
                        >
                            <span style="font-size: 1.5rem;">${option.icon}</span>
                            <span>${option.text}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="navigation" style="
                    display: flex;
                    justify-content: space-between;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid #E5E7EB;
                ">
                    <button 
                        onclick="quiz.previousQuestion()" 
                        ${index === 0 ? 'disabled' : ''}
                        style="
                            padding: 0.75rem 1.5rem;
                            background: #F3F4F6;
                            border: 2px solid #D1D5DB;
                            border-radius: 8px;
                            cursor: ${index === 0 ? 'not-allowed' : 'pointer'};
                            opacity: ${index === 0 ? '0.5' : '1'};
                        ">
                        ← Previous
                    </button>
                    
                    <button 
                        id="nextBtn"
                        onclick="quiz.nextQuestion()" 
                        disabled
                        style="
                            padding: 0.75rem 1.5rem;
                            background: #3B82F6;
                            border: 2px solid #3B82F6;
                            border-radius: 8px;
                            color: white;
                            cursor: not-allowed;
                            opacity: 0.5;
                        ">
                        ${index === this.questions.length - 1 ? 'Get Results' : 'Next →'}
                    </button>
                </div>
            </div>
        `;

        this.updateProgress();
    }

    selectAnswer(questionIndex, optionIndex, button) {
        // Clear previous selections
        const allButtons = button.parentElement.querySelectorAll('.option-btn');
        allButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.background = 'white';
            btn.style.borderColor = '#E5E7EB';
        });

        // Select current option
        button.classList.add('selected');
        const color = button.dataset.color;
        button.style.background = '#EFF6FF';
        button.style.borderColor = color;

        // Store answer
        this.answers[questionIndex] = {
            weight: parseInt(button.dataset.weight),
            text: button.querySelector('span:last-child').textContent
        };

        // Enable next button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.cursor = 'pointer';
            nextBtn.style.opacity = '1';
        }

        console.log('Answer selected:', this.answers[questionIndex]);
    }

    nextQuestion() {
        if (!this.answers[this.currentQuestion]) {
            alert('Please select an answer before continuing.');
            return;
        }

        this.currentQuestion++;
        this.showQuestion(this.currentQuestion);
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        }
    }

    showResults() {
        const totalScore = Object.values(this.answers).reduce((sum, answer) => sum + answer.weight, 0);
        const maxScore = this.questions.length * 3;
        
        let level, color, message;
        if (totalScore <= maxScore * 0.3) {
            level = "Low Risk";
            color = "#10B981";
            message = "Your symptoms appear minimal. Continue monitoring your health.";
        } else if (totalScore <= maxScore * 0.7) {
            level = "Moderate Risk";
            color = "#F59E0B";
            message = "Monitor your symptoms and consider medical advice if they worsen.";
        } else {
            level = "High Risk";
            color = "#EF4444";
            message = "Consider consulting with a healthcare professional promptly.";
        }

        document.querySelector('.quiz-content').innerHTML = `
            <div style="
                text-align: center;
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 16px;
                padding: 3rem;
                max-width: 600px;
                margin: 0 auto;
            ">
                <div style="
                    width: 120px;
                    height: 120px;
                    background: ${color};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: white;
                    margin: 0 auto 2rem;
                ">${totalScore}</div>
                
                <h2 style="color: ${color}; margin-bottom: 1rem;">${level}</h2>
                <p style="color: #6B7280; margin-bottom: 2rem; line-height: 1.6;">${message}</p>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="location.reload()" style="
                        padding: 1rem 2rem;
                        background: #F3F4F6;
                        border: 2px solid #D1D5DB;
                        border-radius: 8px;
                        cursor: pointer;
                    ">Take Again</button>
                    <button onclick="window.location.href='/'" style="
                        padding: 1rem 2rem;
                        background: #3B82F6;
                        border: 2px solid #3B82F6;
                        border-radius: 8px;
                        color: white;
                        cursor: pointer;
                    ">More Tools</button>
                </div>
            </div>
        `;
    }
}

// Initialize quiz when page loads
let quiz;
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, starting quiz...');
    quiz = new SymptomChecker();
});

