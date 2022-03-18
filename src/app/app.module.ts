import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {JwtModule} from "@auth0/angular-jwt";
import {StorageModule} from "./storage/storage.module";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';

import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";


import {HouseholdAddComponent, HouseholdDetailsComponent, HouseholdListComponent} from "./household";

import {authInterceptorProviders} from './_helpers/auth.interceptor';
import {MustMatchDirective} from './_helpers/must-match.directive';
import {GraphQLModule} from './graphql.module';
import {AddFoodItemComponent} from "./food-item/add-food-item/add-food-item.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {SecureImageComponent} from "./_helpers/secure-image.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HouseholdDetailsComponent,
    HouseholdAddComponent,
    HouseholdListComponent,
    MustMatchDirective,
    AddFoodItemComponent,
    SecureImageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    GraphQLModule,
    StorageModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('access_token')
      }
    }),
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule
  ],
  providers: [authInterceptorProviders,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
