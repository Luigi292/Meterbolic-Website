document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // MOBILE MENU TOGGLE
    // ======================
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuIcon = document.querySelector('.mobileMenuIcon');
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileMenuButton.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('mobileMenuOpen');
        document.body.classList.toggle('noScroll');
        
        // Toggle between hamburger and close icon if needed
        if (mobileMenuButton.classList.contains('active')) {
            mobileMenuIcon.classList.remove('fa-bars');
            mobileMenuIcon.classList.add('fa-times');
        } else {
            mobileMenuIcon.classList.remove('fa-times');
            mobileMenuIcon.classList.add('fa-bars');
        }
    }
    
    // Event listeners for mobile menu
    if (mobileMenuButton && mobileMenuOverlay) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenuOverlay.classList.contains('mobileMenuOpen') && 
            !e.target.closest('.mobileMenuOverlay') && 
            !e.target.closest('.mobileMenuButton')) {
            toggleMobileMenu();
        }
    });
    
    // ======================
    // NAVIGATION FUNCTIONALITY
    // ======================
    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobileLink, .mobileRegisterBtn');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenuOverlay.classList.contains('mobileMenuOpen')) {
                toggleMobileMenu();
            }
            
            // Update active link
            if (link.classList.contains('mobileLink')) {
                document.querySelectorAll('.mobileLink').forEach(item => {
                    item.classList.remove('activeLink');
                });
                link.classList.add('activeLink');
                
                // Also update the corresponding desktop link
                const href = link.getAttribute('href');
                document.querySelectorAll('.navLinks a').forEach(desktopLink => {
                    if (desktopLink.getAttribute('href') === href) {
                        desktopLink.classList.add('activeLink');
                    } else {
                        desktopLink.classList.remove('activeLink');
                    }
                });
            }
        });
    });
    
    // Update active link for desktop navigation
    const desktopLinks = document.querySelectorAll('.navLinks a');
    desktopLinks.forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.navLinks a').forEach(item => {
                item.classList.remove('activeLink');
            });
            this.classList.add('activeLink');
            
            // Also update the corresponding mobile link
            const href = this.getAttribute('href');
            document.querySelectorAll('.mobileLink').forEach(mobileLink => {
                if (mobileLink.getAttribute('href') === href) {
                    mobileLink.classList.add('activeLink');
                } else {
                    mobileLink.classList.remove('activeLink');
                }
            });
        });
    });
    
    // ======================
    // NAVBAR SCROLL EFFECTS
    // ======================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Set initial navbar height
        const navbarHeight = navbar.offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
        
        // Update on resize
        window.addEventListener('resize', function() {
            const newHeight = navbar.offsetHeight;
            document.documentElement.style.setProperty('--navbar-height', `${newHeight}px`);
        });
        
        // Scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Update active link based on scroll position
            updateActiveLinkOnScroll();
        });
    }
    
    // ======================
    // SCROLL TO TOP BUTTON
    // ======================
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        scrollToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTop.classList.add('show');
            } else {
                scrollToTop.classList.remove('show');
            }
        });
    }
    
    // ======================
    // HELPER FUNCTIONS
    // ======================
    function updateActiveLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            // Update desktop links
            desktopLinks.forEach(link => {
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('activeLink');
                } else {
                    link.classList.remove('activeLink');
                }
            });
            
            // Update mobile links
            mobileLinks.forEach(link => {
                if (link.classList.contains('mobileLink') && 
                    link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('activeLink');
                } else if (link.classList.contains('mobileLink')) {
                    link.classList.remove('activeLink');
                }
            });
        }
    }
    
    // Initialize active link on page load
    updateActiveLinkOnScroll();
    
    // Close mobile menu when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('mobileMenuOpen')) {
            toggleMobileMenu();
        }
    });
});