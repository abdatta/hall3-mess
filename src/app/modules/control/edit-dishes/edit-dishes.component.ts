import { Component, OnInit } from '@angular/core';
import { DishesService } from '@app/services';
import { DishModel } from '@app/models';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-dishes',
  templateUrl: './edit-dishes.component.html',
  styleUrls: ['./edit-dishes.component.css']
})
export class EditDishesComponent implements OnInit {

  dishes: DishModel[];
  private backupDishes: DishModel[];

  constructor(private dishesService: DishesService,
              private snackbar: MatSnackBar) {

  }

  ngOnInit() {
    this.dishesService.getAllDishes()
      .subscribe(dishes => {
        this.dishes = dishes;
        this.backupDishes = JSON.parse(JSON.stringify(dishes));
      });
  }

  save(i: number) {
    this.dishesService.updateDish(this.dishes[i])
      .subscribe(dish => {
        this.backupDishes[i] = JSON.parse(JSON.stringify(dish));
        this.snackbar.open('Dish saved successfully');
      });
  }

  discard(i: number) {
    this.dishes[i] = JSON.parse(JSON.stringify(this.backupDishes[i]));
  }
}
