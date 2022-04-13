import {TestBed} from '@angular/core/testing';

import {UserService} from './user.service';
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {GraphQLModule} from "../graphql.module";
import {Apollo} from "apollo-angular";
import {HouseholdHelperService} from "../cache-helpers/household-helper.service";
import {MockProvider} from "ng-mocks";

describe('UserService', () => {
  let service: UserService;
  let controller: ApolloTestingController;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, GraphQLModule],
      providers: [Apollo, MockProvider(HouseholdHelperService)]
    });
    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
