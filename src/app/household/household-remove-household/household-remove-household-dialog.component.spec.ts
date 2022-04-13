import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdRemoveHouseholdDialogComponent } from './household-remove-household-dialog.component';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

const mockData = {ownedHouseholds: [{id:1, name:"Test1"}, {id:2, name:"Test2"}]};

describe('HouseholdRemoveHouseholdComponent', () => {
  let component: HouseholdRemoveHouseholdDialogComponent;
  let fixture: ComponentFixture<HouseholdRemoveHouseholdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HouseholdRemoveHouseholdDialogComponent],
      imports: [FormsModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: mockData}
      ]
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
