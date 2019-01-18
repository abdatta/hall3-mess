import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IITKAuthComponent } from './iitk-auth.component';

describe('IITKAuthComponent', () => {
  let component: IITKAuthComponent;
  let fixture: ComponentFixture<IITKAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IITKAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IITKAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
