import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './_helpers/auth.guard';

import {HouseholdDetailsComponent, HouseholdListComponent} from "./household/household.module";
import {StorageAddComponent} from "./storage/storage.module"
import {DashboardComponent} from "./dashboard/dashboard.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {DefaultGuard} from "./_helpers/default.guard";
import {ManageHouseholdsComponent} from "./household/manage-households/manage-households.component";
import {ProfileLandingComponent} from "./profile/profile.module";

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'household', component: HouseholdListComponent, canActivate: [AuthGuard]},
  {path: 'household/:id', component: HouseholdDetailsComponent, canActivate: [AuthGuard]},
  {path: 'addStorage/:id', component: StorageAddComponent, canActivate: [AuthGuard]},
  {path: 'storage/:id', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, DefaultGuard]},
  {path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]},
  {path: 'manage', component: ManageHouseholdsComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileLandingComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
