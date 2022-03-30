import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../_helpers/auth.guard";
import {InviteComponent} from "./invite.module";

const routes: Routes = [
  { path: '', component: InviteComponent, canActivate:[AuthGuard] },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class InviteRouterModule { }
