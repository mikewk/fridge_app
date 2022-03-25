import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdAddInviteComponent } from './household-add-invite.component';

describe('HouseholdAddInviteComponent', () => {
  let component: HouseholdAddInviteComponent;
  let fixture: ComponentFixture<HouseholdAddInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdAddInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdAddInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
