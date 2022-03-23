import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './_helpers/auth.guard';
import {DefaultGuard} from "./_helpers/default.guard";

import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {HouseholdManagementComponent} from "./household/household.module";
import {ProfileLandingComponent} from "./profile/profile.module";
import {OwnerGuard} from "./_helpers/owner.guard";

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, DefaultGuard]},
  {path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]},
  {path: 'manage', component: HouseholdManagementComponent, canActivate: [AuthGuard, OwnerGuard]},
  {path: 'profile', component: ProfileLandingComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
