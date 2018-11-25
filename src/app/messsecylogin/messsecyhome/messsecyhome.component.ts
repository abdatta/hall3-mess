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

  currentUrl: string;
  constructor(private breakpointObserver: BreakpointObserver,
    private authService: AuthService, private router: Router) {
      router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url)
    }

  ngOnInit() {
  }

}
