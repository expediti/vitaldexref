/**
 * VitalDex - Enhanced Glassmorphism JavaScript
 * Handles dynamic tool loading, glass effects, and modern interactions
 */

(function() {
    'use strict';

    // Global app state
    const app = {
        toolsConfig: null,
        intersectionObserver: null,
        isLoadingTools: false
    };

    // DOM Content Loaded Event
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    /**
     * Initialize the application with glassmorphism enhancements
     */
    async function initializeApp() {
        // Initialize glassmorphism effects first
        initializeGlassmorphismEffects();
        
        // Load and display tools dynamically
        await loadAndDisplayTools();
        
        // Setup core functionality
        setupMobileNavigation();
        setupSmoothScrolling();
        setupScrollAnimations();
        setupGlassCardInteractions();
        setupAnalytics();
        setupPerformanceOptimizations();
        setupAccessibilityEnhancements();
        setupGlassLoadingStates();
        
        console.log('VitalDex glassmorphism system initialized successfully');
    }

    /**
     * Initialize glassmorphism visual effects
     */
    function initializeGlassmorphismEffects() {
        // Add glass element class to key components
        const glassElements = document.querySelectorAll('.tool-card, .feature-card, .blog-card, .main-header');
        glassElements.forEach(element => {
            element.classList.add('glass-element');
        });

        // Create floating background particles
        createFloatingParticles();
        
        // Setup dynamic backdrop blur based on scroll
        setupDynamicBackdropBlur();
    }

    /**
     * Create floating particles for enhanced glassmorphism effect
     */
    function createFloatingParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'glass-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                animation: floatParticle ${Math.random() * 20 + 15}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particleContainer.appendChild(particle);
        }

        // Add particle animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) translateX(50px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(particleContainer);
    }

    /**
     * Dynamic tool loading from tools-config.json
     */
    async function loadAndDisplayTools() {
        try {
            app.isLoadingTools = true;
            showGlassLoadingSpinner();

            // Try to load tools config
            const response = await fetch('/tools-config.json');
            if (!response.ok) {
                console.log('No tools-config.json found, using existing HTML structure');
                hideGlassLoadingSpinner();
                return;
            }

            app.toolsConfig = await response.json();
            
            // Generate tool cards
            const toolsGrid = document.querySelector('.tools-grid');
            if (toolsGrid && app.toolsConfig.tools) {
                toolsGrid.innerHTML = ''; // Clear existing
                
                app.toolsConfig.tools.forEach((tool, index) => {
                    const toolCard = createGlassToolCard(tool, index);
                    toolsGrid.appendChild(toolCard);
                });

                // Add staggered animation for new tools
                animateToolsOnLoad();
            }

        } catch (error) {
            console.log('Using existing tool structure:', error);
        } finally {
            app.isLoadingTools = false;
            hideGlassLoadingSpinner();
        }
    }

    /**
     * Create glassmorphism tool card
     */
    function createGlassToolCard(tool, index) {
        const card = document.createElement('div');
        card.className = 'tool-card glass-element fade-in-on-scroll';
        card.setAttribute('data-tool', tool.id);
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="tool-category">${tool.category || 'Health'}</div>
            <div class="tool-icon">${tool.icon || '⚕️'}</div>
            <div class="tool-content">
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
                <div class="tool-meta">
                    <div class="tool-meta-item">
                        <span class="meta-icon">📝</span>
                        <span class="meta-label">Questions</span>
                        <span class="meta-value">${tool.questions || 10}</span>
                    </div>
                    <div class="tool-meta-item">
                        <span class="meta-icon">⏱️</span>
                        <span class="meta-label">Duration</span>
                        <span class="meta-value">${tool.estimatedTime || '3-5 min'}</span>
                    </div>
                </div>
            </div>
            <div class="tool-action">
                <a href="/tools/${tool.id}/" class="start-quiz-btn" aria-label="Start ${tool.name} health check">
                    Start Check
                </a>
            </div>
        `;

        // Add enhanced interactions
        setupToolCardInteractions(card);
        
        return card;
    }

    /**
     * Setup enhanced tool card interactions
     */
    function setupToolCardInteractions(card) {
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            if (!window.matchMedia('(hover: none)').matches) {
                this.style.transform = 'translateY(-12px) scale(1.03)';
                this.style.background = 'rgba(255, 255, 255, 0.18)';
            }
        });

        card.addEventListener('mouseleave', function() {
            if (!window.matchMedia('(hover: none)').matches) {
                this.style.transform = '';
                this.style.background = '';
            }
        });

        // Touch interactions for mobile
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
    }

    /**
     * Animate tools on load with stagger
     */
    function animateToolsOnLoad() {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Enhanced mobile navigation with glassmorphism
     */
    function setupMobileNavigation() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            // Add glass effect to mobile menu
            navMenu.style.cssText += `
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            `;

            mobileToggle.addEventListener('click', function() {
                const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                
                // Enhanced glass menu toggle
                navMenu.classList.toggle('active');
                mobileToggle.setAttribute('aria-expanded', !isExpanded);
                mobileToggle.classList.toggle('active');
                document.body.classList.toggle('nav-open', !isExpanded);

                // Animate menu with glass effect
                if (!isExpanded) {
                    navMenu.style.transform = 'translateY(-10px)';
                    navMenu.style.opacity = '0';
                    requestAnimationFrame(() => {
                        navMenu.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                        navMenu.style.transform = 'translateY(0)';
                        navMenu.style.opacity = '1';
                    });
                }
            });

            // Close menu with smooth animation
            const closeMenu = () => {
                navMenu.style.transform = 'translateY(-10px)';
                navMenu.style.opacity = '0';
                
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }, 200);
            };

            // Enhanced menu link interactions
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach((link, index) => {
                // Add staggered animation
                link.style.animationDelay = `${index * 50}ms`;
                
                link.addEventListener('click', closeMenu);
                
                // Glass hover effect
                link.addEventListener('mouseenter', function() {
                    this.style.background = 'rgba(255, 255, 255, 0.2)';
                    this.style.transform = 'translateX(8px)';
                });
                
                link.addEventListener('mouseleave', function() {
                    this.style.background = '';
                    this.style.transform = '';
                });
            });

            // Close on outside click
            document.addEventListener('click', function(event) {
                const isClickInsideNav = navMenu.contains(event.target);
                const isClickOnToggle = mobileToggle.contains(event.target);
                
                if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            });
        }
    }

    /**
     * Setup scroll-triggered animations for glassmorphism elements
     */
    function setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
            app.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        
                        // Add glassmorphism effect on scroll
                        if (entry.target.classList.contains('tool-card')) {
                            setTimeout(() => {
                                entry.target.style.background = 'rgba(255, 255, 255, 0.12)';
                                entry.target.style.backdropFilter = 'blur(25px)';
                            }, 300);
                        }
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe glassmorphism elements
            const animatedElements = document.querySelectorAll('.tool-card, .feature-card, .blog-card, .fade-in-on-scroll, .scale-in-on-scroll');
            animatedElements.forEach(element => {
                element.classList.add('fade-in-on-scroll');
                app.intersectionObserver.observe(element);
            });
        }
    }

    /**
     * Setup dynamic backdrop blur based on scroll position
     */
    function setupDynamicBackdropBlur() {
        let ticking = false;

        function updateBlur() {
            const scrollY = window.pageYOffset;
            const maxScroll = 200;
            const blurAmount = Math.min(scrollY / maxScroll * 25, 25);
            
            const header = document.querySelector('.main-header');
            if (header) {
                header.style.backdropFilter = `blur(${15 + blurAmount}px)`;
                header.style.background = `rgba(255, 255, 255, ${0.1 + (scrollY / maxScroll * 0.05)})`;
            }
            
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateBlur);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Glass card interactions for existing cards
     */
    function setupGlassCardInteractions() {
        const cards = document.querySelectorAll('.tool-card, .feature-card, .blog-card');
        
        cards.forEach(card => {
            // Skip if already setup (for dynamically created cards)
            if (card.hasAttribute('data-glass-setup')) return;
            card.setAttribute('data-glass-setup', 'true');

            // Enhanced glass hover effect
            card.addEventListener('mouseenter', function(e) {
                if (window.matchMedia('(hover: hover)').matches) {
                    this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    this.style.background = 'rgba(255, 255, 255, 0.15)';
                    this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(255, 255, 255, 0.1)';
                }
            });

            card.addEventListener('mouseleave', function(e) {
                if (window.matchMedia('(hover: hover)').matches) {
                    this.style.transform = '';
                    this.style.background = '';
                    this.style.borderColor = '';
                    this.style.boxShadow = '';
                }
            });

            // Touch feedback for mobile
            card.addEventListener('touchstart', function(e) {
                this.style.transform = 'scale(0.98)';
                this.style.background = 'rgba(255, 255, 255, 0.15)';
            }, { passive: true });

            card.addEventListener('touchend', function(e) {
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.background = '';
                }, 150);
            }, { passive: true });
        });
    }

    /**
     * Glass loading spinner
     */
    function showGlassLoadingSpinner() {
        const existingSpinner = document.querySelector('.glass-loading-overlay');
        if (existingSpinner) return;

        const overlay = document.createElement('div');
        overlay.className = 'glass-loading-overlay';
        overlay.innerHTML = `
            <div class="glass-loading-spinner"></div>
            <p style="color: white; margin-top: 1rem; font-weight: 600;">Loading health tools...</p>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    function hideGlassLoadingSpinner() {
        const overlay = document.querySelector('.glass-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    /**
     * Glass loading states for various elements
     */
    function setupGlassLoadingStates() {
        // Add loading state to buttons
        document.addEventListener('click', function(e) {
            if (e.target.matches('.start-quiz-btn, .btn-primary')) {
                const button = e.target;
                const originalText = button.textContent;
                
                button.style.opacity = '0.7';
                button.innerHTML = '<span class="glass-loading-spinner" style="width: 20px; height: 20px; margin-right: 8px;"></span>Loading...';
                
                // Reset after navigation (fallback)
                setTimeout(() => {
                    button.style.opacity = '';
                    button.textContent = originalText;
                }, 2000);
            }
        });
    }

    /**
     * Enhanced smooth scrolling with glassmorphism effects
     */
    function setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Add glass highlight effect to target
                    targetElement.style.transition = 'all 0.3s ease';
                    targetElement.style.background = 'rgba(100, 181, 246, 0.1)';
                    targetElement.style.borderRadius = '12px';
                    
                    const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Remove highlight after scroll
                    setTimeout(() => {
                        targetElement.style.background = '';
                        targetElement.style.borderRadius = '';
                    }, 1500);
                    
                    targetElement.focus();
                }
            });
        });
    }

    /**
     * Enhanced analytics with glassmorphism interaction tracking
     */
    function setupAnalytics() {
        // Track glassmorphism tool interactions
        document.addEventListener('click', function(e) {
            if (e.target.closest('.tool-card')) {
                const toolCard = e.target.closest('.tool-card');
                const toolName = toolCard.querySelector('h3')?.textContent || 'Unknown';
                const toolId = toolCard.getAttribute('data-tool');
                
                trackEvent('glassmorphism_tool_click', {
                    tool_name: toolName,
                    tool_id: toolId,
                    interaction_type: 'click',
                    timestamp: new Date().toISOString()
                });
            }
            
            if (e.target.closest('.blog-card')) {
                const blogCard = e.target.closest('.blog-card');
                const articleTitle = blogCard.querySelector('h3')?.textContent || 'Unknown';
                
                trackEvent('glassmorphism_blog_click', {
                    article_title: articleTitle,
                    interaction_type: 'click',
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Track scroll depth with glassmorphism elements
        let maxScroll = 0;
        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    trackEvent('scroll_depth', {
                        percentage: maxScroll,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }, { passive: true });
    }

    /**
     * Enhanced performance optimizations for glassmorphism
     */
    function setupPerformanceOptimizations() {
        // Optimize glassmorphism effects based on device capability
        const isLowEndDevice = navigator.hardwareConcurrency <= 4 || 
                              navigator.connection?.effectiveType === 'slow-2g' ||
                              navigator.connection?.effectiveType === '2g';

        if (isLowEndDevice) {
            document.documentElement.style.setProperty('--glass-blur', '10px');
            document.documentElement.style.setProperty('--glass-opacity', '0.15');
        }

        // Lazy load glassmorphism effects for better performance
        if ('IntersectionObserver' in window) {
            const glassElements = document.querySelectorAll('.tool-card, .feature-card, .blog-card');
            const glassObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.backdropFilter = 'blur(25px)';
                        glassObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '50px' });

            glassElements.forEach(element => {
                glassObserver.observe(element);
            });
        }

        // Preload important glassmorphism resources
        const toolLinks = document.querySelectorAll('.tool-card a');
        if ('requestIdleCallback' in window && 'connection' in navigator) {
            requestIdleCallback(() => {
                toolLinks.forEach(link => {
                    const linkElement = document.createElement('link');
                    linkElement.rel = 'prefetch';
                    linkElement.href = link.href;
                    document.head.appendChild(linkElement);
                });
            }, { timeout: 2000 });
        }
    }

    /**
     * Enhanced accessibility with glassmorphism considerations
     */
    function setupAccessibilityEnhancements() {
        // Enhanced keyboard navigation for glassmorphism elements
        document.addEventListener('keydown', function(e) {
            // ESC key closes mobile menu with glass transition
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                
                if (navMenu?.classList.contains('active')) {
                    navMenu.style.transform = 'translateY(-10px)';
                    navMenu.style.opacity = '0';
                    
                    setTimeout(() => {
                        navMenu.classList.remove('active');
                        mobileToggle?.setAttribute('aria-expanded', 'false');
                        mobileToggle?.focus();
                    }, 200);
                }
            }

            // Enhanced focus indicators for glass elements
            if (e.key === 'Tab') {
                const focusedElement = document.activeElement;
                if (focusedElement.classList.contains('tool-card')) {
                    focusedElement.style.outline = '2px solid #64B5F6';
                    focusedElement.style.outlineOffset = '4px';
                    focusedElement.style.boxShadow = '0 0 0 6px rgba(100, 181, 246, 0.3)';
                }
            }
        });

        // Announce glassmorphism interactions to screen readers
        const announceToScreenReader = (message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                if (announcement.parentNode) {
                    document.body.removeChild(announcement);
                }
            }, 1000);
        };

        // Respect user preferences for reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }

        // High contrast mode adjustments
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.documentElement.style.setProperty('--glass-opacity', '0.3');
            document.documentElement.style.setProperty('--glass-border-opacity', '0.8');
        }
    }

    /**
     * Enhanced event tracking with glassmorphism context
     */
    function trackEvent(eventName, data) {
        try {
            const events = JSON.parse(localStorage.getItem('vitaldex_glassmorphism_events') || '[]');
            events.push({
                event: eventName,
                data: { ...data, glassmorphism_enabled: true },
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent.substring(0, 100)
            });
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('vitaldex_glassmorphism_events', JSON.stringify(events));
        } catch (e) {
            console.log('Event tracking disabled - localStorage not available');
        }
    }

    /**
     * Public API with glassmorphism enhancements
     */
    window.VitalDex = {
        // Core functionality
        trackEvent: trackEvent,
        loadTools: loadAndDisplayTools,
        
        // Glassmorphism utilities
        addGlassEffect: function(element) {
            element.classList.add('glass-element');
            element.style.background = 'rgba(255, 255, 255, 0.1)';
            element.style.backdropFilter = 'blur(25px)';
            element.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        },
        
        showLoadingSpinner: showGlassLoadingSpinner,
        hideLoadingSpinner: hideGlassLoadingSpinner,
        
        // User preferences
        getUserPreferences: function() {
            try {
                return JSON.parse(localStorage.getItem('vitaldex_glassmorphism_preferences') || '{}');
            } catch (e) {
                return {};
            }
        },
        
        saveUserPreferences: function(preferences) {
            try {
                const currentPrefs = this.getUserPreferences();
                const updatedPrefs = { ...currentPrefs, ...preferences, lastUpdated: new Date().toISOString() };
                localStorage.setItem('vitaldex_glassmorphism_preferences', JSON.stringify(updatedPrefs));
                return true;
            } catch (e) {
                return false;
            }
        },
        
        // Tool management
        getToolsConfig: function() {
            return app.toolsConfig;
        },
        
        // Performance utilities
        isLowEndDevice: function() {
            return navigator.hardwareConcurrency <= 4 || 
                   navigator.connection?.effectiveType === 'slow-2g' ||
                   navigator.connection?.effectiveType === '2g';
        }
    };

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        if (app.intersectionObserver) {
            app.intersectionObserver.disconnect();
        }
    });

})();
