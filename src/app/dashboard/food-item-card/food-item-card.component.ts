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

  /**
   * Extrapolate between green and yellow if the expiration is 100-50%, and yellow and red if 50%-0%
   */
  extrapolateColor(entered?: string, expiration?: string)
  {
    if( !entered || !expiration)
      return "#FEFEFE";
    const start = new Date(entered.replace(" ", "T")).getTime();
    const end = new Date(expiration.replace(" ", "T")).getTime();
    const now = Date.now();
    const range = end - start;
    const timeLeft = end - now;
    const percent = timeLeft / range;

    let r, g;
    //Red = 255, 0, 0
    //Yellow = 255,255, 0
    //Green = 0 128 0
    if( percent <= .5)
    {
      r = 255
      g = 255 * percent * 2;
    }
    else
    {
      r = 255 * (1 - percent) * 2;
      g = 128 + 127*(1-percent)*2;
    }
    r = Math.floor(r);
    g = Math.floor(g);
    return "rgb("+r+","+g+",0)";
  }
}
