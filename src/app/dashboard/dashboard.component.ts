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
    if (this.route.snapshot.paramMap.get("id")) {
      this.getHousehold(Number(this.route.snapshot.paramMap.get("id")));
    } else {
      //This is safe because SelectedGuard won't let us in without a selectedHousehold
      this.getHousehold(this.localStorageService.getHousehold()!.id!)
    }
  }

  trackFoodItem(index: number, item: FoodItem) {
    return "FoodItem:" + item.id;
  }

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
   * Get household identified by id
   */
  getHousehold(id: number): void {
    this.householdService.getHousehold(id).subscribe(
      {
        next: data => {
          if (data.households) {
            this.household = data.households[0];
            if (!this.selectedStorages) {
              this.selectedStorages = [...this.household.storages!];
            } else {
              this.selectedStorages = this.household.storages!.filter(
                (x: QL_Storage) => {
                  return this.selectedStorages!.reduce(
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
}
