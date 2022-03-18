import {Component, OnInit} from '@angular/core';
import {HouseholdService} from "../../_services/household.service";
import {AddFoodItemComponent} from "../../food-item/add-food-item/add-food-item.component";
import {EMPTY, mergeMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HouseholdAddComponent} from "../household-add/household-add.component";

/**
 * Component that displays a list of households the user can access as a member
 */
@Component({
  selector: 'app-household-list',
  templateUrl: './household-list.component.html',
  styleUrls: ['./household-list.component.css']
})
export class HouseholdListComponent implements OnInit {
  households: any;

  constructor(private householdService: HouseholdService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,) {
  }

  ngOnInit(): void {
    this.retrieveMemberHousehold();
  }

  async openAddDialog() {

    const dialogRef = this.dialog.open(HouseholdAddComponent,
    {
      width: '400px'
    });

     dialogRef.afterClosed().pipe(mergeMap(
(result)=> {
          //If we have a result, make the add food item call
          if (result) {
            return this.householdService.addHousehold(result);
          } else {
            return EMPTY;
          }
        })
     ).subscribe({
      next: data => {
        //If the API call was successful
        if (data.addHousehold) {
          this.snackBar.open("Household Added Successfully",undefined,
                      { duration: 2000, panelClass: ['simple-snack-bar']});
          //Update the component with new info
          this.retrieveMemberHousehold();
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
   * Retrieves all households for the authenticated user
   */
  private retrieveMemberHousehold() {
    this.householdService.getMemberHouseholds().subscribe(
      {
        next: data => {
          if (data.getMemberHouseholds.error) {
            console.log(data.getMemberHouseholds.error);
          } else {
            console.log(data);
            this.households = data.getMemberHouseholds.households;
          }
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }
}
