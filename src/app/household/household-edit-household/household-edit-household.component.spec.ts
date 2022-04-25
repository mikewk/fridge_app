import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdEditHouseholdComponent } from './household-edit-household.component';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

const mockData = {household: {id:1, name:"Test1", location:"TestLoc"}};

describe('HouseholdEditHouseholdComponent', () => {
  let component: HouseholdEditHouseholdComponent;
  let fixture: ComponentFixture<HouseholdEditHouseholdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdEditHouseholdComponent ],
      imports: [FormsModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: mockData}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdEditHouseholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
