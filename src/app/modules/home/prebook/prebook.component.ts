import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
import { PrebookingService } from '@app/services/prebooking.service';
import { PrebookingModel } from '@app/models/prebooking.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-prebook',
  templateUrl: './prebook.component.html',
  styleUrls: ['./prebook.component.css']
})
export class PrebookComponent implements OnInit {

  dishes: DishModel[];
  loading: boolean;
  submitting: boolean;
  selected: boolean[];
  prebooked: PrebookingModel[];
  prebooking = true;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private dishesService: DishesService,
              private prebookingService: PrebookingService) { }

  ngOnInit() {
    this.loading = true;

    this.dishesService.getSomedaysDishes(moment().add(1, 'd').format('dddd'))
      .subscribe(dishes => {
        this.dishes = dishes.filter(dish => dish.prebookable);
        this.loading = false;
      },
      error => {
        if (error === 999) {
          this.snackBar.open('We have no offline data at the moment. Please come online to load some data.');
        } else {
          this.snackBar.open('Oops! Some error occured. Please refresh the page.');
        }
        this.loading = false;
      });
  }

  set setDishes(dishes: DishModel[]) {
    if (dishes) {
      dishes.sort((a: DishModel, b: DishModel) => b.frequency - a.frequency);
      dishes.forEach(dish => dish.quantity = dish.quantity || 0);
      this.selected = dishes.map(_ => false);
      this.dishes = dishes;
    }
  }

  prebook(selected: boolean[]) {
    const dishes = this.dishes && this.dishes.filter((_, i) => selected[i]);
    if (dishes && dishes.length) {
      this.submitting = true;
      dishes.forEach(dish => {
//        this.prebooked[dishes.indexOf(dish)].dish_id = dish._id;
//        this.prebooked[dishes.indexOf(dish)].quantity = dish.quantity;
//    copy value from dishmodel to a prebookmodel -> prebooked
      });
      this.prebookingService
        .prebook(this.prebooked)
        .subscribe(token => {
          if (token) {
//          add this part
          }
        },
        error => {
          if (error === 400) {
            this.snackBar.open('Invalid Request');
          } else if (error === 999) {
            this.snackBar.open('No internet connection. Prebooking only works online.');
          } else {
            this.snackBar.open('Oops! Some error occured', 'Retry')
              .onAction().subscribe(_ => this.prebook(selected));
          }
          this.submitting = false;
        });
      } else {
        this.snackBar.open('No dish is selected.');
      }
  }

}
