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





// Updated Form Submission Handler
function handleFormSubmit(formId) {
    const form = document.getElementById(formId);
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        
        if (formId === 'registrationForm' || formId === 'stayInTouchForm') {
            const fullNameField = formId === 'registrationForm' ? form.fullName : form.querySelector('#stayFullName');
            const emailField = formId === 'registrationForm' ? form.email : form.querySelector('#stayEmail');
            const interestField = formId === 'registrationForm' ? form.interest : form.querySelector('#stayInterest');
            const consentField = formId === 'registrationForm' ? form.consent : form.querySelector('#stayConsent');
            
            const fullNameError = formId === 'registrationForm' ? document.getElementById('fullNameError') : document.getElementById('stayFullNameError');
            const emailError = formId === 'registrationForm' ? document.getElementById('emailError') : document.getElementById('stayEmailError');
            const interestError = formId === 'registrationForm' ? document.getElementById('interestError') : document.getElementById('stayInterestError');
            const consentError = formId === 'registrationForm' ? document.getElementById('consentError') : document.getElementById('stayConsentError');
            
            isValid = validateField(fullNameField, fullNameError, validateFullName) &&
                     validateField(emailField, emailError, validateEmail) &&
                     validateField(interestField, interestError, validateInterest) &&
                     validateField(consentField, consentError, validateConsent);
        }
        
        if (!isValid) {
            return;
        }
        
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
                // Show success message
                alert(result.message);
                
                // Close modal if this is the registration form
                if (formId === 'registrationForm') {
                    document.getElementById('registrationModal').classList.remove('show');
                }
                
                // Redirect if _next is specified
                const nextUrl = form.querySelector('input[name="_next"]')?.value;
                if (nextUrl) {
                    window.location.href = nextUrl;
                }
                
                // Reset form
                form.reset();
            } else {
                alert(result.message || 'There was an error submitting your form. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your form. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = formId === 'registrationForm' ? 'Submit Registration' : 'Subscribe';
        }
    });
}

