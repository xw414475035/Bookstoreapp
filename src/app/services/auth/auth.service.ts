import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService {

  userProfile: any;
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  // Subscribe to token expiration stream
  refreshSub: Subscription;

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.AUDIENCE,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: AUTH_CONFIG.SCOPE
  });

  constructor(public router: Router, private http: HttpClient) {
    // If authenticated, set local profile property,
    // admin status, update login status, schedule renewal.
    // If not authenticated but there are still items
    // in localStorage, log out.
    const lastProfile = localStorage.getItem('profile');

    if (this.isAuthenticated()) {
      this.userProfile = JSON.parse(lastProfile);
      this.setLoggedIn(true);
      this.scheduleRenewal();
    } else if (!this.isAuthenticated && lastProfile) {
      this.logout();
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  public login(redirect?: string): void {
    // Set redirect after login
    const _redirect = redirect ? redirect : this.router.url;
    localStorage.setItem('authRedirect', _redirect);
    // Auth0 authorize request
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.getProfile(authResult);
      } else if (err) {
        this.clearRedirect();
        this.router.navigate(['/']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  public getProfile(authResult): void {
    // Use access token to retrieve user's profile and set session
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      if (profile) {
        this.setSession(authResult, profile);
      } else if (err) {
        console.warn(`Error retrieving profile: ${err.error}`);
      }
    });
  }

  private setSession(authResult, profile?): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // If initial login, set profile and admin information
    this.findOrCreateUser(profile);
  }

  private redirect() {
    // Redirect with or without 'tab' query parameter
    // Note: does not support additional params besides 'tab'
    const fullRedirect = decodeURI(localStorage.getItem('authRedirect'));
    // this.router.navigate([fullRedirect]);
    const redirectArr = fullRedirect.split('?tab=');
    const navArr = [redirectArr[0] || '/'];
    const tabObj = redirectArr[1] ? { queryParams: { tab: redirectArr[1] }} : null;
    if (!tabObj) {
      this.router.navigate(navArr);
    } else {
      this.router.navigate(navArr, tabObj);
    }
  }

  private clearRedirect() {
    // Remove redirect from localStorage
    localStorage.removeItem('authRedirect');
  }

  public logout(noRedirect?: boolean): void {
    // Ensure all auth items removed from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    this.clearRedirect();
    // Reset local properties, update loggedIn$ stream
    this.userProfile = undefined;
    this.setLoggedIn(false);
    // Unschedule access token renewal
    this.unscheduleRenewal();
    // Return to homepage
    if (noRedirect !== true) {
      this.router.navigate(['/']);
    }
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  renewToken() {
    this.auth0.checkSession({},
      (err, authResult) => {
        if (authResult && authResult.accessToken) {
          this.setSession(authResult);
        } else if (err) {
          console.warn(`Could not renew token: ${err.errorDescription}`);
          // Log out without redirecting to clear auth data
          this.logout(true);
          // Log in again
          this.login();
        }
      }
    );
  }

  scheduleRenewal() {
    // If user isn't authenticated, do nothing
    if (!this.isAuthenticated) { return; }
    // Unsubscribe from previous expiration observable
    this.unscheduleRenewal();
    // Create and subscribe to expiration observable
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const expiresIn$ = Observable.of(expiresAt)
      .mergeMap(
        expires => {
          const now = Date.now();
          // Use timer to track delay until expiration
          // to run the refresh at the proper time
          return Observable.timer(Math.max(1, expires - now));
        }
      );

    this.refreshSub = expiresIn$
      .subscribe(
        () => {
          this.renewToken();
          this.scheduleRenewal();
        }
      );
  }

  unscheduleRenewal() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  //sync user data with our database, and get return data save to userProfile
  findOrCreateUser(profile: object) {
    return this.http.post('/api/findOrCreateUser', profile, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    })
    .catch(this._handleError)
    .subscribe(user => {
      localStorage.setItem('profile', JSON.stringify(user));
      this.userProfile = user;
      this.redirect();
      this.clearRedirect();
      // Update login status in loggedIn$ stream
      this.setLoggedIn(true);
      // Schedule access token renewal
      this.scheduleRenewal();
    });
  }

  //update user info
  updateUser(userInfo: object) {
    return this.http.put('/api/updateUser', userInfo, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    })
    .catch(this._handleError)
    .subscribe(user => {
      localStorage.setItem('profile', JSON.stringify(user));
      this.userProfile = user;
    });
  }


  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.login();
    }
    return Observable.throw(errorMsg);
  }
}
