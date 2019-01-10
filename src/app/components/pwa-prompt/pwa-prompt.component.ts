import { Component, OnInit, Inject } from '@angular/core';
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
