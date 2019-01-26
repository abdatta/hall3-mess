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
  submitting: boolean;
  submitted: boolean;
  rollno: string;
  trackBy = (index: number, row: DishModel) => row.name;

  constructor(private snackBar: MatSnackBar,
              private tokenService: TokensService,
              private dishService: DishesService) { }

  ngOnInit() {
  }

  listToken() {
    if (this.rollno) {
      this.submitting = true;
      this.tokenService.getEditTokens(this.rollno)
          .subscribe(tokens => {
            // sort tokens by date and time
            tokens = tokens.sort((t1, t2) => t2.date.localeCompare(t1.date));

            this.tokens = tokens;
            this.submitting = false;
            this.submitted = true;
          },
          error => {
            if (error === 404) {
              this.snackBar.open('User does not exist.');
            } else {
              this.snackBar.open('Oops! Some error occured.', 'Retry')
                    .onAction().subscribe(_ => this.listToken());
            }
            this.submitting = false;
          });
      } else {
        this.snackBar.open('Please enter a roll no.');
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

  delete(i: number, j: number) { // i is token index, j is dish index
    this.tokenService.reduceDishesInToken(this.tokens[i], this.tokens[i].dishes[j])
      .subscribe(
        (updatedToken: TokenModel) => {
          this.snackBar.open('Dish deleted successfully');
          this.tokens[i] = updatedToken;
        },
        (error) => {
          if (error === 404) {
            this.snackBar.open('Invalid token or dish.');
          } else {
            this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.delete(i, j));
          }
        });
  }
}
