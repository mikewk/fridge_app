import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardComponent} from './dashboard.component';
import {HouseholdService} from "../_graphql-services/household.service";
import {ItemDialogService} from "../_services/item-dialog.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalStorageService} from "../_services/local-storage.service";
import {MockInstance, MockProvider} from "ng-mocks";
import {BehaviorSubject, EMPTY} from "rxjs";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        MockProvider(HouseholdService),
        MockProvider(ItemDialogService),
        MockProvider(MatSnackBar),
        MockProvider(LocalStorageService)
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    const selectedHouseholdId = new BehaviorSubject<number | undefined>(undefined);
    MockInstance(LocalStorageService, () => ({selectedHouseholdId}));
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
