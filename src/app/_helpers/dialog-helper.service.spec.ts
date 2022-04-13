import {TestBed} from '@angular/core/testing';

import {DialogHelperService} from './dialog-helper.service';
import {MatDialog} from "@angular/material/dialog";
import {MockProvider} from "ng-mocks";

describe('DialogHelperService', () => {
  let service: DialogHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(MatDialog)]
    });
    service = TestBed.inject(DialogHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
