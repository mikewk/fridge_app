import {TestBed} from '@angular/core/testing';

import {ItemDialogService} from './item-dialog.service';
import {NgxImageCompressService} from "ngx-image-compress";
import {MockProvider} from "ng-mocks";
import {DialogHelperService} from "../_helpers/dialog-helper.service";
import {FoodItemService} from "../_graphql-services/food-item.service";

describe('AddItemHandlerService', () => {
  let service: ItemDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        MockProvider(NgxImageCompressService),
        MockProvider(DialogHelperService),
        MockProvider(FoodItemService)
      ]
    });
    service = TestBed.inject(ItemDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
