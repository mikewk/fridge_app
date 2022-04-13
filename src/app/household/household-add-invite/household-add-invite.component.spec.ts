import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdAddInviteComponent } from './household-add-invite.component';
import {HouseholdService} from "../../_graphql-services/household.service";
import {Mock, MockProvider} from "ng-mocks";
import {LocalStorageService} from "../../_services/local-storage.service";
import {EMPTY} from "rxjs";

describe('HouseholdAddInviteComponent', () => {
  let component: HouseholdAddInviteComponent;
  let fixture: ComponentFixture<HouseholdAddInviteComponent>;
  let getHouseholdSpy = jasmine.createSpy("getHousehold").and.returnValue(EMPTY);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdAddInviteComponent ],
      providers: [
        MockProvider(HouseholdService, {getHousehold: getHouseholdSpy}),
        MockProvider(LocalStorageService)
      ]
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
