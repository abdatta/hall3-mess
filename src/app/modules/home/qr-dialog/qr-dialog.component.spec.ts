import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QRDialogComponent } from './qr-dialog.component';

describe('QRDialogComponent', () => {
  let component: QRDialogComponent;
  let fixture: ComponentFixture<QRDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QRDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
