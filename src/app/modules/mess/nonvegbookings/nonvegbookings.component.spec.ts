import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonvegbookingsComponent } from './nonvegbookings.component';

describe('NonvegbookingsComponent', () => {
  let component: NonvegbookingsComponent;
  let fixture: ComponentFixture<NonvegbookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonvegbookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonvegbookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
