import { TestBed } from '@angular/core/testing';

import { HouseholdHelperService } from './household-helper.service';
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {GraphQLModule} from "../graphql.module";
import {Apollo} from "apollo-angular";
import {MockProvider} from "ng-mocks";
import {LocalStorageService} from "../_services/local-storage.service";

describe('HouseholdHelperService', () => {
  let service: HouseholdHelperService;
  let controller: ApolloTestingController;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, GraphQLModule],
      providers: [Apollo, MockProvider(LocalStorageService)]
    });
    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(HouseholdHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
