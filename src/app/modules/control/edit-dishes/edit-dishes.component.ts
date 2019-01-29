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

  deleting = -1;
  loading = true;
  dishes: DishModel[];
  private backupDishes: DishModel[];

  constructor(private dishesService: DishesService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.loading = true;
    this.dishesService.getAllDishes()
      .subscribe(dishes => {
        this.dishes = dishes;
        this.backupDishes = JSON.parse(JSON.stringify(dishes));
        this.loading = false;
      },
      error => {
        if (error === 999) {
          this.snackBar.open('You are OFFLINE. Please come online and try again.');
        } else {
          this.snackBar.open('Oops! Some error occured', 'Retry')
            .onAction().subscribe(_ => this.ngOnInit());
        }
      });
  }

  save(i: number) {
    this.dishesService.updateDish(this.dishes[i])
      .subscribe(dish => {
        this.backupDishes[i] = JSON.parse(JSON.stringify(dish));
        this.snackBar.open('Dish saved successfully');
      },
      error => {
        if (error === 999) {
          this.snackBar.open('You are OFFLINE. Please come online and try again.');
        } else {
          this.snackBar.open('Oops! Some error occured', 'Retry')
            .onAction().subscribe(_ => this.save(i));
        }
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

  showConfirmDelete(i: number) {
    this.deleting = i;
    setTimeout(() => this.hideConfirmDelete(i), 6000);
  }

  hideConfirmDelete(i: number) {
    if (this.deleting === i) {
      this.deleting = -1;
    }
  }

  delete(i: number) {
    this.dishesService.deleteDish(this.dishes[i])
      .subscribe(dish => {
        this.dishes.splice(i, 1);
        this.snackBar.open('Dish deleted successfully');
      },
      error => {
        if (error === 999) {
          this.snackBar.open('You are OFFLINE. Please come online and try again.');
        } else {
          this.snackBar.open('Oops! Some error occured', 'Retry')
            .onAction().subscribe(_ => this.delete(i));
        }
      });
  }

}
