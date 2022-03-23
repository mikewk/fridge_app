import {Injectable} from '@angular/core';
import {from, mergeMap, Observable} from "rxjs";

import {NgxImageCompressService} from "ngx-image-compress";

import {FoodItemAddComponent} from "../food-item/food-item-add/food-item-add.component";
import {FoodItem, Household} from "../graphql.types";
import {FoodItemService} from "../_graphql-services/food-item.service";
import {DialogHelperService} from "../_helpers/dialog-helper.service";

/**
 * This provide item dialogs to multiple components
 */
@Injectable({
  providedIn: 'root'
})
export class ItemDialogService {

  constructor(private imageCompress: NgxImageCompressService,
              private dialogHelper: DialogHelperService,
              private foodItemService: FoodItemService) {
  }


  /**
   * Display the edit food item dialog for foodItem
   * @param foodItem
   */
  editItem(foodItem: FoodItem): Observable<any> {
    return this.dialogHelper.launchDialog(FoodItemAddComponent,
      (x: any) => this.foodItemService.editFoodItem(x),
      {foodItem: foodItem});
  }

  /**
   * Display an add food item dialog for the household defined in household.
   * @param household
   */
  addItem(household: Household): Observable<any> {
    return from(this.imageCompress.uploadFile().then(
      ({image, orientation}) => {
        return this.imageCompress.compressFile(image, orientation, undefined, 75, 1024, 1024, "image/jpeg").then((compressedImage) => {
          return compressedImage;
        })
      })).pipe(
      mergeMap((image) => {
          return this.dialogHelper.launchDialog(FoodItemAddComponent,
            this.foodItemService.addFoodItem.bind(this.foodItemService),
            {household: household, image: image});
        }
      )
    );
  }
}
