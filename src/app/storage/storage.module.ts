import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageAddComponent} from './storage-add/storage-add.component';
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FoodItemModule} from "../food-item/food-item.module";

export {StorageAddComponent} from "./storage-add/storage-add.component";

@NgModule({
  declarations: [
    StorageAddComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    FoodItemModule
  ],
  exports:
    [
      StorageAddComponent
    ]
})
export class StorageModule {
}
