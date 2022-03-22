import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

import {HouseholdDetailsComponent} from "./household-details/household-details.component";
import {HouseholdListComponent} from "./household-list/household-list.component";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import { ManageHouseholdsComponent } from './manage-households/manage-households.component';
import {MatListModule} from "@angular/material/list";
import { HouseholdChangeDefaultComponent } from './household-change-default/household-change-default.component';
import {MatSelectModule} from "@angular/material/select";

export {HouseholdDetailsComponent} from "./household-details/household-details.component";
export {HouseholdListComponent} from "./household-list/household-list.component";


@NgModule({
  declarations: [
    HouseholdDetailsComponent,
    HouseholdListComponent,
    ManageHouseholdsComponent,
    HouseholdChangeDefaultComponent
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
    HouseholdListComponent
  ]
})
export class HouseholdModule {
}
