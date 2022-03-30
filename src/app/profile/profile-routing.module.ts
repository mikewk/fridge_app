import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../_helpers/auth.guard";
import {ProfileLandingComponent} from "./profile.module";

const routes: Routes = [
  { path: '', component: ProfileLandingComponent, canActivate:[AuthGuard] },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
