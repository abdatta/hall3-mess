import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotkeyComponent } from './forgotkey.component';

describe('ForgotkeyComponent', () => {
  let component: ForgotkeyComponent;
  let fixture: ComponentFixture<ForgotkeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotkeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotkeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
