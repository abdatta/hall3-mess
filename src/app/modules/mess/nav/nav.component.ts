import { Component, OnInit } from '@angular/core';
import { TokensService } from '@app/services';
import { TokenModel } from '@app/models';
import * as moment from 'moment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  tokens: TokenModel[];
  opened: number;

  constructor(private tokenService: TokensService) { }

  ngOnInit() {
    // Fetching recents when first loaded
    this.tokenService.getRecentTokens()
      .subscribe(tokens => {
        this.tokens = tokens;
        this.opened = 0;
      });

    // Subscribing to recent tokens for auto update
    this.tokenService.recentTokens
      .subscribe(tokens => {
        this.tokens = tokens;
        this.opened = 1;
        setTimeout(() => this.opened = 0, 300);
      });
  }

  fromNow(date: string) {
    return moment(date).fromNow();
  }

}
