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

  rollno = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  currentUrl: string;
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
