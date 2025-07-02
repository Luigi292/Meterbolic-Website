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





// Update your form submission handler to this:
document.getElementById('stayInTouchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            alert(result.message);
            if (result.redirect) {
                window.location.href = result.redirect;
            }
            form.reset();
        } else {
            alert(result.message || 'There was an error submitting your form.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your form. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});