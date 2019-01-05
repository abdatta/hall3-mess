import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PWAPromptComponent } from './pwa-prompt.component';

describe('PWAPromptComponent', () => {
  let component: PWAPromptComponent;
  let fixture: ComponentFixture<PWAPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PWAPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PWAPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
