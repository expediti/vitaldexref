/**
 * FitScan - I Love PDF Inspired Health Tools Platform
 * Modern, clean, and professional JavaScript functionality
 */

(function() {
    'use strict';

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        setupSmoothScrolling();
        setupMobileMenu();
        setupToolCardInteractions();
        setupAnimationsOnScroll();
        setupAnalytics();
        console.log('FitScan platform initialized successfully');
    }

    // Smooth scrolling for navigation links
    function setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = 70;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(targetId);
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }

    // Mobile menu functionality
    function setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.main-nav');
        
        if (!mobileMenuBtn || !nav) return;
        
        mobileMenuBtn.addEventListener('click', function() {
            const isOpen = nav.classList.contains('mobile-open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        const nav = document.querySelector('.main-nav');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        nav.classList.add('mobile-open');
        mobileMenuBtn.classList.add('active');
        
        // Add mobile menu styles
        nav.style.cssText = `
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            border-bottom: 1px solid #e2e8f0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: block;
            z-index: 999;
        `;
        
        nav.querySelector('.nav-list').style.cssText = `
            flex-direction: column;
            padding: 20px;
            gap: 0;
        `;
        
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.cssText = `
                display: block;
                padding: 12px 0;
                border-bottom: 1px solid #f7fafc;
            `;
        });
    }

    function closeMobileMenu() {
        const nav = document.querySelector('.main-nav');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        nav.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('active');
        
        // Reset styles for desktop
        if (window.innerWidth > 768) {
            nav.style.cssText = '';
            nav.querySelector('.nav-list').style.cssText = '';
            
            const navLinks = nav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.cssText = '';
            });
        }
    }

    // Update active navigation link
    function updateActiveNavLink(targetId) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Tool card interactions
    function setupToolCardInteractions() {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            // Add click tracking
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.tool-button')) {
                    const toolButton = this.querySelector('.tool-button');
                    if (toolButton) {
                        window.location.href = toolButton.href;
                    }
                }
            });
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
            
            // Track tool interactions
            const toolButton = card.querySelector('.tool-button');
            if (toolButton) {
                toolButton.addEventListener('click', function(e) {
                    const toolName = card.querySelector('.tool-title').textContent;
                    trackEvent('tool_click', {
                        tool_name: toolName,
                        tool_url: this.href
                    });
                });
            }
        });
    }

    // Animations on scroll
    function setupAnimationsOnScroll() {
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
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-card, .tool-card');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // Analytics and tracking
    function setupAnalytics() {
        // Track page view
        trackEvent('page_view', {
            page: 'home',
            timestamp: new Date().toISOString()
        });
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                trackEvent('scroll_depth', {
                    percentage: scrollPercent
                });
            }
        }, 250));
        
        // Track button clicks
        document.addEventListener('click', function(e) {
            if (e.target.matches('.btn') || e.target.closest('.btn')) {
                const btn = e.target.matches('.btn') ? e.target : e.target.closest('.btn');
                trackEvent('button_click', {
                    button_text: btn.textContent.trim(),
                    button_class: btn.className
                });
            }
        });
    }

    // Event tracking function
    function trackEvent(eventName, data) {
        try {
            // Store locally for analytics
            const events = JSON.parse(localStorage.getItem('fitscan_events') || '[]');
            events.push({
                event: eventName,
                data: data,
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('fitscan_events', JSON.stringify(events));
            
            // Send to analytics service if available
            if (window.gtag) {
                window.gtag('event', eventName, data);
            }
        } catch (e) {
            console.log('Analytics tracking disabled');
        }
    }

    // Utility function for throttling
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Smooth reveal for hero section
    window.addEventListener('load', function() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroContent.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        }
    });

    // Export for global access
    window.FitScan = {
        trackEvent: trackEvent,
        openMobileMenu: openMobileMenu,
        closeMobileMenu: closeMobileMenu
    };

})();
// Mobile Menu Toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    
    nav.classList.toggle('mobile-open');
    mobileBtn.classList.toggle('active');
}

// Close mobile menu when clicking nav links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const nav = document.querySelector('.main-nav');
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            
            nav.classList.remove('mobile-open');
            mobileBtn.classList.remove('active');
        });
    });
});
