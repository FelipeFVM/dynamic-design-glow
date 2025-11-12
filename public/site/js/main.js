// === MELHORIAS APLICADAS: Tema Claro/Escuro + Menu Mobile + Scroll Reveal ===

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== TEMA CLARO/ESCURO =====
    const initTheme = () => {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const html = document.documentElement;
        
        // Carrega tema salvo do localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        // Toggle do tema
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
                
                // Adiciona animação ao toggle
                themeToggle.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    themeToggle.style.transform = 'rotate(0deg)';
                }, 300);
            });
        }
        
        function updateThemeIcon(theme) {
            if (themeIcon) {
                themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
            }
        }
    };
    
    // ===== MENU MOBILE =====
    const initMobileMenu = () => {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
                
                // Previne scroll do body quando menu está aberto
                document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            });
            
            // Fecha menu ao clicar em um link
            const links = navLinks.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
            
            // Fecha menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    };
    
    // ===== SCROLL REVEAL ANIMAÇÃO =====
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const revealPoint = 100;
            
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                
                if (elementTop < windowHeight - revealPoint) {
                    element.classList.add('revealed');
                }
            });
        };
        
        // Executa ao carregar
        revealOnScroll();
        
        // Executa ao scrollar
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(revealOnScroll, 10);
        }, { passive: true });
    };
    
    // ===== ANIMAÇÃO INICIAL DAS SEÇÕES =====
    const initSectionAnimations = () => {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            // Adiciona classe scroll-reveal se não tiver
            if (!section.classList.contains('hero-section') && !section.classList.contains('scroll-reveal')) {
                section.classList.add('scroll-reveal');
            }
        });
    };
    
    // ===== SMOOTH SCROLL PARA LINKS INTERNOS =====
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    };
    
    // ===== EFEITO PARALLAX NO HERO =====
    const initParallax = () => {
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }, { passive: true });
        }
    };
    
    // ===== HEADER SCROLL EFFECT =====
    const initHeaderScroll = () => {
        const header = document.querySelector('.header');
        let lastScroll = 0;
        
        if (header) {
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = 'none';
                }
                
                lastScroll = currentScroll;
            }, { passive: true });
        }
    };
    
    // ===== CONTADOR ANIMADO PARA NÚMEROS =====
    const initCounters = () => {
        const counters = document.querySelectorAll('.stat-number, .fact-number');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const hasComma = target.includes(',');
            const number = parseFloat(target.replace(/[^\d,.-]/g, '').replace(',', '.'));
            
            if (!isNaN(number)) {
                let current = 0;
                const increment = number / 60;
                const duration = 1000;
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= number) {
                                    current = number;
                                    clearInterval(timer);
                                }
                                
                                let displayValue = Math.round(current * 10) / 10;
                                if (hasComma) {
                                    displayValue = displayValue.toString().replace('.', ',');
                                }
                                counter.textContent = target.replace(/[\d,.-]+/, displayValue);
                            }, duration / 60);
                            
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(counter);
            }
        });
    };
    
    // ===== PROGRESS BARS ANIMADAS =====
    const initProgressBars = () => {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width') || bar.style.width;
                    bar.style.width = width;
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            const currentWidth = bar.style.width;
            bar.setAttribute('data-width', currentWidth);
            bar.style.width = '0%';
            observer.observe(bar);
        });
    };
    
    // ===== LOADING STATE =====
    const initLoadingState = () => {
        // Remove loading e mostra conteúdo suavemente
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    };
    
    // ===== INICIALIZAÇÃO =====
    initLoadingState();
    initTheme();
    initMobileMenu();
    initSectionAnimations();
    initScrollReveal();
    initSmoothScroll();
    initHeaderScroll();
    initCounters();
    initProgressBars();
    
    // Mensagem de boas-vindas no console
    console.log('%c✨ Quanto Vale o Seu Tempo? ✨', 'color: #6366F1; font-size: 20px; font-weight: bold;');
    console.log('%cDesenvolvido com ❤️ para conscientização social', 'color: #888; font-size: 12px;');
});
