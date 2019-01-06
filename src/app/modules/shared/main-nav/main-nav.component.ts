import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AuthService } from '@app/services';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MessOutDialogComponent } from '@shared/main-nav/mess-out-dialog/mess-out-dialog.component';

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
  currentUrl: string;
  role = 'resident';

  navs: object[];

  constructor(private breakpointObserver: BreakpointObserver,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {
                router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url);
              }

  async ngOnInit() {
    this.route.data.subscribe(data => {
      this.role = data.role;
      this.navs = data.navs;
    });

    this.navheader = this.role === 'mess' ? 'MESS' :
                     (await this.authService.getUser()).rollno;

  }

  messOut() {
    this.dialog.open(MessOutDialogComponent, {
      width: '500px',
      disableClose: false
    })
    .afterClosed().subscribe(() => {
      this.router.navigateByUrl('/mess');
    });
  }

  logout() {
    this.authService.logout();
  }

}
