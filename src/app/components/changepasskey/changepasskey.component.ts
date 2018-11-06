import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-changepasskey',
  templateUrl: './changepasskey.component.html',
  styleUrls: ['./changepasskey.component.css']
})
export class ChangepasskeyComponent implements OnInit {

  currpass: string;
  newpass: string;
  renewpass: string;

  constructor(private authService: AuthService,
    private router: Router , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  openSnackBar(error: string, action?: string ) {
    return this.snackBar.open( error, action || '', {
      duration: 1600,
    });
  }

  clear() {
    this.currpass = '';
    this.newpass = '';
    this.renewpass = '';
  }

  changepassword() {
    if (!this.newpass) {
      this.openSnackBar('New PIN cannot be empty.');
    } else if (this.currpass === this.newpass) {
      this.openSnackBar('New PIN cannot be same as current PIN.');
      this.newpass = '';
      this.renewpass = '';
    } else if (this.newpass === this.renewpass) {
      this.authService.chngpin(this.currpass , this.newpass)
          .subscribe((s: number) => {
            if (s === 200) {
              this.openSnackBar('PIN successfully changed.');
              this.clear();
            } else if (s === 403) {
              this.openSnackBar('Current PIN is incorrect.');
              this.clear();
            } else {
              this.openSnackBar('Oops! Some error occured.', 'Retry')
                .onAction().subscribe(_ => this.changepassword());
              this.clear();
            }
          });
    } else {
      this.openSnackBar('Retype PIN correctly');
      this.newpass = '';
      this.renewpass = '';
    }
  }
}
