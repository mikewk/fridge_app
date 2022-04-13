import { TestBed } from '@angular/core/testing';

import { FoodItemHelperService } from './food-item-helper.service';
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {Apollo} from "apollo-angular";
import {GraphQLModule} from "../graphql.module";

describe('FoodItemHelperService', () => {
  let service: FoodItemHelperService;
  let controller: ApolloTestingController;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, GraphQLModule],
      providers: [Apollo]
    });
    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(FoodItemHelperService)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
