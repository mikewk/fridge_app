import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import { FoodItemCardComponent } from './food-item-card/food-item-card.component';
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {AddFoodItemComponent} from "./add-food-item/add-food-item.component";
import {SecureImageComponent} from "../_helpers/secure-image.component";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";

@NgModule({
  declarations: [
    FoodItemCardComponent,
    AddFoodItemComponent,
    SecureImageComponent
  ],
  exports: [
    FoodItemCardComponent,
    AddFoodItemComponent
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
  ]
})
export class FoodItemModule {
}
