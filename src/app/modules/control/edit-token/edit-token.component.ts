import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TokensService } from '@app/services';
import { TokenModel } from '@app/models';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-token',
  templateUrl: './edit-token.component.html',
  styleUrls: ['./edit-token.component.css']
})
export class EditTokenComponent implements OnInit {

  tokens: TokenModel[];
  deleting = -1;

  constructor(private snackbar: MatSnackBar,
              private tokenService: TokensService) { }

  ngOnInit() {
  }

  listToken(rollno: number) {
    if (rollno) {
    this.tokenService.getEditTokens(rollno)
        .subscribe(tokens => {
          this.tokens = tokens;
          console.log(this.tokens);
        },
        error => {
          if (error === 404) {
            this.snackbar.open('Not a valid Rollno');
          }
        });
    } else {
      this.snackbar.open('Please Enter Rollno');
    }
  }

  getCost(token: TokenModel) {
    let cost = 0;
    token.dishes
      .forEach(dish => cost += dish.price * dish.quantity);
    return cost;
  }

  format(date: string) {
    if (moment(date).format('HHmm') <= '1045') {
      return 'Breakfast ' + moment(date).format('HH:mm') + '\u00A0hrs';
    } else if ((moment(date).format('HHmm') > '1045') && (moment(date).format('HHmm') <= '1700')) {
      return 'Lunch ' + moment(date).format('HH:mm') + '\u00A0hrs';
    } else {return 'Dinner ' + moment(date).format('HH:mm') + '\u00A0hrs'; }
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

  discard(i: number) {

  }

  changeQuantity(i: number, j: number ) {
    this.tokens[i].dishes[j].quantity -= 1;
  }

  save(i: number) {

  }
}
