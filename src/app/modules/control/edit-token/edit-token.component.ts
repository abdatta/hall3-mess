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

  grouped_tokens = {};
  dates = [];
  deleted: {date: string, i: number; j: number};
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

            // group tokens by date
            tokens.forEach(token => {
              const date = moment(token.date).format('Do MMMM \'YY');
              if (this.grouped_tokens[date]) {
                this.grouped_tokens[date].push(token);
              } else {
                this.grouped_tokens[date] = [token];
                this.dates.push(date);
              }
            });

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
    this.dates = [];
    this.grouped_tokens = {};
    this.rollno = '';
  }

  delete(date: string, i: number, j: number) { // i is token index, j is dish index
    this.tokenService.reduceDishesInToken(this.grouped_tokens[date][i], this.grouped_tokens[date][i].dishes[j])
      .subscribe(
        (updatedToken: TokenModel) => {
          this.snackBar.open('Dish deleted successfully');
          this.deleted = {date, i, j};
          setTimeout(() => {
            this.grouped_tokens[date][i] = updatedToken;
            this.deleted = undefined;
          }, 500); // match the delay with the css animation
        },
        (error) => {
          if (error === 404) {
            this.snackBar.open('Invalid token or dish.');
          } else {
            this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.delete(date, i, j));
          }
        });
  }

  isDeleted(date: string, i: number, j: number) {
    return this.deleted &&
           this.deleted.date === date &&
           this.deleted.i === i &&
           this.deleted.j === j;
  }
}
