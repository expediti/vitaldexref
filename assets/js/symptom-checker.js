/**
 * VitalDex - Enhanced Glassmorphism Symptom Checker Quiz Engine
 * Handles quiz functionality with beautiful glass effects and smooth animations
 */

class SymptomChecker {
    constructor(toolName) {
        this.toolName = toolName;
        this.quizData = null;
        this.currentQuestion = 0;
        this.answers = {};
        this.totalScore = 0;
        this.isQuizCompleted = false;
        this.animationDuration = 600;
        this.glassEffects = {
            enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            intensity: this.getGlassIntensity()
        };
        this.init();
    }

    /**
     * Determine glass effect intensity based on device capability
     */
    getGlassIntensity() {
        const isLowEndDevice = navigator.hardwareConcurrency <= 4 || 
                              navigator.connection?.effectiveType === 'slow-2g' ||
                              navigator.connection?.effectiveType === '2g';
        return isLowEndDevice ? 'low' : 'high';
    }

    async init() {
        try {
            this.showGlassLoadingState();
            await this.loadQuizData();
            this.setupGlassmorphismEnvironment();
            this.setupEventListeners();
            await this.showQuestion(0);
            this.updateProgress();
            this.hideGlassLoadingState();
            console.log(`${this.toolName} glassmorphism quiz initialized`);
        } catch (error) {
            console.error('Quiz initialization failed:', error);
            this.hideGlassLoadingState();
            this.showError('Failed to load quiz data. Please refresh the page.');
        }
    }

    /**
     * Setup glassmorphism environment and effects
     */
    setupGlassmorphismEnvironment() {
        // Add glass classes to quiz elements
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer) {
            quizContainer.classList.add('glass-quiz-container');
            quizContainer.style.cssText += `
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(${this.glassEffects.intensity === 'high' ? '25px' : '15px'});
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 24px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                position: relative;
                overflow: hidden;
            `;

            // Add floating glass particles for enhanced effect
            if (this.glassEffects.enabled && this.glassEffects.intensity === 'high') {
                this.createQuizGlassParticles(quizContainer);
            }
        }

        // Style progress bar with glassmorphism
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.cssText += `
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                overflow: hidden;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
            `;
        }

        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.cssText += `
                background: linear-gradient(90deg, 
                    rgba(100, 181, 246, 0.8) 0%, 
                    rgba(33, 150, 243, 0.9) 50%, 
                    rgba(100, 181, 246, 0.8) 100%);
                box-shadow: 0 2px 8px rgba(100, 181, 246, 0.3);
                transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            `;
        }
    }

    /**
     * Create floating glass particles for quiz
     */
    createQuizGlassParticles(container) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'quiz-glass-particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1});
                border-radius: 50%;
                animation: quizParticleFloat ${Math.random() * 15 + 10}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particleContainer.appendChild(particle);
        }

        // Add particle animation
        if (!document.getElementById('quiz-particle-styles')) {
            const style = document.createElement('style');
            style.id = 'quiz-particle-styles';
            style.textContent = `
                @keyframes quizParticleFloat {
                    0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-50px) translateX(25px) rotate(180deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        container.appendChild(particleContainer);
    }

    /**
     * Show glass loading state
     */
    showGlassLoadingState() {
        const quizContainer = document.querySelector('.quiz-container');
        if (!quizContainer) return;

        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'glass-quiz-loading';
        loadingOverlay.innerHTML = `
            <div class="glass-loading-spinner"></div>
            <p style="color: white; margin-top: 1rem; font-weight: 600;">Loading ${this.toolName}...</p>
        `;
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            border-radius: 24px;
        `;

        quizContainer.appendChild(loadingOverlay);
    }

    /**
     * Hide glass loading state
     */
    hideGlassLoadingState() {
        const loadingOverlay = document.querySelector('.glass-quiz-loading');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 300);
        }
    }

    async loadQuizData() {
        try {
            const response = await fetch('./quiz-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.quizData = await response.json();

            // Validate quiz data
            if (!this.quizData || !this.quizData.questions || this.quizData.questions.length === 0) {
                throw new Error('Invalid quiz data structure');
            }
        } catch (error) {
            console.error('Error loading quiz data:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Enhanced navigation buttons with glassmorphism
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            this.enhanceGlassButton(prevBtn);
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            this.enhanceGlassButton(nextBtn);
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.quiz-content')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        if (this.currentQuestion > 0) {
                            this.addKeyboardFeedback('previous');
                            this.previousQuestion();
                        }
                        break;
                    case 'ArrowRight':
                        if (this.canProceed()) {
                            this.addKeyboardFeedback('next');
                            this.nextQuestion();
                        }
                        break;
                    case 'Enter':
                        if (this.canProceed()) {
                            this.addKeyboardFeedback('enter');
                            this.nextQuestion();
                        }
                        break;
                }
            }
        });

        // Enhanced answer selection with glass effects
        document.addEventListener('click', (e) => {
            if (e.target.closest('.answer-btn')) {
                this.selectAnswer(e.target.closest('.answer-btn'));
            }
            if (e.target.closest('.scale-btn')) {
                this.selectScaleAnswer(e.target.closest('.scale-btn'));
            }
        });

        // Restart quiz with glass transition
        document.addEventListener('click', (e) => {
            if (e.target.closest('.restart-quiz')) {
                e.preventDefault();
                this.restartQuizWithGlassTransition();
            }
        });
    }

    /**
     * Enhance button with glassmorphism effects
     */
    enhanceGlassButton(button) {
        button.style.cssText += `
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        `;

        // Add shimmer effect on hover
        button.addEventListener('mouseenter', function() {
            if (window.matchMedia('(hover: hover)').matches) {
                this.style.background = 'rgba(255, 255, 255, 0.25)';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }
        });

        button.addEventListener('mouseleave', function() {
            if (window.matchMedia('(hover: hover)').matches) {
                this.style.background = 'rgba(255, 255, 255, 0.15)';
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });

        // Touch feedback for mobile
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.96)';
        }, { passive: true });

        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
    }

    /**
     * Add keyboard interaction feedback
     */
    addKeyboardFeedback(action) {
        const quizContainer = document.querySelector('.quiz-container');
        if (!quizContainer) return;

        const feedback = document.createElement('div');
        feedback.className = 'keyboard-feedback';
        feedback.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(100, 181, 246, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(100, 181, 246, 0.4);
            border-radius: 8px;
            padding: 8px 12px;
            color: white;
            font-size: 0.8rem;
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
        `;

        const actionText = {
            'previous': '← Previous',
            'next': '→ Next',
            'enter': '✓ Continue'
        };

        feedback.textContent = actionText[action] || action;
        quizContainer.appendChild(feedback);

        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'scale(1)';
        });

        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 1500);
    }

    async showQuestion(index) {
        if (!this.quizData || index >= this.quizData.questions.length) {
            return;
        }

        const currentQuestionElement = document.querySelector('.question.active');
        
        // Animate out current question
        if (currentQuestionElement && this.glassEffects.enabled) {
            await this.animateQuestionOut(currentQuestionElement);
        }

        // Hide all questions
        document.querySelectorAll('.question').forEach(q => {
            q.classList.remove('active');
        });

        // Show new question
        let questionElement = document.querySelector(`.question[data-question="${index + 1}"]`);
        if (questionElement) {
            questionElement.classList.add('active');
            if (this.glassEffects.enabled) {
                await this.animateQuestionIn(questionElement);
            }
        } else {
            // Generate question dynamically
            questionElement = this.generateQuestion(index);
            if (this.glassEffects.enabled) {
                await this.animateQuestionIn(questionElement);
            }
        }

        // Focus management for accessibility
        const firstAnswer = questionElement?.querySelector('.answer-btn, .scale-btn');
        if (firstAnswer) {
            setTimeout(() => firstAnswer.focus(), 200);
        }

        this.updateProgress();
        this.updateNavigationButtons();
    }

    /**
     * Animate question out with glass effects
     */
    animateQuestionOut(element) {
        return new Promise(resolve => {
            element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.transform = 'translateX(-30px) scale(0.95)';
            element.style.opacity = '0';
            element.style.filter = 'blur(5px)';

            setTimeout(resolve, 400);
        });
    }

    /**
     * Animate question in with glass effects
     */
    animateQuestionIn(element) {
        return new Promise(resolve => {
            // Set initial state
            element.style.transform = 'translateX(30px) scale(0.95)';
            element.style.opacity = '0';
            element.style.filter = 'blur(5px)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

            requestAnimationFrame(() => {
                element.style.transform = 'translateX(0) scale(1)';
                element.style.opacity = '1';
                element.style.filter = 'blur(0px)';
            });

            setTimeout(resolve, 600);
        });
    }

    generateQuestion(index) {
        const question = this.quizData.questions[index];
        const quizContent = document.querySelector('.quiz-content');
        if (!quizContent || !question) return null;

        // Clear existing questions
        quizContent.innerHTML = '';

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question active glass-question';
        questionDiv.setAttribute('data-question', index + 1);

        // Apply glassmorphism to question container
        questionDiv.style.cssText = `
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            position: relative;
            overflow: hidden;
        `;

        let optionsHTML = '';
        if (question.type === 'scale') {
            optionsHTML = `
                <div class="scale-options">
                    ${Array.from({length: question.scale || 5}, (_, i) => {
                        const value = i + 1;
                        return `
                            <button class="scale-btn glass-scale-btn" 
                                    data-value="${value}" 
                                    data-weight="${value}"
                                    aria-label="Scale option ${value}">
                                ${value}
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
        } else {
            optionsHTML = question.options.map(option => `
                <button class="answer-btn glass-answer-btn" 
                        data-value="${option.value}" 
                        data-weight="${option.weight}"
                        aria-label="${option.text}">
                    <span class="icon">${option.icon || '•'}</span>
                    <span class="text">${option.text}</span>
                </button>
            `).join('');
        }

        questionDiv.innerHTML = `
            <h3 class="question-title">${question.question}</h3>
            ${question.description ? `<p class="question-description">${question.description}</p>` : ''}
            <div class="answer-options">
                ${optionsHTML}
            </div>
        `;

        quizContent.appendChild(questionDiv);

        // Apply glassmorphism to answer buttons
        this.applyGlassEffectsToAnswerButtons(questionDiv);

        return questionDiv;
    }

    /**
     * Apply glassmorphism effects to answer buttons
     */
    applyGlassEffectsToAnswerButtons(container) {
        const buttons = container.querySelectorAll('.answer-btn, .scale-btn');
        
        buttons.forEach((button, index) => {
            // Apply glass styling
            button.style.cssText += `
                background: rgba(255, 255, 255, 0.08);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.9);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                animation-delay: ${index * 0.1}s;
            `;

            // Add staggered entrance animation
            if (this.glassEffects.enabled) {
                button.style.opacity = '0';
                button.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    button.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                }, index * 100);
            }

            // Enhanced hover effects
            button.addEventListener('mouseenter', function() {
                if (window.matchMedia('(hover: hover)').matches) {
                    this.style.background = 'rgba(255, 255, 255, 0.15)';
                    this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    this.style.transform = 'translateY(-2px) scale(1.02)';
                    this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }
            });

            button.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected') && window.matchMedia('(hover: hover)').matches) {
                    this.style.background = 'rgba(255, 255, 255, 0.08)';
                    this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    this.style.transform = '';
                    this.style.boxShadow = '';
                }
            });

            // Touch feedback
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.96)';
            }, { passive: true });

            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    if (!this.classList.contains('selected')) {
                        this.style.transform = '';
                    }
                }, 150);
            }, { passive: true });
        });
    }

    selectAnswer(button) {
        if (!button) return;

        const questionDiv = button.closest('.question');
        const questionIndex = parseInt(questionDiv.dataset.question) - 1;

        // Animate selection with glass effects
        this.animateAnswerSelection(button, questionDiv);

        // Clear previous selections
        questionDiv.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-selected', 'false');
            if (btn !== button) {
                btn.style.background = 'rgba(255, 255, 255, 0.08)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                btn.style.transform = '';
                btn.style.boxShadow = '';
            }
        });

        // Select current answer with enhanced glass effect
        button.classList.add('selected');
        button.setAttribute('aria-selected', 'true');
        button.style.background = 'rgba(100, 181, 246, 0.2)';
        button.style.borderColor = 'rgba(100, 181, 246, 0.5)';
        button.style.color = 'white';
        button.style.boxShadow = '0 8px 25px rgba(100, 181, 246, 0.3)';

        // Store answer
        const value = button.dataset.value;
        const weight = parseInt(button.dataset.weight) || 0;
        this.answers[questionIndex] = {
            value: value,
            weight: weight,
            text: button.querySelector('.text')?.textContent || value
        };

        // Update navigation with animation
        this.updateNavigationButtons();

        // Auto-advance with enhanced timing
        if (this.quizData.autoAdvance !== false) {
            setTimeout(() => {
                if (this.canProceed()) {
                    this.nextQuestion();
                }
            }, 1200);
        }

        // Enhanced screen reader announcement
        this.announceToScreenReader(`Selected: ${this.answers[questionIndex].text}. ${this.canProceed() ? 'You can now proceed to the next question.' : ''}`);

        // Track interaction
        this.trackGlassInteraction('answer_selected', {
            question: questionIndex + 1,
            answer: value,
            weight: weight
        });
    }

    selectScaleAnswer(button) {
        if (!button) return;

        const questionDiv = button.closest('.question');
        const questionIndex = parseInt(questionDiv.dataset.question) - 1;

        // Animate selection
        this.animateScaleSelection(button, questionDiv);

        // Clear previous selections
        questionDiv.querySelectorAll('.scale-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-selected', 'false');
            if (btn !== button) {
                btn.style.background = 'rgba(255, 255, 255, 0.08)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                btn.style.transform = '';
            }
        });

        // Select current answer
        button.classList.add('selected');
        button.setAttribute('aria-selected', 'true');
        button.style.background = 'rgba(100, 181, 246, 0.2)';
        button.style.borderColor = 'rgba(100, 181, 246, 0.5)';
        button.style.color = 'white';
        button.style.transform = 'scale(1.1)';

        // Store answer
        const value = button.dataset.value;
        const weight = parseInt(button.dataset.weight) || parseInt(value) || 0;
        this.answers[questionIndex] = {
            value: value,
            weight: weight,
            text: `Scale: ${value}`
        };

        this.updateNavigationButtons();
        this.announceToScreenReader(`Selected scale value: ${value}`);

        // Track interaction
        this.trackGlassInteraction('scale_selected', {
            question: questionIndex + 1,
            scale_value: value,
            weight: weight
        });
    }

    /**
     * Animate answer selection with glass effects
     */
    animateAnswerSelection(button, questionDiv) {
        if (!this.glassEffects.enabled) return;

        // Create selection ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(100, 181, 246, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: glassRipple 0.6s ease-out;
        `;

        button.appendChild(ripple);

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glassRipple {
                0% { width: 0; height: 0; opacity: 1; }
                100% { width: 200px; height: 200px; opacity: 0; }
            }
        `;
        if (!document.getElementById('glass-ripple-style')) {
            style.id = 'glass-ripple-style';
            document.head.appendChild(style);
        }

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    /**
     * Animate scale selection
     */
    animateScaleSelection(button, questionDiv) {
        if (!this.glassEffects.enabled) return;

        // Create scale selection wave effect
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(100, 181, 246, 0.2), transparent);
            pointer-events: none;
            animation: scaleWave 0.5s ease-out;
        `;

        button.appendChild(wave);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes scaleWave {
                0% { transform: translateX(-100%) skewX(-45deg); }
                100% { transform: translateX(200%) skewX(-45deg); }
            }
        `;
        if (!document.getElementById('scale-wave-style')) {
            style.id = 'scale-wave-style';
            document.head.appendChild(style);
        }

        setTimeout(() => {
            if (wave.parentNode) {
                wave.parentNode.removeChild(wave);
            }
        }, 500);
    }

    nextQuestion() {
        if (!this.canProceed()) return;

        if (this.currentQuestion < this.quizData.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
        } else {
            this.completeQuizWithGlassTransition();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
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
            
            // Animate progress with glass effect
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.quizData.questions.length}`;

            // Add progress milestone effects
            if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
                this.showProgressMilestone(progress);
            }
        }
    }

    /**
     * Show progress milestone with glass effects
     */
    showProgressMilestone(progress) {
        if (!this.glassEffects.enabled) return;

        const milestone = document.createElement('div');
        milestone.className = 'progress-milestone';
        milestone.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(100, 181, 246, 0.2);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(100, 181, 246, 0.4);
            border-radius: 16px;
            padding: 2rem;
            color: white;
            font-weight: 700;
            text-align: center;
            z-index: 10000;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        const milestoneText = {
            25: '🎯 25% Complete!',
            50: '⚡ Halfway There!',
            75: '🚀 Almost Done!',
            100: '🎉 Complete!'
        };

        milestone.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${milestoneText[progress].split(' ')[0]}</div>
            <div style="font-size: 1.2rem;">${milestoneText[progress].substring(2)}</div>
        `;

        document.body.appendChild(milestone);

        requestAnimationFrame(() => {
            milestone.style.opacity = '1';
            milestone.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        setTimeout(() => {
            milestone.style.opacity = '0';
            milestone.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                if (milestone.parentNode) {
                    milestone.parentNode.removeChild(milestone);
                }
            }, 400);
        }, 2000);
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
                nextBtn.innerHTML = `
                    <span style="margin-right: 8px;">🎯</span>
                    Get Results
                `;
            } else {
                nextBtn.innerHTML = `
                    Next
                    <span style="margin-left: 8px;">→</span>
                `;
            }
        }
    }

    calculateScore() {
        this.totalScore = 0;
        Object.values(this.answers).forEach(answer => {
            this.totalScore += answer.weight;
        });
        return this.totalScore;
    }

    getResultLevel() {
        const score = this.calculateScore();
        const scoring = this.quizData.scoring;

        if (score <= scoring.low.max) {
            return 'low';
        } else if (score <= scoring.moderate.max) {
            return 'moderate';
        } else {
            return 'high';
        }
    }

    /**
     * Complete quiz with glass transition effects
     */
    async completeQuizWithGlassTransition() {
        this.isQuizCompleted = true;
        const score = this.calculateScore();
        const level = this.getResultLevel();

        // Show completion loading state
        this.showGlassLoadingState();
        
        // Simulate processing time for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Hide quiz with glass transition
        const quizContainer = document.querySelector('.quiz-container');
        if (quizContainer && this.glassEffects.enabled) {
            quizContainer.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            quizContainer.style.transform = 'scale(0.95) translateY(-20px)';
            quizContainer.style.opacity = '0';
            quizContainer.style.filter = 'blur(10px)';
        }

        setTimeout(() => {
            quizContainer.style.display = 'none';
            this.showGlassResults(score, level);
        }, 800);

        // Track completion
        this.trackGlassInteraction('quiz_completed', {
            tool: this.toolName,
            score: score,
            level: level,
            answers_count: Object.keys(this.answers).length,
            completion_time: Date.now()
        });
    }

    /**
     * Show results with enhanced glass effects
     */
    showGlassResults(score, level) {
        const resultsSection = document.getElementById('resultsSection');
        if (!resultsSection) return;

        // Apply glassmorphism to results
        resultsSection.style.cssText += `
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            padding: 3rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            position: relative;
            overflow: hidden;
        `;

        resultsSection.style.display = 'block';
        this.displayResults(score, level);

        // Animate results in
        if (this.glassEffects.enabled) {
            resultsSection.style.opacity = '0';
            resultsSection.style.transform = 'scale(0.9) translateY(30px)';
            resultsSection.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

            requestAnimationFrame(() => {
                resultsSection.style.opacity = '1';
                resultsSection.style.transform = 'scale(1) translateY(0)';
            });
        }

        // Scroll to results with smooth behavior
        setTimeout(() => {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 400);

        // Announce completion
        this.announceToScreenReader(`Quiz completed successfully. Your ${this.toolName} risk level is ${level} with a score of ${score}. Please review your detailed results below.`);
    }

    displayResults(score, level) {
        const scoring = this.quizData.scoring[level];
        const recommendations = this.quizData.recommendations[level];

        // Enhanced score display with glass effects
        const scoreNumber = document.querySelector('.score-number');
        const scoreLabel = document.querySelector('.score-label');
        const riskLevel = document.querySelector('.risk-level');

        if (scoreNumber) {
            scoreNumber.textContent = score;
            scoreNumber.style.cssText += `
                background: linear-gradient(135deg, rgba(100, 181, 246, 0.2), rgba(33, 150, 243, 0.2));
                backdrop-filter: blur(10px);
                border: 1px solid rgba(100, 181, 246, 0.3);
                border-radius: 50%;
                width: 120px;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
                font-size: 2.5rem;
                font-weight: 800;
                color: white;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            `;
        }

        if (scoreLabel) {
            scoreLabel.textContent = 'Risk Score';
            scoreLabel.style.color = 'rgba(255, 255, 255, 0.9)';
        }

        if (riskLevel) {
            riskLevel.textContent = scoring.level;
            riskLevel.className = `risk-level ${level}`;
            riskLevel.style.cssText += `
                background: rgba(${this.getLevelColor(level)}, 0.2);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(${this.getLevelColor(level)}, 0.4);
                border-radius: 20px;
                padding: 0.5rem 1rem;
                display: inline-block;
                margin-top: 1rem;
                color: white;
                font-weight: 700;
            `;
        }

        // Enhanced recommendations with glass cards
        const recommendationsList = document.querySelector('.result-interpretation ul');
        if (recommendationsList && recommendations) {
            recommendationsList.innerHTML = recommendations.map((rec, index) => `
                <li style="
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    border-left: 4px solid rgba(100, 181, 246, 0.6);
                    animation: fadeInUp 0.6s ease-out ${index * 0.1}s both;
                    transition: all 0.3s ease;
                " onmouseenter="this.style.background='rgba(255, 255, 255, 0.12)'; this.style.transform='translateX(8px)';" onmouseleave="this.style.background='rgba(255, 255, 255, 0.08)'; this.style.transform='';">
                    <span style="color: rgba(255, 255, 255, 0.9); line-height: 1.6;">${rec}</span>
                </li>
            `).join('');
        }

        // Add restart button with glass effect
        const restartButton = document.querySelector('.restart-quiz');
        if (restartButton) {
            this.enhanceGlassButton(restartButton);
        }
    }

    /**
     * Get color values for different risk levels
     */
    getLevelColor(level) {
        const colors = {
            'low': '76, 175, 80',     // Green
            'moderate': '255, 152, 0', // Orange  
            'high': '244, 67, 54'      // Red
        };
        return colors[level] || '100, 181, 246';
    }

    /**
     * Restart quiz with glass transition
     */
    restartQuizWithGlassTransition() {
        // Reset state
        this.currentQuestion = 0;
        this.answers = {};
        this.totalScore = 0;
        this.isQuizCompleted = false;

        // Hide results with glass transition
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection && this.glassEffects.enabled) {
            resultsSection.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            resultsSection.style.transform = 'scale(0.95) translateY(20px)';
            resultsSection.style.opacity = '0';
            resultsSection.style.filter = 'blur(5px)';
        }

        setTimeout(() => {
            resultsSection.style.display = 'none';
            
            // Show quiz with glass transition
            const quizContainer = document.querySelector('.quiz-container');
            quizContainer.style.display = 'block';
            
            if (this.glassEffects.enabled) {
                quizContainer.style.transform = 'scale(0.95) translateY(20px)';
                quizContainer.style.opacity = '0';
                quizContainer.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                requestAnimationFrame(() => {
                    quizContainer.style.transform = 'scale(1) translateY(0)';
                    quizContainer.style.opacity = '1';
                    quizContainer.style.filter = 'blur(0px)';
                });
            }

            // Restart quiz
            this.showQuestion(0);
            this.updateProgress();
            
            // Scroll to quiz
            setTimeout(() => {
                quizContainer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);

            this.announceToScreenReader('Quiz restarted. You are now at the first question.');
        }, 600);

        // Track restart
        this.trackGlassInteraction('quiz_restarted', {
            tool: this.toolName,
            timestamp: Date.now()
        });
    }

    /**
     * Enhanced error display with glassmorphism
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'glass-error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 67, 54, 0.2);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(244, 67, 54, 0.4);
            border-radius: 16px;
            padding: 2rem;
            color: white;
            text-align: center;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(244, 67, 54, 0.2);
        `;

        errorDiv.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
            <h3 style="margin-bottom: 1rem; color: white;">Error</h3>
            <p style="margin-bottom: 2rem; color: rgba(255, 255, 255, 0.9);">${message}</p>
            <button onclick="location.reload()" style="
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                color: white;
                padding: 0.8rem 1.5rem;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                Refresh Page
            </button>
        `;

        document.body.appendChild(errorDiv);
    }

    /**
     * Enhanced screen reader announcements
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = `
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        `;
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    /**
     * Track glassmorphism interactions
     */
    trackGlassInteraction(eventName, data) {
        try {
            const event = {
                event: eventName,
                data: {
                    ...data,
                    tool_name: this.toolName,
                    glassmorphism_enabled: this.glassEffects.enabled,
                    glass_intensity: this.glassEffects.intensity,
                    timestamp: new Date().toISOString()
                }
            };

            // Store locally
            const events = JSON.parse(localStorage.getItem('vitaldx_glass_quiz_events') || '[]');
            events.push(event);
            
            if (events.length > 50) {
                events.splice(0, events.length - 50);
            }
            
            localStorage.setItem('vitaldx_glass_quiz_events', JSON.stringify(events));

            // Send to analytics if available
            if (window.VitalDex && window.VitalDex.trackEvent) {
                window.VitalDx.trackEvent(eventName, event.data);
            }
        } catch (e) {
            console.log('Glass interaction tracking disabled');
        }
    }
}

// Enhanced initialization with glassmorphism support
document.addEventListener('DOMContentLoaded', function() {
    // Get tool name from page or URL
    const toolName = document.querySelector('[data-tool]')?.dataset.tool || 
                     window.location.pathname.split('/').filter(Boolean).pop() || 
                     'health-check';

    // Initialize glassmorphism symptom checker
    const symptomChecker = new SymptomChecker(toolName);
    
    // Make globally available for debugging
    window.GlassSymptomChecker = symptomChecker;
    
    console.log('Glassmorphism Symptom Checker initialized for:', toolName);
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
