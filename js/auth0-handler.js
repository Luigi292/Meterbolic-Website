// auth0-handler.js
import auth0Service from './auth0-service.js';

document.addEventListener('DOMContentLoaded', function() {
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
  setTimeout(() => {
    if (auth0Service.getIsAuthenticated()) {
      const loginBtn = document.querySelector('.login-btn');
      const getStartedBtn = document.querySelector('.get-started-btn');
      
      if (loginBtn) loginBtn.textContent = 'Logout';
      if (getStartedBtn) getStartedBtn.textContent = 'Dashboard';
    }
  }, 1000);
});