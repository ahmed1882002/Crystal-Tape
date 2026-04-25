// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Connect ScrollTrigger to Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.registerPlugin(ScrollTrigger);

// Hero Animations — only targets elements INSIDE .hero-section
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to('.reveal-text', {
        opacity: 1,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1
    })
    .to('.hero-section .fade-up', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1
    }, '-=0.8');

    // Refresh after hero animations are set up
    ScrollTrigger.refresh();
});

// Scroll Reveal Animations — only targets sections OUTSIDE hero
const revealElements = document.querySelectorAll('section:not(.hero-section) .fade-up');
revealElements.forEach((el) => {
    gsap.fromTo(el,
        { opacity: 0, y: 40, scale: 0.95 },
        {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
                once: true
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power4.out'
        }
    );
});

// Parallax Background Effect
gsap.to('.hero-section', {
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    backgroundPositionY: '50%',
    ease: 'none'
});

// Parallax Effect for Hero Image
gsap.to('.hero-image', {
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: -50,
    rotate: 8,
    scale: 1.1
});

// Tabs Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function setActiveTab(tabId) {
    // Update Buttons
    tabBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    
    // Update Content
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
            // Re-animate cards with fromTo to ensure they are visible
            const cards = content.querySelectorAll('.product-card');
            gsap.fromTo(cards, 
                { opacity: 0, y: 30, scale: 0.9 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    stagger: 0.1, 
                    duration: 0.8, 
                    ease: 'expo.out',
                    clearProps: 'all' // Remove inline styles after animation
                }
            );
        } else {
            content.classList.remove('active');
        }
    });
    
    // Save to localStorage
    localStorage.setItem('rollIt_activeTab', tabId);
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setActiveTab(btn.getAttribute('data-tab'));
    });
});

// Restore Tab on Load
window.addEventListener('load', () => {
    const savedTab = localStorage.getItem('rollIt_activeTab') || 'large-core';
    setActiveTab(savedTab, false); // Don't animate on initial load
});

// Improved 3D Tilt Effect
const cards = document.querySelectorAll('[data-tilt]');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (centerY - y) / 15;
        const rotateY = (x - centerX) / 15;
        
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.05,
            duration: 0.4,
            ease: 'power2.out'
        });
        
        // Glare movement
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power4.out',
            overwrite: true
        });
    });
});

// Number Counter Animation
const prices = document.querySelectorAll('.card-price');
prices.forEach(price => {
    const valueStr = price.innerText.replace(/[^\d]/g, '');
    const value = parseInt(valueStr);
    
    ScrollTrigger.create({
        trigger: price,
        start: 'top 90%',
        onEnter: () => {
            let obj = { val: 0 };
            gsap.to(obj, {
                val: value,
                duration: 1.5,
                ease: 'power2.out',
                onUpdate: () => {
                    price.innerHTML = `${Math.ceil(obj.val).toLocaleString()} <span>ج.م</span>`;
                }
            });
        },
        once: true
    });
});

// Sticky Header Effect
const header = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.padding = '0.5rem 0';
        header.style.background = 'rgba(255, 255, 255, 0.9)';
    } else {
        header.style.padding = '1rem 0';
        header.style.background = 'rgba(255, 255, 255, 0.7)';
    }
});
