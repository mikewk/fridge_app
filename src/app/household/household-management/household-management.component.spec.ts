import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HouseholdManagementComponent} from './household-management.component';
import {RouterTestingModule} from "@angular/router/testing";
import {MatDialog} from "@angular/material/dialog";
import {ManagementService} from "../../_graphql-services/management.service";
import {HouseholdService} from "../../_graphql-services/household.service";
import {StorageService} from "../../_graphql-services/storage.service";
import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {LocalStorageService} from "../../_services/local-storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MockProvider} from "ng-mocks";

describe('ManageHouseholdsComponent', () => {
  let component: HouseholdManagementComponent;
  let fixture: ComponentFixture<HouseholdManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HouseholdManagementComponent],
      imports: [RouterTestingModule],
      providers: [
        MockProvider(MatDialog),
        MockProvider(ManagementService),
        MockProvider(HouseholdService),
        MockProvider(StorageService),
        MockProvider(DialogHelperService),
        MockProvider(LocalStorageService),
        MockProvider(MatSnackBar)
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
