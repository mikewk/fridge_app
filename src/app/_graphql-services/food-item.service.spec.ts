import {TestBed} from '@angular/core/testing';

import {FoodItemService} from './food-item.service';
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {GraphQLModule} from "../graphql.module";
import {Apollo} from "apollo-angular";
import {MockProvider} from "ng-mocks";
import {FoodItemHelperService} from "../cache-helpers/food-item-helper.service";

describe('FoodItemService', () => {
  let service: FoodItemService;
  let controller: ApolloTestingController;
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, GraphQLModule],
      providers: [Apollo, MockProvider(FoodItemHelperService)]
    });
    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(FoodItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
