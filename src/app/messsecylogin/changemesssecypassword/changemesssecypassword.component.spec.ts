import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangemesssecypasswordComponent } from './changemesssecypassword.component';

describe('ChangemesssecypasswordComponent', () => {
  let component: ChangemesssecypasswordComponent;
  let fixture: ComponentFixture<ChangemesssecypasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangemesssecypasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangemesssecypasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
