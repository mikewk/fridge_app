import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from "./dashboard.component";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {FoodItemModule} from "../food-item/food-item.module";
import {DashboardRoutingModule} from "./dashboard-routing.module";


export {DashboardComponent}

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatDividerModule,
    FoodItemModule,
    DashboardRoutingModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
