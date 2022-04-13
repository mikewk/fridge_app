import { TestBed } from '@angular/core/testing';

import { StorageHelperService } from './storage-helper.service';
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {GraphQLModule} from "../graphql.module";
import {Apollo} from "apollo-angular";

describe('StorageHelperService', () => {
  let service: StorageHelperService;
  let controller: ApolloTestingController;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, GraphQLModule],
      providers: [Apollo]
    });
    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(StorageHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
