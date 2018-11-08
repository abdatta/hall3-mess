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

  constructor(private authService: AuthService,
    private router: Router , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  changepassword(cp, np, rnp) {
    const currpass = cp.value;
    const newpass = np.value;
    const renewpass = rnp.value;
    if (!newpass) {
        this.snackBar.open('New password cannot be empty.');
        np.focus();
    } else if (currpass === newpass) {
        this.snackBar.open('New password cannot be same as current password.');
        np.value = rnp.value = '';
        np.focus();
    } else if (newpass === renewpass) {
        this.authService.chngpin(currpass, newpass)
          .subscribe((s: number) => {
            if (s === 200) {
                this.snackBar.open('Password successfully changed.');
                cp.value = np.value = rnp.value = '';
                rnp.blur();
            } else if (s === 403) {
                this.snackBar.open('Current password is incorrect.');
                cp.value = '';
                cp.focus();
            } else {
                this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.changepassword(cp, np, rnp));
            }
          });
    } else {
        this.snackBar.open('Retype new password correctly.');
        rnp.value = '';
        rnp.focus();
    }
  }
}
