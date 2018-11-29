import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuetokenComponent } from './issuetoken.component';

describe('IssuetokenComponent', () => {
  let component: IssuetokenComponent;
  let fixture: ComponentFixture<IssuetokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuetokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuetokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
