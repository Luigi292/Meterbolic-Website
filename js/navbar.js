document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  
  if (mobileMenuButton && mobileMenuOverlay) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenuOverlay.classList.toggle('mobileMenuOpen');
      document.body.classList.toggle('noScroll');
    });
  }
  
  // Close mobile menu when clicking on a link
  const mobileLinks = document.querySelectorAll('.mobileLink');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('mobileMenuOpen');
        document.body.classList.remove('noScroll');
      }
    });
  });
  
  // Registration modal - includes all register buttons
  const registerButtons = [
    document.getElementById('registerBtn'),
    document.getElementById('mobileRegisterBtn'),
    document.getElementById('footerRegisterBtn')
  ].filter(Boolean); // Remove null elements
  
  const registrationModal = document.getElementById('registrationModal');
  const modalCloseButton = document.getElementById('modalCloseButton');
  
  if (registerButtons.length && registrationModal && modalCloseButton) {
    registerButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        registrationModal.classList.add('show');
        document.body.classList.add('noScroll');
      });
    });
    
    modalCloseButton.addEventListener('click', function() {
      registrationModal.classList.remove('show');
      document.body.classList.remove('noScroll');
    });
    
    // Close modal when clicking outside
    registrationModal.addEventListener('click', function(e) {
      if (e.target === registrationModal) {
        registrationModal.classList.remove('show');
        document.body.classList.remove('noScroll');
      }
    });
  }
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const navbarHeight = navbar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
  
  // Form submission
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());
      
      // Here you would typically send this data to your server
      console.log('Form submitted:', data);
      
      // For demo purposes, we'll just show an alert
      alert('Thank you for registering! We will contact you soon.');
      
      // Close the modal
      if (registrationModal) {
        registrationModal.classList.remove('show');
        document.body.classList.remove('noScroll');
      }
      
      // Reset form
      this.reset();
    });
  }
  
  // Scroll to top button
  const scrollToTop = document.getElementById('scrollToTop');
  if (scrollToTop) {
    scrollToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Show scroll to top button when scrolling
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTop.classList.add('show');
      } else {
        scrollToTop.classList.remove('show');
      }
    });
  }
});

// Footer register button
const footerRegisterBtn = document.getElementById('footerRegisterBtn');
if (footerRegisterBtn) {
  footerRegisterBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (registrationModal) {
      registrationModal.classList.add('show');
      document.body.classList.add('noScroll');
    }
  });
}