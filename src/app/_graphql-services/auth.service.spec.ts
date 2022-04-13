import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {GraphQLModule} from "../graphql.module";
import {Apollo} from "apollo-angular";
import {MockProvider} from "ng-mocks";
import {HouseholdHelperService} from "../cache-helpers/household-helper.service";

describe('AuthService', () => {
  let service: AuthService;
  let controller: ApolloTestingController;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, GraphQLModule],
      providers: [Apollo]
    });
    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
