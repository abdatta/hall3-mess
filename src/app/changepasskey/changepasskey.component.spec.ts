import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepasskeyComponent } from './changepasskey.component';

describe('ChangepasskeyComponent', () => {
  let component: ChangepasskeyComponent;
  let fixture: ComponentFixture<ChangepasskeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangepasskeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangepasskeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
