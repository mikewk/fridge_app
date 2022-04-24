import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {MatListModule} from "@angular/material/list";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";

import {ProfileChangeDefaultComponent} from "./change-default/profile-change-default.component";
import {ProfileAddHouseholdComponent} from "./profile-add-household/profile-add-household.component";
import {ProfileLandingComponent} from './profile-landing/profile-landing.component';
import {ProfileLeaveDialogComponent } from './profile-leave-dialog/profile-leave-dialog.component';
import {ProfileRoutingModule} from "./profile-routing.module";
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import {AuthenticationModule} from "../authentication/authentication.module";
import {MatCardModule} from "@angular/material/card";
import { ChangeUsernameDialogComponent } from './change-username-dialog/change-username-dialog.component';

export {ProfileLandingComponent}

@NgModule({
  declarations: [
    ProfileLandingComponent,
    ProfileAddHouseholdComponent,
    ProfileChangeDefaultComponent,
    ProfileLeaveDialogComponent,
    ChangePasswordDialogComponent,
    ChangeUsernameDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    ProfileRoutingModule,
    AuthenticationModule,
    MatCardModule
  ],
  exports:
    [
      ProfileLandingComponent
    ]
})
export class ProfileModule {
}
