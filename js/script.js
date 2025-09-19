document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // GENERAL PAGE SCRIPTS
    // ======================
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if the link is part of the navbar (handled in navbar.js)
            if (!this.closest('.navbar') && !this.classList.contains('mobileLink')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    
    
    // ======================
    // LAZY LOADING IMAGES
    // ======================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ======================
    // HERO SECTION ANIMATION
    // ======================
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Add animation class after short delay
        setTimeout(() => {
            heroSection.classList.add('animate-in');
        }, 300);
    }
    
    // ======================
    // FEATURES SECTION INTERACTIVITY
    // ======================
    const featureItems = document.querySelectorAll('.featureItem');
    if (featureItems.length > 0) {
        featureItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.querySelector('.featureIcon').style.transform = 'scale(1.2)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.querySelector('.featureIcon').style.transform = 'scale(1)';
            });
        });
    }
});




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
          
          // Toggle between hamburger and close icon
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

      // Set current year in footer
      document.getElementById('currentYear').textContent = new Date().getFullYear();

      // ======================
      // CHATBOT FUNCTIONALITY
      // ======================
      const chatbotToggle = document.getElementById('chatbotToggle');
      const chatbotContainer = document.getElementById('chatbotContainer');
      const closeChatbot = document.getElementById('closeChatbot');
      const chatbotMessages = document.getElementById('chatbotMessages');
      const chatbotInput = document.getElementById('chatbotInput');
      const sendMessage = document.getElementById('sendMessage');
      
      // Toggle chatbot visibility
      chatbotToggle.addEventListener('click', function() {
        chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
      });
      
      closeChatbot.addEventListener('click', function() {
        chatbotContainer.style.display = 'none';
      });
      
      // Send message function
      function sendChatbotMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
          // Add user message
          const userMessage = document.createElement('div');
          userMessage.className = 'message user-message';
          userMessage.textContent = message;
          chatbotMessages.appendChild(userMessage);
          
          // Clear input
          chatbotInput.value = '';
          
          // Scroll to bottom
          chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
          
          // Simulate bot response
          setTimeout(() => {
            const botResponse = getBotResponse(message);
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = botResponse;
            chatbotMessages.appendChild(botMessage);
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
          }, 1000);
        }
      }
      
      // Handle Enter key
      chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendChatbotMessage();
        }
      });
      
      // Handle send button click
      sendMessage.addEventListener('click', sendChatbotMessage);
      
      // Simple bot responses
      function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('test') || lowerMessage.includes('testing')) {
          return "Meterbolic offers advanced metabolic testing including the Kraft Baseline Test and Full Kraft Test to measure insulin resistance and metabolic health.";
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
          return "Our testing prices vary based on the package. Please visit our website or contact us directly for detailed pricing information.";
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
          return "You can reach us at info@meterbolic.com for any inquiries or to schedule a consultation.";
        } else if (lowerMessage.includes('team') || lowerMessage.includes('who')) {
          return "Our team consists of medical professionals, scientists, and health experts dedicated to improving metabolic health. Check our Team section for details.";
        } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
          return "Hello! How can I assist you with Meterbolic today?";
        } else {
          return "Thank you for your question. For more specific information, please email us at info@meterbolic.com or visit our website sections.";
        }
      }
    });
