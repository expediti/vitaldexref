// FORCE SINGLE QUESTION DISPLAY
document.addEventListener('DOMContentLoaded', function() {
    // Hide all questions except the first one
    const questions = document.querySelectorAll('.question');
    questions.forEach((q, index) => {
        if (index > 0) {
            q.style.display = 'none';
        }
    });
    
    // Initialize simple quiz
    window.currentQuestionIndex = 0;
    window.showNextQuestion = function() {
        const current = document.querySelector('.question.active');
        if (current) {
            current.style.display = 'none';
            current.classList.remove('active');
        }
        
        window.currentQuestionIndex++;
        const next = document.querySelectorAll('.question')[window.currentQuestionIndex];
        if (next) {
            next.style.display = 'block';
            next.classList.add('active');
        }
    };
});

/**
 * VitalDx - Complete Quiz System with Full Questions
 * Each tool gets 7-8 detailed questions
 */

class SymptomChecker {
    constructor(toolName) {
        this.toolName = toolName || this.getToolFromURL();
        this.currentQuestion = 0;
        this.answers = {};
        this.questions = [];
        this.init();
    }

    getToolFromURL() {
        const path = window.location.pathname;
        if (path.includes('covid-19')) return 'covid-19-symptom-checker';
        if (path.includes('anxiety')) return 'anxiety-symptom-checker';
        if (path.includes('asthma')) return 'asthma-symptom-checker';
        if (path.includes('dizziness')) return 'dizziness-symptom-checker';
        if (path.includes('food-poisoning')) return 'food-poisoning-symptom-checker';
        if (path.includes('gastroenteritis')) return 'gastroenteritis-symptom-checker';
        if (path.includes('ibs')) return 'ibs-symptom-checker';
        if (path.includes('uti')) return 'uti-symptom-checker';
        return 'health-check';
    }

    async init() {
        console.log('Starting quiz for:', this.toolName);
        this.loadFullQuestions();
        this.setupQuiz();
        this.showQuestion(0);
    }

    loadFullQuestions() {
        // Full question sets for each tool (7-8 questions each)
        const quizData = {
            'covid-19-symptom-checker': {
                name: 'COVID-19 Symptom Checker',
                questions: [
                    {
                        question: "Do you have body aches, fatigue, or feel generally unwell?",
                        options: [
                            { text: "Severe fatigue and body aches", weight: 3, color: "#EF4444", icon: "🔴" },
                            { text: "Moderate fatigue and some aches", weight: 2, color: "#F59E0B", icon: "🟡" },
                            { text: "Mild fatigue", weight: 1, color: "#10B981", icon: "🟢" },
                            { text: "Feeling normal", weight: 0, color: "#3B82F6", icon: "✅" }
                        ]
                    },
                    {
                        question: "Do you have a fever or chills?",
                        options: [
                            { text: "High fever (over 101°F/38.3°C)", weight: 3, color: "#EF4444", icon: "🌡️" },
                            { text: "Mild fever (99-101°F)", weight: 2, color: "#F59E0B", icon: "🤒" },
                            { text: "Feeling warm but no measured fever", weight: 1, color: "#F59E0B", icon: "😰" },
                            { text: "No fever or chills", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "Do you have a cough or trouble breathing?",
                        options: [
                            { text: "Severe cough with difficulty breathing", weight: 3, color: "#EF4444", icon: "😷" },
                            { text: "Persistent dry cough", weight: 2, color: "#F59E0B", icon: "😮‍💨" },
                            { text: "Occasional cough", weight: 1, color: "#F59E0B", icon: "😶‍🌫️" },
                            { text: "No cough or breathing issues", weight: 0, color: "#10B981", icon: "😌" }
                        ]
                    },
                    {
                        question: "Have you lost your sense of taste or smell?",
                        options: [
                            { text: "Complete loss of taste and smell", weight: 3, color: "#EF4444", icon: "👃" },
                            { text: "Partial loss of taste or smell", weight: 2, color: "#F59E0B", icon: "🤷" },
                            { text: "Reduced taste or smell", weight: 1, color: "#F59E0B", icon: "😕" },
                            { text: "Normal taste and smell", weight: 0, color: "#10B981", icon: "😋" }
                        ]
                    },
                    {
                        question: "Do you have a sore throat or runny nose?",
                        options: [
                            { text: "Both sore throat and runny nose", weight: 3, color: "#EF4444", icon: "🤧" },
                            { text: "Sore throat only", weight: 2, color: "#F59E0B", icon: "😷" },
                            { text: "Runny nose only", weight: 2, color: "#F59E0B", icon: "🤧" },
                            { text: "Neither", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "Have you been in close contact with someone confirmed to have COVID-19?",
                        options: [
                            { text: "Yes, confirmed close contact", weight: 3, color: "#EF4444", icon: "⚠️" },
                            { text: "Possible contact / unsure", weight: 2, color: "#F59E0B", icon: "🤔" },
                            { text: "No known contact", weight: 0, color: "#10B981", icon: "✅" },
                            { text: "Don't know", weight: 1, color: "#6B7280", icon: "❓" }
                        ]
                    },
                    {
                        question: "When did your symptoms first appear?",
                        options: [
                            { text: "Today", weight: 3, color: "#EF4444", icon: "🕐" },
                            { text: "1-3 days ago", weight: 2, color: "#F59E0B", icon: "📅" },
                            { text: "4-7 days ago", weight: 2, color: "#F59E0B", icon: "📆" },
                            { text: "More than a week ago", weight: 1, color: "#3B82F6", icon: "📋" }
                        ]
                    },
                    {
                        question: "Are you experiencing any digestive issues?",
                        options: [
                            { text: "Severe nausea, vomiting, or diarrhea", weight: 3, color: "#EF4444", icon: "🤢" },
                            { text: "Mild nausea or stomach discomfort", weight: 2, color: "#F59E0B", icon: "😣" },
                            { text: "Occasional stomach issues", weight: 1, color: "#F59E0B", icon: "😐" },
                            { text: "No digestive problems", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    }
                ],
                scoring: {
                    low: { min: 0, max: 6, level: "Low Risk", color: "#10B981" },
                    moderate: { min: 7, max: 14, level: "Moderate Risk", color: "#F59E0B" },
                    high: { min: 15, max: 24, level: "High Risk", color: "#EF4444" }
                }
            },
            
            'anxiety-symptom-checker': {
                name: 'Anxiety Assessment',
                questions: [
                    {
                        question: "How often do you feel nervous, anxious, or on edge?",
                        options: [
                            { text: "Nearly every day", weight: 3, color: "#EF4444", icon: "😰" },
                            { text: "More than half the days", weight: 2, color: "#F59E0B", icon: "😟" },
                            { text: "Several days", weight: 1, color: "#F59E0B", icon: "😕" },
                            { text: "Not at all", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "How often do you have trouble relaxing?",
                        options: [
                            { text: "Nearly every day", weight: 3, color: "#EF4444", icon: "😣" },
                            { text: "More than half the days", weight: 2, color: "#F59E0B", icon: "😔" },
                            { text: "Several days", weight: 1, color: "#F59E0B", icon: "🤔" },
                            { text: "Not at all", weight: 0, color: "#10B981", icon: "😌" }
                        ]
                    },
                    {
                        question: "How often do you worry too much about different things?",
                        options: [
                            { text: "Nearly every day", weight: 3, color: "#EF4444", icon: "😟" },
                            { text: "More than half the days", weight: 2, color: "#F59E0B", icon: "😕" },
                            { text: "Several days", weight: 1, color: "#F59E0B", icon: "🤷" },
                            { text: "Not at all", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "Do you experience physical symptoms when anxious? (racing heart, sweating, trembling)",
                        options: [
                            { text: "Severe physical symptoms", weight: 3, color: "#EF4444", icon: "💓" },
                            { text: "Moderate physical symptoms", weight: 2, color: "#F59E0B", icon: "😓" },
                            { text: "Mild physical symptoms", weight: 1, color: "#F59E0B", icon: "😅" },
                            { text: "No physical symptoms", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "How often do you have trouble sleeping due to worry?",
                        options: [
                            { text: "Nearly every night", weight: 3, color: "#EF4444", icon: "😴" },
                            { text: "More than half the nights", weight: 2, color: "#F59E0B", icon: "😪" },
                            { text: "Several nights", weight: 1, color: "#F59E0B", icon: "🥱" },
                            { text: "Sleep well most nights", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "How often do you avoid situations that make you anxious?",
                        options: [
                            { text: "Always avoid anxiety-provoking situations", weight: 3, color: "#EF4444", icon: "🚫" },
                            { text: "Often avoid such situations", weight: 2, color: "#F59E0B", icon: "😬" },
                            { text: "Sometimes avoid", weight: 1, color: "#F59E0B", icon: "🤔" },
                            { text: "Rarely or never avoid", weight: 0, color: "#10B981", icon: "💪" }
                        ]
                    },
                    {
                        question: "How long have you been experiencing these symptoms?",
                        options: [
                            { text: "More than 6 months", weight: 3, color: "#EF4444", icon: "📅" },
                            { text: "2-6 months", weight: 2, color: "#F59E0B", icon: "📆" },
                            { text: "Less than 2 months", weight: 1, color: "#F59E0B", icon: "🗓️" },
                            { text: "Just started recently", weight: 0, color: "#10B981", icon: "🆕" }
                        ]
                    }
                ],
                scoring: {
                    low: { min: 0, max: 6, level: "Low Anxiety", color: "#10B981" },
                    moderate: { min: 7, max: 14, level: "Moderate Anxiety", color: "#F59E0B" },
                    high: { min: 15, max: 21, level: "High Anxiety", color: "#EF4444" }
                }
            },

            'asthma-symptom-checker': {
                name: 'Asthma Risk Assessment',
                questions: [
                    {
                        question: "How often do you experience shortness of breath?",
                        options: [
                            { text: "Daily or almost daily", weight: 3, color: "#EF4444", icon: "😤" },
                            { text: "Several times a week", weight: 2, color: "#F59E0B", icon: "😮‍💨" },
                            { text: "Occasionally", weight: 1, color: "#F59E0B", icon: "😐" },
                            { text: "Rarely or never", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "Do you have a persistent cough, especially at night or early morning?",
                        options: [
                            { text: "Yes, very persistent and disruptive", weight: 3, color: "#EF4444", icon: "😷" },
                            { text: "Yes, moderate coughing", weight: 2, color: "#F59E0B", icon: "🤧" },
                            { text: "Occasional cough", weight: 1, color: "#F59E0B", icon: "😶‍🌫️" },
                            { text: "No persistent cough", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "Do you experience wheezing or whistling sounds when breathing?",
                        options: [
                            { text: "Frequent wheezing", weight: 3, color: "#EF4444", icon: "🎵" },
                            { text: "Occasional wheezing", weight: 2, color: "#F59E0B", icon: "😤" },
                            { text: "Rare wheezing", weight: 1, color: "#F59E0B", icon: "🤔" },
                            { text: "No wheezing", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "How often do you feel chest tightness?",
                        options: [
                            { text: "Daily chest tightness", weight: 3, color: "#EF4444", icon: "😣" },
                            { text: "Several times a week", weight: 2, color: "#F59E0B", icon: "😔" },
                            { text: "Occasionally", weight: 1, color: "#F59E0B", icon: "🤷" },
                            { text: "Rarely or never", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "Do specific triggers worsen your symptoms? (dust, pollen, exercise, cold air)",
                        options: [
                            { text: "Multiple triggers cause severe symptoms", weight: 3, color: "#EF4444", icon: "🌿" },
                            { text: "Some triggers cause symptoms", weight: 2, color: "#F59E0B", icon: "🤧" },
                            { text: "Few triggers affect me", weight: 1, color: "#F59E0B", icon: "🤔" },
                            { text: "No obvious triggers", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "How do your symptoms affect your daily activities?",
                        options: [
                            { text: "Severely limit daily activities", weight: 3, color: "#EF4444", icon: "🚫" },
                            { text: "Moderately affect activities", weight: 2, color: "#F59E0B", icon: "😔" },
                            { text: "Slightly affect activities", weight: 1, color: "#F59E0B", icon: "😐" },
                            { text: "No impact on activities", weight: 0, color: "#10B981", icon: "💪" }
                        ]
                    },
                    {
                        question: "Do you have a family history of asthma or allergies?",
                        options: [
                            { text: "Strong family history of asthma", weight: 3, color: "#EF4444", icon: "👨‍👩‍👧‍👦" },
                            { text: "Some family history of asthma/allergies", weight: 2, color: "#F59E0B", icon: "👪" },
                            { text: "Distant family history", weight: 1, color: "#F59E0B", icon: "🤷" },
                            { text: "No family history", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "How long have you been experiencing these respiratory symptoms?",
                        options: [
                            { text: "More than a year", weight: 3, color: "#EF4444", icon: "📅" },
                            { text: "6 months to 1 year", weight: 2, color: "#F59E0B", icon: "📆" },
                            { text: "1-6 months", weight: 1, color: "#F59E0B", icon: "🗓️" },
                            { text: "Less than 1 month", weight: 0, color: "#10B981", icon: "🆕" }
                        ]
                    }
                ],
                scoring: {
                    low: { min: 0, max: 7, level: "Low Asthma Risk", color: "#10B981" },
                    moderate: { min: 8, max: 16, level: "Moderate Asthma Risk", color: "#F59E0B" },
                    high: { min: 17, max: 24, level: "High Asthma Risk", color: "#EF4444" }
                }
            },

            // Default fallback for other tools
            'default': {
                name: 'Health Assessment',
                questions: [
                    {
                        question: "How would you describe your overall health today?",
                        options: [
                            { text: "Very poor - multiple severe symptoms", weight: 3, color: "#EF4444", icon: "🔴" },
                            { text: "Poor - several concerning symptoms", weight: 2, color: "#F59E0B", icon: "🟡" },
                            { text: "Fair - some mild symptoms", weight: 1, color: "#F59E0B", icon: "🟠" },
                            { text: "Good - feeling well", weight: 0, color: "#10B981", icon: "🟢" }
                        ]
                    },
                    {
                        question: "Are you experiencing any pain or discomfort?",
                        options: [
                            { text: "Severe pain affecting daily activities", weight: 3, color: "#EF4444", icon: "😣" },
                            { text: "Moderate pain", weight: 2, color: "#F59E0B", icon: "😔" },
                            { text: "Mild discomfort", weight: 1, color: "#F59E0B", icon: "😐" },
                            { text: "No pain or discomfort", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "How is your energy level?",
                        options: [
                            { text: "Extremely fatigued", weight: 3, color: "#EF4444", icon: "😴" },
                            { text: "Often tired", weight: 2, color: "#F59E0B", icon: "😪" },
                            { text: "Occasional tiredness", weight: 1, color: "#F59E0B", icon: "🥱" },
                            { text: "Good energy levels", weight: 0, color: "#10B981", icon: "💪" }
                        ]
                    },
                    {
                        question: "Are you experiencing any mood changes?",
                        options: [
                            { text: "Significant mood changes", weight: 3, color: "#EF4444", icon: "😰" },
                            { text: "Some mood fluctuations", weight: 2, color: "#F59E0B", icon: "😕" },
                            { text: "Minor mood changes", weight: 1, color: "#F59E0B", icon: "🤔" },
                            { text: "Stable mood", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "How is your sleep quality?",
                        options: [
                            { text: "Very poor sleep", weight: 3, color: "#EF4444", icon: "😴" },
                            { text: "Often disrupted sleep", weight: 2, color: "#F59E0B", icon: "😪" },
                            { text: "Occasionally poor sleep", weight: 1, color: "#F59E0B", icon: "🥱" },
                            { text: "Good sleep quality", weight: 0, color: "#10B981", icon: "😊" }
                        ]
                    },
                    {
                        question: "How long have you been experiencing these symptoms?",
                        options: [
                            { text: "More than 3 months", weight: 3, color: "#EF4444", icon: "📅" },
                            { text: "1-3 months", weight: 2, color: "#F59E0B", icon: "📆" },
                            { text: "1-4 weeks", weight: 1, color: "#F59E0B", icon: "🗓️" },
                            { text: "Less than 1 week", weight: 0, color: "#10B981", icon: "🆕" }
                        ]
                    },
                    {
                        question: "Are your symptoms getting worse?",
                        options: [
                            { text: "Yes, significantly worse", weight: 3, color: "#EF4444", icon: "📈" },
                            { text: "Yes, gradually worse", weight: 2, color: "#F59E0B", icon: "📊" },
                            { text: "About the same", weight: 1, color: "#F59E0B", icon: "➡️" },
                            { text: "Getting better", weight: 0, color: "#10B981", icon: "📉" }
                        ]
                    }
                ],
                scoring: {
                    low: { min: 0, max: 6, level: "Low Concern", color: "#10B981" },
                    moderate: { min: 7, max: 14, level: "Moderate Concern", color: "#F59E0B" },
                    high: { min: 15, max: 21, level: "High Concern", color: "#EF4444" }
                }
            }
        };

        // Select appropriate question set
        const selectedQuiz = quizData[this.toolName] || quizData['default'];
        this.questions = selectedQuiz.questions;
        this.scoring = selectedQuiz.scoring;
        this.quizName = selectedQuiz.name;

        console.log(`Loaded ${this.questions.length} questions for ${this.quizName}`);
    }

    setupQuiz() {
        const quizContent = document.querySelector('.quiz-content');
        if (!quizContent) return;

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
                        background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%);
                        border-radius: 8px;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div class="progress-text" style="
                    text-align: center;
                    color: #6B7280;
                    font-weight: 600;
                ">Question 1 of ${this.questions.length}</div>
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
                                min-height: 60px;
                            "
                            onmouseover="this.style.borderColor='${option.color}'; this.style.background='#F8FAFC';"
                            onmouseout="if(!this.classList.contains('selected')) { this.style.borderColor='#E5E7EB'; this.style.background='white'; }"
                        >
                            <span style="font-size: 1.5rem;">${option.icon}</span>
                            <span style="flex: 1;">${option.text}</span>
                            <span class="checkmark" style="opacity: 0; color: #10B981; font-weight: bold; font-size: 1.2rem;">✓</span>
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
                            font-weight: 600;
                            color: #374151;
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
                            font-weight: 600;
                        ">
                        ${index === this.questions.length - 1 ? '🎯 Get Results' : 'Next →'}
                    </button>
                </div>
            </div>
        `;

        this.updateProgress();
    }

    selectAnswer(questionIndex, optionIndex, button) {
        const allButtons = button.parentElement.querySelectorAll('.option-btn');
        allButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.background = 'white';
            btn.style.borderColor = '#E5E7EB';
            btn.querySelector('.checkmark').style.opacity = '0';
        });

        button.classList.add('selected');
        const color = button.dataset.color;
        button.style.background = '#EFF6FF';
        button.style.borderColor = color;
        button.querySelector('.checkmark').style.opacity = '1';

        this.answers[questionIndex] = {
            weight: parseInt(button.dataset.weight),
            text: button.querySelector('span:nth-child(2)').textContent
        };

        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.cursor = 'pointer';
            nextBtn.style.opacity = '1';
        }
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
        
        let level = 'low';
        if (totalScore >= this.scoring.high.min) level = 'high';
        else if (totalScore >= this.scoring.moderate.min) level = 'moderate';
        
        const levelData = this.scoring[level];
        
        const resultsHTML = `
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
                    background: ${levelData.color};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: white;
                    margin: 0 auto 2rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                ">${totalScore}</div>
                
                <h2 style="color: ${levelData.color}; margin-bottom: 1rem; font-size: 2rem;">${levelData.level}</h2>
                <p style="color: #6B7280; margin-bottom: 2rem; line-height: 1.6; font-size: 1.1rem;">
                    <strong>${this.quizName}</strong><br>
                    Your assessment score: <strong>${totalScore}</strong> out of ${this.questions.length * 3}<br><br>
                    ${level === 'high' ? 'We recommend consulting with a healthcare professional for a proper evaluation.' : 
                      level === 'moderate' ? 'Monitor your symptoms and consider medical advice if they worsen or persist.' :
                      'Your symptoms appear minimal. Continue monitoring and maintain healthy lifestyle practices.'}
                </p>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" style="
                        padding: 1rem 2rem;
                        background: #F3F4F6;
                        border: 2px solid #D1D5DB;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        color: #374151;
                    ">Take Assessment Again</button>
                    <button onclick="window.location.href='/'" style="
                        padding: 1rem 2rem;
                        background: #3B82F6;
                        border: 2px solid #3B82F6;
                        border-radius: 8px;
                        color: white;
                        cursor: pointer;
                        font-weight: 600;
                    ">Explore More Tools</button>
                </div>
            </div>
        `;
        
        document.querySelector('.quiz-content').innerHTML = resultsHTML;
    }
}

// Initialize quiz
let quiz;
document.addEventListener('DOMContentLoaded', function() {
    quiz = new SymptomChecker();
});
