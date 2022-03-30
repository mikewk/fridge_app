import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './_helpers/auth.guard';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from "./dashboard/dashboard.component";



const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'manage', loadChildren: ()=>import('./household/household.module').then(m=>m.HouseholdModule)},
  {path: 'profile',loadChildren: ()=>import('./profile/profile.module').then(m=>m.ProfileModule)},
  {path: 'invite/:id', loadChildren: ()=>import('./invite/invite.module').then(m=>m.InviteModule) },
  {path: 'invite', redirectTo: 'dashboard'},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
