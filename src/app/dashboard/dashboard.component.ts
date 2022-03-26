import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NgxImageCompressService} from "ngx-image-compress"

import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

import {StorageService} from "../_graphql-services/storage.service";
import {FoodItemService} from "../_graphql-services/food-item.service";
import {HouseholdService} from "../_graphql-services/household.service";
import {LocalStorageService} from "../_services/local-storage.service";
import {ItemDialogService} from "../_services/item-dialog.service";
import {FoodItem, Household, QL_Storage} from "../graphql.types";
import {NEVER, switchMap} from "rxjs";

/**
 * Implements the bulk of the viewing and editing of items in a household's storages
 */
@Component({
  selector: 'app-storage-details',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  household?: Household;
  selectedStorages?: QL_Storage[];


  constructor(private storageService: StorageService,
              private householdService: HouseholdService,
              private foodItemService: FoodItemService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private imageCompress: NgxImageCompressService,
              private localStorageService: LocalStorageService,
              private itemDialogService: ItemDialogService) {
  }

  ngOnInit(): void {
    /*This is the old methodology for access, but it might be handy in the future
    if (this.route.snapshot.paramMap.get("id")) {
      this.getHousehold(Number(this.route.snapshot.paramMap.get("id")));
    } else {*/

    //This is the new safe way because DefaultGuard won't let us in without a selected Household
    this.localStorageService.selectedHouseholdId.pipe(switchMap(householdId=>{
          if( householdId )
          {
            return this.householdService.getHousehold(householdId!);
          }
          else
          {
            return NEVER;
          }
        })
      ).subscribe({
        next: data => {
          if (data.households) {
            this.household = data.households[0];
            let selectedStorages = this.localStorageService.getSelectedStorages();
            if (!selectedStorages) {
              this.selectedStorages = [...this.household.storages!];
            } else {
              this.selectedStorages = this.household.storages!.filter(
                (x: QL_Storage) => {
                  return selectedStorages!.reduce(
                    (a: boolean, b: QL_Storage) => {
                      return a || b.id == x.id
                    }, false);
                });
              }
            } else {
              console.log(data);
            }
          },
          error: err => {
            console.log(err);
          }
        }
      );
    }

  /**
   * Helper function for Angular to maintain the item list smoothly
   * @param index
   * @param item
   */
  trackFoodItem(index: number, item: FoodItem) {
    return "FoodItem:" + item.id;
  }

  /**
   * Helper function for angular to maintain the storage selected list
   * @param index
   * @param item
   */
  trackStorage(index: number, item: QL_Storage) {
    return "Storage:" + item.id;
  }

  /**
   * Opens add/edit dialog in add mode
   */
  openAddDialog() {

    this.itemDialogService.addItem(this.household!).subscribe({
      next: data => {
        //If the API call was successful
        if (data.addFoodItemToStorage) {
          this.snackBar.open("Food Item Added Successfully", undefined,
            {duration: 2000, panelClass: ['simple-snack-bar']});
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
   * Get ALL the household data identified by id
   * (getHousehold) is a watchQuery that sends multiple returns as the query changes
   */
  getHousehold(id: number): void {

  }

  updateSelectedStorages() {
    this.localStorageService.setSelectedStorages(this.selectedStorages);
  }
}
