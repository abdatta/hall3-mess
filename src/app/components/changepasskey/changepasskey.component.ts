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
  input1: string;
  input2: string;
  input3: string;

  constructor(private authService: AuthService,
    private router: Router , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  openSnackBar() {
    this.snackBar.open( this.error , this.noinput , {
      duration: 1600,
    });
  }

  clear() {
    this.input1 = '';
    this.input2 = '';
    this.input3 = '';
  }

  chngpin(oldpin: string, newpin: string , renewpin: string ) {
    if (oldpin === newpin) {
       this.error = 'New PIN isnt New'; this.openSnackBar();
       this.input2 = '';
       this.input3 = '';
      } else if (newpin === renewpin) {
    this.authService.chngpin(oldpin , newpin)
        .subscribe((s: number) => {
      if (s === 200) {
        this.error = 'PIN successfully changed';
        this.openSnackBar();
        this.clear();
      } else if (s === 403) {
        this.error = 'current PIN is wrong';
        this.openSnackBar();
        this.clear();
      } else {
        this.error = 'Some error occured, Please try again';
        this.openSnackBar();
        this.clear();
      }
    }); } else { this.error = 'Retype PIN correctly'; this.openSnackBar(); this.input2 = '';
    this.input3 = ''; }
  }
}
