import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Network } from '@ngx-pwa/offline';

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

  constructor(private http: HttpClient,
              private router: Router,
              private network: Network,
              private analytics: NgxAnalytics,
              private dishesService: DishesService,
              private notificationsService: NotificationsService) {

    const authStatus = this.http.get<{user: UserModel, mess: boolean}>('/api/account/auth')
                                .toPromise();
    this.currentUser = authStatus.then(auth => auth.user).catch(_ => null);
    this.isInMess = authStatus.then(auth => auth.mess === true).catch(_ => false);
  }

  checkMess = (): Promise<boolean> => this.isInMess;

  getUser = (): Promise<UserModel> => this.currentUser;

  check = (): Promise<boolean> => this.currentUser.then((user: UserModel) => user != null);

  hasControl = (): Promise<boolean> => this.currentUser.then((user: UserModel) =>
                                       user.permissions.length > 0 || user.rollno === 'admin')

  hasPermissions = (perms: string[]): Promise<boolean> => this.currentUser.then((user: UserModel) =>
                       perms.every(perm => user.permissions.includes(perm)) || user.rollno === 'admin')

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
        map((response: UserModel) => {
          this.currentUser = Promise.resolve(response);
          // this.isInMess.then(mess => mess ? null : this.notificationsService.subscribeToNotifications());

          this.isInMess.then(mess => {
            if (mess) {
              return;
            }
            this.http.get('/api/account/auth').toPromise().catch(); // Re-caches the auth api endpoint

            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                    .forEach(day => this.dishesService.getSomedaysDishes(day).subscribe());

            this.analytics.eventTrack.next({
              action: 'Login',
              properties: {
                category: 'Auth',
                label: response.rollno,
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
        map((response: UserModel) => {
          this.currentUser = Promise.resolve(response);
          return 200;
        }),
        catchError(this.handleError)
      );
  }

  like(liked: boolean): Observable<number> {
    return this.http.patch<UserModel>('/api/account/update', { liked })
    .pipe(
      map((response: UserModel) => {
        this.currentUser = Promise.resolve(response);
        this.analytics.eventTrack.next({
          action: liked ? 'Like' : 'Unlike',
          properties: {
            category: 'Like/Unlike',
            label: response.rollno
          },
        });
        return 200;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.currentUser = Promise.resolve(null);
    // To execute observable, it is converted to a promise
    this.http.post('/api/account/logout', {})
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(_ => {
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
          this.isInMess = Promise.resolve(res.mess);
          return 200;
        }),
        catchError(this.handleError)
      );
  }

  messOut(pass: string): Promise<number> {
    const messingOut = this.http.post('/api/account/messout', { password: pass })
      .pipe(
        map((res) => 200),
        catchError(this.handleError)
      ).toPromise();

      this.isInMess = messingOut.then(res => res !== 200);
      this.currentUser = messingOut.then(async res => res === 200 ? null : await this.currentUser);
      return messingOut;
  }

  handleError = (error: any): Observable<any> => {
    if (!this.network.online) {
      error.status = 999; // Custom Error Code for Offline Status
    }
    if (error.status === 401) {
      this.currentUser = Promise.resolve(null);
    }
    if (error.status) {
      return of(error.status);
    }
    return throwError(error.message || error);
  }
}
