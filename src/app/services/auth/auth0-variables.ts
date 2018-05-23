interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  AUDIENCE: string;
  SCOPE: string;
  NAMESPACE: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'BdBlMDimRx4tHtOkpSdVl5fm1Pw8F61y',
  domain: 'warriors.auth0.com',
  callbackURL: 'http://localhost:3000/callback',
  AUDIENCE: 'https://warriors.auth0.com/api/v2/',
  SCOPE: 'openid profile',
  NAMESPACE: 'http://warriors.com/roles'
};
