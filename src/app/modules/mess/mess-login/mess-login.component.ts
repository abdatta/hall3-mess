import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@app/services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { QRBookComponent } from '@mess/qr-book/qr-book.component';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BookComponent } from '@mess/book/book.component';

@Component({
  selector: 'app-mess-login',
  templateUrl: './mess-login.component.html',
  styleUrls: ['./mess-login.component.css']
})
export class MessLoginComponent implements OnInit {

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  submitting: boolean;
  dialog_open: boolean;

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.authService.check().then(user => {
      if (user) {
        this.authService.logout();
      }
    });

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      if (devices.length > 0) {
        this.scanner.changeDevice(devices[0]);
      } else {
        this.snackBar.open('No cameras found in this device.');
      }
    });
  }

  logIn(roll, pass) {
    const rollno = roll.value;
    const password = pass.value;

    if (rollno && password) {
      this.submitting = true;
      this.authService.logIn(rollno, password)
        .subscribe((s: number) => {
          if (s === 200) {
            roll.value = pass.value = '';
            this.dialog_open = true;

            const dialogRef = this.dialog.open(BookComponent, {
              disableClose: true,
              width: '95%',
              maxWidth: '720px'
            });
            dialogRef.afterClosed()
                .subscribe(_ => this.dialog_open = false);

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
    if (this.dialog_open) {
      return;
    }
    this.dialog_open = true;
    const dialogRef = this.dialog.open(QRBookComponent, {
      width: '500px',
      data: data
    });
    dialogRef.afterClosed()
        .subscribe(_ => this.dialog_open = false);
  }

}
