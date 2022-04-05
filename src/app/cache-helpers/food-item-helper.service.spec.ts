import { TestBed } from '@angular/core/testing';

import { FoodItemHelperService } from './food-item-helper.service';

describe('FoodItemHelperService', () => {
  let service: FoodItemHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodItemHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
