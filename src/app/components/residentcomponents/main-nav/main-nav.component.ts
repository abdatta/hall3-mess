import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@app/services';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  currentUrl: string;
  rollno: string;
  navs = [
    {
      title: 'Notifications',
      url: '/home/notifications',
      icon: 'notifications',
      badge: 3
    },
    {
      title: 'Book',
      url: '/home/book',
      icon: 'border_color'
    },
    {
      title: 'Pre-book',
      url: '/home/prebook',
      icon: 'restaurant'
    },
    {
      title: 'Menu This Week',
      url: '/home/thisweek',
      icon: 'restaurant_menu'
    },
    {
      title: 'Bills and History',
      url: '/home/history',
      icon: 'calendar_today'
    },
    {
      title: 'Not Well',
      url: '/home/notwell',
      icon: 'local_hospital'
    },
    {
      title: 'Change Password',
      url: '/home/changepassword',
      icon: 'vpn_key'
    },
    {
      title: 'Book Guestroom',
      url: '/home/guestroom',
      icon: 'hotel'
    }
  ];

  constructor(private breakpointObserver: BreakpointObserver,
              private authService: AuthService, private router: Router) {
                router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url);
              }

  ngOnInit() {
    this.authService.getUser()
      .then(user => this.rollno = user.rollno);
  }

  logout() {
    this.authService.logout();
  }

}
