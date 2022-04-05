import { TestBed } from '@angular/core/testing';

import { HouseholdHelperService } from './household-helper.service';

describe('HouseholdHelperService', () => {
  let service: HouseholdHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseholdHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
