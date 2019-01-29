import { Component, OnInit } from '@angular/core';
import { DishesService } from '@app/services';
import { DishModel } from '@app/models';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-thisweek',
  templateUrl: './thisweek.component.html',
  styleUrls: ['./thisweek.component.css']
})
export class ThisweekComponent implements OnInit {

  days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  active: number;
  menu = {};

  constructor(private dishesService: DishesService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.active = this.days.indexOf(moment().format('dddd'));
    for (const day of this.days) {
      this.dishesService.getSomedaysDishes(day)
        .subscribe(dishes => {
          this.menu[day] = {
            Breakfast: this.groupByPrebookable(this.filterSlot(dishes, 'Breakfast')),
            Lunch: this.groupByPrebookable(this.filterSlot(dishes, 'Lunch')),
            Dinner: this.groupByPrebookable(this.filterSlot(dishes, 'Dinner')),
          };
        }, error => {
          if (error === 999) {
            this.snackBar.open(`We have no offline data at the moment for ${day}. Please come online to load some data.`);
          } else {
            this.snackBar.open('Oops! Some error occured. Please refresh the page.');
          }
        });
    }
  }

  filterSlot(dishes: DishModel[], slot: 'Breakfast' | 'Lunch' | 'Dinner') {
    return dishes && dishes.filter(dish => dish.slot.includes(slot));
  }

  groupByPrebookable(dishes: DishModel[]) {
    return {
      pre: dishes.filter(dish => dish.prebookable),
      notpre: dishes.filter(dish => !dish.prebookable)
    };
  }

  nextday() {
    if (this.active < 6) {
      this.active++;
    }
  }

  prevday() {
    if (this.active > 0) {
      this.active--;
    }
  }

}
