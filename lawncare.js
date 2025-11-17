// ===========================
// ELITE LAWN CARE - JavaScript
// Advanced Interactivity & Performance
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================
    // Scroll Progress Bar
    // ===========================
    const progressBar = document.getElementById('progress-bar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    });
    
    // ===========================
    // Navigation
    // ===========================
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Close mobile menu on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // ===========================
    // Hero Stats Counter Animation
    // ===========================
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // Trigger animation when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateStats();
                animated = true;
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
    
    // ===========================
    // Quote Calculator
    // ===========================
    let currentStep = 1;
    let quoteData = {
        service: '',
        propertySize: 2500,
        frequency: 'biweekly',
        zipCode: '',
        startDate: '',
        extras: []
    };
    
    // Pricing structure
    const pricing = {
        lawn: { base: 49, perSqFt: 0.015 },
        hardscape: { base: 2500, perSqFt: 0.5 },
        irrigation: { base: 1200, perSqFt: 0.3 },
        garden: { base: 800, perSqFt: 0.2 }
    };
    
    const frequencyMultipliers = {
        'weekly': 1.0,
        'biweekly': 0.9,
        'monthly': 0.8,
        'one-time': 1.2
    };
    
    const extras = {
        'edging': 15,
        'cleanup': 25,
        'fertilizer': 40
    };
    
    // Property size display update
    const propertySizeInput = document.getElementById('property-size');
    const sizeDisplay = document.getElementById('size-display');
    
    if (propertySizeInput) {
        propertySizeInput.addEventListener('input', (e) => {
            sizeDisplay.textContent = e.target.value;
        });
    }
    
    // Date availability checker
    const preferredDateInput = document.getElementById('preferred-date');
    const dateAvailability = document.getElementById('date-availability');
    
    if (preferredDateInput) {
        preferredDateInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            const dayOfWeek = selectedDate.getDay();
            
            // Simulate availability (Monday-Friday = available, weekends = limited)
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dateAvailability.textContent = '⚠️ Limited availability';
                dateAvailability.className = 'availability-indicator limited';
            } else {
                dateAvailability.textContent = '✓ Available';
                dateAvailability.className = 'availability-indicator available';
            }
        });
    }
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (preferredDateInput) {
        preferredDateInput.setAttribute('min', today);
    }
    const startDateInput = document.getElementById('start-date');
    if (startDateInput) {
        startDateInput.setAttribute('min', today);
    }
    
    // ===========================
    // Calculator Step Navigation
    // ===========================
    window.nextStep = function() {
        const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const currentStepIndicator = document.querySelector(`.step[data-step="${currentStep}"]`);
        
        // Validate current step
        const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
        let valid = true;
        
        inputs.forEach(input => {
            if (!input.value || (input.type === 'radio' && !document.querySelector(`input[name="${input.name}"]:checked`))) {
                valid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (!valid) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Hide current step
        currentFormStep.classList.remove('active');
        currentStepIndicator.classList.remove('active');
        
        // Show next step
        currentStep++;
        const nextFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const nextStepIndicator = document.querySelector(`.step[data-step="${currentStep}"]`);
        
        if (nextFormStep && nextStepIndicator) {
            nextFormStep.classList.add('active');
            nextStepIndicator.classList.add('active');
        }
    };
    
    window.prevStep = function() {
        const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const currentStepIndicator = document.querySelector(`.step[data-step="${currentStep}"]`);
        
        currentFormStep.classList.remove('active');
        currentStepIndicator.classList.remove('active');
        
        currentStep--;
        const prevFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const prevStepIndicator = document.querySelector(`.step[data-step="${currentStep}"]`);
        
        if (prevFormStep && prevStepIndicator) {
            prevFormStep.classList.add('active');
            prevStepIndicator.classList.add('active');
        }
    };
    
    window.calculateQuote = function() {
        // Gather form data
        const service = document.querySelector('input[name="service"]:checked').value;
        const propertySize = parseInt(document.getElementById('property-size').value);
        const frequency = document.getElementById('frequency').value;
        const selectedExtras = Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(e => e.value);
        
        // Calculate pricing
        const servicePrice = pricing[service];
        const basePrice = servicePrice.base;
        const sizeAdjustment = (propertySize - 2500) * servicePrice.perSqFt;
        const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extras[extra], 0);
        const frequencyMultiplier = frequencyMultipliers[frequency];
        
        const subtotal = (basePrice + sizeAdjustment + extrasPrice) * frequencyMultiplier;
        const savings = basePrice + sizeAdjustment + extrasPrice - subtotal;
        
        // Display results
        document.getElementById('base-price').textContent = `$${basePrice.toFixed(2)}`;
        document.getElementById('size-adjustment').textContent = `$${sizeAdjustment.toFixed(2)}`;
        document.getElementById('extras-price').textContent = `$${extrasPrice.toFixed(2)}`;
        document.getElementById('total-price').textContent = `$${subtotal.toFixed(2)}`;
        
        if (savings > 0) {
            document.getElementById('quote-savings').style.display = 'flex';
            document.getElementById('savings-amount').textContent = `$${savings.toFixed(2)}`;
        } else {
            document.getElementById('quote-savings').style.display = 'none';
        }
        
        // Store quote data
        quoteData = {
            service,
            propertySize,
            frequency,
            extras: selectedExtras,
            total: subtotal
        };
        
        nextStep();
    };
    
    window.resetCalculator = function() {
        currentStep = 1;
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.querySelector('.form-step[data-step="1"]').classList.add('active');
        document.querySelector('.step[data-step="1"]').classList.add('active');
        document.getElementById('quote-form').reset();
        document.getElementById('property-size').value = 2500;
        document.getElementById('size-display').textContent = '2500';
    };
    
    window.openCalculator = function(serviceType) {
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            document.querySelector(`input[name="service"][value="${serviceType}"]`).checked = true;
        }, 500);
    };
    
    window.proceedToBooking = function() {
        // Pre-fill booking form with quote data
        const serviceSelect = document.getElementById('service-type');
        if (serviceSelect) {
            const serviceMap = {
                'lawn': 'lawn',
                'hardscape': 'hardscape',
                'irrigation': 'irrigation',
                'garden': 'garden'
            };
            serviceSelect.value = serviceMap[quoteData.service] || '';
        }
        
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        showNotification('Your quote has been applied to the booking form!', 'success');
    };
    
    // ===========================
    // Gallery Filter
    // ===========================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // ===========================
    // Lightbox
    // ===========================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    window.openLightbox = function(btn) {
        const item = btn.closest('.gallery-item');
        const img = item.querySelector('img');
        const title = item.querySelector('h4').textContent;
        const description = item.querySelector('p').textContent;
        
        lightboxImg.src = img.src;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ===========================
    // Testimonials Slider
    // ===========================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const dotsContainer = document.getElementById('testimonial-dots');
    
    let currentTestimonial = 0;
    
    // Create dots
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    function goToTestimonial(index) {
        showTestimonial(index);
    }
    
    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(next);
    }
    
    function prevTestimonial() {
        const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(prev);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
    if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
    
    // Auto-rotate testimonials
    setInterval(nextTestimonial, 5000);
    
    // Show first testimonial
    if (testimonialCards.length > 0) {
        testimonialCards[0].classList.add('active');
    }
    
    // ===========================
    // Form Submissions
    // ===========================
    const bookingForm = document.getElementById('booking-form');
    const quickContactForm = document.getElementById('quick-contact-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = bookingForm.querySelector('button[type="submit"]');
            const btnText = btn.querySelector('.btn-text');
            const btnLoader = btn.querySelector('.btn-loader');
            
            // Show loader
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            btn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                btn.disabled = false;
                
                showNotification('Booking confirmed! We\'ll contact you within 24 hours.', 'success');
                bookingForm.reset();
            }, 2000);
        });
    }
    
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate sending message
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll respond soon.', 'success');
                quickContactForm.reset();
            }, 1000);
        });
    }
    
    // ===========================
    // Notification System
    // ===========================
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
    
    // ===========================
    // Back to Top Button
    // ===========================
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===========================
    // Intersection Observer for Animations
    // ===========================
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Animate sections on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .gallery-item, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(el);
    });
    
    // ===========================
    // Performance: Lazy Loading Images
    // ===========================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    lazyLoadObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => lazyLoadObserver.observe(img));
    }
    
    // ===========================
    // Smooth Scroll for Links
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
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
    
    // ===========================
    // Service Card Interactions
    // ===========================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-10px)';
        });
    });
    
    // ===========================
    // Initialize
    // ===========================
    console.log('Elite Lawn Care Website Loaded Successfully! 🌿');
    
    // Performance monitoring
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }
    
});

// ===========================
// Service Worker for PWA (Optional)
// ===========================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA features
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}
