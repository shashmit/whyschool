/**
 * Scroll Fade Animation System
 * Uses Intersection Observer API for performance-optimized scroll animations
 */

class ScrollFadeAnimator {
  constructor() {
    this.sections = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Find all sections with scroll-fade attribute
    this.sections = document.querySelectorAll('[data-scroll-fade]');
    
    if (this.sections.length === 0) return;

    // Create intersection observer
    this.createObserver();
    
    // Observe all sections
    this.sections.forEach(section => {
      this.observer.observe(section);
      // Set initial state
      section.classList.add('scroll-fade-element');
    });

    // Add scroll listener for additional fade effects
    this.addScrollListener();
  }

  createObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px', // Trigger when 10% visible
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        const ratio = entry.intersectionRatio;
        
        // Check if this is a main content section that should maintain opacity
        const isMainContentSection = element.textContent.includes('Explore Different Domains') || 
                                   element.textContent.includes('Our Approach');
        
        if (entry.isIntersecting) {
          // Element is coming into view - fade in
          element.classList.add('scroll-fade-in');
          element.classList.remove('scroll-fade-out');
          
          // Set opacity based on intersection ratio for smooth transition
          const opacity = isMainContentSection ? 1 : Math.min(1, ratio * 1.2);
          element.style.setProperty('--scroll-opacity', opacity);
        } else {
          // Element is going out of view - fade out
          element.classList.add('scroll-fade-out');
          element.classList.remove('scroll-fade-in');
          
          // Reduce opacity for elements above viewport
          const rect = element.getBoundingClientRect();
          if (rect.bottom < 0) {
            // Element is above viewport - maintain higher opacity for main content
            const opacity = isMainContentSection ? 0.4 : 0.4;
            element.style.setProperty('--scroll-opacity', opacity);
          } else {
            // Element is below viewport - maintain higher opacity for main content
            const opacity = isMainContentSection ? 0.4 : 0.4;
            element.style.setProperty('--scroll-opacity', opacity);
          }
        }
      });
    }, options);
  }

  addScrollListener() {
    let ticking = false;
    
    const updateScrollEffects = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      this.sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionHeight = rect.height;
        
        // Calculate fade based on scroll position
        let opacity = 1;
        
        // Check if this is a section that should maintain full opacity longer
        const isMainContentSection = section.textContent.includes('Explore Different Domains') || 
                                   section.textContent.includes('Our Approach');
        
        if (isMainContentSection) {
          // For main content sections, only fade when completely out of view
          if (rect.bottom < -windowHeight * 0.2) {
            // Section is well above viewport - gradual fade out
            const fadeAmount = Math.abs(rect.bottom + windowHeight * 0.2) / (windowHeight * 0.3);
            opacity = Math.max(0.4, 1 - fadeAmount * 0.6);
          } else if (rect.top > windowHeight + windowHeight * 0.2) {
            // Section is well below viewport - fade in as it approaches
            const distanceFromBottom = rect.top - windowHeight;
            const fadeAmount = Math.max(0, distanceFromBottom - windowHeight * 0.2) / (windowHeight * 0.4);
            opacity = Math.max(0.4, 1 - fadeAmount * 0.6);
          }
        } else {
          // For other sections, use more conservative fade thresholds
          if (rect.top < -sectionHeight * 0.6) {
            // Section is mostly above viewport - fade out more gradually
            const fadeAmount = Math.abs(rect.top) / (sectionHeight * 1.2);
            opacity = Math.max(0.4, 1 - fadeAmount * 0.6);
          } else if (rect.bottom > windowHeight + sectionHeight * 0.6) {
            // Section is mostly below viewport - fade in as it approaches
            const distanceFromBottom = rect.top - windowHeight;
            const fadeAmount = Math.max(0, distanceFromBottom) / (sectionHeight * 0.8);
            opacity = Math.max(0.4, 1 - fadeAmount * 0.6);
          }
        }
        
        section.style.setProperty('--scroll-opacity', opacity);
      });
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };

    // Throttled scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial call
    updateScrollEffects();
  }
}

// Initialize when script loads
new ScrollFadeAnimator();