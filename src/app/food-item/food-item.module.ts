import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";

import {FoodItemAddComponent} from "./food-item-add/food-item-add.component";
import {SecureImageComponent} from "../_helpers/secure-image.component";
import {MatChipsModule} from "@angular/material/chips";

@NgModule({
  declarations: [
    FoodItemAddComponent,
    SecureImageComponent
  ],
  exports: [
    FoodItemAddComponent,
    SecureImageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
  ]
})
export class FoodItemModule {
}
