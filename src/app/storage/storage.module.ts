import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageAddComponent} from './storage-add/storage-add.component';
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {StorageDetailsComponent} from './storage-details/storage-details.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [
    StorageAddComponent,
    StorageDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class StorageModule {
}
