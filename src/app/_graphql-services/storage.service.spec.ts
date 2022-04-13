import {TestBed} from '@angular/core/testing';

import {StorageService} from './storage.service';
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {GraphQLModule} from "../graphql.module";
import {Apollo} from "apollo-angular";
import {StorageHelperService} from "../cache-helpers/storage-helper.service";
import {MockProvider} from "ng-mocks";

describe('StorageService', () => {
  let service: StorageService;
  let controller: ApolloTestingController;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, GraphQLModule],
      providers: [Apollo, MockProvider(StorageHelperService)]
    });
    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
