import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdInviteManagerComponent } from './household-invite-manager.component';

describe('HouseholdInviteManagerComponent', () => {
  let component: HouseholdInviteManagerComponent;
  let fixture: ComponentFixture<HouseholdInviteManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdInviteManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdInviteManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
