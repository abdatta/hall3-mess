import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient,
              private swPush: SwPush) { }

  getVapidKey(): Promise<string> {
    return this.http.get<{publicKey: string}>('/api/notifications/vapid')
      .pipe(
        map((response) => {
          return response.publicKey;
        }),
        catchError(this.handleError)
      ).toPromise();
  }

  async subscribeToNotifications() {
    const key = await this.getVapidKey();
    this.swPush.requestSubscription({ serverPublicKey: key })
      .then(subscription => {
        this.http.post('/api/notifications/subscribe', subscription)
        .pipe(
          catchError(this.handleError)
        ).toPromise();
      })
      .catch(err => console.log('Could not subscribe to notifications'));
  }

  handleError(error: any): Observable<any> {
    if (error.status) {
      return of(error.status);
    }
    return throwError(error.message || error);
  }
}
