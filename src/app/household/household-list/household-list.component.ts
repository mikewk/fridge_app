import {Component, OnInit} from '@angular/core';
import {HouseholdService} from "../../_services/household.service";

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

  constructor(private householdService: HouseholdService) {
  }

  ngOnInit(): void {
    this.retrieveMemberHousehold();
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
