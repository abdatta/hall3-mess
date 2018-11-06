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

  constructor(private http: HttpClient,
              private router: Router) {
    this.currentUser = this.http.get<UserModel>('/api/account/auth')
      .pipe(
        catchError((err: any, caught) => of(null))
      ).toPromise();
  }

  getUser = (): Promise<UserModel> => this.currentUser;

  check(): Promise<boolean> {
    return this.currentUser.then((user: UserModel) => {
      return user != null;
    });
  }

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
      .subscribe(o => this.router.navigateByUrl('/'));
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
