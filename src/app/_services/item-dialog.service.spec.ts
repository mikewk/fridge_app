import {TestBed} from '@angular/core/testing';

import {ItemDialogService} from './item-dialog.service';

describe('AddItemHandlerService', () => {
  let service: ItemDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
