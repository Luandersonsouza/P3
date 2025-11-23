/**
 * DOE+ - Main JavaScript
 * Funcionalidades interativas do site
 */

(function() {
    'use strict';

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('mainNav');
    const body = document.body;
    
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            body.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
            body.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    
    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTopButton = document.getElementById('backToTop');
    
    function handleBackToTopVisibility() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    window.addEventListener('scroll', handleBackToTopVisibility);
    backToTopButton.addEventListener('click', scrollToTop);
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora links vazios ou apenas "#"
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Offset para navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Fecha o menu mobile se estiver aberto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
    
    // ============================================
    // INTERSECTION OBSERVER - ANIMAÇÕES AO SCROLL
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observa cards de instituições
    document.querySelectorAll('.institution-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observa cards de steps
    document.querySelectorAll('.step-card').forEach(card => {
        observer.observe(card);
    });
    
    // ============================================
    // LAZY LOADING DE IMAGENS
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ============================================
    // CONTADOR ANIMADO PARA ESTATÍSTICAS
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            }
        }, 16);
    }
    
    // Anima contadores quando visíveis
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const text = statNumber.textContent;
                const hasPlus = text.includes('+');
                const targetValue = parseInt(text.replace('+', ''));
                
                if (!isNaN(targetValue)) {
                    statNumber.textContent = '0' + (hasPlus ? '+' : '');
                    animateCounter(statNumber, targetValue);
                    statsObserver.unobserve(statNumber);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // ============================================
    // FORMULÁRIO DE BUSCA (se existir)
    // ============================================
    const searchForm = document.querySelector('.custom-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('input[type="search"]');
            if (searchInput && !searchInput.value.trim()) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }
    
    // ============================================
    // PREVENÇÃO DE ERROS EM LINKS EXTERNOS
    // ============================================
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
    });
    
    // ============================================
    // LOADING STATE PARA BOTÕES
    // ============================================
    document.querySelectorAll('button[type="submit"], a.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Adiciona estado de loading se for um submit
            if (this.tagName === 'BUTTON' && this.type === 'submit') {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Processando...';
                this.disabled = true;
                
                // Remove loading após 3 segundos (ajuste conforme necessário)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 3000);
            }
        });
    });
    
    // ============================================
    // ACESSIBILIDADE - FOCUS VISIBLE
    // ============================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ============================================
    // PERFORMANCE - DEBOUNCE PARA SCROLL
    // ============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Aplica debounce aos eventos de scroll
    const debouncedScroll = debounce(() => {
        handleNavbarScroll();
        handleBackToTopVisibility();
    }, 10);
    
    window.removeEventListener('scroll', handleNavbarScroll);
    window.removeEventListener('scroll', handleBackToTopVisibility);
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    
    // ============================================
    // LOG DE INICIALIZAÇÃO
    // ============================================
    console.log('🌟 Doe+ inicializado com sucesso!');
    
})();