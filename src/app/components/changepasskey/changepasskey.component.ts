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

  error = '';
  noinput = '';
  constructor(private authService: AuthService,
    private router: Router , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  openSnackBar() {
    this.snackBar.open( this.error , this.noinput , {
      duration: 1600,
    });
  }

  chngpin(oldpin: string, newpin: string , renewpin: string ) {
    if (oldpin === newpin) {
       this.error = 'New PIN isnt New'; this.openSnackBar();
      } else if (newpin === renewpin) {
    this.authService.chngpin(oldpin , newpin)
        .subscribe((s: number) => {
      if (s === 200) {
        this.error = 'PIN successfully changed';
        this.openSnackBar();
      } else if (s === 403) {
        this.error = 'current PIN is wrong';
        this.openSnackBar();
      } else {
        this.error = 'Some error occured, Please try again';
        this.openSnackBar();
      }
    }); } else { this.error = 'Retype PIN correctly'; this.openSnackBar(); }
  }
}
