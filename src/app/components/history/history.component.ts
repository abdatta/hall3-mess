import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokensService } from '@app/services';
import { TokenModel } from '@app/models';
import * as moment from 'moment';

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

  constructor(private tokensService: TokensService,
              private route: ActivatedRoute) {}
  ngOnInit() {
    // tokens are being loaded
    this.loading = true;

    this.tokensService.getTokens()
      .subscribe(tokens => {
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

        // query parameters
        this.route.queryParams
          .subscribe(param => {
            if (param.show) {
              this.init_id = param.show;
            }
          });

        // tokens successfully loaded
        this.loading = false;
      });
  }

  getCost(token: TokenModel) {
    let cost = 0;
    token.dishes
      .forEach(dish => cost += dish.price * dish.quantity);
    return cost;
  }

  // TODO : Display seperate accordians for each date.

  format(date: string) {
    return moment(date).format('hh:mm\u00A0a');
  }
}
