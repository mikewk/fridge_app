import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdInviteManagerComponent } from './household-invite-manager.component';
import {Clipboard} from "@angular/cdk/clipboard";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {InviteService} from "../../_graphql-services/invite.service";
import {LocalStorageService} from "../../_services/local-storage.service";
import {MockProvider} from "ng-mocks";

describe('HouseholdInviteManagerComponent', () => {
  let component: HouseholdInviteManagerComponent;
  let fixture: ComponentFixture<HouseholdInviteManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdInviteManagerComponent ],
      providers: [
        MockProvider(Clipboard),
        MockProvider(MatSnackBar),
        MockProvider(DialogHelperService),
        MockProvider(InviteService),
        MockProvider(LocalStorageService)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdInviteManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
