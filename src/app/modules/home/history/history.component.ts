import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokensService, DishesService } from '@app/services';
import { TokenModel } from '@app/models';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {

  grouped_tokens = {};
  dates = [];
  init_id: string;
  loading: boolean;
  fetching: boolean;
  fetchedAll: boolean;
  tab = 0;
  newbie = false;
  total = 0;
  bills: { month: string; total: number; }[];

  constructor(private tokensService: TokensService,
              private dishService: DishesService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.fetchTokens();
    this.fetchBills();
  }

  fetchTokens() {
    // tokens are being loaded
    this.loading = true;
    this.tokensService.getTokens()
      .subscribe(tokens => {
        // If no token is found
        if (tokens.length === 0) {
        this.newbie = true;
        }

        // sort tokens by date and time
        tokens = tokens.sort((t1, t2) =>
                        t2.date.localeCompare(t1.date));

        // calculate total this month
        /* TODO: needs to be fetched from api when only last 10 tokens return */
        this.total = tokens.filter(token => moment().isSame(token.date, 'month'))
                           .reduce((total, token) => total + this.getCost(token), 0);

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

        // query parameters
        this.route.queryParams
          .subscribe(param => {
            if (param.show) {
              this.init_id = param.show;
            }
          });

        // tokens successfully loaded
        this.loading = false;
      },
      error => {
        if (error === 999) {
          this.snackBar.open('We have no offline data at the moment. Please come online to load some data.');
        } else {
          this.snackBar.open('Oops! Some error occured. Please refresh the page.');
        }
        this.loading = false;
      });
  }

  fetchBills() {
    this.tokensService.getMonthlyBills()
      .subscribe(
        bills => {
          bills.forEach(bill =>
            bill.month = moment(bill.month, 'YYYY-MM').format('MMMM \'YY'));
          this.bills = bills;
        },
        error => {
          if (error === 999) {
            this.snackBar.open('We have no offline data at the moment. Please come online to load some data.');
          } else {
            this.snackBar.open('Oops! Some error occured. Please refresh the page.');
          }
      });
  }

  isThisMonth(month: string) {
    return moment(month, 'MMMM \'YY').isSame(moment(), 'month');
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

  fetchMoreTokens() {
    this.fetching = true;
    let offset = this.getLastElement(this.grouped_tokens[this.getLastElement(this.dates)]);
    offset = offset && offset.date;
    this.tokensService.getTokens(offset)
      .subscribe(tokens => {
        if (tokens.length === 0) {
          this.fetching = false;
          this.fetchedAll = true;
          return;
        }

        // remove any duplicate tokens
        tokens = tokens.filter(token => this.dates
                         .every(date => this.grouped_tokens[date]
                           .every(gtoken => gtoken._id !== token._id)));

        // sort tokens by date and time
        tokens = tokens.sort((t1, t2) =>
                        t2.date.localeCompare(t1.date));

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
        this.fetching = false;
      },
      error => {
        this.snackBar.open('Could not fetch more tokens. Some error occured.');
        this.fetching = false;
      });
  }

  private getLastElement(elems: any[]) {
    if (elems.length === 0) {
      return null;
    }
    return elems[elems.length - 1];
  }
}
