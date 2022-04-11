import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

import {HouseholdService} from "../_graphql-services/household.service";
import {LocalStorageService} from "../_services/local-storage.service";
import {ItemDialogService} from "../_services/item-dialog.service";
import {FoodItem, Household, QL_Storage} from "../graphql.types";
import {NEVER, Subject, switchMap, takeUntil} from "rxjs";

/**
 * Implements the bulk of the viewing and editing of items in a household's storages
 */
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  household?: Household;
  selectedStorages?: QL_Storage[];
  loading: boolean = true;
  stop$: Subject<boolean>;


  constructor(private householdService: HouseholdService,
              private snackBar: MatSnackBar,
              private localStorageService: LocalStorageService,
              private itemDialogService: ItemDialogService) {
       this.stop$ = new Subject();
  }

  ngOnDestroy(): void {
    //Clean up subscription
    this.stop$.next(true);
    this.stop$.complete();
  }

  ngOnInit(): void {
    /*This is the old methodology for access, but it might be handy in the future
    if (this.route.snapshot.paramMap.get("id")) {
      this.getHousehold(Number(this.route.snapshot.paramMap.get("id")));
    } else {*/
    //This is the new safe way because DefaultGuard won't let us in without a selected Household
    this.localStorageService.selectedHouseholdId.pipe(
      switchMap(householdId=>{
          if( householdId )
          {
            return this.householdService.getHousehold(householdId!);
          }
          else
          {
            this.loading=false;
            this.household = undefined;
            return NEVER;
          }
        }),
        takeUntil(this.stop$)
      ).subscribe({
        next: data => {
          console.log("Checking out a household");
          console.log(data);
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
            this.loading=false;
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

  compFoodItems(itemA: FoodItem, itemB: FoodItem)
  {
    if( !itemA.expiration ) {
      if( !itemB.expiration )
        return 0;
      return 1
    }
    if( !itemB.expiration )
      return -1;

    const startA = new Date(itemA.entered!.replace(" ", "T")).getTime();
    const endA = new Date(itemA.expiration.replace(" ", "T")).getTime();
    const startB = new Date(itemB.entered!.replace(" ", "T")).getTime();
    const endB = new Date(itemB.expiration.replace(" ", "T")).getTime();
    const now = Date.now();
    const rangeA = endA - startA;
    const rangeB = endB - startB;
    const percentA = (endA-now) / rangeA;
    const percentB = (endB-now) / rangeB;
    return percentA - percentB;

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
        if (data.addFoodItemToStorage.foodItems) {
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
