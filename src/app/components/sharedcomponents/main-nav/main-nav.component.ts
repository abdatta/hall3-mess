import { Component, OnInit, Input } from '@angular/core';
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
  navheader: string;

  @Input()
  role = 'resident';

  @Input()
  navs: any;

  constructor(private breakpointObserver: BreakpointObserver,
              private authService: AuthService, private router: Router) {
                router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url);
              }

  ngOnInit() {
    if (this.role === 'mess') {
      this.navheader = 'MESS';
    } else if (this.role === 'secy') {
      this.navheader = 'HEC';
    } else {
      this.authService.getUser()
      .then(user => this.navheader = user.rollno);
    }
  }

  logout() {
    this.authService.logout(this.currentUrl);
  }

}
