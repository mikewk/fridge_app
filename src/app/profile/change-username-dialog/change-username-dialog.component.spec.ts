import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUsernameDialogComponent } from './change-username-dialog.component';
import {FormsModule} from "@angular/forms";

describe('ChangeUsernameDialogComponent', () => {
  let component: ChangeUsernameDialogComponent;
  let fixture: ComponentFixture<ChangeUsernameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [ ChangeUsernameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
