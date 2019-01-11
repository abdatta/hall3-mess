import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { NgxAnalytics } from 'ngx-analytics';

@Component({
  selector: 'app-pwa-prompt',
  templateUrl: './pwa-prompt.component.html',
  styleUrls: ['./pwa-prompt.component.css']
})
export class PWAPromptComponent implements OnInit {

  constructor(private analytics: NgxAnalytics,
              private bottomSheetRef: MatBottomSheetRef<PWAPromptComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) private deferredPrompt: any) { }

  ngOnInit() {
  }

  @HostListener('window:appinstalled', ['$event'])
  afterAppInstalled(event: any) {
    this.bottomSheetRef.dismiss();
  }

  addToHomescreen(flag: boolean) {
    if (flag) {
      this.deferredPrompt.prompt();
    } else {
      this.analytics.eventTrack.next({
        action: 'Later',
        properties: {
          category: 'PWA'
        },
      });
    }
    this.bottomSheetRef.dismiss();
  }

}
