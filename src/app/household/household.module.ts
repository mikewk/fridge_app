import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";

import {HouseholdManagementComponent} from './household-management/household-management.component';
import {HouseholdAddStorageComponent} from "./household-add-storage/household-add-storage.component";
import {MatButtonModule} from "@angular/material/button";
import { HouseholdRemoveStorageComponent } from './household-remove-storage/household-remove-storage.component';
import { HouseholdInviteManagerComponent } from './household-invite-manager/household-invite-manager.component';
import {MatTableModule} from "@angular/material/table";
import { HouseholdAddInviteComponent } from './household-add-invite/household-add-invite.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatCardModule} from "@angular/material/card";
import {HouseholdRoutingModule} from "./household-routing.module";
import { HouseholdRemoveMemberComponent } from './household-remove-member/household-remove-member.component';
import { HouseholdRemoveHouseholdDialogComponent } from './household-remove-household/household-remove-household-dialog.component';
import { HouseholdEditStorageComponent } from './household-edit-storage/household-edit-storage.component';
import { HouseholdEditHouseholdComponent } from './household-edit-household/household-edit-household.component';

export {HouseholdManagementComponent}
export {HouseholdInviteManagerComponent}

@NgModule({
  declarations: [
    HouseholdManagementComponent,
    HouseholdAddStorageComponent,
    HouseholdRemoveStorageComponent,
    HouseholdInviteManagerComponent,
    HouseholdAddInviteComponent,
    HouseholdRemoveMemberComponent,
    HouseholdRemoveHouseholdDialogComponent,
    HouseholdEditStorageComponent,
    HouseholdEditHouseholdComponent
  ],
  imports: [
    CommonModule,
    HouseholdRoutingModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule
  ],
  exports:
    [
      HouseholdManagementComponent
    ]
})
export class HouseholdModule {
}
