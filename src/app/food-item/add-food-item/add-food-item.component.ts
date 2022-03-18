import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog'
import {FoodItem, QL_Storage, Suggestion} from "../../graphql.types";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {SafeResourceUrl} from "@angular/platform-browser";
import {FoodItemService} from "../../_services/food-item.service";
import {MatSnackBar, MatSnackBarRef} from "@angular/material/snack-bar";
import {environment} from "../../../environments/environment";


/**
 * Material Dialog component for adding and editing food items
 */
@Component({
  selector: 'app-add-food-item',
  templateUrl: './add-food-item.component.html',
  styleUrls: ['./add-food-item.component.css']
})
export class AddFoodItemComponent implements OnInit {
  image_base_url: string = environment.image_base_url;
  foodItem: FoodItem;
  addOnBlur = true;
  editing = false;
  storage: QL_Storage;
  safeImage: SafeResourceUrl;
  suggestion?: Suggestion;
  snackBarRef?: MatSnackBarRef<any>;
  waitingForSuggestion = false;
  readonly separatorKeyCodes = [ENTER, COMMA, SPACE] as const;
  private waitingForFilename: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private foodItemService: FoodItemService,
              private snackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<AddFoodItemComponent>) {
    if (data.foodItem) {
      //Make a copy of the food item
      this.foodItem = Object.assign({}, data.foodItem);
      this.foodItem.tags = [...data.foodItem.tags];
      //If we have a food item, then we're editing not adding
      this.editing = true;
      this.safeImage = this.image_base_url+this.foodItem.filename;
    }
    else
    {
      //No food item?  Create one and we're not editing
      this.foodItem = {name:"", tags:[]};
      this.editing = false;
      this.safeImage = data.image;
    }
    this.storage = data.storage;

  }

  ngOnInit(): void {
    //Go get our suggestions immediately
    this.foodItemService.getSuggestions(this.safeImage.toString()).subscribe(
      {
        next: data => {
          //If the API call was successful
            if (data?.getSuggestions) {
              //Set the suggestion
              this.suggestion = data.getSuggestions.suggestion;

              //If the user clicked "Get Suggestions" before we were ready and hasn't cancelled
              if( this.waitingForSuggestion ) {
                //Dismiss the snackbar if it's there (It should be, but with auto-suggestions on maybe not)
                this.snackBarRef?.dismiss();

                //Set the tags to our suggestion
                this.foodItem.name = this.suggestion.name;
                this.foodItem.tags = this.suggestion.tags;
              }
              if( this.waitingForFilename )
              {
                this.foodItem.filename = this.suggestion.filename;
                this.matDialogRef.close(this.foodItem);
              }
            } else {
              console.log(data);
            }
          },
          error: err => {
          this.waitingForSuggestion = false;
          this.snackBarRef?.dismiss();
            console.log(err);
          }
        }
    );
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
    //If we haven't gotten the suggestions back from the API
    if( !this.suggestion ) {
      //Show a snackbar
      this.waitingForSuggestion = true;
      this.snackBarRef = this.snackBar.open("Getting suggestions...", "Cancel");
      this.snackBarRef.onAction().subscribe(
        {
          next: () => {
            //If they cancel, change our flag and dismiss the snackbar
            this.waitingForSuggestion = false;
            this.snackBarRef?.dismiss();
          }
        }
      );
    }
    else {
      //Fill them in since we've got em
      this.foodItem.name = this.suggestion.name;
      this.foodItem.tags = this.suggestion.tags;
    }
  }

  tryToAddItem() {
    if( this.suggestion )
    {
      this.foodItem.filename = this.suggestion.filename;
      this.matDialogRef.close(this.foodItem);
    }
    else
    {
      //show a snackbar saying we're still uploading the image and they can skip it
      this.waitingForSuggestion = false;
      this.waitingForFilename = true;
      this.snackBarRef = this.snackBar.open("Waiting for image upload...", "Skip upload");
      this.snackBarRef.onAction().subscribe({
        next: () => {
          //If they cancel, change our flag and dismiss the snackbar
          this.waitingForFilename = false;
          this.snackBarRef?.dismiss();
          this.matDialogRef.close(this.foodItem);
        }
      });
    }
  }
}
