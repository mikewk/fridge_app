import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";

import {HouseholdDetailsComponent} from "./household-details/household-details.component";
import {HouseholdListComponent} from "./household-list/household-list.component";
import {HouseholdManagementComponent} from './household-management/household-management.component';
import {HouseholdAddStorageComponent} from "./household-add-storage/household-add-storage.component";
import {MatButtonModule} from "@angular/material/button";
import { HouseholdRemoveStorageComponent } from './household-remove-storage/household-remove-storage.component';

export {HouseholdManagementComponent}
export {HouseholdDetailsComponent}
export {HouseholdListComponent}


@NgModule({
  declarations: [
    HouseholdDetailsComponent,
    HouseholdListComponent,
    HouseholdManagementComponent,
    HouseholdAddStorageComponent,
    HouseholdRemoveStorageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule
  ],
  exports:
    [
      HouseholdDetailsComponent,
      HouseholdListComponent,
      HouseholdManagementComponent
    ]
})
export class HouseholdModule {
}
