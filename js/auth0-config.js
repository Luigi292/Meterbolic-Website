// Auth0 configuration
const auth0Config = {
  domain: "dev-a4hml2pt06o7dkhg.uk.auth0.com",
  clientId: "Uw5K5EsvF43NoE1n5kqGZaXTyJkVxg84",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: `https://${"dev-a4hml2pt06o7dkhg.uk.auth0.com"}/api/v2/`
  },
  // For development, you might want to use specific redirect URIs
  development: {
    redirect_uri: "http://localhost:3000/auth/callback",
    logout_redirect_uri: "http://localhost:3000/"
  }
};