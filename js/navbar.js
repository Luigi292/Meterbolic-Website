// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.nav-top-variant2');
  const hamburgerToggle = document.querySelector('.hamburger-toggle');
  let lastScrollTop = 0;
  
  // Hamburger menu toggle
  if (hamburgerToggle) {
    hamburgerToggle.addEventListener('click', function() {
      navbar.classList.toggle('menu-active');
      this.classList.toggle('active');
    });
  }
  
  // Hide navbar on scroll down, show on scroll up
  window.addEventListener('scroll', function() {
    if (window.innerWidth > 1000) { // Only apply for larger screens
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll down
        navbar.classList.add('hide');
      } else {
        // Scroll up
        navbar.classList.remove('hide');
      }
      
      lastScrollTop = scrollTop;
    }
  });
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.mobile-menu .nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navbar.classList.remove('menu-active');
      hamburgerToggle.classList.remove('active');
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 1000 && 
        navbar.classList.contains('menu-active') && 
        !event.target.closest('.mobile-menu') && 
        !event.target.closest('.hamburger-toggle')) {
      navbar.classList.remove('menu-active');
      hamburgerToggle.classList.remove('active');
    }
  });

  // Add active class to current page link
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const allNavLinks = document.querySelectorAll('.nav-links a');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu .nav-links a');
    
    // Handle desktop navigation links
    allNavLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      // Remove active class first
      link.classList.remove('active');
      // Add active class if it matches current page
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
    
    // Handle mobile navigation links
    mobileNavLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      // Remove active class first
      link.classList.remove('active');
      // Add active class if it matches current page
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // Initialize active nav link on page load
  setActiveNavLink();
});