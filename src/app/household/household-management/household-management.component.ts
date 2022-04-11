import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HouseholdService} from "../../_graphql-services/household.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HouseholdAddStorageComponent} from "../household-add-storage/household-add-storage.component";
import {StorageService} from "../../_graphql-services/storage.service";
import {DialogHelperService} from "../../_helpers/dialog-helper.service";
import {LocalStorageService} from "../../_services/local-storage.service";
import {HouseholdRemoveStorageComponent} from "../household-remove-storage/household-remove-storage.component";
import {Household} from "../../graphql.types";
import {EMPTY, NEVER, switchMap} from "rxjs";
import {HouseholdRemoveMemberComponent} from "../household-remove-member/household-remove-member.component";
import {
  HouseholdRemoveHouseholdDialogComponent
} from "../household-remove-household/household-remove-household-dialog.component";
import {Router} from "@angular/router";
import {ManagementService} from "../../_graphql-services/management.service";

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
  notOwned: boolean = false;

  constructor(private dialog: MatDialog,
              private managementService: ManagementService,
              private householdService: HouseholdService,
              private storageService: StorageService,
              private dialogHelper: DialogHelperService,
              private localStorage: LocalStorageService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
    this.localStorage.selectedHouseholdId.pipe(switchMap(householdId=>
      {
        if( householdId ) {
          return this.householdService.getHousehold(householdId!);
        }
        else {
          this.router.navigate(["/dashboard"]);
          return NEVER;
        }
      }
    )).subscribe({
      next: data => {
          //If the API call was successful
          if (data.households) {
            if( this.localStorage.getUserType() != "owner" ) {
              this.notOwned = true;
            }
            else {
              this.notOwned = false;
              this.household = data.households[0];
            }
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
   * Shows a dialog box to gather information to invite a user to the system
   */
  inviteUser() {

  }

  /**
   * Show a dialog to remove a user from the system and remove them if okayed.
   */
  removeUser() {
     this.dialogHelper.launchDialog(HouseholdRemoveMemberComponent,
                                     (x: any) => this.managementService.removeMember(x, this.household!),
                                     {household:this.household}).subscribe({
      next: data => {
        //If the API call was successful
        if (data.success) {
          this.snackBar.open("User Removed Successfully", undefined,
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
   * Remove the household from the system, LOTS OF WARNINGS THIS IS NOT UNDOABLE WHY ARE WE LETTING THEM DO THIS
   */
  removeHousehold() {
    const user = this.localStorage.getUser()!;
    this.dialogHelper.launchDialog(HouseholdRemoveHouseholdDialogComponent,
      (x: Household) => {
        if (confirm("Are you absolutely sure?"))
        {
          return this.managementService.removeHousehold(x);
        }
        else
        {
          return EMPTY;
        }
      }, {ownedHouseholds: user!.ownedHouseholds}).subscribe({
      next: data => {
        //If the API call was successful
        if (data.success) {
          this.snackBar.open("Removed Household Successfully", undefined,
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
   * Edit basic household metadata
   */
  editHousehold() {

  }

   /**
   * Create the storage in the currently selected household
   */
  addStorage() {

    this.dialogHelper.launchDialog(HouseholdAddStorageComponent,
                                  (x: any) => this.storageService.addStorage(x, this.household!.id)).subscribe({
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
