import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UserModel } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: Promise<UserModel>;
  private isInMess: Promise<boolean>;

  constructor(private http: HttpClient,
              private router: Router) {
    const authStatus = this.http.get<{user: UserModel, mess: boolean}>('/api/account/auth')
                           .pipe(catchError((err: any, caught) => of(null))).toPromise();
    this.currentUser = authStatus.then(auth => auth.user);
    this.isInMess = authStatus.then(auth => auth.mess === true);
  }

  checkMess = (): Promise<boolean> => this.isInMess;

  getUser = (): Promise<UserModel> => this.currentUser;

  check = (): Promise<boolean> => this.currentUser.then((user: UserModel) => user != null);

  logIn(roll: string, pass: string): Observable<number> {
    return this.http.post<UserModel>('/api/account/login', { rollno: roll, password: pass})
      .pipe(
        map((response: UserModel) => {
          this.currentUser = Promise.resolve(response);
          return 200;
        }),
        catchError(this.handleError)
      );
  }

  signUp(roll: string, pass: string): Observable<number> {
    return this.http.post<UserModel>('/api/account/signup', { rollno: roll, password: pass })
      .pipe(
        map((response: UserModel) => {
          this.currentUser = Promise.resolve(response);
          return 200;
        }),
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

  messOut(): void {
    this.isInMess = Promise.resolve(false);
    // To execute observable, it is converted to a promise
    this.http.post('/api/account/messout', {})
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(_ => {
        this.router.navigateByUrl('/mess');
      });
  }

  handleError(error: any): Observable<any> {
    if (error.status === 401) {
      this.currentUser = Promise.resolve(null);
    }
    if (error.status) {
      return of(error.status);
    }
    return throwError(error.message || error);
  }
}
