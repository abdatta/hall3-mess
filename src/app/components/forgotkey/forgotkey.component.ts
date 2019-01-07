import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-forgotkey',
  templateUrl: './forgotkey.component.html',
  styleUrls: ['./forgotkey.component.css']
})
export class ForgotkeyComponent implements OnInit {

  submitting: boolean;

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  submit(roll: any) {
    this.submitting = true;
    this.authService.forgotPassword(roll.value)
      .subscribe(code => {
        if (code === 200) {
          roll.value = '';
          this.snackBar.open('Reset password link sent. Check mail.');
        } else {
          this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.submit(roll));
        }
        this.submitting = false;
      });
  }

}
