import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { DishesService } from '@app/services';
import { DishModel } from '@app/models';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css']
})
export class AddDishComponent implements OnInit {

  dish: DishModel;

  constructor(private dialogRef: MatDialogRef<AddDishComponent>,
              private dishesService: DishesService,
              private snackbar: MatSnackBar) {
                this.dish = {
                  _id: null,
                  short_id: null,
                  name: '',
                  price: null,
                  slot: [],
                  days: [],
                  prebookable: false,
                };
               }

  ngOnInit() {
  }

  add() {
    if ( this.isValid(this.dish) ) {
    this.dishesService.addDish(this.dish)
      .subscribe(dish => {
        this.dialogRef.close(dish);
        this.snackbar.open('Dish saved successfully');
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  isValid(dish: DishModel) {
    if (!dish.name) {
      this.snackbar.open('Please enter dish name');
    } else if (!dish.price) {
      this.snackbar.open('Please enter dish price');
    } else if (!dish.slot.length) {
      this.snackbar.open('Please enter dish slot(s)');
    } else if (!dish.days.length) {
      this.snackbar.open('Please enter day(s)');
    } else {
      return true;
    }
      return false;
  }
}
