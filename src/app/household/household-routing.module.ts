import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HouseholdInviteManagerComponent, HouseholdManagementComponent} from "./household.module";
import {AuthGuard} from "../_helpers/auth.guard";
import {OwnerGuard} from "../_helpers/owner.guard";

const routes: Routes = [
  { path: '', component: HouseholdManagementComponent, canActivate:[AuthGuard, OwnerGuard] },
  { path: 'invite', component:HouseholdInviteManagerComponent, canActivate:[AuthGuard, OwnerGuard]}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HouseholdRoutingModule { }
