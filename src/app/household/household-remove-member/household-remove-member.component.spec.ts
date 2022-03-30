import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdRemoveMemberComponent } from './household-remove-member.component';

describe('HouseholdRemoveMemberComponent', () => {
  let component: HouseholdRemoveMemberComponent;
  let fixture: ComponentFixture<HouseholdRemoveMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdRemoveMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdRemoveMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
