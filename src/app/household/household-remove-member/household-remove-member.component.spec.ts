import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdRemoveMemberComponent } from './household-remove-member.component';
import {
  HouseholdRemoveHouseholdDialogComponent
} from "../household-remove-household/household-remove-household-dialog.component";
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {LocalStorageService} from "../../_services/local-storage.service";
import {MockProvider} from "ng-mocks";

const mockData = {
  household:
  {
    id:1, name:"Test1", location:"TestLoc", users:[
      {id:1, name:"TestUser"}
    ]
  }
};

describe('HouseholdRemoveMemberComponent', () => {
  let component: HouseholdRemoveMemberComponent;
  let fixture: ComponentFixture<HouseholdRemoveMemberComponent>;
  let getUserSpy = jasmine.createSpy("getUser").and.returnValue({id:0, name:"TestOwner"});
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdRemoveMemberComponent ],
      imports: [FormsModule],
      providers: [
        MockProvider(LocalStorageService, {getUser: getUserSpy}),
        {provide: MAT_DIALOG_DATA, useValue: mockData}
      ]
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
