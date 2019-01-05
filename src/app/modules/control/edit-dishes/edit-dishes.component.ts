import { Component, OnInit } from '@angular/core';
import { DishesService } from '@app/services';
import { DishModel } from '@app/models';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { AddDishComponent } from '../add-dish/add-dish.component';

@Component({
  selector: 'app-edit-dishes',
  templateUrl: './edit-dishes.component.html',
  styleUrls: ['./edit-dishes.component.css']
})
export class EditDishesComponent implements OnInit {

  loading = true;
  dishes: DishModel[];
  private backupDishes: DishModel[];

  constructor(private dishesService: DishesService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar) {

  }

  ngOnInit() {
    this.loading = true;
    this.dishesService.getAllDishes()
      .subscribe(dishes => {
        this.dishes = dishes;
        this.backupDishes = JSON.parse(JSON.stringify(dishes));
        this.loading = false;
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

  add() {
    const dialogRef = this.dialog.open(AddDishComponent, {
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed()
        .subscribe(dish => {
          if (dish) {
            this.dishes.push(dish);
            this.backupDishes.push(dish);
          }
        });
  }
}
