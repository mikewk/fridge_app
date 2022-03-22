import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLandingComponent } from './profile-component/profile-landing.component';
import {MatListModule} from "@angular/material/list";
import {HouseholdAddComponent} from "./household-add/household-add.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";

export {ProfileLandingComponent}

@NgModule({
  declarations: [
    ProfileLandingComponent,
    HouseholdAddComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule
  ],
  exports:
  [
    ProfileLandingComponent
  ]
})
export class ProfileModule { }
