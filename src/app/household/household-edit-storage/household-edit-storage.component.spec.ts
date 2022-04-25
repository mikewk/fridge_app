import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdEditStorageComponent } from './household-edit-storage.component';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

const mockData = {household: {id:1, name:"Test1", storages:[{id:1, name:"Storage1"}]}};

describe('HouseholdEditStorageComponent', () => {
  let component: HouseholdEditStorageComponent;
  let fixture: ComponentFixture<HouseholdEditStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdEditStorageComponent ],
      imports: [FormsModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: mockData}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdEditStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
