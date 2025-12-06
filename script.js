// Navigation Scroll Effect

const navbar = document.getElementById('navbar');
let lastScroll = 0;

// Ensure navbar stays fixed - run on load and continuously
function ensureNavbarFixed() {
    if (navbar) {
        // Force fixed positioning using all methods
        navbar.style.setProperty('position', 'fixed', 'important');
        navbar.style.setProperty('top', '0', 'important');
        navbar.style.setProperty('left', '0', 'important');
        navbar.style.setProperty('right', '0', 'important');
        navbar.style.setProperty('width', '100vw', 'important');
        navbar.style.setProperty('z-index', '9999', 'important');
        navbar.style.setProperty('transform', 'none', 'important');
        navbar.style.setProperty('margin', '0', 'important');
        
        // Also ensure body/html don't have transforms or perspective that create containing blocks
        document.body.style.setProperty('transform', 'none', 'important');
        document.body.style.setProperty('perspective', 'none', 'important');
        document.body.style.setProperty('filter', 'none', 'important');
        document.documentElement.style.setProperty('transform', 'none', 'important');
        document.documentElement.style.setProperty('perspective', 'none', 'important');
        document.documentElement.style.setProperty('filter', 'none', 'important');
        
        // Remove any parent transforms
        let parent = navbar.parentElement;
        while (parent && parent !== document.body) {
            const computed = window.getComputedStyle(parent);
            if (computed.transform !== 'none' || computed.perspective !== 'none' || computed.filter !== 'none') {
                parent.style.setProperty('transform', 'none', 'important');
                parent.style.setProperty('perspective', 'none', 'important');
                parent.style.setProperty('filter', 'none', 'important');
            }
            parent = parent.parentElement;
        }
    }
}

// Run immediately and on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureNavbarFixed);
} else {
    ensureNavbarFixed();
}
window.addEventListener('load', ensureNavbarFixed);
// Run periodically to ensure it stays fixed
setInterval(ensureNavbarFixed, 50);

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Dropdown Toggle for Mobile
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 968) {
            e.preventDefault();
            const dropdown = toggle.parentElement;
            const menu = dropdown.querySelector('.dropdown-menu');
            dropdown.classList.toggle('active');
        }
    });
});

// Update active dropdown link based on current page
function updateActiveDropdownLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    
    dropdownLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}

// Run on page load
updateActiveDropdownLink();

// Update active navigation link based on current page
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    
    // Update main nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        // Check if this link matches the current page
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Update dropdown links
    dropdownLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage) {
            link.classList.add('active');
            // Also mark parent dropdown as active
            const dropdown = link.closest('.nav-dropdown');
            if (dropdown) {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.classList.add('active');
                }
            }
        }
    });
    
    // Mark services dropdown as active if on any service page
    if (currentPage.includes('development') || currentPage.includes('systems') || currentPage === 'services.html') {
        const servicesDropdown = document.querySelector('.nav-dropdown');
        if (servicesDropdown) {
            const toggle = servicesDropdown.querySelector('.dropdown-toggle');
            if (toggle && !toggle.classList.contains('active')) {
                toggle.classList.add('active');
            }
        }
    }
}

// Run on page load
updateActiveNavLink();

// Smooth Scroll for Anchor Links (for same-page anchors)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Quote Section Word-by-Word Scroll Animation - Reveal on scroll down, hide on scroll up
const quoteSection = document.querySelector('.quote-section');
const quoteTextElement = document.querySelector('.quote-text');
const quoteMarks = document.querySelectorAll('.quote-mark');

if (quoteSection && quoteTextElement) {
    const quoteLines = quoteTextElement.querySelectorAll('.quote-line');
    
    // Wrap each word in a span if not already wrapped
    if (quoteLines.length > 0 && !quoteLines[0].querySelector('.quote-word')) {
        quoteLines.forEach(line => {
            const text = line.textContent.trim();
            line.innerHTML = '';
            const words = text.split(/\s+/);
            words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'quote-word';
                wordSpan.textContent = word;
                line.appendChild(wordSpan);
                // Add space after word (except last word in line)
                if (wordIndex < words.length - 1) {
                    line.appendChild(document.createTextNode(' '));
                }
            });
        });
    }

    const quoteWords = document.querySelectorAll('.quote-word');

    if (quoteWords.length > 0) {
        // Set transition delays once
        quoteWords.forEach((word, index) => {
            word.style.transitionDelay = `${index * 60}ms`;
        });
        
        function updateQuoteAnimation() {
            const rect = quoteSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            
            // Only animate when section is in viewport
            if (sectionBottom < 0 || sectionTop > windowHeight) {
                // Section is completely out of view - hide everything
                quoteWords.forEach(word => {
                    word.classList.remove('visible');
                });
                quoteMarks.forEach(mark => {
                    mark.style.opacity = '0';
                    mark.style.transform = mark.classList.contains('quote-mark-left')
                        ? 'rotate(-15deg) translateY(20px)'
                        : 'rotate(15deg) translateY(20px)';
                    mark.classList.remove('animated');
                });
                return;
            }
            
            // Calculate scroll progress based on section position in viewport
            // Start revealing when section top is at 70% of viewport
            // Finish revealing when section top is at 30% of viewport
            const revealStart = windowHeight * 0.7;
            const revealEnd = windowHeight * 0.3;
            const revealRange = revealStart - revealEnd;
            
            // Calculate progress (0 to 1)
            let scrollProgress = 0;
            
            if (sectionTop <= revealStart && sectionTop >= revealEnd) {
                // Section is in the reveal range - calculate progress
                // When sectionTop is at revealStart, progress = 0
                // When sectionTop is at revealEnd, progress = 1
                scrollProgress = 1 - ((sectionTop - revealEnd) / revealRange);
            } else if (sectionTop < revealEnd) {
                // Section is above reveal end - fully revealed
                scrollProgress = 1;
            } else if (sectionTop > revealStart) {
                // Section is below reveal start - not yet started
                scrollProgress = 0;
            }
            
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));
            
            // Calculate how many words should be visible based on progress
            const wordsToReveal = Math.floor(scrollProgress * quoteWords.length);
            
            // Update word visibility - this will work for both scroll directions
            quoteWords.forEach((word, index) => {
                if (index < wordsToReveal) {
                    word.classList.add('visible');
                } else {
                    word.classList.remove('visible');
                }
            });
            
            // Animate quote marks
            quoteMarks.forEach((mark) => {
                if (scrollProgress > 0.1) {
                    mark.style.opacity = '0.3';
                    mark.style.transform = mark.classList.contains('quote-mark-left') 
                        ? 'rotate(-15deg) translateY(0)' 
                        : 'rotate(15deg) translateY(0)';
                    mark.classList.add('animated');
                } else {
                    mark.style.opacity = '0';
                    mark.style.transform = mark.classList.contains('quote-mark-left')
                        ? 'rotate(-15deg) translateY(20px)'
                        : 'rotate(15deg) translateY(20px)';
                    mark.classList.remove('animated');
                }
            });
        }
        
        // Use scroll event for smooth bidirectional animation
        let ticking = false;
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateQuoteAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
        updateQuoteAnimation(); // Initial check
        
        // Also update on resize
        window.addEventListener('resize', updateQuoteAnimation, { passive: true });
    }
}

// Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all elements with reveal class
document.querySelectorAll('.service-card, .process-step, .value-card, .value-card-new, .team-member, .team-member-new, .testimonial-card, .testimonial-card-new, .portfolio-item, .portfolio-item-new, .mission-card-new, .why-feature-card-new').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-btn-new');
const portfolioItems = document.querySelectorAll('.portfolio-item-new');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Message Sent! ✓';
        submitButton.style.background = 'linear-gradient(135deg, #27c93f 0%, #20a83a 100%)';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
        }, 3000);
    });
}

// Parallax effect removed - gradient orbs now stay fixed in place

// Smooth scroll offset adjustment for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update active nav link immediately
            setTimeout(updateActiveNavLink, 100);
        }
    });
});

// Floating Cards Animation Enhancement
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.5}s`;
});

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth reveal for page sections
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// Loading Screen Management
const loadingScreen = document.getElementById('loading-screen');
const lottieElement = loadingScreen ? loadingScreen.querySelector('dotlottie-wc') : null;

// Hide body content initially (but not the loading screen)
document.body.classList.remove('content-loaded');

// Ensure loading screen is visible
if (loadingScreen) {
    loadingScreen.classList.remove('hidden');
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
    loadingScreen.style.visibility = 'visible';
    loadingScreen.style.zIndex = '99999';
}

// Function to hide loading screen and show content with smooth transition
function hideLoadingScreen() {
    if (hideFunctionCalled) return;
    hideFunctionCalled = true;
    
    console.log('Starting smooth transition NOW');
    
    // Make content visible FIRST so it can transition in
    document.body.classList.add('content-loaded');
    
    // Use next frame to ensure content is rendered, then start transition
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (loadingScreen) {
                // Set transition for smooth scale + fade out
                loadingScreen.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                
                // Start scaling down and fading out loading screen
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transform = 'scale(1.1)';
                
                // Remove loading screen from DOM after transition completes
                setTimeout(() => {
                    if (loadingScreen) {
                        loadingScreen.classList.add('hidden');
                        loadingScreen.style.display = 'none';
                        loadingScreen.style.zIndex = '-1';
                    }
                }, 650);
            }
        });
    });
}

// Track animation completion
let animationCompleted = false;
let hideFunctionCalled = false;

// Wait for Lottie animation to complete
if (lottieElement) {
    // Ensure Lottie element is visible
    lottieElement.style.display = 'block';
    lottieElement.style.opacity = '1';
    lottieElement.style.visibility = 'visible';
    
    // Set speed to 2x (already set in HTML, but ensure it's applied)
    if (lottieElement.setAttribute) {
        lottieElement.setAttribute('speed', '2');
    }
    
    // Listen for animation complete event IMMEDIATELY (most reliable)
    const handleComplete = () => {
        console.log('Lottie animation completed via event - starting fade IMMEDIATELY');
        if (!animationCompleted && !hideFunctionCalled) {
            animationCompleted = true;
            hideLoadingScreen();
        }
    };
    
    lottieElement.addEventListener('complete', handleComplete);
    lottieElement.addEventListener('loopComplete', handleComplete);
    
    // Fallback: if event doesn't fire, use a reasonable timeout (animation at 2x speed should be ~1-2 seconds)
    setTimeout(() => {
        if (!animationCompleted && !hideFunctionCalled) {
            console.log('Fallback: Animation should be complete, starting fade');
            animationCompleted = true;
            hideLoadingScreen();
        }
    }, 2500); // 2.5 seconds should be enough for most animations at 2x speed
} else {
    // If no Lottie element, use shorter fallback timing
    setTimeout(() => {
        if (!hideFunctionCalled) {
            animationCompleted = true;
            hideLoadingScreen();
        }
    }, 2000);
}

// Fallback: Force hide after maximum wait time (10 seconds - accounts for slower connections)
setTimeout(() => {
    if (!hideFunctionCalled) {
        console.log('Fallback: Forcing hide after timeout');
        hideFunctionCalled = true;
        animationCompleted = true;
        pageLoaded = true;
        hideLoadingScreen();
    }
}, 10000);

// Show loading screen when clicking internal navigation links
document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only show loading for internal page links (not anchors, external, or special links)
        if (href && 
            !href.startsWith('#') && 
            !href.startsWith('http') && 
            !href.startsWith('mailto:') && 
            !href.startsWith('tel:') &&
            !href.startsWith('javascript:')) {
            
            // Check if it's a different page
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const linkPage = href.split('/').pop() || href;
            
            if (linkPage !== currentPage && linkPage !== '' && linkPage !== '#') {
                // Hide body content and show loading screen immediately
                document.body.classList.remove('content-loaded');
                if (loadingScreen) {
                    loadingScreen.classList.remove('hidden');
                }
            }
        }
    });
});

// Enhanced scroll animations
// Removed parallax effect on hero background to keep it fixed

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


console.log('BlueOrbit Designs website loaded successfully! 🚀');


