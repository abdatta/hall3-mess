import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessOutDialogComponent } from './mess-out-dialog.component';

describe('MessOutDialogComponent', () => {
  let component: MessOutDialogComponent;
  let fixture: ComponentFixture<MessOutDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessOutDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessOutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
