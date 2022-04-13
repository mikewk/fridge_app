import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdRemoveStorageComponent } from './household-remove-storage.component';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

const mockData = {household: {id:1, name:"Test1", storages:[{id:1, name:"Storage1"}]}};

describe('HouseholdRemoveStorageComponent', () => {
  let component: HouseholdRemoveStorageComponent;
  let fixture: ComponentFixture<HouseholdRemoveStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdRemoveStorageComponent ],
      imports: [FormsModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: mockData}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdRemoveStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
