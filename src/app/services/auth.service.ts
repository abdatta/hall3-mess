import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Network } from '@ngx-pwa/offline';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { UserModel } from '@app/models';
import { NotificationsService } from '@app/services/notifications.service';
import { DishesService } from '@app/services/dishes.service';
import { NgxAnalytics } from 'ngx-analytics';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: Promise<UserModel>;
  private isInMess: Promise<boolean>;

  private async setCurrentUser($user: Promise<UserModel>) {
    this.currentUser = $user;
    // Update local storage
    const user = await $user;
    if (user) {
      this.localStorage.setItemSubscribe('user', user);
    } else {
      this.localStorage.removeItemSubscribe('user');
    }
  }

  private async setInMess(mess: Promise<boolean>) {
    this.isInMess = mess;
    this.localStorage.setItemSubscribe('mess', (await mess) === true); // Update local storage
  }

  checkMess = (): Promise<boolean> => this.isInMess;

  getUser = (): Promise<UserModel> => this.currentUser;

  check = (): Promise<boolean> => this.currentUser.then((user: UserModel) => user != null);

  hasControl = async (): Promise<boolean> => {
    const user = await this.currentUser;
    if (user.rollno === 'admin') { return true; }
    return user.permissions.length > 0 && !user.permissions.includes('user');
  }

  hasPermissions = async (perms: string[]): Promise<boolean> => {
    const user = await this.currentUser;
    if (user.rollno === 'admin') { return true; }
    return perms.every(perm => user.permissions.includes(perm));
  }

  constructor(private http: HttpClient,
              private router: Router,
              private network: Network,
              private analytics: NgxAnalytics,
              private localStorage: LocalStorage,
              private dishesService: DishesService,
              private notificationsService: NotificationsService) {

    if (this.network.online) {
      const authStatus = this.http.get<{user: UserModel, mess: boolean}>('/api/account/auth').toPromise();
      this.setCurrentUser(authStatus.then(auth => auth.user).catch(_ => null));
      this.setInMess(authStatus.then(auth => auth.mess === true).catch(_ => false));
    } else {
      this.currentUser = this.localStorage.getItem<UserModel>('user').toPromise();
      this.isInMess = this.localStorage.getItem<boolean>('mess').toPromise();
    }
  }

  authIITK(IITKusername: string, IITKpassword: string): Observable<number> {
    return this.http.post('/api/account/auth/iitk', { IITKusername, IITKpassword })
      .pipe(
        map(response => 200),
        catchError(this.handleError)
      );
  }

  logIn(roll: string, pass: string): Observable<number> {
    return this.http.post<UserModel>('/api/account/login', { rollno: roll, password: pass})
      .pipe(
        map((user: UserModel) => {
          this.setCurrentUser(Promise.resolve(user));
          // this.isInMess.then(mess => mess ? null : this.notificationsService.subscribeToNotifications());

          this.isInMess.then(mess => {
            if (mess) {
              return;
            }
            this.http.get('/api/account/auth').toPromise().catch(); // Re-caches the auth api endpoint

            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                    .forEach(day => this.dishesService.getSomedaysDishes(day).subscribe());

            // Track login event
            this.analytics.eventTrack.next({
              action: 'Login',
              properties: {
                category: 'Auth',
                label: user.rollno,
              },
            });
          });

          return 200;
        }),
        catchError(this.handleError)
      );
  }

  signUp(name: string, rollno: string, password: string, IITKusername, IITKpassword): Observable<number> {
    return this.http.post<UserModel>('/api/account/signup', { name, rollno, password, IITKusername, IITKpassword })
      .pipe(
        map((response: UserModel) => 200),
        catchError(this.handleError)
      );
  }

  verifyUser(id: string): Observable<number> {
    return this.http.post('/api/account/verify/' + id, {})
      .pipe(
        map(response => 200),
        catchError(this.handleError)
      );
  }

  deleteUnverifiedUser(id: string): Observable<number> {
    return this.http.post('/api/account/delete_unverified/' + id, {})
      .pipe(
        map(response => 200),
        catchError(this.handleError)
      );
  }

  forgotPassword(roll: string): Observable<number> {
    return this.http.post('/api/account/forgot_password', { rollno: roll })
      .pipe(
        map(response => 200),
        catchError(this.handleError)
      );
  }

  resetPassword(rollno: string, reset_code: string, password: string) {
    return this.http.post('/api/account/reset_password', { rollno, reset_code, password })
      .pipe(
        map(response => 200),
        catchError(this.handleError)
      );
  }

  chngpin(oldpin: string, newpin: string): Observable<number> {
    return this.http.patch<UserModel>('/api/account/update', { password: oldpin, newpassword: newpin })
      .pipe(
        map((user: UserModel) => {
          this.setCurrentUser(Promise.resolve(user));
          return 200;
        }),
        catchError(this.handleError)
      );
  }

  like(liked: boolean): Observable<number> {
    return this.http.patch<UserModel>('/api/account/update', { liked })
    .pipe(
      map((user: UserModel) => {
        this.setCurrentUser(Promise.resolve(user));
        // Track like event
        this.analytics.eventTrack.next({
          action: liked ? 'Like' : 'Unlike',
          properties: {
            category: 'Like/Unlike',
            label: user.rollno
          },
        });
        return 200;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.setCurrentUser(Promise.resolve(null));
    // To execute observable, it is converted to a promise
    this.http.post('/api/account/logout', {})
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(_ => {
        this.localStorage.removeItemSubscribe('tokens');
        this.isInMess.then(mess => {
          this.router.navigateByUrl(mess ? '/mess/login' : '/');
          if (mess) {
            this.router.navigateByUrl('/mess/login');
          } else {
            this.router.navigateByUrl('/');
            this.http.get('/api/account/auth').toPromise().catch(); // Re-caches the auth api endpoint
          }
        });
      });
  }

  messIn(pass: string): Observable<number> {
    return this.http.post<{mess: boolean}>('/api/account/messin', {password: pass})
      .pipe(
        map((res: {mess: boolean}) => {
          this.setInMess(Promise.resolve(res.mess));
          return 200;
        }),
        catchError(this.handleError)
      );
  }

  async messOut(pass: string): Promise<number> {
    const messingOut = this.http.post('/api/account/messout', { password: pass })
      .pipe(
        map((res) => 200),
        catchError(this.handleError)
      ).toPromise();

      this.setInMess(messingOut.then(res => res !== 200));
      this.setCurrentUser(messingOut.then(async res => res === 200 ? null : await this.currentUser));

      return messingOut;
  }

  handleError = (error: any): Observable<any> => {
    if (!this.network.online) {
      error.status = 999; // Custom Error Code for Offline Status
    }
    if (error.status === 401) {
      this.setCurrentUser(Promise.resolve(null));
      this.router.navigateByUrl('/login');
    }
    if (error.status) {
      return of(error.status);
    }
    return throwError(error.message || error);
  }
}
