// Auth0 handler for button events
document.addEventListener('DOMContentLoaded', function() {
  // Wait for Auth0 service to initialize
  setTimeout(() => {
    // Add event listeners to buttons
    const loginBtn = document.querySelector('.login-btn');
    const getStartedBtn = document.querySelector('.get-started-btn');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', function() {
        if (auth0Service.getIsAuthenticated()) {
          auth0Service.logout();
        } else {
          auth0Service.login();
        }
      });
    }
    
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', function() {
        if (auth0Service.getIsAuthenticated()) {
          window.location.href = '/dashboard.html';
        } else {
          auth0Service.register();
        }
      });
    }
    
    // Update UI based on authentication state
    if (auth0Service.getIsAuthenticated()) {
      const loginBtn = document.querySelector('.login-btn');
      const getStartedBtn = document.querySelector('.get-started-btn');
      
      if (loginBtn) loginBtn.textContent = 'Logout';
      if (getStartedBtn) getStartedBtn.textContent = 'Dashboard';
    }
  }, 500);
});