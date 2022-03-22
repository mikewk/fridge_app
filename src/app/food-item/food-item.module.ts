import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";

import {FoodItemCardComponent} from './food-item-card/food-item-card.component';
import {FoodItemAddComponent} from "./food-item-add/food-item-add.component";
import {SecureImageComponent} from "../_helpers/secure-image.component";

@NgModule({
  declarations: [
    FoodItemCardComponent,
    FoodItemAddComponent,
    SecureImageComponent
  ],
  exports: [
    FoodItemCardComponent,
    FoodItemAddComponent,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatSidenavModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatSidenavModule,
    MatSelectModule,
    MatListModule,
  ]
})
export class FoodItemModule {
}
