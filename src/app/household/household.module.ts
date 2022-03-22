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

export {HouseholdManagementComponent}
export {HouseholdDetailsComponent}
export {HouseholdListComponent}


@NgModule({
  declarations: [
    HouseholdDetailsComponent,
    HouseholdListComponent,
    HouseholdManagementComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule
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
