import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';

@Component({
  selector: 'app-thisweek',
  templateUrl: './thisweek.component.html',
  styleUrls: ['./thisweek.component.css']
})
export class ThisweekComponent implements OnInit {

  days = ["Monday",
         "Tuesday",
         "Wednesday",
         "Thrusday",
         "Friday",
         "Saturday",
         "Sunday"];

  mondaydishes: DishModel[];
  tuesdaydishes: DishModel[];
  wednesdaydishes: DishModel[];
  thursdaydishes: DishModel[];
  fridaydishes: DishModel[];
  saturdaydishes: DishModel[];
  sundaydishes: DishModel[];


  constructor(private dishesService: DishesService, private tokensService: TokensService) { }

  ngOnInit() {
    this.dishesService.getSomedaysDishes('monday')
    .subscribe(dishes => {
      this.mondaydishes = dishes; 
    });
    this.dishesService.getSomedaysDishes('tuesday')
    .subscribe(dishes => {
      this.tuesdaydishes = dishes; 
    });
    this.dishesService.getSomedaysDishes('wednesday')
    .subscribe(dishes => {
      this.wednesdaydishes = dishes; 
    });
    this.dishesService.getSomedaysDishes('thursday')
    .subscribe(dishes => {
      this.thursdaydishes = dishes; 
    });
    this.dishesService.getSomedaysDishes('friday')
    .subscribe(dishes => {
      this.fridaydishes = dishes; 
    });
    this.dishesService.getSomedaysDishes('saturday')
    .subscribe(dishes => {
      this.saturdaydishes = dishes; 
    });
    this.dishesService.getSomedaysDishes('sunday')
    .subscribe(dishes => {
      this.sundaydishes = dishes; 
    });
}

}
