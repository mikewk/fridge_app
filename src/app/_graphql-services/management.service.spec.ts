import { TestBed } from '@angular/core/testing';

import { ManagementService } from './management.service';
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {GraphQLModule} from "../graphql.module";
import {Apollo} from "apollo-angular";
import {MockProvider} from "ng-mocks";
import {HouseholdHelperService} from "../cache-helpers/household-helper.service";

describe('ManagementServiceService', () => {
  let service: ManagementService;
  let controller: ApolloTestingController;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, GraphQLModule],
      providers: [Apollo, MockProvider(HouseholdHelperService)]
    });
    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(ManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
