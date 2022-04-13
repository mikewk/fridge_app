import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {LocalStorageService} from "./_services/local-storage.service";
import {ItemDialogService} from "./_services/item-dialog.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {HouseholdService} from "./_graphql-services/household.service";
import {AuthService} from "./_graphql-services/auth.service";
import {SubscriptionHandlerService} from "./_services/subscription-handler-service";
import {MockProvider} from "ng-mocks";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        MockProvider(LocalStorageService),
        MockProvider(ItemDialogService),
        MockProvider(MatSnackBar),
        MockProvider(HouseholdService),
        MockProvider(AuthService),
        MockProvider(SubscriptionHandlerService)
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
