import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from '@app/services';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-messhome',
  templateUrl: './messhome.component.html',
  styleUrls: ['./messhome.component.css']
})
export class MesshomeComponent implements OnInit {

  currentUrl: string;
  role = 'mess';
  nav = [
    {
      title: 'Notifications',
      url: '/messhome/issuetoken',
      icon: 'notifications',
      badge: 3
    },
    {
      title: 'Issue Token',
      url: '/messhome/issuetoken',
      icon: 'monetization_on',
    },
    {
      title: 'Non-Veg Booking',
      url: '/messhome/nonvegbookings',
      icon: 'restaurant',
    },
    {
      title: 'Change Password',
      url: '/messhome/changepassword',
      icon: 'vpn_key',
    }
  ];

  constructor(private breakpointObserver: BreakpointObserver,
    private authService: AuthService, private router: Router) {
      router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url);
    }

  ngOnInit() {
  }

}
