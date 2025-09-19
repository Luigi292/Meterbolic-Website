// auth0-config.js
const auth0Config = {
  domain: "dev-a4hml2pt06o7dkhg.uk.auth0.com",
  clientId: "Uw5K5EsvF43NoE1n5kqGZaXTyJkVxg84",
  authorizationParams: {
    redirect_uri: window.location.origin,
    // For development, you might want to use:
    // redirect_uri: "http://localhost:3000/auth/callback"
  }
};

export default auth0Config;