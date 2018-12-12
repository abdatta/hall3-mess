import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@app/services';
import { ActivatedRoute } from '@angular/router';

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

  navheader: string;

  role = 'resident';

  navs: object[];

  constructor(private breakpointObserver: BreakpointObserver,
              private authService: AuthService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.role = data.role;
      this.navs = data.navs;
    });
    if (this.role === 'resident') {
      this.authService.getUser()
      .then(user => this.navheader = user.rollno);
    } else if (this.role === 'mess') {
      this.navheader = 'MESS';
    } else {
      this.navheader = 'HEC';
    }
  }

  messOut() {
    this.authService.messOut();
  }

  logout() {
    this.authService.logout();
  }

}
