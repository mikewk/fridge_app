import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InviteComponent} from "./invite.component";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {InviteRouterModule} from "./invite-router.module";

export {InviteComponent};

@NgModule({
  declarations: [InviteComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    InviteRouterModule
  ],
  exports: [
     InviteComponent
  ]
})
export class InviteModule { }
