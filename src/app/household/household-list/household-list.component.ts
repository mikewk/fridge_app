import {Component, OnInit} from '@angular/core';
import {HouseholdService} from "../../_services/household.service";

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
