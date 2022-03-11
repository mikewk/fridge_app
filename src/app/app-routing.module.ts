import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './_helpers/auth.guard';

import {HouseholdAddComponent, HouseholdDetailsComponent, HouseholdListComponent} from "./household";
import {StorageAddComponent} from "./storage/storage-add/storage-add.component";
import {StorageDetailsComponent} from "./storage/storage-details/storage-details.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'addHousehold', component: HouseholdAddComponent, canActivate: [AuthGuard]},
  {path: 'household', component: HouseholdListComponent, canActivate: [AuthGuard]},
  {path: 'household/:id', component: HouseholdDetailsComponent, canActivate: [AuthGuard]},
  {path: 'addStorage/:id', component: StorageAddComponent, canActivate: [AuthGuard]},
  {path: 'storage/:id', component: StorageDetailsComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
