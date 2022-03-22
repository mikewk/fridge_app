import {Component, OnInit} from '@angular/core';
import {HouseholdService} from "../../_graphql-services/household.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

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


  }


  /**
   * Retrieves all households for the authenticated user
   */
  private retrieveMemberHousehold() {
    this.householdService.getMemberHouseholds().subscribe(
      {
        next: data => {
          if (!data.households) {
            console.log(data.error);
          } else {
            console.log(data);
            this.households = data.households;
          }
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }
}
