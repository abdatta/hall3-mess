import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangemanagerpasswordComponent } from './changemanagerpassword.component';

describe('ChangemanagerpasswordComponent', () => {
  let component: ChangemanagerpasswordComponent;
  let fixture: ComponentFixture<ChangemanagerpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangemanagerpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangemanagerpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
