import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLeaveDialogComponent } from './profile-leave-dialog.component';

describe('ProfileLeaveDialogComponent', () => {
  let component: ProfileLeaveDialogComponent;
  let fixture: ComponentFixture<ProfileLeaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileLeaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLeaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
