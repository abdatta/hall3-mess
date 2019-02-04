import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Network } from '@ngx-pwa/offline';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { DishModel } from '@app/models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class DishesService {

  constructor(private http: HttpClient,
              private localStorage: LocalStorage,
              private network: Network) { }

  getSlot(date = new Date().toISOString()): ('Breakfast' | 'Lunch' | 'Dinner') {
    if (moment(date).format('HHmm') <= '1100') {
      return 'Breakfast';
    } else if (moment(date).format('HHmm') <= '1700') {
      return 'Lunch';
    } else {
      return 'Dinner';
    }
  }
  getSomedaysDishes(day: string): Observable<DishModel[]> {
    day = day.toLowerCase();
    if (this.network.online) {
      return this.http.get<DishModel[]>('/api/dishes/' + day)
        .pipe(
          tap(dishes => this.localStorage.setItemSubscribe(day, dishes)),
          catchError(this.handleError)
        );
    } else {
      return this.localStorage.getItem<DishModel[]>(day)
        .pipe(tap(dishes => {
          if (dishes === null) {
            throw 999; // offline error code
          }
        }));
    }
  }

  getAllDishes(): Observable<DishModel[]> {
    return this.http.get<DishModel[]>('/api/dishes/all')
      .pipe(catchError(this.handleError));
  }

  updateDish(dish: DishModel): Observable<DishModel> {
    return this.http.put<DishModel>('/api/dishes/update/' + dish._id, dish)
      .pipe(catchError(this.handleError));
  }

  addDish(dish: DishModel): Observable<DishModel> {
    return this.http.post<DishModel>('/api/dishes/add', dish)
      .pipe(catchError(this.handleError));
  }

  deleteDish(dish: DishModel): Observable<number> {
    return this.http.delete('/api/dishes/delete/' + dish._id, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  handleError = (error: any): Observable<any> => {
    if (!this.network.online) {
      error.status = 999; // Custom Error Code for Offline Status
    }
    return throwError(error.status || error.message || error);
  }
}
