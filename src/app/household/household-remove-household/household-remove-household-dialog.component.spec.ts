import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdRemoveHouseholdDialogComponent } from './household-remove-household-dialog.component';

describe('HouseholdRemoveHouseholdComponent', () => {
  let component: HouseholdRemoveHouseholdDialogComponent;
  let fixture: ComponentFixture<HouseholdRemoveHouseholdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdRemoveHouseholdDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdRemoveHouseholdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
