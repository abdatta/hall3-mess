import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  user_id: string;
  reseting: boolean;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.user_id = params['id'];
    });
  }

  reset(newpass: string, renewpass: string) {
    if (!newpass && !renewpass) {
      this.snackBar.open('Fill all fields.');
    } else if ( newpass !== renewpass) {
      this.snackBar.open('Retype new password correctly');
    } else {
      this.reseting = true;
      this.authService.deleteUnverifiedUser(this.user_id)
          .subscribe(code => {
            if (code === 200) {
              this.snackBar.open('Reset successful');
            } else {
              this.snackBar.open('Failed to reset password! Retry');
            }
            this.reseting = false;
          });
        }
      }

}
