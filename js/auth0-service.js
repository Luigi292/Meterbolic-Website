// auth0-service.js
import auth0Config from './auth0-config.js';

class Auth0Service {
  constructor() {
    this.auth0Client = null;
    this.isAuthenticated = false;
    this.userProfile = null;
    this.initAuth0();
  }

  async initAuth0() {
    try {
      // Create Auth0 client
      this.auth0Client = await auth0.createAuth0Client({
        domain: auth0Config.domain,
        clientId: auth0Config.clientId,
        authorizationParams: {
          redirect_uri: auth0Config.authorizationParams.redirect_uri
        }
      });

      // Check if user is authenticated
      this.isAuthenticated = await this.auth0Client.isAuthenticated();
      
      if (this.isAuthenticated) {
        // Get user profile
        this.userProfile = await this.auth0Client.getUser();
        this.updateUIAfterAuthentication();
      }

      // Handle redirect callback if needed
      if (window.location.search.includes('code=') && 
          window.location.search.includes('state=')) {
        await this.auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
        this.isAuthenticated = await this.auth0Client.isAuthenticated();
        
        if (this.isAuthenticated) {
          this.userProfile = await this.auth0Client.getUser();
          this.updateUIAfterAuthentication();
        }
      }
    } catch (error) {
      console.error('Error initializing Auth0:', error);
    }
  }

  async login() {
    try {
      await this.auth0Client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: auth0Config.authorizationParams.redirect_uri
        }
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async register() {
    try {
      await this.auth0Client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: auth0Config.authorizationParams.redirect_uri,
          screen_hint: "signup"
        }
      });
    } catch (error) {
      console.error('Register error:', error);
    }
  }

  async logout() {
    try {
      await this.auth0Client.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  updateUIAfterAuthentication() {
    const loginBtn = document.querySelector('.login-btn');
    const getStartedBtn = document.querySelector('.get-started-btn');
    
    if (this.isAuthenticated && loginBtn && getStartedBtn) {
      loginBtn.textContent = 'Logout';
      loginBtn.onclick = () => this.logout();
      
      getStartedBtn.textContent = 'Dashboard';
      getStartedBtn.onclick = () => {
        window.location.href = '/dashboard.html';
      };
    }
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getUserProfile() {
    return this.userProfile;
  }
}

// Create a singleton instance
const auth0Service = new Auth0Service();
export default auth0Service;