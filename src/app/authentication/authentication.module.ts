import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordResetRequestComponent } from './password-reset-request/password-reset-request.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {AuthenticationRoutingModule} from "./authentication-routing.module";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { PasswordResetComponent } from './password-reset/password-reset.component';
import {MustMatchDirective} from "../_helpers/must-match.directive";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";



@NgModule({
  declarations: [
    PasswordResetRequestComponent,
    PasswordResetComponent,
    LoginComponent,
    RegisterComponent,
    MustMatchDirective
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    AuthenticationRoutingModule,
    MatInputModule,
    MatButtonModule,

  ]
})
export class AuthenticationModule { }
