import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@app/services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-mess-login',
  templateUrl: './mess-login.component.html',
  styleUrls: ['./mess-login.component.css']
})
export class MessLoginComponent implements OnInit {

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  submitting: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      if (devices.length > 0) {
        this.scanner.changeDevice(devices[0]);
      } else {
        this.snackBar.open('No cameras found in this device.');
      }
    });
  }

  logIn(rollno: string, password: string) {
    if (rollno && password) {
      this.submitting = true;
      this.authService.logIn(rollno, password)
        .subscribe((s: number) => {
          if (s === 200) {
            this.router.navigateByUrl('/mess/book');
          } else if (s === 401) {
            this.snackBar.open('Incorrect Username or Password');
          } else {
            this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.logIn(rollno, password));
          }
          this.submitting = false;
      });
    } else {
      this.snackBar.open('Please fill all the fields.');
    }
  }

  handleQRdata(data: string) {
    this.snackBar.open(data);
  }

}
