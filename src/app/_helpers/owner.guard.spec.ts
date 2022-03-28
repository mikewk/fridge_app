import { TestBed } from '@angular/core/testing';

import { OwnerGuard } from './owner.guard';
import {HouseholdService} from "../_graphql-services/household.service";
import {LocalStorageService} from "../_services/local-storage.service";
import {Apollo} from "apollo-angular";
import {JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {RouterTestingModule} from "@angular/router/testing";

describe('OwnerGuard', () => {
  let guard: OwnerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:
      [
        RouterTestingModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: () => localStorage.getItem('access_token')
            }
        })
      ],
      providers:[
        HouseholdService,
        LocalStorageService,
        Apollo,
        JwtHelperService
      ]
    });
    guard = TestBed.inject(OwnerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
