document.addEventListener('DOMContentLoaded', function() {
  // Initialize form validation for both modal and contact page forms
  const forms = document.querySelectorAll('.registrationForm');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset error messages
      const errorMessages = form.querySelectorAll('.error-message');
      errorMessages.forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
      });
      
      // Validate form fields
      let isValid = true;
      
      // Validate full name
      const fullName = form.querySelector('#fullName');
      if (fullName && !fullName.value.trim()) {
        const errorElement = form.querySelector('#fullNameError') || document.getElementById('fullNameError');
        errorElement.textContent = 'Please enter your full name';
        errorElement.style.display = 'block';
        isValid = false;
      }
      
      // Validate email
      const email = form.querySelector('#email');
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
          const errorElement = form.querySelector('#emailError') || document.getElementById('emailError');
          errorElement.textContent = 'Please enter your email';
          errorElement.style.display = 'block';
          isValid = false;
        } else if (!emailRegex.test(email.value)) {
          const errorElement = form.querySelector('#emailError') || document.getElementById('emailError');
          errorElement.textContent = 'Please enter a valid email';
          errorElement.style.display = 'block';
          isValid = false;
        }
      }
      
      // Validate interest
      const interest = form.querySelector('#interest');
      if (interest && !interest.value) {
        const errorElement = form.querySelector('#interestError') || document.getElementById('interestError');
        errorElement.textContent = 'Please select an option';
        errorElement.style.display = 'block';
        isValid = false;
      }
      
      // Validate consent
      const consent = form.querySelector('#consent');
      if (consent && !consent.checked) {
        const errorElement = form.querySelector('#consentError') || document.getElementById('consentError');
        errorElement.textContent = 'You must agree to receive emails';
        errorElement.style.display = 'block';
        isValid = false;
      }
      
      // If form is valid, submit it
      if (isValid) {
        const submitBtn = form.querySelector('.submitButton') || document.getElementById('waitlistSubmitBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
          
          // Simulate form submission
          setTimeout(() => {
            // Reset form
            form.reset();
            
            // Show success message
            alert('Thank you for registering! We will be in touch soon.');
            
            // Close modal if this is the modal form
            const modal = document.querySelector('.modalOverlay');
            if (modal && modal.classList.contains('show')) {
              modal.classList.remove('show');
            }
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Registration';
          }, 1500);
        }
      }
    });
  });

  // Modal specific functionality (only if modal exists on page)
  const modal = document.querySelector('.modalOverlay');
  if (modal) {
    const openButtons = document.querySelectorAll('[id*="registerBtn"], [id*="RegisterBtn"]');
    const closeButton = document.querySelector('.modalCloseButton');
    
    openButtons.forEach(button => {
      button.addEventListener('click', () => {
        modal.classList.add('show');
      });
    });
    
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
      });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  }
});