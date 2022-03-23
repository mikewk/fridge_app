import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HouseholdService} from "../../_graphql-services/household.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProfileAddHouseholdComponent} from "../../profile/profile-add-household/profile-add-household.component";
import {HouseholdAddStorageComponent} from "../household-add-storage/household-add-storage.component";
import {StorageService} from "../../_graphql-services/storage.service";
import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {LocalStorageService} from "../../_services/local-storage.service";
import {HouseholdRemoveStorageComponent} from "../household-remove-storage/household-remove-storage.component";
import {Household} from "../../graphql.types";

/**
 * Displays household management menu and handles the callbacks from GraphQL API calls
 */
@Component({
  selector: 'app-household-management',
  templateUrl: './household-management.component.html',
  styleUrls: ['./household-management.component.css']
})
export class HouseholdManagementComponent implements OnInit {

  household?: Household;

  constructor(private dialog: MatDialog,
              private householdService: HouseholdService,
              private storageService: StorageService,
              private dialogHelper: DialogHelperService,
              private localStorage: LocalStorageService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    //Load in our household data
    //TODO: Figure out a way to ensure the household in localstorage IS our household and is updated by watchQuery
    this.householdService.getHousehold(this.localStorage.getHousehold()!.id!).subscribe(
      {
        next: data => {
          //If the API call was successful
          if (data.households) {
            this.household = data.households[0];
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
   * Shows a dialog box to gather information to invite a user to the system
   */
  inviteUser() {

  }

  /**
   * Show a dialog to remove a user from the system and remove them if okayed.
   */
  removeUser() {

  }

  /**
   * Remove the household from the system, LOTS OF WARNINGS THIS IS NOT UNDOABLE WHY ARE WE LETTING THEM DO THIS
   */
  removeHousehold() {

  }

  /**
   * Edit basic household metadata
   */
  editHousehold() {

  }

   /**
   * Create the storage in the currently selected household
   */
  addStorage() {

    this.dialogHelper.launchDialog(HouseholdAddStorageComponent,
                                  (x: any) => this.storageService.addStorage(x)).subscribe({
      next: data => {
        //If the API call was successful
        if (data.storages) {
          this.snackBar.open("Storage Added Successfully", undefined,
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
   * Edit basic storage metadata
   */
  editStorage() {

  }

  /**
   * Remove a storage from the system.  Should probably have a warning about no undo
   */
  removeStorage() {
    if(this.household?.storages?.length != 0)
    {
      this.dialogHelper.launchDialog(HouseholdRemoveStorageComponent,
                                     (x: any) => this.storageService.removeStorage(x),
                                     {household:this.household}).subscribe({
      next: data => {
        //If the API call was successful
        if (data.success) {
          this.snackBar.open("Storage Removed Successfully", undefined,
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
    else
    {
      this.snackBar.open("No Storages To Remove", undefined,
            {duration: 2000, panelClass: ['simple-snack-bar']});
    }
  }
}
