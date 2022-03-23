import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSidenav} from "@angular/material/sidenav";

import {ItemDialogService} from "../../_services/item-dialog.service";
import {FoodItemService} from "../../_graphql-services/food-item.service";
import {FoodItem} from "../../graphql.types";

/**
 * Displays all the information about a food item
 * Also contains the sidebar for exposing edit and delete buttons
 */
@Component({
  selector: 'food-item-card',
  templateUrl: './food-item-card.component.html',
  styleUrls: ['./food-item-card.component.css']
})
export class FoodItemCardComponent implements OnInit {
  @Input() foodItem!: FoodItem;
  @ViewChild('snav') sidenav!: MatSidenav;

  constructor(private foodItemService: FoodItemService,
              private itemDialogService: ItemDialogService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  /**
   * Open the edit dialog for foodItem using the ItemDialogService
   * @param foodItem
   */
  openEditDialog(foodItem: FoodItem) {
    this.itemDialogService.editItem(foodItem).subscribe({
      next: data => {
        //If the API call was successful
        if (!data.error) {
          this.snackBar.open("Food Item Edited Successfully", undefined,
            {duration: 2000, panelClass: ['simple-snack-bar']});
          this.sidenav.close();
        } else {
          console.log(data);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  /**
   * Use the default confirmation dialog on delete
   * @param foodItem
   */
  openDeleteDialog(foodItem: FoodItem) {
    if (confirm("Are you sure?")) {
      this.foodItemService.removeFoodItem(foodItem).subscribe(
        {
          next: data => {
            if (!data.error) {
              this.snackBar.open("Food Item Deleted Successfully", undefined,
                {duration: 2000, panelClass: ['simple-snack-bar']});
            }
          },
          error: err => {
            console.log(err);
          }
        }
      );
    }
  }
}
