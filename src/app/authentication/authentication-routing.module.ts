import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {PasswordResetRequestComponent} from "./password-reset-request/password-reset-request.component";
import {NotAuthGuard} from "../_helpers/not-auth-guard";
import {PasswordResetComponent} from "./password-reset/password-reset.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'request', component: PasswordResetRequestComponent, canActivate: [NotAuthGuard] },
  { path: 'reset/:key', component: PasswordResetComponent },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
