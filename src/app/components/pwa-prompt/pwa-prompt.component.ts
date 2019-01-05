import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-pwa-prompt',
  templateUrl: './pwa-prompt.component.html',
  styleUrls: ['./pwa-prompt.component.css']
})
export class PWAPromptComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<PWAPromptComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) private deferredPrompt: any) { }

  ngOnInit() {
  }

  addToHomescreen(flag: boolean) {
    if (flag) {
      this.deferredPrompt.prompt();
    }
    this.bottomSheetRef.dismiss();
  }

}
