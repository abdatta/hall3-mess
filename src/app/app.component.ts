import { Component, OnInit, HostListener } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatBottomSheet } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxAnalyticsGoogleAnalytics } from 'ngx-analytics/ga';
import { NgxAnalytics } from 'ngx-analytics';
import { PWAPromptComponent } from '@app/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  update = false;
  updatingIn = 5;
  deferredPrompt: any;

  constructor(private swUpdate: SwUpdate,
              private bottomSheet: MatBottomSheet,
              private deviceService: DeviceDetectorService,
              // Keep googleAnalytics variable !important
              private analytics: NgxAnalytics,
              private googleAnalytics: NgxAnalyticsGoogleAnalytics) {}

  ngOnInit() {
    this.swUpdate.available.subscribe(event => {
      this.update = true;
      const updateTimer = setInterval(() => {
        this.updatingIn--;
        if (this.updatingIn <= 0) {
          clearInterval(updateTimer);
          window.location.reload();
        }
      }, 1000);

      // Add analytics for update event
      this.analytics.eventTrack.next({
        action: 'Update',
        properties: {
          category: 'PWA'
        },
      });
    });
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  beforeInstallPrompt(event: any) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault();

    // Stash the event so it can be triggered later.
    this.deferredPrompt = event;

    // Open prompt if device is mobile
    if (this.deviceService.isMobile()) {
      // Open prompt after 2 seconds
      this.waitFor(2000).then(this.openPrompt);
    }
  }

  @HostListener('window:appinstalled', ['$event'])
  afterAppInstalled(event: any) {
    this.analytics.eventTrack.next({
      action: 'Added',
      properties: {
        category: 'PWA'
      },
    });
  }

  waitFor = (ms: number) => new Promise(resolve => setTimeout(() => resolve(), ms));

  openPrompt = () => this.bottomSheet.open(PWAPromptComponent, { disableClose: true, data: this.deferredPrompt });

}
