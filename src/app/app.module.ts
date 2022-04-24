import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {JwtModule} from "@auth0/angular-jwt";

import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {authInterceptorProviders} from './_helpers/auth.interceptor';
import {GraphQLModule} from './graphql.module';
import {FoodItemModule} from "./food-item/food-item.module";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    MatIconModule,
    MatButtonModule,
  ],
  providers: [authInterceptorProviders,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
