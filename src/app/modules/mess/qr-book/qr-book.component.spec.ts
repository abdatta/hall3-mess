import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QRBookComponent } from './qr-book.component';

describe('QRBookComponent', () => {
  let component: QRBookComponent;
  let fixture: ComponentFixture<QRBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QRBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
