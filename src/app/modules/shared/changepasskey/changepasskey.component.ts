import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { of } from 'rxjs';

@Component({
  selector: 'app-changepasskey',
  templateUrl: './changepasskey.component.html',
  styleUrls: ['./changepasskey.component.css']
})
export class ChangepasskeyComponent implements OnInit {

  submitting: boolean;

  constructor(private authService: AuthService,
    private router: Router , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  changepassword(cp, np, rnp) {
    rnp.blur();
    const currpass = cp.value;
    const newpass = np.value;
    const renewpass = rnp.value;
    if (!currpass || !newpass || !renewpass) {
        this.snackBar.open('Please fill all the fields.');
        if (!currpass) {
          cp.focus();
        } else if (!newpass) {
          np.focus();
        } else {
          rnp.focus();
        }
    } else if (currpass === newpass) {
        this.snackBar.open('New password cannot be same as current password.');
        np.value = rnp.value = '';
        np.focus();
    } else if (newpass === renewpass) {
        this.submitting = true;
        this.authService.chngpin(currpass, newpass)
          .subscribe((s: number) => {
            if (s === 200) {
                this.snackBar.open('Password successfully changed.');
                cp.value = np.value = rnp.value = '';
            } else if (s === 403) {
                this.snackBar.open('Current password is incorrect.');
                cp.value = '';
                cp.focus();
            } else if (s === 999) {
              this.snackBar.open('No internet connection. Come online and try again.');
            } else {
                this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.changepassword(cp, np, rnp));
            }
            this.submitting = false;
          });
    } else {
        this.snackBar.open('Retype new password correctly.');
        rnp.value = '';
        rnp.focus();
    }
  }
}
