import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLandingComponent } from './landing/profile-landing.component';
import {MatListModule} from "@angular/material/list";
import {ProfileAddHouseholdComponent} from "./add-household/profile-add-household.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {ProfileChangeDefaultComponent} from "./change-default/profile-change-default.component";

export {ProfileLandingComponent}

@NgModule({
  declarations: [
    ProfileLandingComponent,
    ProfileAddHouseholdComponent,
    ProfileChangeDefaultComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  exports:
  [
    ProfileLandingComponent
  ]
})
export class ProfileModule { }
