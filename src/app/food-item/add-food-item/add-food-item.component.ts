import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog'
import {FoodItem, QL_Storage} from "../../graphql.types";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FoodItemService} from "../../_services/food-item.service";
import {MatSnackBar} from "@angular/material/snack-bar";


/**
 * Material Dialog component for adding and editing food items
 */
@Component({
  selector: 'app-add-food-item',
  templateUrl: './add-food-item.component.html',
  styleUrls: ['./add-food-item.component.css']
})
export class AddFoodItemComponent implements OnInit {
  foodItem: FoodItem;
  addOnBlur = true;
  editing = false;
  storage: QL_Storage;
  safeImage: SafeResourceUrl;
  waitingForSuggestion = false;
  readonly separatorKeyCodes = [ENTER, COMMA, SPACE] as const;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer,
              private foodItemService: FoodItemService,
              private snackBar: MatSnackBar) {
    if (data.foodItem) {
      //Make a copy of the food item
      this.foodItem = Object.assign({}, data.foodItem);
      this.foodItem.tags = [...data.foodItem.tags];
      this.editing = true;
    }
    else
    {
      this.foodItem = {name:"", tags:[]};
      this.editing = false;
    }
    this.storage = data.storage;
    this.safeImage = this.sanitizer.bypassSecurityTrustResourceUrl(data.image);
  }

  ngOnInit(): void {
  }

  /**
   * Add a chip to the tag list
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.foodItem.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  /**
   * Remove a chip from the tag list
   */
  remove(value: string): void {
    const index = this.foodItem.tags.indexOf(value);

    if (index >= 0) {
      this.foodItem.tags.splice(index, 1);
    }
  }

  getSuggestion() {
    this.waitingForSuggestion = true;
    let snackBarRef = this.snackBar.open("Getting suggestions...","Cancel");
    snackBarRef.onAction().subscribe(
      {
        next: () => {
          this.waitingForSuggestion = false;
          snackBarRef.dismiss();
        }
      }
    );

    this.foodItemService.getSuggestions(this.safeImage.toString()).subscribe(
      {
        next: data => {
          snackBarRef.dismiss();
          //If the API call was successful
            if (data.getSuggestions && this.waitingForSuggestion) {
              this.waitingForSuggestion = false;
              //Check to see if they've cancelled the suggestion
              this.foodItem.name = data.getSuggestions.suggestion.name;
              this.foodItem.tags = data.getSuggestions.suggestion.tags;
            } else {
              console.log(data);
            }
          },
          error: err => {
          this.waitingForSuggestion = false;
          snackBarRef.dismiss();
            console.log(err);
          }
        }
    );
  }
}
