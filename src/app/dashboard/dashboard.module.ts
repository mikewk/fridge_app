import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from "./dashboard.component";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {FoodItemModule} from "../food-item/food-item.module";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {FoodItemCardComponent} from "./food-item-card/food-item-card.component";

export {DashboardComponent}

@NgModule({
  declarations: [
    DashboardComponent,
    FoodItemCardComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatDividerModule,
    FoodItemModule,
    DashboardRoutingModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatButtonModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
