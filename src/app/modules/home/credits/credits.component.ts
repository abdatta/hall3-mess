import { Component, OnInit } from '@angular/core';
import { NgxAnalytics } from 'ngx-analytics';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {

  thumbsup = false;

  constructor(private analytics: NgxAnalytics,
              private authService: AuthService) { }

  ngOnInit() {
  }

  async like() {
    this.thumbsup = !this.thumbsup;
    this.analytics.eventTrack.next({
      action: this.thumbsup ? 'Like' : 'Unlike',
      properties: {
        category: 'Like/Unlike',
        label: (await this.authService.getUser()).rollno
      },
    });
  }

}
