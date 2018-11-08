import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';
import * as moment from 'moment';

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
  today: string;
  menu = {};

  constructor(private dishesService: DishesService, private tokensService: TokensService) { }

  ngOnInit() {
    this.today = moment().format('dddd');
    for (const day of this.days) {
      this.dishesService.getSomedaysDishes(day)
        .subscribe(dishes => {
          this.menu[day] = {
            Breakfast: this.groupByPrebookable(this.filterSlot(dishes, 'Breakfast')),
            Lunch: this.groupByPrebookable(this.filterSlot(dishes, 'Lunch')),
            Dinner: this.groupByPrebookable(this.filterSlot(dishes, 'Dinner')),
          };
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

}
