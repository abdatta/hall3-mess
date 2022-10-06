import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { TokensService } from '@app/services';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-makebills',
  templateUrl: './makebills.component.html',
  styleUrls: ['./makebills.component.css']
})
export class MakebillsComponent implements OnInit {

  fromDate: Date;
  toDate: Date;
  earliestDate: Date;

  downloading: boolean;
  @ViewChild('downloadLink')
  downloader: ElementRef;

  constructor(private tokenService: TokensService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    // Set earliest date to 1st of last to last month
    this.earliestDate = moment().subtract(2, 'M').startOf('M').toDate();
  }

  yesterday() {
    return moment().subtract(1, 'd').toDate();
  }

  requestDownload() {
    // Check fields are not empty
    if (!this.fromDate || !this.toDate) {
      this.snackBar.open('Please fill all the fields.');
      return;
    }

    const from = moment(this.fromDate);
    const to = moment(this.toDate);
    // Check fields are valied dates
    if (!from.isValid() || !to.isValid()) {
      this.snackBar.open('Invalid date format. Please enter valid date.');
      return;
    }

    // Check from date is not after to date
    if (from.isAfter(to)) {
      this.snackBar.open('Start Date cannot be before End Date.');
      return;
    }

    this.downloading = true;
    this.tokenService.downloadMessBill(from, to)
      .subscribe((bill) => {
        this.fromDate = this.toDate = null;
        this.downLoadFile(bill.data, bill.name);
        this.downloading = false;
      }, (err) => {
        if (err === 400) {
          this.snackBar.open('Invalid date format. Please enter valid date.');
        } else if (err === 999) {
          this.snackBar.open('No internet connection. Please come online and try again.');
        } else {
          this.snackBar.open('Oops! Some error occured.', 'Retry')
                .onAction().subscribe(_ => this.requestDownload());
        }
        this.downloading = false;
      });
  }

  downLoadFile(data: Blob, filename: string) {
    const a = this.downloader.nativeElement;
    a.href = window.URL.createObjectURL(data);
    a.download = filename;
    a.click();
  }

}
