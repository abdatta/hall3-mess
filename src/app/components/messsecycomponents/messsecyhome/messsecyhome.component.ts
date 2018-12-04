import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@app/services';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-messsecyhome',
  templateUrl: './messsecyhome.component.html',
  styleUrls: ['./messsecyhome.component.css']
})
export class MesssecyhomeComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  navs = [
    {
      title: 'Notifications',
      url: '/messsecyhome/notify',
      icon: 'notifications',
      badge: 3
    },
    {
      title: 'Notify People',
      url: '/messsecyhome/notify',
      icon: 'notifications_active',
    },
    {
      title: 'Edit items',
      url: '/messsecyhome/edititem',
      icon: 'settings',
    },
    {
      title: 'Make Bills',
      url: '/messsecyhome/makebills',
      icon: 'account_balance_wallet',
    },
    {
      title: 'Change Password',
      url: '/messsecyhome/changepassword',
      icon: 'vpn_key',
    }
  ];
  currentUrl: string;
  constructor(private breakpointObserver: BreakpointObserver,
    private authService: AuthService, private router: Router) {
      router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url);
    }

  ngOnInit() {
  }

}
