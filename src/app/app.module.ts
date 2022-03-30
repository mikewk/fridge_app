import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {JwtModule} from "@auth0/angular-jwt";

import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';


import {authInterceptorProviders} from './_helpers/auth.interceptor';
import {GraphQLModule} from './graphql.module';
import {MustMatchDirective} from './_helpers/must-match.directive';

import {FoodItemModule} from "./food-item/food-item.module";
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {MatListModule} from "@angular/material/list";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MustMatchDirective,
    DashboardComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        GraphQLModule,
        FoodItemModule,
        BrowserAnimationsModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: () => localStorage.getItem('access_token')
            }
        }),
        MatToolbarModule,
        MatSnackBarModule,
        MatMenuModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatListModule
    ],
  providers: [authInterceptorProviders,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  exports: [
    MatFormFieldModule,
    MatInputModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
