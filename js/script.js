// Mobile menu toggle
document.getElementById('hamburger').addEventListener('click', function() {
  const mobileMenu = document.getElementById('mobileMenu');
  const icon = this.querySelector('i');
  
  mobileMenu.classList.toggle('mobileMenuOpen');
  
  if (mobileMenu.classList.contains('mobileMenuOpen')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Close mobile menu when clicking on links
document.querySelectorAll('.mobileNavLinks a').forEach(link => {
  link.addEventListener('click', function() {
    document.getElementById('mobileMenu').classList.remove('mobileMenuOpen');
    document.getElementById('hamburger').querySelector('i').classList.remove('fa-times');
    document.getElementById('hamburger').querySelector('i').classList.add('fa-bars');
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});


