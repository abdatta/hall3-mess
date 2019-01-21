import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TokensService, DishesService } from '@app/services';
import { TokenModel, DishModel } from '@app/models';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-token',
  templateUrl: './edit-token.component.html',
  styleUrls: ['./edit-token.component.css']
})
export class EditTokenComponent implements OnInit {

  tokens: TokenModel[];
  deleting = -1;
  submitted = false;
  rollno: string;

  constructor(private snackBar: MatSnackBar,
              private tokenService: TokensService,
              private dishService: DishesService) { }

  ngOnInit() {
  }

  listToken() {
    if (this.rollno) {
    this.tokenService.getEditTokens(this.rollno)
        .subscribe(tokens => {
          this.tokens = tokens;
          this.submitted = true;
        },
        error => {
          if (error === 404) {
            this.snackBar.open('Rollno not found');
          }
        });
    } else {
      this.snackBar.open('Please Enter Rollno');
    }
  }

  getCost(token: TokenModel) {
    let cost = 0;
    token.dishes
      .forEach(dish => cost += dish.price * dish.quantity);
    return cost;
  }

  format(date: string) {
      return this.dishService.getSlot(date) + ' ' + moment(date).format('HH:mm') + '\u00A0hrs';
  }

  back() {
    this.submitted = false;
    this.rollno = '';
  }

  delete(dish: DishModel, token: TokenModel) {
    this.tokenService.reduceDishesInToken(dish, token)
    .subscribe((s: number) => {
      if (s === 200) {
        this.snackBar.open('Dish deleted successfully');
      } else {
        this.snackBar.open('Oops! Some error occured.', 'Retry')
              .onAction().subscribe(_ => this.delete(dish, token));
      }
  });
  }
}
